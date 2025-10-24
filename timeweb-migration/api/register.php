<?php
// API для регистрации команд и игроков
require_once 'config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - проверка статуса регистрации
    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT setting_value 
            FROM settings 
            WHERE setting_key = 'registration_open'
        ");
        $stmt->execute();
        $result = $stmt->fetch();
        
        $isOpen = $result ? ($result['setting_value'] === 'true') : true;
        
        jsonResponse([
            'registration_open' => $isOpen,
            'individual_players' => [] // Можно добавить список игроков
        ]);
    }
    
    // POST - регистрация команды или игрока
    if ($method === 'POST') {
        $data = getJsonBody();
        $type = $data['type'] ?? '';
        
        // Проверка открыта ли регистрация
        $stmt = $pdo->prepare("
            SELECT setting_value 
            FROM settings 
            WHERE setting_key = 'registration_open'
        ");
        $stmt->execute();
        $result = $stmt->fetch();
        
        if ($result && $result['setting_value'] === 'false') {
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
                SELECT id FROM teams WHERE team_name = ?
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
                    sub2_nick, sub2_telegram, is_approved
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            $nickname = $data['nickname'] ?? '';
            $telegram = $data['telegram'] ?? '';
            $preferredRoles = json_encode($data['preferred_roles'] ?? []);
            
            if (!$nickname || !$telegram) {
                errorResponse('Nickname and telegram required');
            }
            
            // Сохранение регистрации
            $stmt = $pdo->prepare("
                INSERT INTO individual_registrations (
                    nickname, telegram, preferred_roles, has_friends,
                    friend1_nickname, friend1_telegram, friend1_roles,
                    friend2_nickname, friend2_telegram, friend2_roles
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $nickname,
                $telegram,
                $preferredRoles,
                $data['has_friends'] ?? false,
                $data['friend1_nickname'] ?? null,
                $data['friend1_telegram'] ?? null,
                json_encode($data['friend1_roles'] ?? []),
                $data['friend2_nickname'] ?? null,
                $data['friend2_telegram'] ?? null,
                json_encode($data['friend2_roles'] ?? [])
            ]);
            
            jsonResponse(['message' => 'Player registered successfully']);
        }
        
        errorResponse('Invalid registration type');
    }
    
    errorResponse('Method not allowed', 405);
    
} catch (Exception $e) {
    error_log('Register API error: ' . $e->getMessage());
    errorResponse('Server error', 500);
}
