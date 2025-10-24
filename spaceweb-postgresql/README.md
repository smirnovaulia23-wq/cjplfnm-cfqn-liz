# Турнирный сайт - PostgreSQL версия для Spaceweb

## 📦 Содержимое

Полный бэкенд на PHP для работы с PostgreSQL базой данных на хостинге Spaceweb.

### Файлы API:
- `api/config.php` - Конфигурация подключения к PostgreSQL
- `api/auth.php` - Авторизация администраторов
- `api/user-auth.php` - Авторизация капитанов команд
- `api/register.php` - Регистрация команд и игроков
- `api/teams.php` - Управление командами
- `api/settings.php` - Настройки сайта
- `database_export.sql` - Дамп базы данных со структурой и данными

## 🚀 Установка на Spaceweb

### Шаг 1: Импорт базы данных

1. Откройте **Spaceweb панель → Базы данных**
2. Выберите базу `smirnovaul` (или создайте новую PostgreSQL базу)
3. Нажмите **"Управление" → phpPgAdmin** или используйте SSH
4. Импортируйте файл `database_export.sql`

**Через phpPgAdmin:**
- SQL → Вставьте содержимое `database_export.sql`
- Нажмите "Выполнить"

**Через SSH:**
```bash
psql -h localhost -U smirnovaul -d smirnovaul -f database_export.sql
```

### Шаг 2: Настройка подключения

1. Откройте `api/config.php`
2. Замените данные подключения:

```php
define('DB_HOST', 'localhost');  // Или IP из панели
define('DB_NAME', 'smirnovaul'); // Имя вашей БД
define('DB_USER', 'smirnovaul'); // Пользователь БД
define('DB_PASS', 'ваш_пароль'); // Пароль из панели Spaceweb
define('DB_PORT', '5432');       // Порт PostgreSQL
```

### Шаг 3: Загрузка файлов

1. Подключитесь к Spaceweb по FTP или через Файловый менеджер
2. Загрузите папку `api/` в корень сайта: `public_html/api/`
3. Убедитесь что права на файлы:
   - Папки: **755**
   - PHP файлы: **644**

### Шаг 4: Проверка работы

Откройте в браузере:
```
https://ваш-домен.ru/api/settings.php
```

Должен вернуться JSON с настройками:
```json
{
  "settings": {
    "registration_open": "true",
    "home_title": "League of Legends: Wild Rift",
    ...
  }
}
```

## 🔐 Данные для входа

### Админ панель:
- **Логин:** `Xuna`
- **Пароль:** `Smirnova2468`

### Второй админ:
- **Логин:** `Dante`
- **Пароль:** (установлен в БД)

## 📋 API Endpoints

### Публичные:
- `GET /api/settings.php` - Получить настройки сайта
- `POST /api/register.php` - Регистрация команды/игрока
- `GET /api/teams.php?action=approved` - Список одобренных команд

### Для админов (требуется X-Auth-Token):
- `POST /api/auth.php` - Авторизация админа
- `GET /api/teams.php?action=pending` - Список заявок
- `POST /api/teams.php` - Одобрение/отклонение команд
- `POST /api/settings.php` - Обновление настроек

### Для капитанов команд (требуется X-User-Id):
- `POST /api/user-auth.php` - Авторизация команды
- `PUT /api/teams.php` - Редактирование своей команды

## 🔧 Отличия от MySQL версии

### Синтаксис:
- **Плейсхолдеры:** `$1, $2, $3` вместо `?, ?, ?`
- **DSN:** `pgsql:` вместо `mysql:`
- **Порт:** 5432 вместо 3306

### Структура БД:
- **Статусы команд:** `'pending' | 'approved' | 'rejected'` вместо `is_approved BOOLEAN`
- **SERIAL:** автоинкремент ID в PostgreSQL
- **TEXT[]:** массивы для ролей игроков

### Команды:
- **UPSERT:** `ON CONFLICT DO UPDATE` вместо `ON DUPLICATE KEY UPDATE`

## ⚠️ Важно

1. **Права доступа:** Убедитесь что пользователь БД имеет права на все операции
2. **PHP версия:** Минимум PHP 7.4 с расширением `pdo_pgsql`
3. **CORS:** Заголовки настроены для работы с любым frontend
4. **Безопасность:** Пароли хешируются SHA-256

## 🆘 Устранение проблем

### Ошибка подключения к БД:
- Проверьте данные в `config.php`
- Убедитесь что PostgreSQL запущен
- Проверьте права пользователя БД

### Ошибка "relation does not exist":
- База не импортирована
- Импортируйте `database_export.sql`

### CORS ошибки:
- Убедитесь что заголовки отправляются (проверьте в DevTools → Network)
- Проверьте что сервер не перезаписывает заголовки

## 📞 Поддержка

При проблемах проверьте:
1. Логи PHP: `/var/log/php_errors.log`
2. Логи PostgreSQL: `/var/log/postgresql/`
3. Панель Spaceweb → Логи

---

**Создано для турнирной системы League of Legends: Wild Rift**
