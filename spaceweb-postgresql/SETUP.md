# Пошаговая инструкция по установке

## ✅ Что у вас есть

На Spaceweb уже созданы 2 PostgreSQL базы:
- **smirnovaul** (9 таблиц, 7.78 MB) - основная БД
- **smirnovaul_2** (0 таблиц, 73 MB) - пустая БД

## 📝 План установки

### Шаг 1: Подготовка базы данных

**Вариант A: Использовать пустую БД smirnovaul_2 (рекомендуется)**
1. Панель Spaceweb → Базы данных
2. Выберите **smirnovaul_2**
3. Нажмите **"Импорт"** или откройте phpPgAdmin
4. Импортируйте файл `database_export.sql`

**Вариант B: Создать новую БД**
1. Панель Spaceweb → Базы данных
2. Нажмите **"Создать базу данных"**
3. Тип: **PostgreSQL**
4. Имя: `tournament_db` (любое)
5. После создания импортируйте `database_export.sql`

### Шаг 2: Получение данных доступа

1. Панель Spaceweb → Базы данных
2. Найдите свою базу
3. Нажмите на иконку "инфо" (ℹ️)
4. Скопируйте:
   - **Хост** (например: `localhost` или `192.168.1.10`)
   - **Порт** (обычно `5432`)
   - **Имя БД** (например: `smirnovaul_2`)
   - **Логин** (например: `smirnovaul_2`)
   - **Пароль** (нажмите "Показать пароль")

### Шаг 3: Настройка config.php

Откройте файл `api/config.php` и замените:

```php
define('DB_HOST', 'localhost');          // Хост из панели
define('DB_NAME', 'smirnovaul_2');      // Имя вашей БД
define('DB_USER', 'smirnovaul_2');      // Логин пользователя
define('DB_PASS', 'ваш_пароль_здесь');  // Пароль из панели
define('DB_PORT', '5432');               // Порт PostgreSQL
```

**Пример с реальными данными:**
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'smirnovaul_2');
define('DB_USER', 'smirnovaul_2');
define('DB_PASS', 'xK9mP2nQ7wE1');
define('DB_PORT', '5432');
```

### Шаг 4: Загрузка файлов на хостинг

**Через FTP (FileZilla, Total Commander):**
1. Подключитесь к Spaceweb по FTP
2. Перейдите в папку `public_html/`
3. Создайте папку `api/`
4. Загрузите все файлы из папки `api/`:
   - config.php
   - auth.php
   - user-auth.php
   - register.php
   - teams.php
   - settings.php
   - .htaccess

**Через файловый менеджер Spaceweb:**
1. Панель Spaceweb → Файловый менеджер
2. Откройте `public_html/`
3. Создайте папку `api/`
4. Загрузите файлы через интерфейс

### Шаг 5: Установка прав доступа

**Важно! Установите правильные права:**

```
public_html/api/          755 (drwxr-xr-x)
public_html/api/*.php     644 (-rw-r--r--)
public_html/api/.htaccess 644 (-rw-r--r--)
```

**Как установить права:**
- FTP клиент: ПКМ → Права доступа
- Файловый менеджер: ПКМ → Изменить права

### Шаг 6: Проверка работы

Откройте в браузере:

**Тест 1: Получение настроек**
```
https://ваш-домен.ru/api/settings.php
```

Должен вернуться JSON:
```json
{
  "settings": {
    "registration_open": "true",
    "home_title": "League of Legends: Wild Rift",
    ...
  }
}
```

**Тест 2: Авторизация админа**
```bash
curl -X POST https://ваш-домен.ru/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{"action":"login","username":"Xuna","password":"Smirnova2468"}'
```

Должен вернуться токен:
```json
{
  "token": "abc123...",
  "role": "super_admin",
  "username": "Xuna"
}
```

### Шаг 7: Подключение к frontend

В вашем React приложении обновите URL API:

```typescript
// src/config/api.ts
const API_BASE_URL = 'https://ваш-домен.ru/api';

export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/auth.php`,
  userAuth: `${API_BASE_URL}/user-auth.php`,
  register: `${API_BASE_URL}/register.php`,
  teams: `${API_BASE_URL}/teams.php`,
  settings: `${API_BASE_URL}/settings.php`,
};
```

## 🔧 Решение проблем

### Ошибка: "Database connection failed"

**Причина:** Неверные данные подключения

**Решение:**
1. Проверьте `config.php` - данные должны совпадать с панелью
2. Проверьте что PostgreSQL запущен (панель → Базы данных)
3. Убедитесь что у пользователя есть права на БД

### Ошибка: "relation does not exist"

**Причина:** База не импортирована

**Решение:**
1. Импортируйте `database_export.sql` через phpPgAdmin
2. Проверьте что все таблицы созданы (должно быть 9 таблиц)

### Ошибка: "Access denied"

**Причина:** Пользователь не имеет прав на БД

**Решение:**
1. Панель Spaceweb → Базы данных
2. Выберите БД → Управление доступом
3. Добавьте пользователя с правами **ALL PRIVILEGES**

### Ошибка 500 Internal Server Error

**Причина:** Синтаксическая ошибка в PHP или неверные права

**Решение:**
1. Проверьте права на файлы (должны быть 644)
2. Проверьте логи: Панель → Логи → PHP errors
3. Убедитесь что расширение `pdo_pgsql` установлено

### CORS ошибки

**Причина:** Заголовки не отправляются

**Решение:**
1. Убедитесь что `.htaccess` загружен в папку `api/`
2. Проверьте что `mod_headers` включен на сервере
3. Если не помогает - заголовки уже установлены в `config.php`

## 📊 Проверка структуры БД

После импорта должны быть созданы:

- ✅ admin_users (2 записи)
- ✅ settings (8 записей)
- ✅ teams (8 записей)
- ✅ team_registrations (7 записей)
- ✅ individual_registrations (11 записей)
- ✅ individual_players (0 записей)
- ✅ schedule_teams (2 записи)
- ✅ matches (0 записей)
- ✅ user_sessions (6 записей)

**Проверка через SQL:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

## 🎯 Готово!

После выполнения всех шагов:
1. ✅ База данных импортирована и работает
2. ✅ API файлы загружены на хостинг
3. ✅ Подключение к БД настроено
4. ✅ API endpoints отвечают корректно
5. ✅ Frontend может обращаться к бэкенду

Теперь ваш турнирный сайт полностью работает на Spaceweb!
