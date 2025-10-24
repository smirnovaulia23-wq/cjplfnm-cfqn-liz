<?php
// API для авторизации капитанов команд (PostgreSQL версия)
require_once 'config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        $data = getJsonBody();
        $action = $data['action'] ?? '';
        
        // Авторизация команды
        if ($action === 'login') {
            $teamName = $data['team_name'] ?? '';
            $password = $data['password'] ?? '';
            
            if (!$teamName || !$password) {
                errorResponse('Team name and password required');
            }
            
            // Поиск команды
            $stmt = $pdo->prepare("
                SELECT id, team_name, password_hash, captain_nick, captain_telegram, status 
                FROM teams 
                WHERE team_name = $1
            ");
            $stmt->execute([$teamName]);
            $team = $stmt->fetch();
            
            if (!$team || $team['password_hash'] !== hashPassword($password)) {
                errorResponse('Invalid credentials', 401);
            }
            
            if ($team['status'] !== 'approved') {
                errorResponse('Team not approved yet', 403);
            }
            
            // Генерация токена сессии
            $token = generateSessionToken();
            
            // Сохранение сессии
            $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
            
            $stmt = $pdo->prepare("
                INSERT INTO user_sessions (telegram, user_type, session_token, expires_at) 
                VALUES ($1, 'team_captain', $2, $3)
            ");
            $stmt->execute([$team['captain_telegram'], $token, $expiresAt]);
            
            jsonResponse([
                'token' => $token,
                'team_id' => $team['id'],
                'team_name' => $team['team_name'],
                'captain_nick' => $team['captain_nick'],
                'role' => 'team_captain'
            ]);
        }
        
        errorResponse('Invalid action');
    }
    
    errorResponse('Method not allowed', 405);
    
} catch (Exception $e) {
    error_log('User auth API error: ' . $e->getMessage());
    errorResponse('Server error: ' . $e->getMessage(), 500);
}
