
'use strict';

/* =========================================================
   ECO BURABAY — script.js (Версия с облачной базой Supabase)
   ========================================================= */

// ── СИНХРОНИЗАЦИЯ С ОБЛАКОМ SUPABASE ───────────────────────
// НАСТРОЙКА: Замените эти данные на ключи из вашего проекта Supabase (Settings -> API)
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error('Supabase CDN не подключен в index.html!');
}

// ── 1. LOCALSTORAGE (Только для локальной сессии юзера) ─────
function getLS(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch (e) { return def; }
}
function setLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

// ── 2. ДАННЫЕ И ДЕФОЛТНЫЕ НАСТРОЙКИ ────────────────────────
const DEFAULT_SIGHTS = [
  {
    id: 'burabay',
    name: 'Озеро Бурабай',
    subtitle: 'Главный водоём парка',
    image: 'https://borovoe.kz/upload/medialibrary/454/454cf69f5a0ad9b5bbeba27b18d9b644.jpg',
    shortDesc: 'Сердце nationalного парка — кристальное озеро среди гранитных скал.',
    description: 'Озеро Бурабай (Боровое) — бессточное озеро в Бурабайском районе Акмолинской области Казахстана. Оно окружено величественными сосновыми лесами и причудливыми скалами.'
  },
  {
    id: 'okzhetpes',
    name: 'Скала Окжетпес',
    subtitle: 'Высота около 200 м',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk3V5RUyOVEO-SbDIzmLzxDftQsEoDcPcir5lAXspjuA&s=10',
    shortDesc: 'Величественная скала, чьё название означает «Стрела не долетит».',
    description: 'Гранитная скала на берегу озера Боровое. Её вершина напоминает лежащего слона. Окжетпес воспета в многочисленных легендах казахского народа.'
  },
  {
    id: 'zhumbaktas',
    name: 'Скала Жумбактас',
    subtitle: 'Загадочный камень',
    image: 'https://img.mustafinmag.kz/eX1X4UKNS9c/el:true/rs:fit:3840/dpr:1/f:webp/czM6Ly9tdXN0YWZpbi1tYWdhemluZS9pbWcvZjdkOWU3ZjZhNjVhOTZiZjIxMjM4YTdmNjlmNGFlMTcuanBn',
    shortDesc: 'Гранитная скала посреди озера — символ Бурабая.',
    description: 'Жумбактас (Загадочный камень) — одна из самых узнаваемых достопримечательностей парка. Скала расположена прямо в воде озера Боровое.'
  }
];

const DEFAULT_TREES = [
  { id: 't1', type: 'Сосна обыкновенная', place: 'Зона №1', date: '12.05.2026', planter: 'Алексей М.' },
  { id: 't2', type: 'Берёза повислая',    place: 'Зона №2', date: '24.05.2026', planter: 'Индира Б.' },
  { id: 't3', type: 'Ель сибирская',      place: 'Зона №3', date: '01.06.2026', planter: 'Эко-клуб' }
];

let SIGHTS = [];
let TREES  = [];
let CURRENT_USER = getLS('eco_user', null);

// Функция асинхронной загрузки данных из облака
async function loadGlobalData() {
  if (!supabaseClient) {
    SIGHTS = DEFAULT_SIGHTS;
    TREES = DEFAULT_TREES;
    return;
  }
  try {
    // Параллельно запрашиваем достопримечательности и деревья из БД
    const [sightsResponse, treesResponse] = await Promise.all([
      supabaseClient.from('eco_sights').select('*'),
      supabaseClient.from('eco_trees').select('*').order('created_at', { ascending: false })
    ]);

    if (sightsResponse.error) throw sightsResponse.error;
    if (treesResponse.error) throw treesResponse.error;

    SIGHTS = sightsResponse.data.length ? sightsResponse.data : DEFAULT_SIGHTS;
    TREES = treesResponse.data.length ? treesResponse.data : DEFAULT_TREES;
  } catch (error) {
    console.error('Ошибка загрузки из Supabase, применены дефолтные данные:', error);
    SIGHTS = DEFAULT_SIGHTS;
    TREES = DEFAULT_TREES;
  }
}

// ── 3. СЧЁТЧИКИ С АНИМАЦИЕЙ ──────────────────────────────────
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function updateCounters() {
  const tEl = document.getElementById('liveTreeCount');
  const sEl = document.getElementById('liveSightCount');
  const rEl = document.getElementById('liveReportCount');
  const reports = getLS('eco_reports', []);
  if (tEl) animateCounter(tEl, TREES.length);
  if (sEl) animateCounter(sEl, SIGHTS.length);
  if (rEl) animateCounter(rEl, reports.length + 2);
}

// ── 4. QR-ГИД — РЕНДЕР КАРТОЧЕК ─────────────────────────────
function renderSights() {
  const grid = document.getElementById('sightCards');
  if (!grid) return;
  grid.innerHTML = '';

  SIGHTS.forEach((sight, i) => {
    const card = document.createElement('div');
    card.className = 'card reveal';
    card.style.transitionDelay = `${i * 80}ms`;

    const qrPlaceholder = `qr-mini-${sight.id}`;

    card.innerHTML = `
      <div class="card__img">
        <img src="${sight.image}" alt="${sight.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1627564547012-6eb6dc355bfa?auto=format&fit=crop&w=800&q=80'">
      </div>
      <div class="card__body">
        <h3 class="card__title">${sight.name}</h3>
        <p class="card__desc">${sight.shortDesc}</p>
        <div class="card__qr">
          <div id="${qrPlaceholder}" class="card__qr-img"></div>
          <div class="card__qr-text">
            <strong>QR-код объекта</strong><br>
            Сканируйте для просмотра
          </div>
        </div>
        <div style="display:flex; gap:10px; margin-top:15px;">
          <button class="btn btn--primary" style="flex:1; padding:10px;" onclick="openSightModal('${sight.id}')">Подробнее</button>
          <button class="btn btn--outline" style="color:var(--slate); border-color:var(--slate); padding:10px 14px;" onclick="openQrModal('${sight.id}')">🔲 QR</button>
        </div>
      </div>
    `;
    grid.appendChild(card);

    setTimeout(() => {
      const miniEl = document.getElementById(qrPlaceholder);
      if (miniEl && typeof QRCode !== 'undefined') {
        new QRCode(miniEl, {
          text: `${window.location.origin}/place/${sight.id}`,
          width: 56, height: 56,
          colorDark: '#166534', colorLight: '#ffffff'
        });
      }
    }, 200 + i * 100);
  });

  initReveal();
}

// ── 5. МОДАЛЬНОЕ ОКНО — ДОСТОПРИМЕЧАТЕЛЬНОСТЬ ────────────────
window.openSightModal = function(id) {
  const sight = SIGHTS.find(s => s.id === id);
  if (!sight) return;

  const modal = document.getElementById('sightModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <img src="${sight.image}" alt="${sight.name}"
         style="width:100%;height:260px;object-fit:cover;border-radius:12px;margin-bottom:20px;"
         onerror="this.style.display='none'">
    <span class="section__eyebrow">${sight.subtitle}</span>
    <h2 style="margin:10px 0 16px;">${sight.name}</h2>
    <p style="color:#475569;line-height:1.7;">${sight.description || sight.shortDesc}</p>
    <div style="margin-top:24px;display:flex;gap:12px;">
      <button class="btn btn--primary" onclick="openQrModal('${sight.id}'); closeModal();">
        🔲 Получить QR-код
      </button>
    </div>
  `;
  openModal('sightModal');

  if (!window.location.pathname.startsWith('/place/')) {
    window.history.pushState({ sightId: id }, '', `/place/${id}`);
  }
};

// ── 6. МОДАЛЬНОЕ ОКНО — QR-КОД ──────────────────────────────
window.openQrModal = function(id) {
  const sight = SIGHTS.find(s => s.id === id);
  if (!sight) return;

  let modal = document.getElementById('qrModalDynamic');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'qrModalDynamic';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__overlay" onclick="closeQrDynamic()"></div>
      <div class="modal__box modal__box--sm" style="text-align:center;">
        <button class="modal__close" onclick="closeQrDynamic()">✕</button>
        <div id="qrModalBody"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const fullUrl = `${window.location.origin}/place/${id}`;
  document.getElementById('qrModalBody').innerHTML = `
    <h3 style="margin-bottom:8px;">QR-код объекта</h3>
    <p style="color:#64748b;font-size:0.85rem;margin-bottom:20px;">${sight.name}</p>
    <div id="qrCodeBig" style="display:inline-block;padding:16px;background:white;border-radius:12px;border:2px solid #e2e8f0;"></div>
    <p style="margin-top:16px;font-size:0.8rem;color:#64748b;word-break:break-all;">${fullUrl}</p>
    <button class="btn btn--primary" style="margin-top:16px;" onclick="downloadQR('${id}','${sight.name}')">
      ⬇ Скачать QR-код
    </button>
  `;

  openModal('qrModalDynamic');

  setTimeout(() => {
    const el = document.getElementById('qrCodeBig');
    if (el && typeof QRCode !== 'undefined') {
      el.innerHTML = '';
      new QRCode(el, {
        text: fullUrl,
        width: 200, height: 200,
        colorDark: '#166534', colorLight: '#ffffff'
      });
    }
  }, 50);
};

window.closeQrDynamic = function() {
  closeModalById('qrModalDynamic');
};

window.downloadQR = function(id, name) {
  const canvas = document.querySelector('#qrCodeBig canvas');
  if (!canvas) { showToast('Не удалось найти QR-код'); return; }
  const link = document.createElement('a');
  link.download = `qr-${id}.png`;
  link.href = canvas.toDataURL();
  link.click();
  showToast('QR-код скачан!');
};

// ── 7. ЕДИНАЯ СИСТЕМА МОДАЛЬНЫХ ОКОН ────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModalById(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
window.closeModal = function() {
  closeModalById('sightModal');
  if (window.location.pathname.startsWith('/place/')) {
    window.history.pushState({}, '', '/');
  }
};
window.closeAuthModal   = () => closeModalById('authModal');
window.closePlantModal  = () => closeModalById('plantModal');

// ── 8. РЕЕСТР ДЕРЕВЬЕВ ───────────────────────────────────────
function renderTrees(filter = '') {
  const grid = document.getElementById('treeGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = filter
    ? TREES.filter(t => t.planter.toLowerCase().includes(filter.toLowerCase()) || t.type.toLowerCase().includes(filter.toLowerCase()))
    : TREES;

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:#64748b;grid-column:1/-1;text-align:center;padding:40px 0;">Деревья не найдены</p>';
    return;
  }

  filtered.forEach((tree, i) => {
    const icons = { 'Сосна обыкновенная': '🌲', 'Берёза повислая': '🌳', 'Ель сибирская': '🎄' };
    const icon = icons[tree.type] || '🌲';
    const card = document.createElement('div');
    card.className = 'tree-card reveal';
    card.style.transitionDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="tree-card__header">
        <div style="font-size:2rem;">${icon}</div>
        <strong>${tree.type}</strong>
      </div>
      <div style="margin-top:12px;font-size:0.8rem;color:#64748b;line-height:1.8;">
        <div>👤 ${tree.planter || 'Аноним'}</div>
        <div>📍 ${tree.place || 'Бурабай'}</div>
        <div>📅 ${tree.date || ''}</div>
      </div>
    `;
    grid.appendChild(card);
  });
  initReveal();
}

window.filterTrees = function() {
  const val = document.getElementById('treeSearch')?.value || '';
  renderTrees(val);
};

window.openPlantModal  = () => openModal('plantModal');

// Добавление дерева напрямую в Supabase, чтобы его видели ВСЕ
function setupPlantForm() {
  const form = document.getElementById('plantForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('pName').value.trim() || 'Эко-герой';
    const species = document.getElementById('pSpecies').value;
    const place   = document.getElementById('pPlace').value.trim() || 'Бурабай';

    const newTree = {
      id: 't-' + Date.now(),
      type: species,
      place,
      date: new Date().toLocaleDateString('ru-RU'),
      planter: name
    };

    if (supabaseClient) {
      showToast('🌱 Сохранение в общий реестр...');
      const { error } = await supabaseClient.from('eco_trees').insert([newTree]);
      if (error) {
        showToast('❌ Ошибка отправки в облако');
        return;
      }
    }

    await loadGlobalData(); // Перечитываем актуальную базу
    renderTrees();
    updateCounters();
    closePlantModal();
    form.reset();
    showToast(`🌱 Дерево «${species}» добавлено для всех участников!`);
  });
}

// ── 9. ФОРМА ВОЛОНТЁРА ───────────────────────────────────────
function setupVolForm() {
  const form = document.getElementById('volForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('hidden');
    document.getElementById('volSuccess')?.classList.remove('hidden');
    showToast('🎉 Заявка волонтёра принята!');
  });
}

// ── 10. ФОРМА ЭКО-ПАТРУЛЯ ───────────────────────────────────
function setupCleanForm() {
  const form = document.getElementById('cleanForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const reports = getLS('eco_reports', []);
    reports.push({
      location: document.getElementById('cfLocation')?.value,
      desc: document.getElementById('cfDesc')?.value,
      date: new Date().toLocaleDateString('ru-RU')
    });
    setLS('eco_reports', reports);

    form.classList.add('hidden');
    document.getElementById('cleanSuccess')?.classList.remove('hidden');
    updateCounters();
    showToast('✅ Эко-заявка зарегистрирована!');
  });
}

window.resetCleanForm = function() {
  document.getElementById('cleanForm')?.classList.remove('hidden');
  document.getElementById('cleanSuccess')?.classList.add('hidden');
  document.getElementById('cleanForm')?.reset();
};

// ── 11. АВТОРИЗАЦИЯ ──────────────────────────────────────────
function initAuth() {
  const authBtn = document.getElementById('authBtn');
  const adminBtn = document.getElementById('adminPanelBtn');

  function refreshUI() {
    if (CURRENT_USER) {
      if (authBtn) authBtn.textContent = `Выйти (${CURRENT_USER.name.split(' ')[0]})`;
      if (CURRENT_USER.role === 'admin') {
        adminBtn?.classList.remove('hidden');
      } else {
        adminBtn?.classList.add('hidden');
        document.getElementById('adminSection')?.classList.add('hidden');
      }
    } else {
      if (authBtn) authBtn.textContent = 'Войти';
      adminBtn?.classList.add('hidden');
      document.getElementById('adminSection')?.classList.add('hidden');
    }
  }

  authBtn?.addEventListener('click', () => {
    if (CURRENT_USER) {
      CURRENT_USER = null;
      localStorage.removeItem('eco_user');
      refreshUI();
      showToast('Вы вышли из системы');
    } else {
      openModal('authModal');
    }
  });

  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPassword').value;

    if (email === 'admin@eco.kz' && pass === 'admin123') {
      CURRENT_USER = { name: 'Администратор', email, role: 'admin' };
    } else {
      CURRENT_USER = { name: email.split('@')[0], email, role: 'user' };
    }
    setLS('eco_user', CURRENT_USER);
    refreshUI();
    closeAuthModal();
    showToast(`👋 Добро пожаловать, ${CURRENT_USER.name}!`);
  });

  document.getElementById('registerForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    CURRENT_USER = { name, email, role: 'user' };
    setLS('eco_user', CURRENT_USER);
    refreshUI();
    closeAuthModal();
    showToast(`🎉 Аккаунт создан, ${name}!`);
  });

  refreshUI();

  window.toggleAuthWindows = function(e, mode) {
    e.preventDefault();
    document.getElementById('loginFormWindow')?.classList.toggle('hidden', mode !== 'login');
    document.getElementById('registerFormWindow')?.classList.toggle('hidden', mode !== 'reg');
  };
}

// ── 12. АДМИН-ПАНЕЛЬ С СОХРАНЕНИЕМ В ОБЛАКО ──────────────────
function initAdmin() {
  const adminBtn     = document.getElementById('adminPanelBtn');
  const adminSection = document.getElementById('adminSection');
  const adminForm    = document.getElementById('adminSightForm');

  adminBtn?.addEventListener('click', () => {
    adminSection?.classList.toggle('hidden');
    if (!adminSection?.classList.contains('hidden')) {
      adminSection.scrollIntoView({ behavior: 'smooth' });
      renderAdminTable();
    }
  });

  adminForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('editId').value;
    const obj = {
      name:        document.getElementById('asName').value.trim(),
      subtitle:    document.getElementById('asSubtitle').value.trim(),
      image:       document.getElementById('asImg').value.trim() || DEFAULT_SIGHTS[0].image,
      shortDesc:   document.getElementById('asShortDesc').value.trim(),
      description: document.getElementById('asFullDesc').value.trim()
    };

    if (supabaseClient) {
      showToast('🔄 Синхронизация с сервером...');
      if (editId) {
        // Обновление существующего объекта у всех
        const { error } = await supabaseClient.from('eco_sights').update(obj).eq('id', editId);
        if (error) { showToast('❌ Ошибка изменения'); return; }
        showToast('✏️ Объект обновлён глобально!');
      } else {
        // Создание нового объекта для всех
        const { error } = await supabaseClient.from('eco_sights').insert([{ id: 'id-' + Date.now(), ...obj }]);
        if (error) { showToast('❌ Ошибка добавления'); return; }
        showToast('✅ Новый объект добавлен для всех!');
      }
    }

    await loadGlobalData();
    resetAdminForm();
    renderSights();
    renderAdminTable();
    updateCounters();
  });

  window.resetAdminForm = function() {
    adminForm?.reset();
    if (document.getElementById('editId')) document.getElementById('editId').value = '';
    document.getElementById('adminFormTitle').textContent = 'Добавить / Изменить объект';
  };
}

function renderAdminTable() {
  const tbody = document.getElementById('adminSightsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  SIGHTS.forEach(s => {
    const tr = document.createElement('tr');
    const qrUrl = `${window.location.origin}/place/${s.id}`;
    tr.innerHTML = `
      <td><strong>${s.name}</strong></td>
      <td>
        <div id="admin-qr-${s.id}" style="width:48px;height:48px;"></div>
      </td>
      <td>
        <button class="btn-action" onclick="adminEdit('${s.id}')" title="Редактировать">✏️</button>
        <button class="btn-action btn-action--delete" onclick="adminDelete('${s.id}')" title="Удалить">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);

    setTimeout(() => {
      const el = document.getElementById(`admin-qr-${s.id}`);
      if (el && typeof QRCode !== 'undefined') {
        new QRCode(el, { text: qrUrl, width: 48, height: 48, colorDark: '#166534', colorLight: '#fff' });
      }
    }, 100);
  });
}

window.adminEdit = function(id) {
  const s = SIGHTS.find(x => x.id === id);
  if (!s) return;
  document.getElementById('editId').value     = s.id;
  document.getElementById('asName').value     = s.name;
  document.getElementById('asSubtitle').value = s.subtitle;
  document.getElementById('asImg').value      = s.image;
  document.getElementById('asShortDesc').value = s.shortDesc;
  document.getElementById('asFullDesc').value  = s.description || '';
  document.getElementById('adminFormTitle').textContent = '✏️ Редактировать объект';
  document.getElementById('adminSection')?.scrollIntoView({ behavior: 'smooth' });
};

window.adminDelete = async function(id) {
  if (!confirm('Удалить этот объект для всех пользователей?')) return;
  
  if (supabaseClient) {
    showToast('🗑️ Удаление с сервера...');
    const { error } = await supabaseClient.from('eco_sights').delete().eq('id', id);
    if (error) { showToast('❌ Ошибка при удалении'); return; }
  }

  await loadGlobalData();
  renderSights();
  renderAdminTable();
  updateCounters();
  showToast('🗑️ Объект успешно удалён!');
};

// ── 13. SCROLL REVEAL АНИМАЦИИ ───────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal:not(.active)').forEach(el => obs.observe(el));
}

function initParallax() {
  const hero = document.querySelector('.hero__bg-image');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.35}px)`;
  }, { passive: true });
}

// ── 14. УВЕДОМЛЕНИЯ (TOAST) ──────────────────────────────────
function showToast(msg) {
  document.querySelectorAll('.eco-toast').forEach(el => el.remove());
  const toast = document.createElement('div');
  toast.className = 'eco-toast';
  toast.style.cssText = `
    position:fixed; bottom:-60px; left:50%; transform:translateX(-50%);
    background:#166534; color:white; padding:14px 28px; border-radius:30px;
    font-weight:600; font-size:0.95rem; box-shadow:0 10px 30px rgba(22,101,52,0.4);
    z-index:99999; transition:all 0.45s cubic-bezier(0.175,0.885,0.32,1.275);
    opacity:0; white-space:nowrap; font-family:inherit;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.bottom = '28px';
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.bottom = '-60px';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3200);
}
window.showToast = showToast;

// ── 15. БУРГЕР-МЕНЮ ──────────────────────────────────────────
function initBurger() {
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// ── 16. РОУТИНГ /place/:id ───────────────────────────────────
function handleRouting() {
  const path = window.location.pathname;
  if (!path.startsWith('/place/')) return;

  const id = path.split('/')[2];
  if (!id) return;

  const sight = SIGHTS.find(s => s.id === id);
  if (!sight) {
    showToast('Объект не найден');
    window.history.replaceState({}, '', '/');
    return;
  }

  document.title = `${sight.name} — Eco Burabay`;

  function tryOpen(attempts) {
    const qrReady = typeof QRCode !== 'undefined';
    const cardsReady = document.getElementById('sightCards')?.children.length > 0;

    if (qrReady && cardsReady) {
      openSightModal(id);
    } else if (attempts > 0) {
      setTimeout(() => tryOpen(attempts - 1), 150);
    } else {
      openSightModal(id);
    }
  }
  tryOpen(20);
}

window.addEventListener('popstate', () => {
  if (!window.location.pathname.startsWith('/place/')) {
    closeModalById('sightModal');
  }
});

// ── 17. СТАРТ ПРИЛОЖЕНИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ───────────────
document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. Сначала подтягиваем данные из глобального облака
  showToast('🔄 Загрузка данных эко-парка...');
  await loadGlobalData();

  // 2. Инициализируем весь интерфейс
  document.querySelectorAll('.modal').forEach(m => {
    m.querySelector('.modal__overlay')?.addEventListener('click', () => {
      m.classList.remove('open');
      document.body.style.overflow = '';
      if (window.location.pathname.startsWith('/place/')) {
        window.history.pushState({}, '', '/');
      }
    });
  });

  initBurger();
  initAuth();
  renderSights();
  renderTrees();
  setupPlantForm();
  setupVolForm();
  setupCleanForm();
  initAdmin();
  updateCounters();
  initReveal();
  initParallax();
  handleRouting();
});
