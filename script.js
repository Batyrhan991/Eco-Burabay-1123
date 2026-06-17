'use strict';

/* =========================================================
   ECO BURABAY — script.js (Абсолютно отказоустойчивая версия)
   ========================================================= */

const SUPABASE_URL = 'https://owsyrkvkyaeqqalxdqgc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_th2MsqnMjnUHXrEyN1dZAQ_6V3x03bI';

let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase CDN не обнаружен, работаем локально.');
  }
} catch (e) {
  console.error('Ошибка инициализации Supabase клиента:', e);
}

function getLS(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch (e) { return def; }
}
function setLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

const DEFAULT_SIGHTS = [
  {
    id: 'burabay',
    name: 'Озеро Бурабай',
    subtitle: 'Главный водоём парка',
    image: 'https://borovoe.kz/upload/medialibrary/454/454cf69f5a0ad9b5bbeba27b18d9b644.jpg',
    shortDesc: 'Сердце национального парка — кристальное озеро среди гранитных скал.',
    description: 'Озеро Бурабай (Боровое) — бессточное озеро в Бурабайском районе Акмолинской области Казахстана.'
  },
  {
    id: 'okzhetpes',
    name: 'Скала Окжетпес',
    subtitle: 'Высота около 200 м',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk3V5RUyOVEO-SbDIzmLzxDftQsEoDcPcir5lAXspjuA&s=10',
    shortDesc: 'Величественная скала, чьё название означает «Стрела не долетит».',
    description: 'Гранитная скала на берегу озера Боровое. Её вершина напоминает лежащего слона.'
  },
  {
    id: 'zhumbaktas',
    name: 'Скала Жумбактас',
    subtitle: 'Загадочный камень',
    image: 'https://img.mustafinmag.kz/eX1X4UKNS9c/el:true/rs:fit:3840/dpr:1/f:webp/czM6Ly9tdXN0YWZpbi1tYWdhemluZS9pbWcvZjdkOWU3ZjZhNjVhOTZiZjIxMjM4YTdmNjlmNGFlMTcuanBn',
    shortDesc: 'Гранитная скала посреди озера — символ Бурабая.',
    description: 'Жумбактас (Загадочный камень) — одна из самых узнаваемых достопримечательностей парка.'
  }
];

const DEFAULT_TREES = [
  { id: 't1', type: 'Сосна обыкновенная', place: 'Зона №1', date: '12.05.2026', planter: 'Алексей М.' },
  { id: 't2', type: 'Берёза повислая',    place: 'Зона №2', date: '24.05.2026', planter: 'Индира Б.' },
  { id: 't3', type: 'Ель сибирская',      place: 'Зона №3', date: '01.06.2026', planter: 'Эко-клуб' }
];

let SIGHTS = [...DEFAULT_SIGHTS];
let TREES  = [...DEFAULT_TREES];
let CURRENT_USER = getLS('eco_user', null);

async function loadGlobalData() {
  if (!supabaseClient) return;
  try {
    const [sightsResponse, treesResponse] = await Promise.all([
      supabaseClient.from('eco_sights').select('*'),
      supabaseClient.from('eco_trees').select('*').order('created_at', { ascending: false })
    ]).catch(() => [ {error: true}, {error: true} ]);

    if (sightsResponse && !sightsResponse.error && sightsResponse.data?.length) {
      SIGHTS = sightsResponse.data;
    }
    if (treesResponse && !treesResponse.error && treesResponse.data?.length) {
      TREES = treesResponse.data;
    }
  } catch (error) {
    console.error('Откат на локальные данные:', error);
  }
}

function animateCounter(el, target, duration = 1200) {
  if (!el) return;
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
  try {
    const tEl = document.getElementById('liveTreeCount');
    const sEl = document.getElementById('liveSightCount');
    const rEl = document.getElementById('liveReportCount');
    const reports = getLS('eco_reports', []);
    if (tEl) animateCounter(tEl, TREES.length);
    if (sEl) animateCounter(sEl, SIGHTS.length);
    if (rEl) animateCounter(rEl, reports.length + 2);
  } catch (e) { console.error('Ошибка счетчиков:', e); }
}

function renderSights() {
  try {
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
          <img src="${sight.image || ''}" alt="${sight.name || ''}" loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1627564547012-6eb6dc355bfa?auto=format&fit=crop&w=800&q=80'">
        </div>
        <div class="card__body">
          <h3 class="card__title">${sight.name || ''}</h3>
          <p class="card__desc">${sight.shortDesc || ''}</p>
          <div class="card__qr">
            <div id="${qrPlaceholder}" class="card__qr-img"></div>
            <div class="card__qr-text">
              <strong>QR-код объекта</strong><br>Сканируйте для просмотра
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
          miniEl.innerHTML = '';
          new QRCode(miniEl, {
            text: `${window.location.origin}/place/${sight.id}`,
            width: 56, height: 56,
            colorDark: '#166534', colorLight: '#ffffff'
          });
        }
      }, 100 + i * 50);
    });
    initReveal();
  } catch (e) { console.error('Ошибка рендера карточек объектов:', e); }
}

window.openSightModal = function(id) {
  try {
    const sight = SIGHTS.find(s => s.id === id);
    if (!sight) return;
    const modal = document.getElementById('sightModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <img src="${sight.image || ''}" alt="${sight.name || ''}" style="width:100%;height:260px;object-fit:cover;border-radius:12px;margin-bottom:20px;" onerror="this.style.display='none'">
      <span class="section__eyebrow">${sight.subtitle || ''}</span>
      <h2 style="margin:10px 0 16px;">${sight.name || ''}</h2>
      <p style="color:#475569;line-height:1.7;">${sight.description || sight.shortDesc || ''}</p>
      <div style="margin-top:24px;display:flex;gap:12px;">
        <button class="btn btn--primary" onclick="openQrModal('${sight.id}'); closeModal();">🔲 Получить QR-код</button>
      </div>
    `;
    openModal('sightModal');
    if (!window.location.pathname.startsWith('/place/')) {
      window.history.pushState({ sightId: id }, '', `/place/${id}`);
    }
  } catch (e) { console.error(e); }
};

window.openQrModal = function(id) {
  try {
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
      <p style="color:#64748b;font-size:0.85rem;margin-bottom:20px;">${sight.name || ''}</p>
      <div id="qrCodeBig" style="display:inline-block;padding:16px;background:white;border-radius:12px;border:2px solid #e2e8f0;"></div>
      <p style="margin-top:16px;font-size:0.8rem;color:#64748b;word-break:break-all;">${fullUrl}</p>
      <button class="btn btn--primary" style="margin-top:16px;" onclick="downloadQR('${id}','${sight.name || ''}')">⬇ Скачать QR-код</button>
    `;

    openModal('qrModalDynamic');

    setTimeout(() => {
      const el = document.getElementById('qrCodeBig');
      if (el && typeof QRCode !== 'undefined') {
        el.innerHTML = '';
        new QRCode(el, { text: fullUrl, width: 200, height: 200, colorDark: '#166534', colorLight: '#ffffff' });
      }
    }, 50);
  } catch (e) { console.error(e); }
};

window.closeQrDynamic = () => closeModalById('qrModalDynamic');

window.downloadQR = function(id, name) {
  const canvas = document.querySelector('#qrCodeBig canvas');
  if (!canvas) { showToast('Не удалось найти QR-код'); return; }
  const link = document.createElement('a');
  link.download = `qr-${id}.png`;
  link.href = canvas.toDataURL();
  link.click();
  showToast('QR-код скачан!');
};

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

function renderTrees(filter = '') {
  try {
    const grid = document.getElementById('treeGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = filter
      ? TREES.filter(t => {
          const planterStr = String(t.planter || '').toLowerCase();
          const typeStr = String(t.type || '').toLowerCase();
          const searchStr = filter.toLowerCase();
          return planterStr.includes(searchStr) || typeStr.includes(searchStr);
        })
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
          <strong>${tree.type || ''}</strong>
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
  } catch (e) { console.error('Ошибка рендера реестра деревьев:', e); }
}

window.filterTrees = function() {
  const val = document.getElementById('treeSearch')?.value || '';
  renderTrees(val);
};

function setupPlantForm() {
  const form = document.getElementById('plantForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const name    = document.getElementById('pName').value.trim() || 'Эко-герой';
      const species = document.getElementById('pSpecies').value;
      const place   = document.getElementById('pPlace').value.trim() || 'Бурабай';

      const newTree = { id: 't-' + Date.now(), type: species, place, date: new Date().toLocaleDateString('ru-RU'), planter: name };

      if (supabaseClient) {
        showToast('🌱 Сохранение...');
        const { error } = await supabaseClient.from('eco_trees').insert([newTree]);
        if (error) { showToast('❌ Ошибка отправки'); return; }
      }
      await loadGlobalData();
      renderTrees();
      updateCounters();
      closeModalById('plantModal');
      form.reset();
      showToast(`🌱 Дерево «${species}» добавлено!`);
    } catch (err) { console.error(err); }
  });
}

function setupVolForm() {
  const form = document.getElementById('volForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('hidden');
    document.getElementById('volSuccess')?.classList.remove('hidden');
    showToast('🎉 Заявка принята!');
  });
}

function setupCleanForm() {
  const form = document.getElementById('cleanForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    try {
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
    } catch (err) { console.error(err); }
  });
}

window.resetCleanForm = function() {
  document.getElementById('cleanForm')?.classList.remove('hidden');
  document.getElementById('cleanSuccess')?.classList.add('hidden');
  document.getElementById('cleanForm')?.reset();
};

function initAuth() {
  try {
    const authBtn = document.getElementById('authBtn');
    const adminBtn = document.getElementById('adminPanelBtn');

    function refreshUI() {
      try {
        if (CURRENT_USER) {
          const firstName = String(CURRENT_USER.name || 'Пользователь').split(' ')[0];
          if (authBtn) authBtn.textContent = `Выйти (${firstName})`;
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
      } catch (uiErr) { console.error('Ошибка UI авторизации:', uiErr); }
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
      closeModalById('authModal');
      showToast(`👋 Рады видеть, ${CURRENT_USER.name}!`);
    });

    document.getElementById('registerForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      CURRENT_USER = { name, email, role: 'user' };
      setLS('eco_user', CURRENT_USER);
      refreshUI();
      closeModalById('authModal');
      showToast(`🎉 Аккаунт создан, ${name}!`);
    });

    refreshUI();

    window.toggleAuthWindows = function(e, mode) {
      e.preventDefault();
      document.getElementById('loginFormWindow')?.classList.toggle('hidden', mode !== 'login');
      document.getElementById('registerFormWindow')?.classList.toggle('hidden', mode !== 'reg');
    };
  } catch (e) { console.error('Ошибка инициализации блока авторизации:', e); }
}

function initAdmin() {
  try {
    const adminBtn     = document.getElementById('adminPanelBtn');
    const adminSection = document.getElementById('adminSection');
    const adminForm    = document.getElementById('adminSightForm');

    adminBtn?.addEventListener('click', () => {
      adminSection?.classList.toggle('hidden');
      if (adminSection && !adminSection.classList.contains('hidden')) {
        adminSection.scrollIntoView({ behavior: 'smooth' });
        renderAdminTable();
      }
    });

    adminForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const editId = document.getElementById('editId').value;
        const obj = {
          name:        document.getElementById('asName').value.trim(),
          subtitle:    document.getElementById('asSubtitle').value.trim(),
          image:       document.getElementById('asImg').value.trim() || DEFAULT_SIGHTS[0].image,
          shortDesc:   document.getElementById('asShortDesc').value.trim(),
          description: document.getElementById('asFullDesc').value.trim()
        };

        if (supabaseClient) {
          showToast('🔄 Синхронизация...');
          if (editId) {
            await supabaseClient.from('eco_sights').update(obj).eq('id', editId);
          } else {
            await supabaseClient.from('eco_sights').insert([{ id: 'id-' + Date.now(), ...obj }]);
          }
        }
        await loadGlobalData();
        resetAdminForm();
        renderSights();
        renderAdminTable();
        updateCounters();
      } catch (err) { console.error(err); }
    });

    window.resetAdminForm = function() {
      if(adminForm) adminForm.reset();
      if (document.getElementById('editId')) document.getElementById('editId').value = '';
      const title = document.getElementById('adminFormTitle');
      if(title) title.textContent = 'Добавить / Изменить объект';
    };
  } catch (e) { console.error('Ошибка панели админа:', e); }
}

function renderAdminTable() {
  try {
    const tbody = document.getElementById('adminSightsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    SIGHTS.forEach(s => {
      const tr = document.createElement('tr');
      const qrUrl = `${window.location.origin}/place/${s.id}`;
      tr.innerHTML = `
        <td><strong>${s.name || ''}</strong></td>
        <td><div id="admin-qr-${s.id}" style="width:48px;height:48px;"></div></td>
        <td>
          <button class="btn-action" onclick="adminEdit('${s.id}')">✏️</button>
          <button class="btn-action btn-action--delete" onclick="adminDelete('${s.id}')">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);

      setTimeout(() => {
        const el = document.getElementById(`admin-qr-${s.id}`);
        if (el && typeof QRCode !== 'undefined') {
          el.innerHTML = '';
          new QRCode(el, { text: qrUrl, width: 48, height: 48, colorDark: '#166534', colorLight: '#fff' });
        }
      }, 50);
    });
  } catch (e) { console.error(e); }
}

window.adminEdit = function(id) {
  try {
    const s = SIGHTS.find(x => x.id === id);
    if (!s) return;
    document.getElementById('editId').value     = s.id;
    document.getElementById('asName').value     = s.name || '';
    document.getElementById('asSubtitle').value = s.subtitle || '';
    document.getElementById('asImg').value      = s.image || '';
    document.getElementById('asShortDesc').value = s.shortDesc || '';
    document.getElementById('asFullDesc').value  = s.description || '';
    document.getElementById('adminFormTitle').textContent = '✏️ Редактировать объект';
    document.getElementById('adminSection')?.scrollIntoView({ behavior: 'smooth' });
  } catch (e) { console.error(e); }
};

window.adminDelete = async function(id) {
  if (!confirm('Удалить объект?')) return;
  try {
    if (supabaseClient) {
      await supabaseClient.from('eco_sights').delete().eq('id', id);
    }
    await loadGlobalData();
    renderSights();
    renderAdminTable();
    updateCounters();
    showToast('🗑️ Объект удалён');
  } catch (e) { console.error(e); }
};

function initReveal() {
  try {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal:not(.active)').forEach(el => obs.observe(el));
  } catch (e) { console.error(e); }
}

function initParallax() {
  const hero = document.querySelector('.hero__bg-image');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    hero.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }, { passive: true });
}

function showToast(msg) {
  try {
    document.querySelectorAll('.eco-toast').forEach(el => el.remove());
    const toast = document.createElement('div');
    toast.className = 'eco-toast';
    toast.style.cssText = `position:fixed; bottom:-60px; left:50%; transform:translateX(-50%); background:#166534; color:white; padding:14px 28px; border-radius:30px; font-weight:600; font-size:0.95rem; box-shadow:0 10px 30px rgba(22,101,52,0.4); z-index:99999; transition:all 0.45s cubic-bezier(0.175,0.885,0.32,1.275); opacity:0; white-space:nowrap;`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.bottom = '28px'; toast.style.opacity = '1'; });
    setTimeout(() => { toast.style.bottom = '-60px'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3200);
  } catch (e) { console.error(msg); }
}
window.showToast = showToast;

function initBurger() {
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => { burger.classList.toggle('open'); navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { burger.classList.remove('open'); navLinks.classList.remove('open'); });
  });
}

function handleRouting() {
  try {
    const path = window.location.pathname;
    if (!path.startsWith('/place/')) return;
    const id = path.split('/')[2];
    if (!id) return;
    const sight = SIGHTS.find(s => s.id === id);
    if (!sight) { window.history.replaceState({}, '', '/'); return; }
    document.title = `${sight.name} — Eco Burabay`;
    openSightModal(id);
  } catch (e) { console.error(e); }
}

window.addEventListener('popstate', () => {
  if (!window.location.pathname.startsWith('/place/')) closeModalById('sightModal');
});

// ── СТАРТ ПРИЛОЖЕНИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ───────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Автоматически настраиваем закрытие модалок по клику на фон
  document.querySelectorAll('.modal').forEach(m => {
    m.querySelector('.modal__overlay')?.addEventListener('click', () => {
      m.classList.remove('open');
      document.body.style.overflow = '';
      if (window.location.pathname.startsWith('/place/')) window.history.pushState({}, '', '/');
    });
  });

  // Массив безопасных шагов инициализации
  const steps = [
    { name: 'Бургер-меню', action: initBurger },
    { name: 'Авторизация', action: initAuth },
    { name: 'Рендер объектов', action: renderSights },
    { name: 'Рендер реестра деревьев', action: renderTrees },
    { name: 'Форма посадки деревьев', action: setupPlantForm },
    { name: 'Форма волонтеров', action: setupVolForm },
    { name: 'Форма эко-патруля', action: setupCleanForm },
    { name: 'Панель администратора', action: initAdmin },
    { name: 'Обновление счетчиков', action: updateCounters },
    { name: 'Анимации появления', action: initReveal },
    { name: 'Параллакс', action: initParallax },
    { name: 'Роутинг', action: handleRouting }
  ];

  steps.forEach(step => {
    try {
      step.action();
    } catch (err) {
      console.error(`Ошибка при инициализации компонента [${step.name}]:`, err);
    }
  });

  // Асинхронно обновляем из Supabase (в фоне)
  loadGlobalData().then(() => {
    try {
      renderSights();
      renderTrees();
      updateCounters();
      handleRouting();
    } catch (e) { console.error('Ошибка фонового обновления данных:', e); }
  });
});
