<?php
// API для управления командами (PostgreSQL версия)
require_once 'config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - получение команд
    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';
        
        // Список одобренных команд
        if ($action === 'approved') {
            $stmt = $pdo->query("
                SELECT id, team_name, captain_nick, captain_telegram,
                       top_nick, jungle_nick, mid_nick, adc_nick, support_nick,
                       sub1_nick, sub2_nick, created_at
                FROM teams 
                WHERE status = 'approved' 
                ORDER BY created_at DESC
            ");
            $teams = $stmt->fetchAll();
            jsonResponse(['teams' => $teams]);
        }
        
        // Список заявок (для админа)
        if ($action === 'pending') {
            $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
            $admin = verifyAdminSession($pdo, $token);
            
            if (!$admin) {
                errorResponse('Unauthorized', 403);
            }
            
            $stmt = $pdo->query("
                SELECT * FROM teams 
                WHERE status = 'pending' 
                ORDER BY created_at DESC
            ");
            $teams = $stmt->fetchAll();
            jsonResponse(['teams' => $teams]);
        }
        
        // Информация о конкретной команде
        $teamId = $_GET['team_id'] ?? 0;
        if ($teamId) {
            $stmt = $pdo->prepare("SELECT * FROM teams WHERE id = $1");
            $stmt->execute([$teamId]);
            $team = $stmt->fetch();
            
            if (!$team) {
                errorResponse('Team not found', 404);
            }
            
            jsonResponse(['team' => $team]);
        }
        
        errorResponse('Invalid action');
    }
    
    // POST - одобрение/отклонение команды
    if ($method === 'POST') {
        $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
        $admin = verifyAdminSession($pdo, $token);
        
        if (!$admin) {
            errorResponse('Unauthorized', 403);
        }
        
        $data = getJsonBody();
        $action = $data['action'] ?? '';
        $teamId = $data['team_id'] ?? 0;
        
        if (!$teamId) {
            errorResponse('Team ID required');
        }
        
        // Одобрение команды
        if ($action === 'approve') {
            $stmt = $pdo->prepare("
                UPDATE teams 
                SET status = 'approved' 
                WHERE id = $1
            ");
            $stmt->execute([$teamId]);
            jsonResponse(['message' => 'Team approved']);
        }
        
        // Отклонение команды
        if ($action === 'reject') {
            $stmt = $pdo->prepare("
                UPDATE teams 
                SET status = 'rejected' 
                WHERE id = $1
            ");
            $stmt->execute([$teamId]);
            jsonResponse(['message' => 'Team rejected']);
        }
        
        errorResponse('Invalid action');
    }
    
    // PUT - обновление данных команды
    if ($method === 'PUT') {
        $userToken = $_SERVER['HTTP_X_USER_ID'] ?? '';
        
        if (!$userToken) {
            errorResponse('Unauthorized', 403);
        }
        
        // Проверка сессии команды
        $stmt = $pdo->prepare("
            SELECT telegram FROM user_sessions 
            WHERE session_token = $1 AND user_type = 'team_captain'
        ");
        $stmt->execute([$userToken]);
        $session = $stmt->fetch();
        
        if (!$session) {
            errorResponse('Invalid session', 403);
        }
        
        $data = getJsonBody();
        
        // Найти команду по telegram капитана
        $stmt = $pdo->prepare("
            SELECT id FROM teams 
            WHERE captain_telegram = $1 AND status != 'rejected'
            ORDER BY created_at DESC 
            LIMIT 1
        ");
        $stmt->execute([$session['telegram']]);
        $team = $stmt->fetch();
        
        if (!$team) {
            errorResponse('Team not found', 404);
        }
        
        // Обновление данных команды
        $stmt = $pdo->prepare("
            UPDATE teams SET
                captain_telegram = $1,
                top_nick = $2, top_telegram = $3,
                jungle_nick = $4, jungle_telegram = $5,
                mid_nick = $6, mid_telegram = $7,
                adc_nick = $8, adc_telegram = $9,
                support_nick = $10, support_telegram = $11,
                sub1_nick = $12, sub1_telegram = $13,
                sub2_nick = $14, sub2_telegram = $15,
                is_edited = true
            WHERE id = $16
        ");
        
        $stmt->execute([
            $data['captain_telegram'] ?? '',
            $data['top_nick'] ?? '', $data['top_telegram'] ?? '',
            $data['jungle_nick'] ?? '', $data['jungle_telegram'] ?? '',
            $data['mid_nick'] ?? '', $data['mid_telegram'] ?? '',
            $data['adc_nick'] ?? '', $data['adc_telegram'] ?? '',
            $data['support_nick'] ?? '', $data['support_telegram'] ?? '',
            $data['sub1_nick'] ?? '', $data['sub1_telegram'] ?? '',
            $data['sub2_nick'] ?? '', $data['sub2_telegram'] ?? '',
            $team['id']
        ]);
        
        jsonResponse(['message' => 'Team updated']);
    }
    
    // DELETE - удаление команды
    if ($method === 'DELETE') {
        $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
        $admin = verifyAdminSession($pdo, $token);
        
        if (!$admin) {
            errorResponse('Unauthorized', 403);
        }
        
        $data = getJsonBody();
        $teamId = $data['team_id'] ?? 0;
        
        if (!$teamId) {
            errorResponse('Team ID required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM teams WHERE id = $1");
        $stmt->execute([$teamId]);
        
        jsonResponse(['message' => 'Team deleted']);
    }
    
    errorResponse('Method not allowed', 405);
    
} catch (Exception $e) {
    error_log('Teams API error: ' . $e->getMessage());
    errorResponse('Server error: ' . $e->getMessage(), 500);
}
