'use strict';

/* =========================================================
   ECO BURABAY — i18n.js
   Локализация: Русский | Қазақша | English
   ========================================================= */

const TRANSLATIONS = {
  ru: {
    // NAV
    nav_guide:     'QR-гид',
    nav_clean:     'Эко-патруль',
    nav_trees:     'Моё дерево',
    nav_map:       'Карта',
    nav_volunteer: 'Волонтёры',
    nav_admin:     '🔑 Админка',
    nav_login:     'Войти',
    nav_logout:    'Выйти',

    // HERO
    hero_badge:    '🌿 Экологический проект Казахстана',
    hero_slogan:   'Сканируй. Узнавай. Сохраняй.',
    hero_slogan2:  'Выращивай Бурабай вместе с нами!',
    hero_desc:     'Цифровая платформа для сохранения природы и культурного наследия жемчужины Казахстана — национального природного парка «Бурабай».',
    hero_btn_qr:   '🔲 Исследовать QR-гид',
    hero_btn_tree: '🌱 Посадить дерево',

    // STATS
    stat_trees:    'Деревьев посажено',
    stat_qr:       'QR-объектов',
    stat_members:  'Участников',
    stat_solved:   'Решённых проблем',

    // AUTH
    auth_login_title: 'Вход в систему',
    auth_reg_title:   'Регистрация',
    auth_email:       'Email',
    auth_password:    'Пароль',
    auth_name:        'Ваше имя',
    auth_name_ph:     'Батырхан Ахметов',
    auth_pass_ph:     'Минимум 6 символов',
    auth_login_btn:   'Войти',
    auth_reg_btn:     'Создать аккаунт',
    auth_no_acc:      'Нет аккаунта?',
    auth_has_acc:     'Уже есть аккаунт?',
    auth_do_reg:      'Зарегистрироваться',
    auth_do_login:    'Войти',
    auth_hint:        '💡 Администратор:',

    // PLANT MODAL
    plant_title:    '🌱 Регистрация нового дерева',
    plant_owner:    'Имя владельца / Организация *',
    plant_owner_ph: 'Батырхан',
    plant_species:  'Порода дерева *',
    plant_zone:     'Сектор посадки *',
    plant_zone_ph:  'Зона №3 (Озеро Малое Чебачье)',
    plant_btn:      'Внести в реестр 🌿',

    // SPECIES
    species_pine:   '🌲 Сосна обыкновенная',
    species_birch:  '🌳 Берёза повислая',
    species_fir:    '🎄 Ель сибирская',
    
    // Прямой маппинг значений из БД для реестра деревьев
    'pine':               '🌲 Сосна обыкновенная',
    'birch':              '🌳 Берёза повислая',
    'fir':                '🎄 Ель сибирская',
    'Сосна обыкновенная': '🌲 Сосна обыкновенная',
    'Берёза повислая':    '🌳 Берёза повислая',
    'Ель сибирская':      '🎄 Ель сибирская',

    // ADMIN
    admin_eyebrow:    'Панель администратора',
    admin_title:      'Управление QR-объектами',
    admin_add:        '➕ Добавить объект',
    admin_name:       'Название *',
    admin_name_ph:    'Озеро Бурабай',
    admin_subtitle:   'Подзаголовок *',
    admin_subtitle_ph:'Главный водоём парка',
    admin_img:        'URL изображения',
    admin_short:      'Краткое описание *',
    admin_short_ph:   'Для карточки (1–2 предложения)',
    admin_full:       'Полное описание *',
    admin_full_ph:    'Для модального окна',
    admin_save:       'Сохранить',
    admin_cancel:     'Отмена',
    admin_list:       'Список объектов',
    admin_col_name:   'Название',
    admin_col_qr:     'QR-код',
    admin_col_act:    'Действия',

    // GUIDE SECTION
    guide_eyebrow: 'QR-гид по Бурабаю',
    guide_title:   'Достопримечательности',
    guide_desc:    'Каждая карточка содержит QR-код. Отсканируйте — и получите полную информацию об объекте прямо на вашем телефоне.',
    card_more:     'Подробнее',
    card_qr:       '🔲 QR',
    qr_scan_label: 'QR-код объекта',
    qr_scan_sub:   'Сканируйте для просмотра',

    // CLEAN SECTION
    clean_eyebrow: 'Эко-патруль',
    clean_title:   'Заметили мусор? Сообщите нам!',
    clean_desc:    'Сделайте фото, укажите место — и наши волонтёрские отряды оперативно отправятся на очистку территории.',
    clean_where:   'Где обнаружен мусор? *',
    clean_where_ph:'Поляна Абылай хана, возле опушки',
    clean_desc_lbl:'Описание *',
    clean_desc_ph: 'Пластиковые бутылки, пакеты...',
    clean_btn:     'Отправить заявку в патруль 🚶',
    clean_ok_title:'✅ Заявка принята!',
    clean_ok_text: 'Спасибо за вклад в сохранение природы. Эко-волонтёры уведомлены.',
    clean_more:    'Отправить ещё',

    // TREES SECTION
    trees_eyebrow: 'Моё дерево в Бурабае',
    trees_title:   'Электронный реестр посаженных деревьев',
    trees_plant:   '🌱 Посадить своё дерево',
    trees_search:  '🔍 Поиск по имени или породе...',
    trees_empty:   'Деревья не найдены',
    tree_anon:     'Аноним',
    tree_place:    'Бурабай',

    // MAP SECTION
    map_eyebrow:   'Навигация',
    map_title:     'Интерактивная карта Бурабая',

    // VOLUNTEER SECTION
    vol_title:  'Стань эко-волонтёром',
    vol_desc:   'Участвуйте в масштабных посадках леса, рейдах чистоты и просветительских мероприятиях.',
    vol_name:   'Ваше имя',
    vol_phone:  '+7 (707) 000-00-00',
    vol_btn:    'Подать заявку',
    vol_ok:     '🎉 Вы в команде! Мы свяжемся с вами в ближайшее время.',

    // FOOTER
    footer: '© 2026 Eco Burabay. Разработано для защиты природы Казахстана 🌿',

    // QR MODAL
    qr_modal_title: 'QR-код объекта',
    qr_download:    '⬇ Скачать QR-код',
    qr_get:         '🔲 Получить QR-код',

    // TOASTS
    toast_loading:   '🔄 Загрузка данных эко-парка...',
    toast_not_found: 'Объект не найден',
    toast_logout:    'Вы вышли из системы',
    toast_welcome:   '👋 Добро пожаловать',
    toast_reg_ok:    '🎉 Аккаунт создан',
    toast_vol_ok:    '🎉 Заявка волонтёра принята!',
    toast_clean_ok:  '✅ Эко-заявка зарегистрирована!',
    toast_tree_ok:   '🌱 Дерево добавлено для всех участников!',
    toast_sync:      '🔄 Синхронизация с сервером...',
    toast_updated:   '✏️ Объект обновлён глобально!',
    toast_added:     '✅ Новый объект добавлен для всех!',
    toast_deleted:   '🗑️ Объект успешно удалён!',
    toast_del_err:   '❌ Ошибка при удалении',
    toast_add_err:   '❌ Ошибка добавления',
    toast_upd_err:   '❌ Ошибка изменения',
    toast_save_err:  '❌ Ошибка отправки в облако',
    toast_tree_sync: '🌱 Сохранение в общий реестр...',
    toast_del_sync:  '🗑️ Удаление с сервера...',
    toast_qr_dl:     'QR-код скачан!',
    toast_qr_err:    'Не удалось найти QR-код',
    confirm_delete:  'Удалить этот объект для всех пользователей?',

    // DEFAULT DATA
    sight_burabay_name:  'Озеро Бурабай',
    sight_burabay_sub:   'Главный водоём парка',
    sight_burabay_short: 'Сердце национального парка — кристальное озеро среди гранитных скал.',
    sight_burabay_desc:  'Озеро Бурабай (Боровое) — бессточное озеро в Бурабайском районе Акмолинской области Казахстана. Оно окружено величественными сосновыми лесами и причудливыми скалами.',
    sight_okzh_name:     'Скала Окжетпес',
    sight_okzh_sub:      'Высота около 200 м',
    sight_okzh_short:    'Величественная скала, чьё название означает «Стрела не долетит».',
    sight_okzh_desc:     'Гранитная скала на берегу озера Боровое. Её вершина напоминает лежащего слона. Окжетпес воспета в многочисленных легендах казахского народа.',
    sight_zhumb_name:    'Скала Жумбактас',
    sight_zhumb_sub:     'Загадочный камень',
    sight_zhumb_short:   'Гранитная скала посреди озера — символ Бурабая.',
    sight_zhumb_desc:    'Жумбактас (Загадочный камень) — одна из самых узнаваемых достопримечательностей парка. Скала расположена прямо в воде озера Боровое.',
  },

  kz: {
    nav_guide:     'QR-нұсқаулық',
    nav_clean:     'Эко-патруль',
    nav_trees:     'Менің ағашым',
    nav_map:       'Карта',
    nav_volunteer: 'Волонтерлер',
    nav_admin:     '🔑 Әкімші',
    nav_login:     'Кіру',
    nav_logout:    'Шығу',

    hero_badge:    '🌿 Қазақстанның экологиялық жобасы',
    hero_slogan:   'Сканерле. Біл. Сақта.',
    hero_slogan2:  'Бурабайды бізбен бірге өсір!',
    hero_desc:     'Қазақстанның інжу-маржаны — «Бурабай» ұлттық табиғи паркінің табиғаты мен мәдени мұрасын сақтауға арналған цифрлық платформа.',
    hero_btn_qr:   '🔲 QR-нұсқаулықты зерттеу',
    hero_btn_tree: '🌱 Ағаш егу',

    stat_trees:    'Егілген ағаштар',
    stat_qr:       'QR-нысандар',
    stat_members:  'Қатысушылар',
    stat_solved:   'Шешілген мәселелер',

    auth_login_title: 'Жүйеге кіру',
    auth_reg_title:   'Тіркелу',
    auth_email:       'Email',
    auth_password:    'Құпия сөз',
    auth_name:        'Атыңыз',
    auth_name_ph:     'Батырхан Ахметов',
    auth_pass_ph:     'Кемінде 6 таңба',
    auth_login_btn:   'Кіру',
    auth_reg_btn:     'Аккаунт жасау',
    auth_no_acc:      'Аккаунт жоқ па?',
    auth_has_acc:     'Аккаунт бар ма?',
    auth_do_reg:      'Тіркелу',
    auth_do_login:    'Кіру',
    auth_hint:        '💡 Әкімші:',

    plant_title:    '🌱 Жаңа ағашты тіркеу',
    plant_owner:    'Иесінің аты / Ұйым *',
    plant_owner_ph: 'Батырхан',
    plant_species:  'Ағаш түрі *',
    plant_zone:     'Егу секторы *',
    plant_zone_ph:  'Аймақ №3 (Кіші Шабақты көлі)',
    plant_btn:      'Тізімге енгізу 🌿',

    species_pine:   '🌲 Қарапайым қарағай',
    species_birch:  '🌳 Салбыраңқы қайың',
    species_fir:    '🎄 Сібір шыршасы',

    // Прямой маппинг значений из БД для реестра деревьев
    'pine':               '🌲 Қарапайым қарағай',
    'birch':              '🌳 Салбыраңқы қайың',
    'fir':                '🎄 Сібір шыршасы',
    'Сосна обыкновенная': '🌲 Қарапайым қарағай',
    'Берёза повислая':    '🌳 Салбыраңқы қайың',
    'Ель сибирская':      '🎄 Сібір шыршасы',

    admin_eyebrow:    'Әкімші панелі',
    admin_title:      'QR-нысандарды басқару',
    admin_add:        '➕ Нысан қосу',
    admin_name:       'Атауы *',
    admin_name_ph:    'Бурабай көлі',
    admin_subtitle:   'Субтақырып *',
    admin_subtitle_ph:'Парктің негізгі су қоймасы',
    admin_img:        'Сурет URL',
    admin_short:      'Қысқа сипаттама *',
    admin_short_ph:   'Карточка үшін (1–2 сөйлем)',
    admin_full:       'Толық сипаттама *',
    admin_full_ph:    'Модальды терезе үшін',
    admin_save:       'Сақтау',
    admin_cancel:     'Болдырмау',
    admin_list:       'Нысандар тізімі',
    admin_col_name:   'Атауы',
    admin_col_qr:     'QR-код',
    admin_col_act:    'Әрекеттер',

    guide_eyebrow: 'Бурабай QR-нұсқаулығы',
    guide_title:   'Көрікті жерлер',
    guide_desc:    'Әр карточкада QR-код бар. Сканерлеңіз — нысан туралы толық ақпаратты телефонда алыңыз.',
    card_more:     'Толығырақ',
    card_qr:       '🔲 QR',
    qr_scan_label: 'Нысанның QR-коды',
    qr_scan_sub:   'Қарау үшін сканерлеңіз',

    clean_eyebrow: 'Эко-патруль',
    clean_title:   'Қоқыс байқадыңыз ба? Хабарлаңыз!',
    clean_desc:    'Фото түсіріп, орнын көрсетіңіз — волонтер отрядтарымыз тазалауға жедел барады.',
    clean_where:   'Қоқыс қайда табылды? *',
    clean_where_ph:'Абылай хан алаңы, орман шетінде',
    clean_desc_lbl:'Сипаттама *',
    clean_desc_ph: 'Пластик бөтелкелер, қаптар...',
    clean_btn:     'Патрульге өтінім жіберу 🚶',
    clean_ok_title:'✅ Өтінім қабылданды!',
    clean_ok_text: 'Табиғатты сақтауға үлес қосқаныңызға рахмет. Эко-волонтерлер хабардар.',
    clean_more:    'Тағы жіберу',

    trees_eyebrow: 'Бурабайдағы менің ағашым',
    trees_title:   'Егілген ағаштардың электрондық тізімі',
    trees_plant:   '🌱 Өз ағашыңды егу',
    trees_search:  '🔍 Аты немесе түрі бойынша іздеу...',
    trees_empty:   'Ағаштар табылмады',
    tree_anon:     'Белгісіз',
    tree_place:    'Бурабай',

    map_eyebrow:   'Навигация',
    map_title:     'Бурабайдың интерактивті картасы',

    vol_title:  'Эко-волонтер болыңыз',
    vol_desc:   'Орман егу, тазалық рейдтеріне және ағарту іс-шараларына қатысыңыз.',
    vol_name:   'Атыңыз',
    vol_phone:  '+7 (707) 000-00-00',
    vol_btn:    'Өтінім беру',
    vol_ok:     '🎉 Сіз командада! Жақын арада хабарласамыз.',

    footer: '© 2026 Eco Burabay. Қазақстан табиғатын қорғау үшін жасалды 🌿',

    qr_modal_title: 'Нысанның QR-коды',
    qr_download:    '⬇ QR-кодты жүктеу',
    qr_get:         '🔲 QR-кодты алу',

    toast_loading:   '🔄 Эко-парк деректері жүктелуде...',
    toast_not_found: 'Нысан табылмады',
    toast_logout:    'Жүйеден шықтыңыз',
    toast_welcome:   '👋 Қош келдіңіз',
    toast_reg_ok:    '🎉 Аккаунт жасалды',
    toast_vol_ok:    '🎉 Волонтер өтінімі қабылданды!',
    toast_clean_ok:  '✅ Эко-өтінім тіркелді!',
    toast_tree_ok:   '🌱 Ағаш барлық қатысушыларға қосылды!',
    toast_sync:      '🔄 Серверлермен синхрондалуда...',
    toast_updated:   '✏️ Нысан жаһандық деңгейде жаңартылды!',
    toast_added:     '✅ Жаңа нысан барлығына қосылды!',
    toast_deleted:   '🗑️ Нысан сәтті жойылды!',
    toast_del_err:   '❌ Жою кезінде қате',
    toast_add_err:   '❌ Қосу қатесі',
    toast_upd_err:   '❌ Өзгерту қатесі',
    toast_save_err:  '❌ Бұлтқа жіберу қатесі',
    toast_tree_sync: '🌱 Жалпы тізімге сақталуда...',
    toast_del_sync:  '🗑️ Серверден жойылуда...',
    toast_qr_dl:     'QR-код жүктелді!',
    toast_qr_err:    'QR-кодты табу мүмкін болмады',
    confirm_delete:  'Бұл нысанды барлық пайдаланушылар үшін жою керек пе?',

    sight_burabay_name:  'Бурабай көлі',
    sight_burabay_sub:   'Парктің негізгі су қоймасы',
    sight_burabay_short: 'Ұлттық парктің жүрегі — гранит жартастар арасындағы кристалды көл.',
    sight_burabay_desc:  'Бурабай (Боровое) көлі — Қазақстанның Ақмола облысы Бурабай ауданындағы аққабақ көл. Ол сәнді қарағай ормандары мен өрнекті жартастармен қоршалған.',
    sight_okzh_name:     'Оқжетпес жартасы',
    sight_okzh_sub:      'Биіктігі шамамен 200 м',
    sight_okzh_short:    'Аты «Оқ жетпейді» дегенді білдіретін ғажайып жартас.',
    sight_okzh_desc:     'Боровое көлінің жағасындағы гранит жартас. Оның шыңы жатқан пілді еске түсіреді. Оқжетпес қазақ халқының көптеген аңыздарында жырланған.',
    sight_zhumb_name:    'Жұмбақтас жартасы',
    sight_zhumb_sub:     'Жұмбақ тас',
    sight_zhumb_short:   'Көл ортасындағы гранит жартас — Бурабайдың символы.',
    sight_zhumb_desc:    'Жұмбақтас — парктің ең танымал ескерткіштерінің бірі. Жартас Боровое көлінің суында орналасқан.',
  },

  en: {
    nav_guide:     'QR Guide',
    nav_clean:     'Eco Patrol',
    nav_trees:     'My Tree',
    nav_map:       'Map',
    nav_volunteer: 'Volunteers',
    nav_admin:     '🔑 Admin',
    nav_login:     'Log In',
    nav_logout:    'Log Out',

    hero_badge:    '🌿 Kazakhstan Ecological Project',
    hero_slogan:   'Scan. Discover. Preserve.',
    hero_slogan2:  'Grow Burabay together with us!',
    hero_desc:     'A digital platform for preserving the nature and cultural heritage of Kazakhstan\'s pearl — the Burabay National Nature Park.',
    hero_btn_qr:   '🔲 Explore QR Guide',
    hero_btn_tree: '🌱 Plant a Tree',

    stat_trees:    'Trees Planted',
    stat_qr:       'QR Objects',
    stat_members:  'Participants',
    stat_solved:   'Issues Resolved',

    auth_login_title: 'Sign In',
    auth_reg_title:   'Registration',
    auth_email:       'Email',
    auth_password:    'Password',
    auth_name:        'Your Name',
    auth_name_ph:     'John Smith',
    auth_pass_ph:     'At least 6 characters',
    auth_login_btn:   'Sign In',
    auth_reg_btn:     'Create Account',
    auth_no_acc:      'No account?',
    auth_has_acc:     'Already have an account?',
    auth_do_reg:      'Register',
    auth_do_login:    'Sign In',
    auth_hint:        '💡 Administrator:',

    plant_title:    '🌱 Register a New Tree',
    plant_owner:    'Owner Name / Organization *',
    plant_owner_ph: 'John Smith',
    plant_species:  'Tree Species *',
    plant_zone:     'Planting Sector *',
    plant_zone_ph:  'Zone #3 (Small Chebachy Lake)',
    plant_btn:      'Add to Registry 🌿',

    species_pine:   '🌲 Scots Pine',
    species_birch:  '🌳 Silver Birch',
    species_fir:    '🎄 Siberian Spruce',

    // Прямой маппинг значений из БД для реестра деревьев
    'pine':               '🌲 Scots Pine',
    'birch':              '🌳 Silver Birch',
    'fir':                '🎄 Siberian Spruce',
    'Сосна обыкновенная': '🌲 Scots Pine',
    'Берёза повислая':    '🌳 Silver Birch',
    'Ель сибирская':      '🎄 Siberian Spruce',

    admin_eyebrow:    'Admin Panel',
    admin_title:      'Manage QR Objects',
    admin_add:        '➕ Add Object',
    admin_name:       'Name *',
    admin_name_ph:    'Lake Burabay',
    admin_subtitle:   'Subtitle *',
    admin_subtitle_ph:'Main water body of the park',
    admin_img:        'Image URL',
    admin_short:      'Short Description *',
    admin_short_ph:   'For card (1–2 sentences)',
    admin_full:       'Full Description *',
    admin_full_ph:    'For modal window',
    admin_save:       'Save',
    admin_cancel:     'Cancel',
    admin_list:       'Object List',
    admin_col_name:   'Name',
    admin_col_qr:     'QR Code',
    admin_col_act:    'Actions',

    guide_eyebrow: 'QR Guide to Burabay',
    guide_title:   'Attractions',
    guide_desc:    'Each card contains a QR code. Scan it to get full information about the object right on your phone.',
    card_more:     'Learn More',
    card_qr:       '🔲 QR',
    qr_scan_label: 'Object QR Code',
    qr_scan_sub:   'Scan to view',

    clean_eyebrow: 'Eco Patrol',
    clean_title:   'Spotted Litter? Let Us Know!',
    clean_desc:    'Take a photo, mark the location — our volunteer teams will promptly head out for cleanup.',
    clean_where:   'Where was litter found? *',
    clean_where_ph:'Abylai Khan Meadow, near the forest edge',
    clean_desc_lbl:'Description *',
    clean_desc_ph: 'Plastic bottles, bags...',
    clean_btn:     'Send Report to Patrol 🚶',
    clean_ok_title:'✅ Report Accepted!',
    clean_ok_text: 'Thank you for contributing to nature conservation. Eco-volunteers have been notified.',
    clean_more:    'Send Another',

    trees_eyebrow: 'My Tree in Burabay',
    trees_title:   'Electronic Registry of Planted Trees',
    trees_plant:   '🌱 Plant Your Own Tree',
    trees_search:  '🔍 Search by name or species...',
    trees_empty:   'No trees found',
    tree_anon:     'Anonymous',
    tree_place:    'Burabay',

    map_eyebrow:   'Navigation',
    map_title:     'Interactive Map of Burabay',

    vol_title:  'Become an Eco-Volunteer',
    vol_desc:   'Join large-scale tree planting, clean-up raids and educational events.',
    vol_name:   'Your Name',
    vol_phone:  '+7 (707) 000-00-00',
    vol_btn:    'Apply',
    vol_ok:     '🎉 You\'re on the team! We will contact you soon.',

    footer: '© 2026 Eco Burabay. Built to protect Kazakhstan\'s nature 🌿',

    qr_modal_title: 'Object QR Code',
    qr_download:    '⬇ Download QR Code',
    qr_get:         '🔲 Get QR Code',

    toast_loading:   '🔄 Loading eco-park data...',
    toast_not_found: 'Object not found',
    toast_logout:    'You have been logged out',
    toast_welcome:   '👋 Welcome',
    toast_reg_ok:    '🎉 Account created',
    toast_vol_ok:    '🎉 Volunteer application accepted!',
    toast_clean_ok:  '✅ Eco-report submitted!',
    toast_tree_ok:   '🌱 Tree added for all participants!',
    toast_sync:      '🔄 Syncing with server...',
    toast_updated:   '✏️ Object updated globally!',
    toast_added:     '✅ New object added for everyone!',
    toast_deleted:   '🗑️ Object successfully deleted!',
    toast_del_err:   '❌ Error deleting',
    toast_add_err:   '❌ Error adding',
    toast_upd_err:   '❌ Error updating',
    toast_save_err:  '❌ Error sending to cloud',
    toast_tree_sync: '🌱 Saving to shared registry...',
    toast_del_sync:  '🗑️ Deleting from server...',
    toast_qr_dl:     'QR code downloaded!',
    toast_qr_err:    'Could not find QR code',
    confirm_delete:  'Delete this object for all users?',

    sight_burabay_name:  'Lake Burabay',
    sight_burabay_sub:   'Main water body of the park',
    sight_burabay_short: 'The heart of the national park — a crystal-clear lake among granite rocks.',
    sight_burabay_desc:  'Lake Burabay (Borovoye) is an endorheic lake in the Burabay district of Kazakhstan\'s Akmola region. It is surrounded by majestic pine forests and whimsical rock formations.',
    sight_okzh_name:     'Okzhetpes Rock',
    sight_okzh_sub:      'About 200 m high',
    sight_okzh_short:    'A majestic rock whose name means "Arrow Won\'t Reach".',
    sight_okzh_desc:     'A granite rock on the shore of Lake Borovoye. Its summit resembles a lying elephant. Okzhetpes is celebrated in numerous legends of the Kazakh people.',
    sight_zhumb_name:    'Zhumbaкtas Rock',
    sight_zhumb_sub:     'The Mysterious Stone',
    sight_zhumb_short:   'A granite rock in the middle of the lake — the symbol of Burabay.',
    sight_zhumb_desc:    'Zhumbaktas (The Mysterious Stone) is one of the most recognizable landmarks of the park. The rock is located directly in the waters of Lake Borovoye.',
  }
};

// ── Текущий язык ──────────────────────────────────────────────
let currentLang = localStorage.getItem('eco_lang') || 'ru';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ||
         (TRANSLATIONS['ru'] && TRANSLATIONS['ru'][key]) || key;
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('eco_lang', lang);
  applyTranslations();
  
  // Перерисовываем динамические компоненты, если они уже инициализированы
  if (typeof renderSights === 'function') renderSights();
  if (typeof renderTrees  === 'function') renderTrees();
  if (typeof renderAdminTable === 'function' && document.getElementById('adminSightsTableBody')) renderAdminTable();
  
  updateLangButtons();
}

function updateLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('lang-btn--active', btn.dataset.lang === currentLang);
  });
}

// ── Применить переводы ко всем [data-i18n] элементам ─────────
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  // Обновить lang атрибут html
  document.documentElement.lang = currentLang;
}

// Экспорт функций глобально
window.t        = t;
window.setLang  = setLang;
window.applyTranslations = applyTranslations;
window.currentLang = () => currentLang;

// ── Автоматический запуск локализации при загрузке страницы ──
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateLangButtons();
});
