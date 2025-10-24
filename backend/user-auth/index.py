"""
Business: User authentication system for team captains and individual players
Args: event with httpMethod, body (login/telegram, password), queryStringParameters
Returns: HTTP response with session token or error
"""

import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def escape_sql(value: str) -> str:
    return value.replace("'", "''")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'login':
                telegram = body_data.get('telegram', '').strip()
                password = body_data.get('password', '')
                
                if not telegram or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Telegram и пароль обязательны'})
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    f"SELECT id, team_name, captain_nick, status FROM teams WHERE captain_telegram = '{escape_sql(telegram)}' AND password_hash = '{escape_sql(password_hash)}'"
                )
                team = cur.fetchone()
                
                if team:
                    session_token = generate_token()
                    expires_at = datetime.now() + timedelta(days=7)
                    
                    cur.execute(
                        f"INSERT INTO user_sessions (telegram, user_type, session_token, expires_at) VALUES ('{escape_sql(telegram)}', 'team_captain', '{escape_sql(session_token)}', '{expires_at}')"
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'token': session_token,
                            'userType': 'team_captain',
                            'teamId': team['id'],
                            'teamName': team['team_name'],
                            'captainNick': team['captain_nick'],
                            'teamStatus': team['status']
                        })
                    }
                
                cur.execute(
                    f"SELECT id, nickname, preferred_role, status FROM individual_players WHERE telegram = '{escape_sql(telegram)}' AND password_hash = '{escape_sql(password_hash)}'"
                )
                player = cur.fetchone()
                
                if player:
                    session_token = generate_token()
                    expires_at = datetime.now() + timedelta(days=7)
                    
                    cur.execute(
                        f"INSERT INTO user_sessions (telegram, user_type, session_token, expires_at) VALUES ('{escape_sql(telegram)}', 'individual_player', '{escape_sql(session_token)}', '{expires_at}')"
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'token': session_token,
                            'userType': 'individual_player',
                            'playerId': player['id'],
                            'nickname': player['nickname'],
                            'preferredRole': player['preferred_role'],
                            'playerStatus': player['status']
                        })
                    }
                
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный логин или пароль'})
                }
            
            elif action == 'verify':
                token = body_data.get('token')
                
                if not token:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Токен обязателен'})
                    }
                
                cur.execute(
                    f"SELECT telegram, user_type, expires_at FROM user_sessions WHERE session_token = '{escape_sql(token)}'"
                )
                session = cur.fetchone()
                
                if not session:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Недействительный токен'})
                    }
                
                if datetime.now() > session['expires_at']:
                    cur.execute(f"DELETE FROM user_sessions WHERE session_token = '{escape_sql(token)}'")
                    conn.commit()
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Токен истек'})
                    }
                
                if session['user_type'] == 'team_captain':
                    cur.execute(
                        f"SELECT id, team_name, captain_nick, status FROM teams WHERE captain_telegram = '{escape_sql(session['telegram'])}'"
                    )
                    team = cur.fetchone()
                    
                    if team:
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({
                                'valid': True,
                                'userType': 'team_captain',
                                'teamId': team['id'],
                                'teamName': team['team_name'],
                                'captainNick': team['captain_nick'],
                                'teamStatus': team['status']
                            })
                        }
                
                else:
                    cur.execute(
                        f"SELECT id, nickname, preferred_role, status FROM individual_players WHERE telegram = '{escape_sql(session['telegram'])}'"
                    )
                    player = cur.fetchone()
                    
                    if player:
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({
                                'valid': True,
                                'userType': 'individual_player',
                                'playerId': player['id'],
                                'nickname': player['nickname'],
                                'preferredRole': player['preferred_role'],
                                'playerStatus': player['status']
                            })
                        }
                
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'})
                }
            
            elif action == 'logout':
                token = body_data.get('token')
                
                if token:
                    cur.execute(f"DELETE FROM user_sessions WHERE session_token = '{escape_sql(token)}'")
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    finally:
        cur.close()
        conn.close()
