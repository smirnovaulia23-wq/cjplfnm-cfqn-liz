import json
import os
import hashlib
import secrets
import psycopg2
from typing import Dict, Any

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Authenticate users and manage admin sessions with token generation
    Args: event - dict with httpMethod, body, headers
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            action = params.get('action')
            
            if action == 'list_admins':
                auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
                
                if not auth_token:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT username FROM admin_users WHERE session_token = %s",
                    (auth_token,)
                )
                admin = cur.fetchone()
                
                if not admin or admin[0] != 'Xuna':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Super admin access required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT id, username, role, created_at FROM admin_users ORDER BY created_at DESC"
                )
                admins = cur.fetchall()
                
                admins_list = [{
                    'id': a[0],
                    'username': a[1],
                    'role': a[2],
                    'createdAt': a[3].isoformat() if a[3] else None
                } for a in admins]
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'admins': admins_list}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create_admin':
                auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
                
                if not auth_token:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT username FROM admin_users WHERE session_token = %s",
                    (auth_token,)
                )
                admin = cur.fetchone()
                
                if not admin or admin[0] != 'Xuna':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Super admin access required'}),
                        'isBase64Encoded': False
                    }
                
                new_username = body_data.get('username')
                new_password = body_data.get('password')
                
                if not new_username or not new_password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Username and password required'}),
                        'isBase64Encoded': False
                    }
                
                hashed_password = hash_password(new_password)
                
                cur.execute(
                    "INSERT INTO admin_users (username, password_hash, role) VALUES (%s, %s, 'admin') RETURNING id",
                    (new_username, hashed_password)
                )
                admin_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'adminId': admin_id}),
                    'isBase64Encoded': False
                }
            
            username = body_data.get('username', '')
            password = body_data.get('password', '')
            
            if not username or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Username and password required'}),
                    'isBase64Encoded': False
                }
            
            hashed_password = hash_password(password)
            
            cur.execute(
                "SELECT id, username, role, password_hash FROM admin_users WHERE username = %s",
                (username,)
            )
            user_data = cur.fetchone()
            
            if user_data and user_data[3] == hashed_password:
                session_token = generate_session_token()
                
                cur.execute(
                    "UPDATE admin_users SET session_token = %s WHERE id = %s",
                    (session_token, user_data[0])
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'username': user_data[1],
                        'role': user_data[2],
                        'token': session_token
                    }),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 401,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': False, 'error': 'Неверный логин или пароль'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'delete_admin':
                auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
                
                if not auth_token:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT username FROM admin_users WHERE session_token = %s",
                    (auth_token,)
                )
                admin = cur.fetchone()
                
                if not admin or admin[0] != 'Xuna':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Super admin access required'}),
                        'isBase64Encoded': False
                    }
                
                admin_id = body_data.get('adminId')
                
                cur.execute("SELECT username FROM admin_users WHERE id = %s", (admin_id,))
                target_admin = cur.fetchone()
                
                if target_admin and target_admin[0] == 'Xuna':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Cannot delete super admin'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("DELETE FROM admin_users WHERE id = %s", (admin_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()