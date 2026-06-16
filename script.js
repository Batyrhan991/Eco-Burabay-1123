'use strict';

// Безопасное чтение из localStorage (чтобы система не ломалась от багов кэша браузера)
function getStorageItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

const DEFAULT_SIGHTS = [
  { id: 'burabay', name: 'Озеро Бурабай', subtitle: 'Главный водоём парка', image: 'https://images.unsplash.com/photo-1627564547012-6eb6dc355bfa?auto=format&fit=crop&w=800&q=80', shortDesc: 'Сердце национального парка — кристальное озеро среди гранитных скал.', description: 'Озеро Бурабай (Боровое) — бессточное озеро в Бурабайском районе Акмолинской области Казахстана.' },
  { id: 'okzhetpes', name: 'Скала Окжетпес', subtitle: 'Высота около 200 м', image: 'https://images.unsplash.com/photo-1589405858862-2ac9cbb41321?auto=format&fit=crop&w=800&q=80', shortDesc: 'Величественная скала, чье название означает "Стрела не долетит".', description: 'Гранитная скала на берегу одноименного озера, овеянная десятками народных легенд.' }
];

const DEFAULT_TREES = [
  { id: 1, name: 'Батырхан', species: 'Сосна обыкновенная', place: 'Сектор А-1' },
  { id: 2, name: 'Алина М.', species: 'Ель сибирская', place: 'Возле поляны Абылай Хана' },
  { id: 3, name: 'EcoCompany', species: 'Берёза повислая', place: 'Южный склон' }
];

let SIGHTS = getStorageItem('eco_sights', DEFAULT_SIGHTS);
let TREES_DATA = getStorageItem('eco_trees', DEFAULT_TREES);
let CURRENT_USER = getStorageItem('eco_current_user', null);
let REPORT_COUNT = parseInt(localStorage.getItem('eco_reports_count')) || 2;

function saveAllData() {
  localStorage.setItem('eco_sights', JSON.stringify(SIGHTS));
  localStorage.setItem('eco_trees', JSON.stringify(TREES_DATA));
  localStorage.setItem('eco_reports_count', REPORT_COUNT);
}

// ===== УМНЫЕ СЧЕТЧИКИ =====
function updateLiveCounters() {
  if (document.getElementById('liveTreeCount')) document.getElementById('liveTreeCount').textContent = TREES_DATA.length;
  if (document.getElementById('liveSightCount')) document.getElementById('liveSightCount').textContent = SIGHTS.length;
  if (document.getElementById('liveReportCount')) document.getElementById('liveReportCount').textContent = REPORT_COUNT;
}

// ===== СИСТЕМА ВХОДА (ТЕПЕРЬ РАБОТАЕТ) =====
function initAuthSystem() {
  const authBtn = document.getElementById('authBtn');
  const authModal = document.getElementById('authModal');
  const adminPanelBtn = document.getElementById('adminPanelBtn');
  const adminSection = document.getElementById('adminSection');

  if (!authBtn) return;

  function refreshUI() {
    if (CURRENT_USER && CURRENT_USER.name) {
      authBtn.textContent = `Выйти (${CURRENT_USER.name})`;
      authBtn.style.background = '#dc2626'; // Красный цвет кнопки выхода
      if (CURRENT_USER.role === 'admin' && adminPanelBtn) {
        adminPanelBtn.classList.remove('hidden');
      } else {
        if (adminPanelBtn) adminPanelBtn.classList.add('hidden');
        if (adminSection) adminSection.classList.add('hidden');
      }
    } else {
      authBtn.textContent = 'Войти';
      authBtn.style.background = ''; // Возвращаем зеленый
      if (adminPanelBtn) adminPanelBtn.classList.add('hidden');
      if (adminSection) adminSection.classList.add('hidden');
    }
  }

  // Логика нажатия на кнопку Войти/Выйти
  authBtn.addEventListener('click', () => {
    if (CURRENT_USER) {
      CURRENT_USER = null;
      localStorage.removeItem('eco_current_user');
      refreshUI();
      showNotification('Вы успешно вышли из системы');
    } else {
      authModal.classList.add('open');
      document.getElementById('loginForm').reset();
    }
  });

  // Логин форма
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;

    if (email === 'admin@eco.kz' && pass === 'admin123') {
      CURRENT_USER = { name: 'Администратор', email, role: 'admin' };
    } else {
      CURRENT_USER = { name: email.split('@')[0], email, role: 'user' };
    }
    
    localStorage.setItem('eco_current_user', JSON.stringify(CURRENT_USER));
    refreshUI();
    closeAuthModal();
    showNotification(`Добро пожаловать, ${CURRENT_USER.name}!`);
  });

  // Форма регистрации
  document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    
    CURRENT_USER = { name, email, role: 'user' };
    localStorage.setItem('eco_current_user', JSON.stringify(CURRENT_USER));
    refreshUI();
    closeAuthModal();
    showNotification('Успешная регистрация!');
  });

  if (adminPanelBtn) {
    adminPanelBtn.addEventListener('click', () => {
      if (adminSection) {
        adminSection.classList.toggle('hidden');
        if (!adminSection.classList.contains('hidden')) {
          adminSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  refreshUI();
}

window.closeAuthModal = function() {
  document.getElementById('authModal').classList.remove('open');
};

window.toggleAuthWindows = function(e, type) {
  e.preventDefault();
  const loginWin = document.getElementById('loginFormWindow');
  const regWin = document.getElementById('registerFormWindow');
  
  if (type === 'reg') {
    loginWin.classList.add('hidden');
    regWin.classList.remove('hidden');
  } else {
    regWin.classList.add('hidden');
    loginWin.classList.remove('hidden');
  }
};

// ===== ГЕНЕРАЦИЯ QR ГИДА =====
function renderSights() {
  const container = document.getElementById('sightCards');
  if (!container) return;

  container.innerHTML = SIGHTS.map(s => `
    <div class="card" onclick="openSightModal('${s.id}')">
      <div class="card__img">
        <img src="${s.image}" alt="${s.name}"/>
      </div>
      <div class="card__body">
        <h3 class="card__title">${s.name}</h3>
        <p class="card__desc">${s.shortDesc}</p>
        <div class="card__qr">
          <div class="card__qr-img" id="main-qr-${s.id}"></div>
          <div class="card__qr-text"><strong>Eco QR Код</strong>Сканируй на месте</div>
        </div>
      </div>
    </div>
  `).join('');

  SIGHTS.forEach(s => {
    const box = document.getElementById(`main-qr-${s.id}`);
    if (box && typeof QRCode !== 'undefined') {
      new QRCode(box, { text: `https://eco-burabay.kz/place/${s.id}`, width: 60, height: 60, colorDark: "#166534" });
    }
  });
}

window.openSightModal = function(id) {
  const s = SIGHTS.find(x => x.id === id);
  if (!s) return;
  const content = document.getElementById('modalContent');
  if (content) {
    content.innerHTML = `
      <div style="margin-bottom:20px; border-radius:12px; overflow:hidden; height:200px;">
         <img src="${s.image}" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <h2 style="margin-bottom:8px;">${s.name}</h2>
      <p style="color:#166534; font-weight:600; margin-bottom:1rem;">${s.subtitle}</p>
      <p style="line-height:1.6; color:#475569;">${s.description}</p>
    `;
    document.getElementById('sightModal').classList.add('open');
  }
};

window.closeModal = function() {
  document.getElementById('sightModal').classList.remove('open');
};

// ===== АДМИНКА =====
function initAdminLogic() {
  const tbody = document.getElementById('adminSightsTableBody');
  const form = document.getElementById('adminSightForm');
  if (!tbody || !form) return;

  function updateAdminTable() {
    tbody.innerHTML = SIGHTS.map(s => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td><div id="adm-qr-${s.id}"></div></td>
        <td style="white-space: nowrap;">
          <button type="button" class="btn-action" onclick="prepareEditSight('${s.id}')">✏️</button>
          <button type="button" class="btn-action btn-action--delete" onclick="removeSight('${s.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');

    SIGHTS.forEach(s => {
      const box = document.getElementById(`adm-qr-${s.id}`);
      if (box && typeof QRCode !== 'undefined') {
        new QRCode(box, { text: `https://eco-burabay.kz/place/${s.id}`, width: 35, height: 35 });
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('editId').value;
    const name = document.getElementById('asName').value.trim();
    const subtitle = document.getElementById('asSubtitle').value.trim();
    const image = document.getElementById('asImg').value.trim();
    const shortDesc = document.getElementById('asShortDesc').value.trim();
    const description = document.getElementById('asFullDesc').value.trim();

    if (editId) {
      const i = SIGHTS.findIndex(x => x.id === editId);
      if (i !== -1) SIGHTS[i] = { ...SIGHTS[i], name, subtitle, image, shortDesc, description };
      showNotification('Объект успешно обновлен');
    } else {
      SIGHTS.push({ id: 'id-' + Date.now(), name, subtitle, image, shortDesc, description });
      showNotification('Новый объект добавлен');
    }

    saveAllData();
    resetAdminForm();
    renderSights();
    updateAdminTable();
    updateLiveCounters();
  });

  window.prepareEditSight = function(id) {
    const s = SIGHTS.find(x => x.id === id);
    if (!s) return;
    document.getElementById('editId').value = s.id;
    document.getElementById('asName').value = s.name;
    document.getElementById('asSubtitle').value = s.subtitle;
    document.getElementById('asImg').value = s.image;
    document.getElementById('asShortDesc').value = s.shortDesc;
    document.getElementById('asFullDesc').value = s.description;
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  window.removeSight = function(id) {
    if (confirm('Вы уверены, что хотите удалить объект?')) {
      SIGHTS = SIGHTS.filter(x => x.id !== id);
      saveAllData();
      renderSights();
      updateAdminTable();
      updateLiveCounters();
      showNotification('Объект удален');
    }
  };

  window.resetAdminForm = function() {
    form.reset();
    document.getElementById('editId').value = '';
    document.getElementById('cancelEditBtn').style.display = 'none';
  };

  updateAdminTable();
}

// ===== РЕЕСТР ДЕРЕВЬЕВ =====
function renderTrees() {
  const grid = document.getElementById('treeGrid');
  if (!grid) return;
  grid.innerHTML = TREES_DATA.map(t => `
    <div class="tree-card">
      <div class="tree-card__header"><strong>${t.name}</strong></div>
      <div style="font-size:2.5rem; text-align:center; margin: 0.5rem 0;">🌲</div>
      <div style="font-size:0.85rem; color:#4b5563; text-align:center;">
        <div>${t.species}</div>
        <div style="margin-top:0.25rem; font-style:italic;">📍 ${t.place}</div>
      </div>
    </div>
  `).join('');
}

window.openPlantModal = function() { document.getElementById('plantModal').classList.add('open'); };
window.closePlantModal = function() { document.getElementById('plantModal').classList.remove('open'); };

window.plantTree = function(e) {
  e.preventDefault();
  const name = document.getElementById('pName').value.trim();
  const species = document.getElementById('pSpecies').value;
  const place = document.getElementById('pPlace').value.trim();
  if (!name || !place) return;

  TREES_DATA.unshift({ id: Date.now(), name, species, place });
  saveAllData();
  renderTrees();
  updateLiveCounters();
  closePlantModal();
  document.getElementById('plantForm').reset();
  showNotification('Дерево занесено в реестр проекта! 🌱');
};

window.filterTrees = function() {
  const query = document.getElementById('treeSearch').value.toLowerCase();
  const grid = document.getElementById('treeGrid');
  if (!grid) return;
  grid.innerHTML = TREES_DATA.filter(t => t.name.toLowerCase().includes(query)).map(t => `
    <div class="tree-card">
      <div class="tree-card__header"><strong>${t.name}</strong></div>
      <div style="font-size:2.5rem; text-align:center; margin: 0.5rem 0;">🌲</div>
      <div style="font-size:0.85rem; color:#4b5563; text-align:center;">
        <div>${t.species}</div>
        <div>📍 ${t.place}</div>
      </div>
    </div>
  `).join('');
};

// ===== ОСТАЛЬНОЙ UI И АНИМАЦИИ =====
function setupFormsLogic() {
  const cleanForm = document.getElementById('cleanForm');
  const cleanSuccess = document.getElementById('cleanSuccess');
  if (cleanForm && cleanSuccess) {
    cleanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      REPORT_COUNT++;
      saveAllData();
      updateLiveCounters();
      cleanForm.classList.add('hidden');
      cleanSuccess.classList.remove('hidden');
    });
  }

  const volForm = document.getElementById('volForm');
  const volSuccess = document.getElementById('volSuccess');
  if (volForm && volSuccess) {
    volForm.addEventListener('submit', (e) => {
      e.preventDefault();
      volForm.classList.add('hidden');
      volSuccess.classList.remove('hidden');
    });
  }

  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }
}

function initRevealAnimation() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => observer.observe(i));
}

function showNotification(msg) {
  document.querySelectorAll('.eco-notification').forEach(el => el.remove());
  const banner = document.createElement('div');
  banner.className = 'eco-notification';
  banner.style.cssText = `position: fixed; bottom: -50px; left: 50%; transform: translateX(-50%); background: #166534; color: white; padding: 14px 28px; border-radius: 30px; font-weight: 600; box-shadow: 0 10px 25px rgba(22, 101, 52, 0.4); z-index: 99999; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: 0; pointer-events: none;`;
  banner.textContent = msg;
  document.body.appendChild(banner);
  
  requestAnimationFrame(() => {
    banner.style.bottom = '24px';
    banner.style.opacity = '1';
  });

  setTimeout(() => {
    banner.style.bottom = '-50px';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 400);
  }, 3000);
}

window.resetCleanForm = function() {
  const form = document.getElementById('cleanForm');
  const succ = document.getElementById('cleanSuccess');
  if (form && succ) {
    form.reset();
    form.classList.remove('hidden');
    succ.classList.add('hidden');
  }
};

// ЗАПУСК
document.addEventListener('DOMContentLoaded', () => {
  setupFormsLogic();
  initAuthSystem();
  renderSights();
  renderTrees();
  initAdminLogic();
  updateLiveCounters();
  initRevealAnimation();
});