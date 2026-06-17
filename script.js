/**
 * Eco Burabay — Официальный скрипт платформы
 * Полная интерактивная логика: гид, реестр, патруль, админка и авторизация.
 */

// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ ДАННЫХ (БАЗА ДАННЫХ)
// ==========================================

// Начальные данные для QR-гида (если localStorage пуст)
const defaultSights = [
    {
        id: "sight_1",
        name: "Скара Окжетпес",
        subtitle: "Символ Бурабая",
        img: "https://images.unsplash.com/photo-1589553460459-33929f01ab7d?auto=format&fit=crop&w=600&q=80",
        shortDesc: "Величественная скала, напоминающая трехгранную пирамиду на берегу озера.",
        fullDesc: "Окжетпес — одна из самых известных достопримечательностей национального парка. Её высота достигает 300 метров над уровнем моря. С этой скалой связано множество красивых казахских легенд о любви, мужестве и свободе. Скала привлекает альпинистов и тысячи туристов со всего мира."
    },
    {
        id: "sight_2",
        name: "Поляна Абылай хана",
        subtitle: "Историческое сердце парка",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        shortDesc: "Уникальный памятник природы и истории под открытым небом с особым микроклиматом.",
        fullDesc: "Поляна Абылай хана — сакральное место для казахского народа. Здесь установлена величественная стела в честь объединителя казахских земель. На поляне наблюдается уникальный природный феномен: ультрафиолетовые лучи и обилие фитонцидов способствуют омоложению организма."
    }
];

// Начальные данные для реестра деревьев
const defaultTrees = [
    { id: "tree_1", name: "Батырхан А.", species: "Сосна обыкновенная", place: "Сектор №1 (Берег озера)", date: "12.04.2026" },
    { id: "tree_2", name: "Шертай Е.", species: "Берёза повислая", place: "Зона №3 (Около поляны)", date: "20.05.2026" }
];

// Загрузка данных или установка дефолтных
let sights = JSON.parse(localStorage.getItem('eco_sights')) || defaultSights;
let trees = JSON.parse(localStorage.getItem('eco_trees')) || defaultTrees;
let reportsCount = parseInt(localStorage.getItem('eco_reports_count')) || 14; // Начальное число решенных проблем
let currentUser = JSON.parse(localStorage.getItem('eco_current_user')) || null;

// Сохранение изменений в память
function saveToStorage() {
    localStorage.setItem('eco_sights', JSON.stringify(sights));
    localStorage.setItem('eco_trees', JSON.stringify(trees));
    localStorage.setItem('eco_reports_count', reportsCount.toString());
    localStorage.setItem('eco_current_user', JSON.stringify(currentUser));
}

// ==========================================
// 2. СЛУШАТЕЛИ И ИНИЦИАЛИЗАЦИЯ DOM
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Инициализация интерфейса
    updateStats();
    renderSights();
    renderTrees();
    checkAuthStatus();
    initReveal();

    // Бургер-меню
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            const expanded = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылки
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
            });
        });
    }

    // Кнопка авторизации (Войти / Выйти)
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (currentUser) {
                // Если залогинен — выходим
                currentUser = null;
                saveToStorage();
                checkAuthStatus();
                location.reload();
            } else {
                // Если не залогинен — открываем окно
                openAuthModal();
            }
        });
    }

    // Отправка формы авторизации (Вход)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const pass = document.getElementById('loginPassword').value;

            if (email === 'admin@eco.kz' && pass === 'admin123') {
                currentUser = { name: 'Администратор', email: email, role: 'admin' };
            } else {
                currentUser = { name: email.split('@')[0], email: email, role: 'user' };
            }
            saveToStorage();
            closeAuthModal();
            checkAuthStatus();
            location.reload();
        });
    }

    // Отправка формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            
            currentUser = { name: name, email: email, role: 'user' };
            saveToStorage();
            closeAuthModal();
            checkAuthStatus();
            location.reload();
        });
    }

    // Регистрация нового дерева (Форма)
    const plantForm = document.getElementById('plantForm');
    if (plantForm) {
        plantForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('pName').value.trim();
            const species = document.getElementById('pSpecies').value;
            const place = document.getElementById('pPlace').value.trim();
            const today = new Date().toLocaleDateString('ru-RU');

            const newTree = {
                id: 'tree_' + Date.now(),
                name: name,
                species: species,
                place: place,
                date: today
            };

            trees.unshift(newTree);
            saveToStorage();
            renderTrees();
            updateStats();
            closePlantModal();
            plantForm.reset();
        });
    }

    // Эко-патруль (Форма сообщения о мусоре)
    const cleanForm = document.getElementById('cleanForm');
    if (cleanForm) {
        cleanForm.addEventListener('submit', (e) => {
            e.preventDefault();
            reportsCount++;
            saveToStorage();
            updateStats();

            document.getElementById('cleanFormBlock').classList.add('hidden');
            document.getElementById('cleanSuccess').classList.remove('hidden');
        });
    }

    // Управление формой администратора (Создание / Редактирование объектов)
    const adminSightForm = document.getElementById('adminSightForm');
    if (adminSightForm) {
        adminSightForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('editId').value;
            const name = document.getElementById('asName').value.trim();
            const subtitle = document.getElementById('asSubtitle').value.trim();
            const img = document.getElementById('asImg').value.trim() || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';
            const shortDesc = document.getElementById('asShortDesc').value.trim();
            const fullDesc = document.getElementById('asFullDesc').value.trim();

            if (editId) {
                // Редактирование
                const idx = sights.findIndex(s => s.id === editId);
                if (idx !== -1) {
                    sights[idx] = { id: editId, name, subtitle, img, shortDesc, fullDesc };
                }
            } else {
                // Создание
                const newSight = {
                    id: 'sight_' + Date.now(),
                    name, subtitle, img, shortDesc, fullDesc
                };
                sights.push(newSight);
            }

            saveToStorage();
            renderSights();
            updateStats();
            resetAdminForm();
        });
    }

    // Волонтерство
    const volForm = document.getElementById('volForm');
    if (volForm) {
        volForm.addEventListener('submit', (e) => {
            e.preventDefault();
            volForm.classList.add('hidden');
            document.getElementById('volSuccess').classList.remove('hidden');
        });
    }

    // Анимация при прокрутке экрана
    window.addEventListener('scroll', initReveal);
});

// ==========================================
// 3. АВТОРИЗАЦИЯ И ДИНАМИКА ИНТЕРФЕЙСА
// ==========================================

function checkAuthStatus() {
    const authBtn = document.getElementById('authBtn');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const adminSection = document.getElementById('adminSection');

    if (currentUser) {
        authBtn.textContent = `Выйти (${currentUser.name})`;
        authBtn.classList.add('btn--outline');

        if (currentUser.role === 'admin') {
            if (adminPanelBtn) adminPanelBtn.classList.remove('hidden');
            
            // Навешиваем событие клика на админ-кнопку в меню
            if (adminPanelBtn && adminSection) {
                adminPanelBtn.onclick = () => {
                    adminSection.classList.toggle('hidden');
                    if (!adminSection.classList.contains('hidden')) {
                        adminSection.scrollIntoView({ behavior: 'smooth' });
                        renderAdminTable();
                    }
                };
            }
        }
    } else {
        if (authBtn) {
            authBtn.textContent = 'Войти';
            authBtn.classList.remove('btn--outline');
        }
        if (adminPanelBtn) adminPanelBtn.classList.add('hidden');
        if (adminSection) adminSection.classList.add('hidden');
    }
}

// Статистика на главном экране
function updateStats() {
    const liveTreeCount = document.getElementById('liveTreeCount');
    const liveSightCount = document.getElementById('liveSightCount');
    const liveReportCount = document.getElementById('liveReportCount');

    if (liveTreeCount) liveTreeCount.textContent = trees.length;
    if (liveSightCount) liveSightCount.textContent = sights.length;
    if (liveReportCount) liveReportCount.textContent = reportsCount;
}

// ==========================================
// 4. МОДЫ И ОКНА (ГЛОБАЛЬНЫЕ ФУНКЦИИ)
// ==========================================

window.openAuthModal = function() {
    document.getElementById('authModal').classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeAuthModal = function() {
    document.getElementById('authModal').classList.remove('active');
    document.body.style.overflow = '';
};

window.toggleAuthWindows = function(event, type) {
    event.preventDefault();
    if (type === 'reg') {
        document.getElementById('loginFormWindow').classList.add('hidden');
        document.getElementById('registerFormWindow').classList.remove('hidden');
    } else {
        document.getElementById('registerFormWindow').classList.add('hidden');
        document.getElementById('loginFormWindow').classList.remove('hidden');
    }
};

window.openPlantModal = function() {
    document.getElementById('plantModal').classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closePlantModal = function() {
    document.getElementById('plantModal').classList.remove('active');
    document.body.style.overflow = '';
};

window.closeModal = function() {
    document.getElementById('sightModal').classList.remove('active');
    document.body.style.overflow = '';
};

window.resetCleanForm = function() {
    document.getElementById('cleanForm').reset();
    document.getElementById('cleanSuccess').classList.add('hidden');
    document.getElementById('cleanFormBlock').classList.remove('hidden');
};

// ==========================================
// 5. ГИД И ГЕНЕРАЦИЯ QR-КОДОВ
// ==========================================

function renderSights() {
    const cardsContainer = document.getElementById('sightCards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = '';

    sights.forEach(sight => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card__img">
                <img src="${sight.img}" alt="${sight.name}" loading="lazy" />
            </div>
            <div class="card__content">
                <span class="card__subtitle">📍 ${sight.subtitle}</span>
                <h3 class="card__title">${sight.name}</h3>
                <p class="card__desc">${sight.shortDesc}</p>
                
                <div class="card__footer">
                    <button class="btn btn--primary btn--sm" onclick="openSightModal('${sight.id}')">Подробнее 🌿</button>
                    <div class="card__qr-box" id="qr_card_${sight.id}" title="Сканируйте для мобильного гида"></div>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);

        // Генерация QR-кода прямо в карточку (ссылка симулирует переход на подробное инфо)
        setTimeout(() => {
            const qrContainer = document.getElementById(`qr_card_${sight.id}`);
            if (qrContainer && typeof QRCode !== 'undefined') {
                new QRCode(qrContainer, {
                    text: `https://eco-burabay.kz/sight/${sight.id}`,
                    width: 60,
                    height: 60,
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }, 50);
    });
}

window.openSightModal = function(id) {
    const sight = sights.find(s => s.id === id);
    if (!sight) return;

    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;

    modalContent.innerHTML = `
        <div class="modal-sight">
            <div class="modal-sight__img">
                <img src="${sight.img}" alt="${sight.name}" />
            </div>
            <div class="modal-sight__body">
                <span class="modal-sight__badge">📍 ${sight.subtitle}</span>
                <h2>${sight.name}</h2>
                <div class="modal-sight__text">
                    <p>${sight.fullDesc}</p>
                </div>
                <div class="modal-sight__qr-large">
                    <div id="modal_qr_large"></div>
                    <p>Сканируйте этот QR-код прямо на месте у объекта, чтобы сохранить аудиогид в смартфоне.</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('sightModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Отрисовка увеличенного QR кода в модальном окне
    setTimeout(() => {
        const modalQrContainer = document.getElementById('modal_qr_large');
        if (modalQrContainer && typeof QRCode !== 'undefined') {
            new QRCode(modalQrContainer, {
                text: `https://eco-burabay.kz/sight/${sight.id}?source=monument`,
                width: 120,
                height: 120
            });
        }
    }, 50);
};

// ==========================================
// 6. РЕЕСТР ДЕРЕВЬЕВ И ФИЛЬТРАЦИЯ
// ==========================================

function renderTrees() {
    const grid = document.getElementById('treeGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (trees.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#64748b; padding: 2rem;">Реестр пуст. Посадите первое дерево!</p>`;
        return;
    }

    trees.forEach(tree => {
        const item = document.createElement('div');
        item.className = 'tree-card';
        item.innerHTML = `
            <div class="tree-card__icon">🌲</div>
            <div class="tree-card__info">
                <h4>${tree.species}</h4>
                <p class="tree-card__owner">Владелец: <strong>${tree.name}</strong></p>
                <p class="tree-card__place">📍 ${tree.place}</p>
                <span class="tree-card__date">Дата: ${tree.date}</span>
            </div>
        `;
        grid.appendChild(item);
    });
}

window.filterTrees = function() {
    const query = document.getElementById('treeSearch').value.toLowerCase();
    const treeCards = document.querySelectorAll('#treeGrid .tree-card');

    treeCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.style.display = 'none'; // Мелкая защита раскладки флекса
            card.style.setProperty('display', 'none', 'important');
        }
    });
};

// ==========================================
// 7. ПАНЕЛЬ АДМИНИСТРАТОРА (CRUD)
// ==========================================

function renderAdminTable() {
    const tbody = document.getElementById('adminSightsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    sights.forEach(sight => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${sight.name}</strong><br><small style="color:#64748b">${sight.subtitle}</small></td>
            <td><div id="admin_table_qr_${sight.id}" class="admin-table-qr"></div></td>
            <td>
                <div style="display:flex; gap:6px;">
                    <button class="btn btn--sm" style="background:#e2e8f0; color:#1e293b; padding: 4px 10px;" onclick="editSight('${sight.id}')">✏️</button>
                    <button class="btn btn--sm" style="background:#fee2e2; color:#ef4444; padding: 4px 10px;" onclick="deleteSight('${sight.id}')">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);

        // Крошечный QR для административной таблицы
        setTimeout(() => {
            const container = document.getElementById(`admin_table_qr_${sight.id}`);
            if (container && typeof QRCode !== 'undefined') {
                new QRCode(container, {
                    text: `https://eco-burabay.kz/sight/${sight.id}`,
                    width: 40,
                    height: 40
                });
            }
        }, 30);
    });
}

window.editSight = function(id) {
    const sight = sights.find(s => s.id === id);
    if (!sight) return;

    document.getElementById('editId').value = sight.id;
    document.getElementById('asName').value = sight.name;
    document.getElementById('asSubtitle').value = sight.subtitle;
    document.getElementById('asImg').value = sight.img;
    document.getElementById('asShortDesc').value = sight.shortDesc;
    document.getElementById('asFullDesc').value = sight.fullDesc;

    document.getElementById('adminFormTitle').textContent = '📝 Редактировать объект';
    document.getElementById('adminSightForm').scrollIntoView({ behavior: 'smooth' });
};

window.deleteSight = function(id) {
    if (confirm('Вы уверены, что хотите удалить этот туристический объект из системы?')) {
        sights = sights.filter(s => s.id !== id);
        saveToStorage();
        renderSights();
        renderAdminTable();
        updateStats();
    }
};

window.resetAdminForm = function() {
    document.getElementById('adminSightForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('adminFormTitle').textContent = '➕ Добавить объект';
};

// ==========================================
// 8. ЭФФЕКТ ПЛАВНОГО ПОЯВЛЕНИЯ (SCROLL REVEAL)
// ==========================================

function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 80; // Элемент появляется, когда верхушка находится в 80px от низа экрана

    reveals.forEach(element => {
        const revealTop = element.getBoundingClientRect().top;

        if (revealTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}
