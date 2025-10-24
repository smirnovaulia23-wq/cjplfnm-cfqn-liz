<?php
// Конфигурация подключения к PostgreSQL базе данных Spaceweb
// ВАЖНО: Замените данные на свои из панели Spaceweb

define('DB_HOST', 'localhost'); // или IP из панели Spaceweb
define('DB_NAME', 'smirnovaul'); // название вашей БД
define('DB_USER', 'smirnovaul'); // пользователь БД
define('DB_PASS', 'your_password_here'); // пароль из панели
define('DB_PORT', '5432'); // порт PostgreSQL

// CORS заголовки для разрешения запросов с frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, X-User-Id');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight OPTIONS запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Функция подключения к базе данных PostgreSQL
function getDbConnection() {
    try {
        $dsn = sprintf(
            "pgsql:host=%s;port=%s;dbname=%s",
            DB_HOST,
            DB_PORT,
            DB_NAME
        );
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        
        return $pdo;
    } catch (PDOException $e) {
        error_log('Database connection error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'error' => 'Database connection failed',
            'message' => $e->getMessage()
        ]);
        exit();
    }
}

// Функция для получения JSON body из POST запроса
function getJsonBody() {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?: [];
}

// Функция хеширования пароля (SHA-256 как в оригинале)
function hashPassword($password) {
    return hash('sha256', $password);
}

// Функция генерации токена сессии
function generateSessionToken() {
    return bin2hex(random_bytes(32));
}

// Функция проверки админской сессии
function verifyAdminSession($pdo, $token) {
    if (!$token) {
        return false;
    }
    
    $stmt = $pdo->prepare("SELECT id, username, role FROM admin_users WHERE session_token = $1");
    $stmt->execute([$token]);
    return $stmt->fetch();
}

// Функция для отправки JSON ответа
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Функция для отправки ошибки
function errorResponse($message, $statusCode = 400) {
    jsonResponse(['error' => $message], $statusCode);
}
