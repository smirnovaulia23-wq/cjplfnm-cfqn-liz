<?php
// API для авторизации администраторов
require_once 'config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - получение списка админов
    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';
        
        if ($action === 'list_admins') {
            $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
            $admin = verifyAdminSession($pdo, $token);
            
            if (!$admin || $admin['role'] !== 'super_admin') {
                errorResponse('Unauthorized', 403);
            }
            
            $stmt = $pdo->query("
                SELECT id, username, role, created_at 
                FROM admin_users 
                ORDER BY created_at DESC
            ");
            $admins = $stmt->fetchAll();
            
            jsonResponse(['admins' => $admins]);
        }
        
        errorResponse('Invalid action');
    }
    
    // POST - авторизация или создание админа
    if ($method === 'POST') {
        $data = getJsonBody();
        $action = $data['action'] ?? '';
        
        // Авторизация админа
        if ($action === 'login') {
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';
            
            if (!$username || !$password) {
                errorResponse('Username and password required');
            }
            
            $stmt = $pdo->prepare("
                SELECT id, username, role, password_hash 
                FROM admin_users 
                WHERE username = ?
            ");
            $stmt->execute([$username]);
            $admin = $stmt->fetch();
            
            if (!$admin || $admin['password_hash'] !== hashPassword($password)) {
                errorResponse('Invalid credentials', 401);
            }
            
            // Генерация нового токена
            $token = generateSessionToken();
            
            $stmt = $pdo->prepare("
                UPDATE admin_users 
                SET session_token = ? 
                WHERE id = ?
            ");
            $stmt->execute([$token, $admin['id']]);
            
            jsonResponse([
                'token' => $token,
                'role' => $admin['role'],
                'username' => $admin['username']
            ]);
        }
        
        // Создание нового админа (только для супер-админа)
        if ($action === 'create_admin') {
            $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
            $currentAdmin = verifyAdminSession($pdo, $token);
            
            if (!$currentAdmin || $currentAdmin['role'] !== 'super_admin') {
                errorResponse('Unauthorized', 403);
            }
            
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';
            
            if (!$username || !$password) {
                errorResponse('Username and password required');
            }
            
            // Проверка существования
            $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE username = ?");
            $stmt->execute([$username]);
            if ($stmt->fetch()) {
                errorResponse('Admin already exists');
            }
            
            // Создание админа
            $stmt = $pdo->prepare("
                INSERT INTO admin_users (username, password_hash, role) 
                VALUES (?, ?, 'admin')
            ");
            $stmt->execute([$username, hashPassword($password)]);
            
            jsonResponse(['message' => 'Admin created successfully']);
        }
        
        errorResponse('Invalid action');
    }
    
    // DELETE - удаление админа
    if ($method === 'DELETE') {
        $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
        $currentAdmin = verifyAdminSession($pdo, $token);
        
        if (!$currentAdmin || $currentAdmin['role'] !== 'super_admin') {
            errorResponse('Unauthorized', 403);
        }
        
        $data = getJsonBody();
        $adminId = $data['admin_id'] ?? 0;
        
        if (!$adminId) {
            errorResponse('Admin ID required');
        }
        
        // Проверка что это не супер-админ
        $stmt = $pdo->prepare("SELECT username FROM admin_users WHERE id = ?");
        $stmt->execute([$adminId]);
        $admin = $stmt->fetch();
        
        if (!$admin) {
            errorResponse('Admin not found', 404);
        }
        
        if ($admin['username'] === 'Xuna') {
            errorResponse('Cannot delete super admin');
        }
        
        // Удаление
        $stmt = $pdo->prepare("DELETE FROM admin_users WHERE id = ?");
        $stmt->execute([$adminId]);
        
        jsonResponse(['message' => 'Admin deleted successfully']);
    }
    
    errorResponse('Method not allowed', 405);
    
} catch (Exception $e) {
    error_log('Auth API error: ' . $e->getMessage());
    errorResponse('Server error', 500);
}
