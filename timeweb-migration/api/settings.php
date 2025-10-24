<?php
// API для настроек сайта
require_once 'config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - получение настроек
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
        $rows = $stmt->fetchAll();
        
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
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
                INSERT INTO settings (setting_key, setting_value) 
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE 
                setting_value = VALUES(setting_value),
                updated_at = CURRENT_TIMESTAMP
            ");
            $stmt->execute([$key, $value]);
        }
        
        jsonResponse(['message' => 'Settings updated']);
    }
    
    errorResponse('Method not allowed', 405);
    
} catch (Exception $e) {
    error_log('Settings API error: ' . $e->getMessage());
    errorResponse('Server error', 500);
}
