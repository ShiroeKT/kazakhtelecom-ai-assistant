import { Symptom, DiagnosticNode, Malfunction, ServiceCategory } from '../types';

export const SYMPTOMS: Symptom[] = [
  // Internet symptoms
  {
    id: 'no_internet',
    keywords: ['нет интернета', 'не работает интернет', 'отсутствует связь', 'не грузит страницы', 'соединение отсутствует'],
    category: 'internet',
    severity: 'high',
    description: 'Полное отсутствие доступа к интернету'
  },
  {
    id: 'slow_internet',
    keywords: ['медленный интернет', 'низкая скорость', 'тормозит', 'долго грузит', 'плохая скорость'],
    category: 'internet',
    severity: 'medium',
    description: 'Низкая скорость интернет-соединения'
  },
  {
    id: 'intermittent_internet',
    keywords: ['прерывается', 'пропадает', 'обрывается', 'нестабильно', 'периодически отключается'],
    category: 'internet',
    severity: 'medium',
    description: 'Нестабильное интернет-соединение'
  },
  {
    id: 'wifi_not_working',
    keywords: ['вайфай не работает', 'wi-fi нет', 'не подключается к wifi', 'wifi не видит'],
    category: 'internet',
    severity: 'medium',
    description: 'Проблемы с Wi-Fi подключением'
  },
  // TV symptoms
  {
    id: 'no_tv_signal',
    keywords: ['нет сигнала', 'экран черный', 'нет изображения', 'тв не работает', 'нет каналов'],
    category: 'tv',
    severity: 'high',
    description: 'Отсутствие телевизионного сигнала'
  },
  {
    id: 'tv_pixelation',
    keywords: ['пикселизация', 'квадратики', 'артефакты', 'плохое качество', 'разрывается картинка'],
    category: 'tv',
    severity: 'medium',
    description: 'Пикселизация и артефакты на экране'
  },
  {
    id: 'tv_freezes',
    keywords: ['зависает', 'замирает', 'виснет', 'не переключается', 'тормозит тв'],
    category: 'tv',
    severity: 'medium',
    description: 'Зависание телевизионного сигнала'
  },
  // Telephony symptoms
  {
    id: 'no_dial_tone',
    keywords: ['нет гудка', 'не звонит', 'молчит телефон', 'нет связи стационарный'],
    category: 'telephony',
    severity: 'high',
    description: 'Отсутствие гудка в стационарном телефоне'
  },
  {
    id: 'poor_audio_quality',
    keywords: ['плохо слышно', 'шумит', 'хрипит', 'прерывается', 'искажение звука'],
    category: 'telephony',
    severity: 'medium',
    description: 'Плохое качество звука при звонке'
  },
  {
    id: 'cannot_call_out',
    keywords: ['не могу звонить', 'не исходящие', 'не дозвониться', 'сбрасывает'],
    category: 'telephony',
    severity: 'high',
    description: 'Невозможность совершить исходящий звонок'
  },
  // Mobile symptoms
  {
    id: 'no_mobile_signal',
    keywords: ['нет сети', 'нет связи', 'поиск сети', 'emergency only', 'sos'],
    category: 'mobile',
    severity: 'high',
    description: 'Отсутствие мобильной сети'
  },
  {
    id: 'slow_mobile_data',
    keywords: ['медленный мобильный интернет', 'не грузит 4g', 'медленно 3g', 'низкая скорость мобильная'],
    category: 'mobile',
    severity: 'medium',
    description: 'Низкая скорость мобильного интернета'
  },
  // Equipment symptoms
  {
    id: 'router_not_working',
    keywords: ['роутер не работает', 'маршрутизатор не включается', 'не горит индикатор', 'роутер мертвый'],
    category: 'equipment',
    severity: 'high',
    description: 'Роутер не функционирует'
  },
  {
    id: 'modem_overheating',
    keywords: ['нагревается', 'горячий', 'перегрев', 'очень горячий роутер'],
    category: 'equipment',
    severity: 'medium',
    description: 'Перегрев оборудования'
  }
];

export const DIAGNOSTIC_TREES: Record<ServiceCategory, DiagnosticNode[]> = {
  internet: [
    {
      id: 'internet_start',
      question:Какая именно проблема с интернетом вас беспокоит?',
      symptoms: ['no_internet', 'slow_internet', 'intermittent_internet', 'wifi_not_working'],
      answers: [
        { text: 'Интернет полностью отсутствует', nextNodeId: 'internet_none_check' },
        { text: 'Интернет работает медленно', nextNodeId: 'internet_slow_check' },
        { text: 'Интернет периодически пропадает', nextNodeId: 'internet_intermittent_check' },
        { text: 'Проблемы только с Wi-Fi', nextNodeId: 'internet_wifi_check' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_none_check',
      question: 'Проверьте, горит ли индикатор интернета на роутере? Обычно это значок с изображением земного шара или буквы "INET".',
      answers: [
        { text: 'Индикатор горит', nextNodeId: 'internet_none_lights_on' },
        { text: 'Индикатор не горит', nextNodeId: 'internet_none_lights_off' },
        { text: 'Не знаю / Не могу проверить', nextNodeId: 'internet_none_unknown' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_none_lights_on',
      question: 'Индикатор горит, но интернета нет. Попробуйте перезагрузить роутер - выключите его из розетки на 1 минуту, затем включите обратно. Помогло?',
      answers: [
        { text: 'Да, интернет появился', nextNodeId: 'internet_resolved' },
        { text: 'Нет, интернета все равно нет', nextNodeId: 'internet_none_lights_on_persist' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_none_lights_on_persist',
      question: 'Подключите компьютер кабелем напрямую к роутеру (если возможно). Интернет появился?',
      answers: [
        { text: 'Да, по кабелю работает', nextNodeId: 'internet_wifi_issue' },
        { text: 'Нет, по кабелю тоже не работает', nextNodeId: 'internet_cable_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_issue',
      question: 'Проверьте настройки Wi-Fi на устройстве. Убедитесь, что вы подключены к правильной сети и введен правильный пароль. Попробуйте забыть сеть и подключиться заново. Работает?',
      answers: [
        { text: 'Да, проблема решена', nextNodeId: 'internet_resolved' },
        { text: 'Нет, проблема сохраняется', nextNodeId: 'internet_router_config_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_router_config_issue',
      question: 'Возможна проблема с настройками роутера. Зайдите в веб-интерфейс роутера (обычно 192.168.1.1 или 192.168.0.1) и проверьте настройки WAN. Видите ли вы ошибки?',
      answers: [
        { text: 'Вижу ошибку авторизации', nextNodeId: 'internet_auth_error' },
        { text: 'Нет IP-адреса', nextNodeId: 'internet_no_ip' },
        { text: 'Не могу зайти в настройки', nextNodeId: 'internet_router_access_issue' },
        { text: 'Все выглядит нормально', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_auth_error',
      question: 'Ошибка авторизации означает проблему с логином/паролем. Проверьте данные в договоре или в личном кабинете. Хотите проверить данные?',
      answers: [
        { text: 'Да, проверить данные', nextNodeId: 'internet_check_credentials' },
        { text: 'Данные верные', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_no_ip',
      question: 'Отсутствие IP-адреса указывает на проблему на линии или на стороне провайдера. Попробуйте сменить кабель от розетки к роутеру. Помогло?',
      answers: [
        { text: 'Да, помогло', nextNodeId: 'internet_resolved' },
        { text: 'Нет, не помогло', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_router_access_issue',
      question: 'Если не можете зайти в настройки, попробуйте сбросить роутер до заводских настроек (нажмите и удерживайте кнопку Reset 10 секунд). После этого потребуется повторная настройка. Продолжить?',
      answers: [
        { text: 'Да, сбросить настройки', nextNodeId: 'internet_factory_reset' },
        { text: 'Нет, не хочу сбрасывать', nextNodeId: 'internet_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_factory_reset',
      question: 'После сброса настройте роутер заново согласно инструкции из договора. Если не получается - вызовем техника.',
      answers: [
        { text: 'Настроил, работает', nextNodeId: 'internet_resolved' },
        { text: 'Не получается настроить', nextNodeId: 'internet_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_cable_issue',
      question: 'Проблема по кабелю. Проверьте целостность кабеля от розетки до роутера. Попробуйте другой кабель. Помогло?',
      answers: [
        { text: 'Да, проблема в кабеле', nextNodeId: 'internet_resolved' },
        { text: 'Нет, кабель исправен', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_line_issue',
      question: 'Скорее всего проблема на линии или на стороне провайдера. Проверьте, есть ли оповещения об авариях в вашем районе в личном кабинете.',
      answers: [
        { text: 'Есть авария в районе', nextNodeId: 'internet_availability_known' },
        { text: 'Нет информации об аварии', nextNodeId: 'internet_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_availability_known',
      question: 'Авария уже известна, технические службы работают над устранением. Ориентировочное время восстановления указано в уведомлении.',
      answers: [
        { text: 'Понял, спасибо', nextNodeId: 'internet_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_none_lights_off',
      question: 'Индикатор не горит. Проверьте, подключен ли кабель от розетки к порту WAN на роутере (обычно синий или отдельный порт).',
      answers: [
        { text: 'То кабель подключен', nextNodeId: 'internet_none_lights_off_connected' },
        { text: 'То кабель не был подключен', nextNodeId: 'internet_cable_fix' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_cable_fix',
      question: 'Подключите кабель от розетки к порту WAN на роутере. Подождите 2-3 минуты. Индикатор загорелся?',
      answers: [
        { text: 'Да, индикатор горит, интернет работает', nextNodeId: 'internet_resolved' },
        { text: 'Индикатор не горит', nextNodeId: 'internet_none_lights_off_connected' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_none_lights_off_connected',
      question: 'Кабель подключен, но индикатор не горит. Проверьте, есть ли сигнал в розетке (подключите другой прибор или попробуйте другую розетку).',
      answers: [
        { text: 'В розетке нет питания', nextNodeId: 'internet_power_issue' },
        { text: 'В розетке есть питание', nextNodeId: 'internet_router_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_power_issue',
      question: 'Проблема с электропитанием. Проверьте автоматический выключатель в щитке или используйте другую розетку.',
      answers: [
        { text: 'Решил проблему с питанием', nextNodeId: 'internet_resolved' },
        { text: 'Проблема не в питании', nextNodeId: 'internet_router_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_router_defect',
      question: 'Возможен дефект роутера или блока питания. Попробуйте другой блок питания, если есть. Или заменим роутер.',
      answers: [
        { text: 'Другой блок питания помог', nextNodeId: 'internet_resolved' },
        { text: 'Нужен новый роутер', nextNodeId: 'internet_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_none_unknown',
      question: 'Пожалуйста, посмотрите на роутер. Какие индикаторы горят? Опишите их цвет и состояние.',
      answers: [
        { text: 'Горит только индикатор питания', nextNodeId: 'internet_none_lights_off' },
        { text: 'Горят несколько индикаторов', nextNodeId: 'internet_none_lights_on' },
        { text: 'Ничего не горит', nextNodeId: 'internet_router_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_slow_check',
      question: 'Как давно вы заметили снижение скорости? Это произошло внезапно или постепенно?',
      answers: [
        { text: 'Внезапно, сегодня или вчера', nextNodeId: 'internet_slow_sudden' },
        { text: 'Постепенно в течение времени', nextNodeId: 'internet_slow_gradual' },
        { text: 'Всегда было медленно', nextNodeId: 'internet_slow_always' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_slow_sudden',
      question: 'Внезапное снижение скорости. Проверьте, не запущены ли обновления или загрузки на других устройствах. Также проверьте кабель - он плотно подключен?',
      answers: [
        { text: 'Нашел проблему с загрузками', nextNodeId: 'internet_resolved' },
        { text: 'Кабель был плохо подключен', nextNodeId: 'internet_resolved' },
        { text: 'Проблема не в этом', nextNodeId: 'internet_slow_check_line' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_slow_check_line',
      question: 'Проверьте скорость на сайте speedtest.net. Какая скорость показывает тест?',
      answers: [
        { text: 'Скорость соответствует тарифу', nextNodeId: 'internet_slow_device' },
        { text: 'Скорость значительно ниже тарифа', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_slow_device',
      question: 'Скорость соответствует тарифу, но вам кажется медленно. Проблема может быть в вашем устройстве или конкретных сайтах. Попробуйте другой сайт или устройство.',
      answers: [
        { text: 'На другом сайте/устройстве нормально', nextNodeId: 'internet_resolved' },
        { text: 'Везде медленно', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_slow_gradual',
      question: 'Постепенное снижение скорости может указывать на износ оборудования или перегрузку сети. Сколько устройств подключено к интернету?',
      answers: [
        { text: 'Много устройств (10+)', nextNodeId: 'internet_slow_overload' },
        { text: 'Несколько устройств', nextNodeId: 'internet_slow_equipment' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_slow_overload',
      question: 'Много устройств могут перегружать роутер. Попробуйте отключить ненужные устройства или рассмотрите upgrading роутера.',
      answers: [
        { text: 'Помогло отключение устройств', nextNodeId: 'internet_resolved' },
        { text: 'Нужен более мощный роутер', nextNodeId: 'internet_upgrade_suggestion' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_slow_equipment',
      question: 'Возможен износ оборудования или перегрев. Проверьте температуру роутера. Он горячий?',
      answers: [
        { text: 'Да, очень горячий', nextNodeId: 'internet_overheating' },
        { text: 'Нормальная температура', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_overheating',
      question: 'Перегрев роутера. Обеспечьте вентиляцию, уберите роутер в более прохладное место. Не накрывайте его.',
      answers: [
        { text: 'Помогло улучшение вентиляции', nextNodeId: 'internet_resolved' },
        { text: 'Нужен новый роутер', nextNodeId: 'internet_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_slow_always',
      question: 'Если скорость всегда была низкой, возможно проблема с тарифным планом или техническими возможностями линии. Какой у вас тариф?',
      answers: [
        { text: 'Базовый тариф', nextNodeId: 'internet_upgrade_suggestion' },
        { text: 'Высокоскоростной тариф', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_upgrade_suggestion',
      question: 'Рекомендуем рассмотреть переход на более высокий тарифный план для увеличения скорости.',
      answers: [
        { text: 'Хочу перейти на другой тариф', nextNodeId: 'internet_resolved' },
        { text: 'Останусь на текущем', nextNodeId: 'internet_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_intermittent_check',
      question: 'Интернет периодически пропадает. Как часто это происходит?',
      answers: [
        { text: 'Несколько раз в день', nextNodeId: 'internet_intermittent_frequent' },
        { text: 'Редко, раз в несколько дней', nextNodeId: 'internet_intermittent_rare' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_intermittent_frequent',
      question: 'Частые обрывы. Проверьте кабель на целостность и плотность подключения. Также проверьте температуру роутера.',
      answers: [
        { text: 'Нашел проблему с кабелем', nextNodeId: 'internet_resolved' },
        { text: 'Роутер перегревается', nextNodeId: 'internet_overheating' },
        { text: 'Всего в порядке', nextNodeId: 'internet_line_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_intermittent_rare',
      question: 'Редкие обрывы могут быть связаны с работами на линии или временными перегрузками. Проверьте уведомления в личном кабинете.',
      answers: [
        { text: 'Есть информация о работах', nextNodeId: 'internet_availability_known' },
        { text: 'Нет информации', nextNodeId: 'internet_monitor' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_monitor',
      question: 'Продолжайте наблюдение. Если проблема усилится или станет регулярной - обращайтесь повторно.',
      answers: [
        { text: 'Понял, буду следить', nextNodeId: 'internet_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_check',
      question: 'Проблемы только с Wi-Fi. Устройство видит сеть Wi-Fi?',
      answers: [
        { text: 'Да, сеть видна', nextNodeId: 'internet_wifi_visible' },
        { text: 'Нет, сеть не видна', nextNodeId: 'internet_wifi_not_visible' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_visible',
      question: 'Сеть видна. При подключении запрашивает пароль?',
      answers: [
        { text: 'Да, запрашивает пароль', nextNodeId: 'internet_wifi_password' },
        { text: 'Нет, сразу подключается/отключается', nextNodeId: 'internet_wifi_connection' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_password',
      question: 'Введите пароль от Wi-Fi. Он указан на наклейке на роутере. Пароль принят?',
      answers: [
        { text: 'Да, подключился', nextNodeId: 'internet_resolved' },
        { text: 'Пароль не подходит', nextNodeId: 'internet_wifi_wrong_password' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_wrong_password',
      question: 'Если пароль не подходит, возможно он был изменен. Проверьте в личном кабинете или в настройках роутера. Или сбросьте роутер до заводских настроек.',
      answers: [
        { text: 'Нашел правильный пароль', nextNodeId: 'internet_resolved' },
        { text: 'Сброшу роутер', nextNodeId: 'internet_factory_reset' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_connection',
      question: 'Проблема с подключением. Попробуйте забыть сеть в настройках устройства и подключиться заново. Также попробуйте перезагрузить роутер.',
      answers: [
        { text: 'Помогло', nextNodeId: 'internet_resolved' },
        { text: 'Не помогло', nextNodeId: 'internet_router_config_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_not_visible',
      question: 'Сеть не видна. Проверьте, включен ли Wi-Fi на роутере (индикатор Wi-Fi должен гореть). Также подойдите ближе к роутеру.',
      answers: [
        { text: 'Wi-Fi был выключен на роутере', nextNodeId: 'internet_wifi_enable' },
        { text: 'Далеко от роутера', nextNodeId: 'internet_wifi_range' },
        { text: 'Wi-Fi включен, рядом с роутером', nextNodeId: 'internet_router_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_enable',
      question: 'Включите Wi-Fi на роутере через веб-интерфейс или кнопку на устройстве. Сеть появилась?',
      answers: [
        { text: 'Да, сеть появилась', nextNodeId: 'internet_resolved' },
        { text: 'Нет, не получается включить', nextNodeId: 'internet_router_config_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_wifi_range',
      question: 'Попробуйте подойти ближе к роутеру или используйте repeater для расширения покрытия.',
      answers: [
        { text: 'Вблизи работает', nextNodeId: 'internet_resolved' },
        { text: 'Вблизи тоже не работает', nextNodeId: 'internet_wifi_not_visible' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_check_credentials',
      question: 'Проверьте логин и пароль в договоре или в личном кабинете на сайте Казахтелеком. Введите их в настройки роутера.',
      answers: [
        { text: 'Данные верные, подключился', nextNodeId: 'internet_resolved' },
        { text: 'Данные не подходят или забыл', nextNodeId: 'internet_credentials_recovery' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_credentials_recovery',
      question: 'Для восстановления логина/пароля обратитесь в офис с паспортом или воспользуйтесь восстановлением в личном кабинете.',
      answers: [
        { text: 'Понял, обращусь', nextNodeId: 'internet_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_technician_needed',
      question: 'Требуется выезд техника для диагностики и устранения проблемы на линии или замене оборудования.',
      answers: [
        { text: 'Вызвать техника', nextNodeId: 'internet_technician_scheduled' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_technician_scheduled',
      question: 'Техник будет вызван. Ожидайте звонка для согласования времени визита. Обычно визит в течение 24-48 часов.',
      answers: [
        { text: 'Понял, жду звонка', nextNodeId: 'internet_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'internet_resolved',
      question: 'Проблема решена. Если возникнут вопросы - обращайтесь.',
      answers: [],
      isTerminal: true,
      diagnosis: {
        id: 'internet_resolved',
        name: 'Проблема с интернетом решена',
        category: 'internet',
        severity: 'low',
        description: 'Проблема с интернетом была успешно диагностирована и устранена',
        possibleCauses: ['Настройки роутера', 'Подключение кабелей', 'Перегрузка сети'],
        solutions: [
          { step: 1, description: 'Перезагрузка оборудования', actionType: 'reset' },
          { step: 2, description: 'Проверка подключений', actionType: 'check' },
          { step: 3, description: 'Настройка параметров', actionType: 'configuration' }
        ],
        estimatedResolutionTime: '0-30 минут',
        requiresTechnician: false
      }
    }
  ],
  tv: [
    {
      id: 'tv_start',
      question: 'Какая проблема с телевизором?',
      symptoms: ['no_tv_signal', 'tv_pixelation', 'tv_freezes'],
      answers: [
        { text: 'Нет сигнала / черный экран', nextNodeId: 'tv_no_signal_check' },
        { text: 'Пикселизация / квадратики', nextNodeId: 'tv_pixelation_check' },
        { text: 'Зависание изображения', nextNodeId: 'tv_freeze_check' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_no_signal_check',
      question: 'Проверьте, включен ли телевизор и приставка. Горят ли индикаторы питания на обоих устройствах?',
      answers: [
        { text: 'Оба устройства включены', nextNodeId: 'tv_no_signal_power_on' },
        { text: 'Телевизор не включается', nextNodeId: 'tv_tv_power_issue' },
        { text: 'Приставка не включается', nextNodeId: 'tv_box_power_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_no_signal_power_on',
      question: 'Устройства включены. Проверьте правильность подключения: кабель от приставки к телевизору подключен к разъему HDMI?',
      answers: [
        { text: 'Да, подключен к HDMI', nextNodeId: 'tv_no_signal_hdmi' },
        { text: 'Нет, подключен к другому разъему', nextNodeId: 'tv_connection_fix' },
        { text: 'Не знаю / Не могу проверить', nextNodeId: 'tv_connection_check' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_connection_fix',
      question: 'Переключите кабель на разъем HDMI. На телевизоре выберите соответствующий источник сигнала (HDMI). Появилось изображение?',
      answers: [
        { text: 'Да, изображение появилось', nextNodeId: 'tv_resolved' },
        { text: 'Нет, изображения нет', nextNodeId: 'tv_no_signal_hdmi' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_connection_check',
      question: 'Посмотрите на заднюю панель телевизора и приставки. К какому разъему подключен кабель? (HDMI, SCART, AV и т.д.)',
      answers: [
        { text: 'HDMI', nextNodeId: 'tv_no_signal_hdmi' },
        { text: 'Другой разъем', nextNodeId: 'tv_connection_fix' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_no_signal_hdmi',
      question: 'HDMI подключен. На пульте телевизора нажмите кнопку "Source" или "Input" и выберите HDMI. Появилось изображение?',
      answers: [
        { text: 'Да, изображение появилось', nextNodeId: 'tv_resolved' },
        { text: 'Нет, изображения нет', nextNodeId: 'tv_hdmi_cable_check' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_hdmi_cable_check',
      question: 'Попробуйте другой HDMI кабель или другой HDMI разъем на телевизоре. Помогло?',
      answers: [
        { text: 'Да, проблема в кабеле/разъеме', nextNodeId: 'tv_resolved' },
        { text: 'Нет, проблема не в кабеле', nextNodeId: 'tv_box_check' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_box_check',
      question: 'Проверьте индикаторы на приставке. Горит ли индикатор сигнала или сети?',
      answers: [
        { text: 'Индикатор сигнала горит', nextNodeId: 'tv_box_signal_ok' },
        { text: 'Индикатор не горит или мигает', nextNodeId: 'tv_box_signal_issue' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_box_signal_ok',
      question: 'Сигнал на приставку поступает. Попробуйте перезагрузить приставку (выключить из розетки на 30 секунд). Появилось изображение?',
      answers: [
        { text: 'Да, после перезагрузки работает', nextNodeId: 'tv_resolved' },
        { text: 'Нет, не помогло', nextNodeId: 'tv_box_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_box_signal_issue',
      question: 'Индикатор сигнала не горит. Проверьте кабель от розетки к приставке. Он подключен?',
      answers: [
        { text: 'Кабель подключен', nextNodeId: 'tv_line_check' },
        { text: 'Кабель не был подключен', nextNodeId: 'tv_cable_fix' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_cable_fix',
      question: 'Подключите кабель от розетки к приставке. Подождите 1-2 минуты. Индикатор загорелся?',
      answers: [
        { text: 'Да, сигнал появился', nextNodeId: 'tv_resolved' },
        { text: 'Нет, индикатор не горит', nextNodeId: 'tv_line_check' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_line_check',
      question: 'Кабель подключен, но сигнала нет. Проверьте, есть ли сигнал в розетке (подключите телевизор напрямую к розетке, если есть такая возможность).',
      answers: [
        { text: 'В розетке нет сигнала', nextNodeId: 'tv_line_issue' },
        { text: 'В розетке есть сигнал', nextNodeId: 'tv_box_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_line_issue',
      question: 'Проблема на линии. Проверьте уведомления об авариях в личном кабинете.',
      answers: [
        { text: 'Есть авария в районе', nextNodeId: 'tv_availability_known' },
        { text: 'Нет информации об аварии', nextNodeId: 'tv_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_availability_known',
      question: 'Авария известна, технические службы работают. Ориентировочное время восстановления указано в уведомлении.',
      answers: [
        { text: 'Понял, спасибо', nextNodeId: 'tv_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_box_defect',
      question: 'Возможен дефект приставки. Попробуйте другую приставку, если есть. Или заменим приставку.',
      answers: [
        { text: 'Другая приставка работает', nextNodeId: 'tv_resolved' },
        { text: 'Нужна новая приставка', nextNodeId: 'tv_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_tv_power_issue',
      question: 'Телевизор не включается. Проверьте, есть ли питание в розетке (подключите другой прибор).',
      answers: [
        { text: 'В розетке нет питания', nextNodeId: 'tv_power_issue' },
        { text: 'В розетке есть питание', nextNodeId: 'tv_tv_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_power_issue',
      question: 'Проблема с электропитанием. Проверьте автоматический выключатель или используйте другую розетку.',
      answers: [
        { text: 'Решил проблему с питанием', nextNodeId: 'tv_resolved' },
        { text: 'Проблема не в питании', nextNodeId: 'tv_tv_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_tv_defect',
      question: 'Проблема с телевизором. Это не относится к услугам Казахтелеком. Рекомендуем обратиться в сервисный центр телевизора.',
      answers: [
        { text: 'Понял, обращусь в сервис', nextNodeId: 'tv_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_box_power_issue',
      question: 'Приставка не включается. Проверьте блок питания и розетку.',
      answers: [
        { text: 'Проблема с блоком питания', nextNodeId: 'tv_power_supply_fix' },
        { text: 'Проблема с розеткой', nextNodeId: 'tv_power_issue' },
        { text: 'Все в порядке', nextNodeId: 'tv_box_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_power_supply_fix',
      question: 'Попробуйте другой блок питания или розетку. Помогло?',
      answers: [
        { text: 'Да, помогло', nextNodeId: 'tv_resolved' },
        { text: 'Нет, приставка не работает', nextNodeId: 'tv_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_technician_needed',
      question: 'Требуется выезд техника для диагностики или замены оборудования.',
      answers: [
        { text: 'Вызвать техника', nextNodeId: 'tv_technician_scheduled' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_technician_scheduled',
      question: 'Техник будет вызван. Ожидайте звонка для согласования времени визита.',
      answers: [
        { text: 'Понял, жду звонка', nextNodeId: 'tv_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_pixelation_check',
      question: 'Пикселизация изображения. Проверьте качество и целостность кабеля от розетки к приставке.',
      answers: [
        { text: 'Кабель поврежден или старый', nextNodeId: 'tv_cable_replace' },
        { text: 'Кабель в порядке', nextNodeId: 'tv_pixelation_signal' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_cable_replace',
      question: 'Замените кабель на новый. Качество изображения улучшилось?',
      answers: [
        { text: 'Да, пикселизация исчезла', nextNodeId: 'tv_resolved' },
        { text: 'Нет, проблема сохраняется', nextNodeId: 'tv_pixelation_signal' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_pixelation_signal',
      question: 'Кабель в порядке. Проверьте уровень сигнала в настройках приставки (обычно в меню "Настройки" -> "Сигнал"). Какой уровень сигнала?',
      answers: [
        { text: 'Низкий уровень сигнала', nextNodeId: 'tv_line_issue' },
        { text: 'Нормальный уровень сигнала', nextNodeId: 'tv_box_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_freeze_check',
      question: 'Зависание изображения. Попробуйте перезагрузить приставку. Помогло?',
      answers: [
        { text: 'Да, после перезагрузки работает', nextNodeId: 'tv_resolved' },
        { text: 'Нет, проблема сохраняется', nextNodeId: 'tv_freeze_persist' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_freeze_persist',
      question: 'Перезагрузка не помогла. Проверьте температуру приставки - она не перегревается?',
      answers: [
        { text: 'Приставка горячая', nextNodeId: 'tv_overheating' },
        { text: 'Температура нормальная', nextNodeId: 'tv_pixelation_signal' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_overheating',
      question: 'Перегрев приставки. Обеспечьте вентиляцию, не накрывайте устройство.',
      answers: [
        { text: 'Помогло улучшение вентиляции', nextNodeId: 'tv_resolved' },
        { text: 'Нужна новая приставка', nextNodeId: 'tv_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'tv_resolved',
      question: 'Проблема с ТВ решена. Если возникнут вопросы - обращайтесь.',
      answers: [],
      isTerminal: true,
      diagnosis: {
        id: 'tv_resolved',
        name: 'Проблема с ТВ решена',
        category: 'tv',
        severity: 'low',
        description: 'Проблема с ТВ была успешно диагностирована и устранена',
        possibleCauses: ['Подключение HDMI', 'Сигнал на линии', 'Работа приставки'],
        solutions: [
          { step: 1, description: 'Проверка подключений', actionType: 'check' },
          { step: 2, description: 'Перезагрузка оборудования', actionType: 'reset' },
          { step: 3, description: 'Замена кабеля', actionType: 'instruction' }
        ],
        estimatedResolutionTime: '0-30 минут',
        requiresTechnician: false
      }
    }
  ],
  telephony: [
    {
      id: 'telephony_start',
      question: 'Какая проблема со стационарным телефоном?',
      symptoms: ['no_dial_tone', 'poor_audio_quality', 'cannot_call_out'],
      answers: [
        { text: 'Нет гудка', nextNodeId: 'telephony_no_tone_check' },
        { text: 'Плохое качество звука', nextNodeId: 'telephony_audio_check' },
        { text: 'Не могу звонить', nextNodeId: 'telephony_outgoing_check' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_no_tone_check',
      question: 'Проверьте, подключен ли телефон к розетке. Шнур плотно вставлен?',
      answers: [
        { text: 'Телефон подключен', nextNodeId: 'telephony_no_tone_connected' },
        { text: 'Телефон не был подключен', nextNodeId: 'telephony_connect_fix' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_connect_fix',
      question: 'Подключите телефон к розетке. Появился гудок?',
      answers: [
        { text: 'Да, гудок появился', nextNodeId: 'telephony_resolved' },
        { text: 'Нет, гудка нет', nextNodeId: 'telephony_no_tone_connected' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_no_tone_connected',
      question: 'Телефон подключен, но гудка нет. Попробуйте другой телефон в этой же розетке.',
      answers: [
        { text: 'Другой телефон работает', nextNodeId: 'telephony_phone_defect' },
        { text: 'Другой телефон тоже не работает', nextNodeId: 'telephony_line_check' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_phone_defect',
      question: 'Проблема в вашем телефоне. Рекомендуем проверить или заменить телефон.',
      answers: [
        { text: 'Понял, проверю телефон', nextNodeId: 'telephony_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_line_check',
      question: 'Проблема на линии. Проверьте уведомления об авариях в личном кабинете.',
      answers: [
        { text: 'Есть авария в районе', nextNodeId: 'telephony_availability_known' },
        { text: 'Нет информации об аварии', nextNodeId: 'telephony_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_availability_known',
      question: 'Авария известна, технические службы работают.',
      answers: [
        { text: 'Понял, спасибо', nextNodeId: 'telephony_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_technician_needed',
      question: 'Требуется выезд техника для диагностики линии.',
      answers: [
        { text: 'Вызвать техника', nextNodeId: 'telephony_technician_scheduled' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_technician_scheduled',
      question: 'Техник будет вызван. Ожидайте звонка для согласования времени визита.',
      answers: [
        { text: 'Понял, жду звонка', nextNodeId: 'telephony_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_audio_check',
      question: 'Плохое качество звука. Попробуйте другой телефон в этой же розетке.',
      answers: [
        { text: 'На другом телефоне нормально', nextNodeId: 'telephony_phone_defect' },
        { text: 'На другом телефоне тоже плохо', nextNodeId: 'telephony_audio_line' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_audio_line',
      question: 'Проблема на линии. Проверьте уведомления об авариях.',
      answers: [
        { text: 'Есть авария', nextNodeId: 'telephony_availability_known' },
        { text: 'Нет информации', nextNodeId: 'telephony_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_outgoing_check',
      question: 'Не могу звонить. Входящие звонки приходят?',
      answers: [
        { text: 'Входящие работают', nextNodeId: 'telephony_outgoing_only' },
        { text: 'Входящие тоже не работают', nextNodeId: 'telephony_no_tone_check' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_outgoing_only',
      question: 'Только исходящие не работают. Проверьте, не заблокирована ли услуга за неоплату в личном кабинете.',
      answers: [
        { text: 'Есть задолженность', nextNodeId: 'telephony_payment' },
        { text: 'Задолженности нет', nextNodeId: 'telephony_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_payment',
      question: 'Пополните баланс для разблокировки услуги. После оплаты услуга восстановится автоматически в течение 24 часов.',
      answers: [
        { text: 'Понял, оплачу', nextNodeId: 'telephony_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'telephony_resolved',
      question: 'Проблема с телефонией решена. Если возникнут вопросы - обращайтесь.',
      answers: [],
      isTerminal: true,
      diagnosis: {
        id: 'telephony_resolved',
        name: 'Проблема с телефонией решена',
        category: 'telephony',
        severity: 'low',
        description: 'Проблема с телефонией была успешно диагностирована и устранена',
        possibleCauses: ['Подключение телефона', 'Состояние линии', 'Оплата услуги'],
        solutions: [
          { step: 1, description: 'Проверка подключения', actionType: 'check' },
          { step: 2, description: 'Проверка баланса', actionType: 'check' },
          { step: 3, description: 'Диагностика линии', actionType: 'instruction' }
        ],
        estimatedResolutionTime: '0-60 минут',
        requiresTechnician: false
      }
    }
  ],
  mobile: [
    {
      id: 'mobile_start',
      question: 'Какая проблема с мобильной связью?',
      symptoms: ['no_mobile_signal', 'slow_mobile_data'],
      answers: [
        { text: 'Нет сети / нет сигнала', nextNodeId: 'mobile_no_signal_check' },
        { text: 'Медленный мобильный интернет', nextNodeId: 'mobile_slow_check' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_no_signal_check',
      question: 'Проверьте, включен ли режим полета на телефоне?',
      answers: [
        { text: 'Режим полета включен', nextNodeId: 'mobile_airplane_off' },
        { text: 'Режим полета выключен', nextNodeId: 'mobile_no_signal_normal' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_airplane_off',
      question: 'Выключите режим полета. Сеть появилась?',
      answers: [
        { text: 'Да, сеть появилась', nextNodeId: 'mobile_resolved' },
        { text: 'Нет, сети нет', nextNodeId: 'mobile_no_signal_normal' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_no_signal_normal',
      question: 'Попробуйте перезагрузить телефон. Также проверьте карту SIM - она вставлена правильно?',
      answers: [
        { text: 'SIM карта была вытащена', nextNodeId: 'mobile_sim_fix' },
        { text: 'SIM карта на месте', nextNodeId: 'mobile_restart_check' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_sim_fix',
      question: 'Вставьте SIM карту правильно. Сеть появилась?',
      answers: [
        { text: 'Да, сеть появилась', nextNodeId: 'mobile_resolved' },
        { text: 'Нет, сети нет', nextNodeId: 'mobile_restart_check' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_restart_check',
      question: 'Перезагрузите телефон. После перезагрузки сеть появилась?',
      answers: [
        { text: 'Да, сеть появилась', nextNodeId: 'mobile_resolved' },
        { text: 'Нет, сети нет', nextNodeId: 'mobile_location_check' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_location_check',
      question: 'Попробуйте перейти в другое место - возможно вы в зоне плохого покрытия (подвал, удаленная местность). Сеть появилась?',
      answers: [
        { text: 'Да, в другом месте сеть есть', nextNodeId: 'mobile_coverage_issue' },
        { text: 'Нет, сети нет везде', nextNodeId: 'mobile_sim_check' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_coverage_issue',
      question: 'Проблема с покрытием в вашем местоположении. Это зона с плохим покрытием.',
      answers: [
        { text: 'Понял', nextNodeId: 'mobile_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_sim_check',
      question: 'Попробуйте эту SIM карту в другом телефоне. Работает?',
      answers: [
        { text: 'В другом телефоне работает', nextNodeId: 'mobile_phone_defect' },
        { text: 'В другом телефоне не работает', nextNodeId: 'mobile_sim_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_phone_defect',
      question: 'Проблема в вашем телефоне. Рекомендуем обратиться в сервисный центр.',
      answers: [
        { text: 'Понял, обращусь в сервис', nextNodeId: 'mobile_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_sim_defect',
      question: 'Проблема с SIM картой. Обратитесь в офис Казахтелеком для замены SIM карты.',
      answers: [
        { text: 'Понял, обращусь в офис', nextNodeId: 'mobile_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_slow_check',
      question: 'Медленный мобильный интернет. Проверьте, какой тип сети отображается (2G, 3G, 4G, 5G)?',
      answers: [
        { text: '2G или 3G', nextNodeId: 'mobile_slow_3g' },
        { text: '4G или 5G', nextNodeId: 'mobile_slow_4g' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_slow_3g',
      question: '2G/3G имеют ограниченную скорость. Проверьте, поддерживает ли ваш телефон 4G и включен ли он в настройках.',
      answers: [
        { text: 'Включил 4G, скорость выросла', nextNodeId: 'mobile_resolved' },
        { text: 'Телефон не поддерживает 4G', nextNodeId: 'mobile_phone_limitation' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_phone_limitation',
      question: 'Ваш телефон не поддерживает 4G. Максимальная скорость ограничена возможностями 3G сети.',
      answers: [
        { text: 'Понял', nextNodeId: 'mobile_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_slow_4g',
      question: '4G включен, но скорость низкая. Проверьте уровень сигнала - сколько полосок отображается?',
      answers: [
        { text: '1-2 полоски', nextNodeId: 'mobile_weak_signal' },
        { text: '3-4 полоски', nextNodeId: 'mobile_slow_congestion' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_weak_signal',
      question: 'Слабый сигнал ограничивает скорость. Попробуйте перейти в место с лучшим покрытием или у окна.',
      answers: [
        { text: 'Помогло изменение места', nextNodeId: 'mobile_resolved' },
        { text: 'Не помогло', nextNodeId: 'mobile_slow_congestion' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_slow_congestion',
      question: 'Сигнал хороший, но скорость низкая. Возможна перегрузка базовой станции. Проверьте уведомления об авариях.',
      answers: [
        { text: 'Есть авария/работы', nextNodeId: 'mobile_availability_known' },
        { text: 'Нет информации', nextNodeId: 'mobile_monitor' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_availability_known',
      question: 'Проводятся работы на базовой станции. Скорость восстановится после завершения работ.',
      answers: [
        { text: 'Понял', nextNodeId: 'mobile_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_monitor',
      question: 'Продолжайте наблюдение. Если проблема сохранится - обращайтесь повторно.',
      answers: [
        { text: 'Понял', nextNodeId: 'mobile_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'mobile_resolved',
      question: 'Проблема с мобильной связью решена. Если возникнут вопросы - обращайтесь.',
      answers: [],
      isTerminal: true,
      diagnosis: {
        id: 'mobile_resolved',
        name: 'Проблема с мобильной связью решена',
        category: 'mobile',
        severity: 'low',
        description: 'Проблема с мобильной связью была успешно диагностирована и устранена',
        possibleCauses: ['Настройки телефона', 'Покрытие сети', 'SIM карта'],
        solutions: [
          { step: 1, description: 'Проверка настроек', actionType: 'configuration' },
          { step: 2, description: 'Перезагрузка устройства', actionType: 'reset' },
          { step: 3, description: 'Замена SIM карты', actionType: 'instruction' }
        ],
        estimatedResolutionTime: '0-30 минут',
        requiresTechnician: false
      }
    }
  ],
  equipment: [
    {
      id: 'equipment_start',
      question: 'Какое оборудование вызывает проблемы?',
      symptoms: ['router_not_working', 'modem_overheating'],
      answers: [
        { text: 'Роутер не работает', nextNodeId: 'equipment_router_check' },
        { text: 'Оборудование перегревается', nextNodeId: 'equipment_overheat_check' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_router_check',
      question: 'Роутер не работает. Проверьте индикаторы питания - горит ли индикатор Power?',
      answers: [
        { text: 'Индикатор Power горит', nextNodeId: 'equipment_router_power_on' },
        { text: 'Индикатор Power не горит', nextNodeId: 'equipment_router_power_off' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_router_power_off',
      question: 'Индикатор питания не горит. Проверьте блок питания и розетку.',
      answers: [
        { text: 'Проблема с блоком питания', nextNodeId: 'equipment_power_supply' },
        { text: 'Проблема с розеткой', nextNodeId: 'equipment_power_outlet' },
        { text: 'Все в порядке', nextNodeId: 'equipment_router_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_power_supply',
      question: 'Попробуйте другой блок питания. Роутер включился?',
      answers: [
        { text: 'Да, включился', nextNodeId: 'equipment_resolved' },
        { text: 'Нет, не включается', nextNodeId: 'equipment_router_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_power_outlet',
      question: 'Попробуйте другую розетку. Роутер включился?',
      answers: [
        { text: 'Да, включился', nextNodeId: 'equipment_resolved' },
        { text: 'Нет, не включается', nextNodeId: 'equipment_power_supply' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_router_defect',
      question: 'Роутер не включается при исправном питании. Возможен дефект роутера. Требуется замена.',
      answers: [
        { text: 'Нужен новый роутер', nextNodeId: 'equipment_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_router_power_on',
      question: 'Питание есть. Какие индикаторы горят на роутере?',
      answers: [
        { text: 'Только Power', nextNodeId: 'equipment_router_only_power' },
        { text: 'Power и другие индикаторы', nextNodeId: 'equipment_router_multiple_lights' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_router_only_power',
      question: 'Горит только индикатор питания. Это указывает на проблему с загрузкой или подключением к сети. Попробуйте перезагрузить.',
      answers: [
        { text: 'После перезагрузки заработал', nextNodeId: 'equipment_resolved' },
        { text: 'После перезагрузки то же самое', nextNodeId: 'equipment_router_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_router_multiple_lights',
      question: 'Другие индикаторы горят. Есть ли индикатор интернета (INET/WAN)?',
      answers: [
        { text: 'Индикатор интернета горит', nextNodeId: 'equipment_router_internet_ok' },
        { text: 'Индикатор интернета не горит', nextNodeId: 'equipment_router_no_internet' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_router_internet_ok',
      question: 'Интернет есть на роутере. Проблема может быть в настройках Wi-Fi или подключении устройств.',
      answers: [
        { text: 'Проверить Wi-Fi', nextNodeId: 'equipment_wifi_check' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_wifi_check',
      question: 'Проверьте настройки Wi-Fi в веб-интерфейсе роутера. Wi-Fi включен?',
      answers: [
        { text: 'Wi-Fi выключен', nextNodeId: 'equipment_wifi_enable' },
        { text: 'Wi-Fi включен', nextNodeId: 'equipment_wifi_settings' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_wifi_enable',
      question: 'Включите Wi-Fi в настройках роутера. Сеть появилась?',
      answers: [
        { text: 'Да, сеть появилась', nextNodeId: 'equipment_resolved' },
        { text: 'Нет, не появилась', nextNodeId: 'equipment_wifi_settings' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_wifi_settings',
      question: 'Проверьте имя сети и пароль. Попробуйте изменить их или сбросить настройки.',
      answers: [
        { text: 'Помогло изменение настроек', nextNodeId: 'equipment_resolved' },
        { text: 'Нужна помощь с настройками', nextNodeId: 'equipment_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_router_no_internet',
      question: 'Индикатор интернета не горит. Проверьте подключение кабеля от розетки к порту WAN.',
      answers: [
        { text: 'Кабель не был подключен', nextNodeId: 'equipment_cable_fix' },
        { text: 'Кабель подключен', nextNodeId: 'equipment_line_check' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_cable_fix',
      question: 'Подключите кабель к порту WAN. Подождите 2-3 минуты. Индикатор загорелся?',
      answers: [
        { text: 'Да, индикатор горит', nextNodeId: 'equipment_resolved' },
        { text: 'Нет, индикатор не горит', nextNodeId: 'equipment_line_check' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_line_check',
      question: 'Кабель подключен, но индикатор не горит. Проверьте, есть ли сигнал в розетке.',
      answers: [
        { text: 'Сигнала нет', nextNodeId: 'equipment_line_issue' },
        { text: 'Сигнал есть', nextNodeId: 'equipment_router_defect' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_line_issue',
      question: 'Проблема на линии. Проверьте уведомления об авариях.',
      answers: [
        { text: 'Есть авария', nextNodeId: 'equipment_availability_known' },
        { text: 'Нет информации', nextNodeId: 'equipment_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_availability_known',
      question: 'Авария известна, технические службы работают.',
      answers: [
        { text: 'Понял', nextNodeId: 'equipment_resolved' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_technician_needed',
      question: 'Требуется выезд техники для замены оборудования.',
      answers: [
        { text: 'Вызвать техника', nextNodeId: 'equipment_technician_scheduled' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_technician_scheduled',
      question: 'Техник будет вызван. Ожидайте звонка для согласования времени визита.',
      answers: [
        { text: 'Понял, жду звонка', nextNodeId: 'equipment_resolved' }
      ],
      isTerminal: false
    },
    {\
      id: 'equipment_overheat_check',
      question: 'Оборудование перегревается. Проверьте температуру устройства.',
      answers: [
        { text: 'Устройство очень горячее', nextNodeId: 'equipment_ventilation' },
        { text: 'Температура нормальная', nextNodeId: 'equipment_router_check' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_ventilation',
      question: 'Обеспечьте вентиляцию - не накрывайте устройство, уберите его в более прохладное место.',
      answers: [
        { text: 'Помогло', nextNodeId: 'equipment_resolved' },
        { text: 'Не помогло, нужно новое оборудование', nextNodeId: 'equipment_technician_needed' }
      ],
      isTerminal: false
    },
    {
      id: 'equipment_resolved',
      question: 'Проблема с оборудованием решена. Если возникнут вопросы - обращайтесь.',
      answers: [],
      isTerminal: true,
      diagnosis: {
        id: 'equipment_resolved',
        name: 'Проблема с оборудованием решена',
        category: 'equipment',
        severity: 'low',
        description: 'Проблема с оборудованием была успешно диагностирована и устранена',
        possibleCauses: ['Питание', 'Подключение', 'Вентиляция'],
        solutions: [
          { step: 1, description: 'Проверка питания', actionType: 'check' },
          { step: 2, description: 'Проверка подключений', actionType: 'check' },
          { step: 3, description: 'Обеспечение вентиляции', actionType: 'instruction' }
        ],
        estimatedResolutionTime: '0-30 минут',
        requiresTechnician: false
      }
    }
  ]
};

export function getDiagnosticTree(category: ServiceCategory): DiagnosticNode[] {
  return DIAGNOSTIC_TREES[category] || [];
}

export function getSymptomById(id: string): Symptom | undefined {
  return SYMPTOMS.find(s => s.id === id);
}

export function getSymptomsByCategory(category: ServiceCategory): Symptom[] {
  return SYMPTOMS.filter(s => s.category === category);
}

export function getAllSymptoms(): Symptom[] {
  return SYMPTOMS;
}
