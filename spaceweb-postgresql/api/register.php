<?php
// API для регистрации команд и игроков (PostgreSQL версия)
require_once 'config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - проверка статуса регистрации
    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT value 
            FROM settings 
            WHERE key = 'registration_open'
        ");
        $stmt->execute();
        $result = $stmt->fetch();
        
        $isOpen = $result ? ($result['value'] === 'true') : true;
        
        jsonResponse([
            'registration_open' => $isOpen,
            'individual_players' => []
        ]);
    }
    
    // POST - регистрация команды или игрока
    if ($method === 'POST') {
        $data = getJsonBody();
        $type = $data['type'] ?? '';
        
        // Проверка открыта ли регистрация
        $stmt = $pdo->prepare("
            SELECT value 
            FROM settings 
            WHERE key = 'registration_open'
        ");
        $stmt->execute();
        $result = $stmt->fetch();
        
        if ($result && $result['value'] === 'false') {
            errorResponse('Registration is closed', 403);
        }
        
        // Регистрация команды
        if ($type === 'team') {
            $teamName = $data['team_name'] ?? '';
            $password = $data['password'] ?? '';
            
            if (!$teamName || !$password) {
                errorResponse('Team name and password required');
            }
            
            // Проверка уникальности названия
            $stmt = $pdo->prepare("
                SELECT id FROM teams WHERE team_name = $1
            ");
            $stmt->execute([$teamName]);
            if ($stmt->fetch()) {
                errorResponse('Team name already exists');
            }
            
            // Создание команды
            $stmt = $pdo->prepare("
                INSERT INTO teams (
                    team_name, captain_nick, captain_telegram, password_hash,
                    top_nick, top_telegram, jungle_nick, jungle_telegram,
                    mid_nick, mid_telegram, adc_nick, adc_telegram,
                    support_nick, support_telegram, sub1_nick, sub1_telegram,
                    sub2_nick, sub2_telegram, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'pending')
            ");
            
            $stmt->execute([
                $teamName,
                $data['captain_nick'] ?? '',
                $data['captain_telegram'] ?? '',
                hashPassword($password),
                $data['top_nick'] ?? '',
                $data['top_telegram'] ?? '',
                $data['jungle_nick'] ?? '',
                $data['jungle_telegram'] ?? '',
                $data['mid_nick'] ?? '',
                $data['mid_telegram'] ?? '',
                $data['adc_nick'] ?? '',
                $data['adc_telegram'] ?? '',
                $data['support_nick'] ?? '',
                $data['support_telegram'] ?? '',
                $data['sub1_nick'] ?? null,
                $data['sub1_telegram'] ?? null,
                $data['sub2_nick'] ?? null,
                $data['sub2_telegram'] ?? null
            ]);
            
            // Сохранение в историю регистраций
            $stmt = $pdo->prepare("
                INSERT INTO team_registrations (
                    team_name, captain_nick, captain_telegram,
                    top_nick, top_telegram, jungle_nick, jungle_telegram,
                    mid_nick, mid_telegram, adc_nick, adc_telegram,
                    support_nick, support_telegram, sub1_nick, sub1_telegram,
                    sub2_nick, sub2_telegram
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            ");
            
            $stmt->execute([
                $teamName,
                $data['captain_nick'] ?? '',
                $data['captain_telegram'] ?? '',
                $data['top_nick'] ?? '',
                $data['top_telegram'] ?? '',
                $data['jungle_nick'] ?? '',
                $data['jungle_telegram'] ?? '',
                $data['mid_nick'] ?? '',
                $data['mid_telegram'] ?? '',
                $data['adc_nick'] ?? '',
                $data['adc_telegram'] ?? '',
                $data['support_nick'] ?? '',
                $data['support_telegram'] ?? '',
                $data['sub1_nick'] ?? null,
                $data['sub1_telegram'] ?? null,
                $data['sub2_nick'] ?? null,
                $data['sub2_telegram'] ?? null
            ]);
            
            jsonResponse(['message' => 'Team registered successfully']);
        }
        
        // Регистрация индивидуального игрока
        if ($type === 'individual') {
            $playerNick = $data['player_nick'] ?? '';
            $playerTelegram = $data['player_telegram'] ?? '';
            $mainRole = $data['main_role'] ?? '';
            
            if (!$playerNick || !$playerTelegram || !$mainRole) {
                errorResponse('Nickname, telegram and main role required');
            }
            
            // Сохранение регистрации
            $stmt = $pdo->prepare("
                INSERT INTO individual_registrations (
                    player_nick, player_telegram, main_role, alternative_role,
                    friend1_nick, friend1_telegram,
                    friend2_nick, friend2_telegram
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ");
            
            $stmt->execute([
                $playerNick,
                $playerTelegram,
                $mainRole,
                $data['alternative_role'] ?? null,
                $data['friend1_nick'] ?? null,
                $data['friend1_telegram'] ?? null,
                $data['friend2_nick'] ?? null,
                $data['friend2_telegram'] ?? null
            ]);
            
            jsonResponse(['message' => 'Player registered successfully']);
        }
        
        errorResponse('Invalid registration type');
    }
    
    errorResponse('Method not allowed', 405);
    
} catch (Exception $e) {
    error_log('Register API error: ' . $e->getMessage());
    errorResponse('Server error: ' . $e->getMessage(), 500);
}
