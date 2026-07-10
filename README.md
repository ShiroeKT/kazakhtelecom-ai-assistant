# AI Ассистент технической поддержки Казахтелеком

Интеллектуальная система диагностики и поддержки абонентов Казахтелеком на базе современных технологий.

## Возможности

- **Анализ симптомов**: Автоматическое распознавание проблем из описания абонента
- **Уточняющие вопросы**: Генерация вопросов для точной диагностики
- **Деревья диагностики**: Структурированные алгоритмы для каждой категории услуг
- **Определение неисправностей**: Точная идентификация проблемы
- **Генерация текста**: Готовые сценарии разговора с абонентом
- **История беседы**: Сохранение состояния диалога

## Категории услуг

- 🌐 Интернет
- 📺 Телевидение
- 📞 Телефония
- 📱 Мобильная связь
- 🔌 Оборудование

## Технологии

### Backend
- Node.js + Express + TypeScript
- Fuse.js для нечеткого поиска
- REST API

### Frontend
- React + TypeScript + Vite
- TailwindCSS
- Lucide React (иконки)

## Установка

### Требования
- Node.js 18+
- npm или yarn

### Установка зависимостей

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Запуск

### Backend

```bash
cd backend
npm run dev
```

Сервер запустится на порту 5000

### Frontend

```bash
cd frontend
npm run dev
```

Приложение будет доступно по адресу http://localhost:3000

## API Эндпоинты

### Сессии
- `POST /api/session` - Создать новую сессию
- `GET /api/session/:sessionId` - Получить сессию
- `DELETE /api/session/:sessionId` - Удалить сессию

### Анализ
- `POST /api/analyze` - Анализировать ввод пользователя

### Диагностика
- `POST /api/diagnostic/start` - Начать диагностику
- `POST /api/diagnostic/next` - Получить следующий шаг
- `POST /api/diagnostic/reset` - Сбросить диагностику

### Ответы
- `POST /api/response/generate` - Генерировать текст ответа

### Симптомы
- `GET /api/symptoms` - Получить список симптомов
- `GET /api/symptoms?category=xxx` - Симптомы по категории

## Структура проекта

```
kazakhtelecom-ai-assistant/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── knowledgeBase.ts    # База знаний
│   │   │   ├── symptomAnalyzer.ts  # Анализ симптомов
│   │   │   ├── diagnosticEngine.ts # Диагностический движок
│   │   │   ├── responseGenerator.ts # Генератор ответов
│   │   │   └── conversationManager.ts # Управление беседой
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript типы
│   │   └── index.ts                # Главный файл сервера
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MessageList.tsx     # Список сообщений
│   │   │   ├── ChatInput.tsx       # Поле ввода
│   │   │   ├── DiagnosticOptions.tsx # Варианты ответов
│   │   │   ├── CategorySelector.tsx # Выбор категории
│   │   │   └── DiagnosisCard.tsx   # Карточка диагноза
│   │   ├── services/
│   │   │   └── api.ts              # API клиент
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript типы
│   │   ├── App.tsx                 # Главный компонент
│   │   ├── main.tsx                # Точка входа
│   │   └── index.css               # Глобальные стили
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## Использование

1. Запустите backend сервер
2. Запустите frontend приложение
3. Откройте http://localhost:3000 в браузере
4. Опишите проблему в чате
5. Следуйте инструкциям ассистента

## Расширение базы знаний

База знаний находится в `backend/src/modules/knowledgeBase.ts`. Для добавления новых симптомов или диагностических путей:

1. Добавьте симптом в массив `SYMPTOMS`
2. Расширьте диагностическое дерево в `DIAGNOSTIC_TREES`
3. Перезапустите сервер

## Разработка

### Добавление новой категории услуг

1. Добавьте категорию в `ServiceCategory` тип
2. Создайте диагностическое дерево в `knowledgeBase.ts`
3. Добавьте иконку в `CategorySelector.tsx`
4. Обновите логику в `symptomAnalyzer.ts`

### Кастомизация ответов

Ответы генерируются в `responseGenerator.ts`. Измените шаблоны для кастомизации текста.

## Лицензия

MIT
