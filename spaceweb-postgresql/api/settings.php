<?php
// API для настроек сайта (PostgreSQL версия)
require_once 'config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - получение настроек
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT key, value FROM settings");
        $rows = $stmt->fetchAll();
        
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['key']] = $row['value'];
        }
        
        jsonResponse(['settings' => $settings]);
    }
    
    // POST - обновление настроек (только для админа)
    if ($method === 'POST') {
        $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
        $admin = verifyAdminSession($pdo, $token);
        
        if (!$admin) {
            errorResponse('Unauthorized', 403);
        }
        
        $data = getJsonBody();
        
        // Обновление или создание настроек
        foreach ($data as $key => $value) {
            $stmt = $pdo->prepare("
                INSERT INTO settings (key, value) 
                VALUES ($1, $2)
                ON CONFLICT (key) 
                DO UPDATE SET 
                    value = EXCLUDED.value,
                    updated_at = CURRENT_TIMESTAMP
            ");
            $stmt->execute([$key, $value]);
        }
        
        jsonResponse(['message' => 'Settings updated']);
    }
    
    errorResponse('Method not allowed', 405);
    
} catch (Exception $e) {
    error_log('Settings API error: ' . $e->getMessage());
    errorResponse('Server error: ' . $e->getMessage(), 500);
}
