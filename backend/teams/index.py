import json
import os
import hashlib
import psycopg2
from typing import Dict, Any

def escape_sql(value: str) -> str:
    return value.replace("'", "''")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage team registrations - create, list, approve, reject
    Args: event - dict with httpMethod, body, queryStringParameters, headers
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Session-Token',
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
            
            if params.get('action') == 'team-login':
                return {
                    'statusCode': 405,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Use POST method for team login'}),
                    'isBase64Encoded': False
                }
            
            if params.get('type') == 'individual':
                cur.execute(
                    """SELECT id, nickname, telegram, preferred_roles, status, created_at,
                              has_friends, friend1_nickname, friend1_telegram, friend1_roles,
                              friend2_nickname, friend2_telegram, friend2_roles
                       FROM individual_players 
                       ORDER BY created_at DESC"""
                )
                players = cur.fetchall()
                
                players_list = [{
                    'id': p[0],
                    'nickname': p[1],
                    'telegram': p[2],
                    'preferredRoles': p[3] if p[3] else [],
                    'status': p[4],
                    'createdAt': p[5].isoformat() if p[5] else None,
                    'hasFriends': p[6] if p[6] is not None else False,
                    'friend1Nickname': p[7],
                    'friend1Telegram': p[8],
                    'friend1Roles': p[9] if p[9] else [],
                    'friend2Nickname': p[10],
                    'friend2Telegram': p[11],
                    'friend2Roles': p[12] if p[12] else []
                } for p in players]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'players': players_list}),
                    'isBase64Encoded': False
                }
            
            team_id = params.get('teamId')
            if team_id:
                cur.execute(
                    f"""SELECT id, team_name, captain_nick, captain_telegram, status, created_at,
                              top_nick, top_telegram, jungle_nick, jungle_telegram, 
                              mid_nick, mid_telegram, adc_nick, adc_telegram,
                              support_nick, support_telegram, sub1_nick, sub1_telegram,
                              sub2_nick, sub2_telegram, is_edited 
                       FROM teams WHERE id = {team_id}"""
                )
                t = cur.fetchone()
                
                if not t:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Team not found'}),
                        'isBase64Encoded': False
                    }
                
                team_data = {
                    'id': t[0],
                    'teamName': t[1],
                    'captainNick': t[2],
                    'captainTelegram': t[3],
                    'status': t[4],
                    'createdAt': t[5].isoformat() if t[5] else None,
                    'topNick': t[6],
                    'topTelegram': t[7],
                    'jungleNick': t[8],
                    'jungleTelegram': t[9],
                    'midNick': t[10],
                    'midTelegram': t[11],
                    'adcNick': t[12],
                    'adcTelegram': t[13],
                    'supportNick': t[14],
                    'supportTelegram': t[15],
                    'sub1Nick': t[16],
                    'sub1Telegram': t[17],
                    'sub2Nick': t[18],
                    'sub2Telegram': t[19],
                    'isEdited': t[20] if len(t) > 20 and t[20] is not None else False
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'team': team_data}),
                    'isBase64Encoded': False
                }
            
            status_filter = params.get('status', 'approved')
            
            cur.execute(
                f"""SELECT id, team_name, captain_nick, captain_telegram, status, created_at,
                          top_nick, top_telegram, jungle_nick, jungle_telegram, 
                          mid_nick, mid_telegram, adc_nick, adc_telegram,
                          support_nick, support_telegram, sub1_nick, sub1_telegram,
                          sub2_nick, sub2_telegram, is_edited 
                   FROM teams WHERE status = '{escape_sql(status_filter)}' ORDER BY created_at DESC"""
            )
            teams = cur.fetchall()
            
            teams_list = [{
                'id': t[0],
                'teamName': t[1],
                'captainNick': t[2],
                'captainTelegram': t[3],
                'status': t[4],
                'createdAt': t[5].isoformat() if t[5] else None,
                'topNick': t[6],
                'topTelegram': t[7],
                'jungleNick': t[8],
                'jungleTelegram': t[9],
                'midNick': t[10],
                'midTelegram': t[11],
                'adcNick': t[12],
                'adcTelegram': t[13],
                'supportNick': t[14],
                'supportTelegram': t[15],
                'sub1Nick': t[16],
                'sub1Telegram': t[17],
                'sub2Nick': t[18],
                'sub2Telegram': t[19],
                'isEdited': t[20] if len(t) > 20 and t[20] is not None else False
            } for t in teams]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'teams': teams_list}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            params = event.get('queryStringParameters') or {}
            if params.get('action') == 'team-login' or body_data.get('action') == 'team-login':
                team_name = body_data.get('teamName', '')
                password = body_data.get('password', '')
                
                if not team_name or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': False, 'error': 'Требуется название команды и пароль'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    f"""SELECT id, team_name, captain_nick, captain_telegram, status,
                              top_nick, top_telegram, jungle_nick, jungle_telegram,
                              mid_nick, mid_telegram, adc_nick, adc_telegram,
                              support_nick, support_telegram, sub1_nick, sub1_telegram,
                              sub2_nick, sub2_telegram
                       FROM teams 
                       WHERE team_name = '{escape_sql(team_name)}' AND password_hash = '{escape_sql(password_hash)}'"""
                )
                team = cur.fetchone()
                
                if not team:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': False, 'error': 'Неверное название команды или пароль'}),
                        'isBase64Encoded': False
                    }
                
                team_data = {
                    'id': team[0],
                    'teamName': team[1],
                    'captainNick': team[2],
                    'captainTelegram': team[3],
                    'status': team[4],
                    'topNick': team[5],
                    'topTelegram': team[6],
                    'jungleNick': team[7],
                    'jungleTelegram': team[8],
                    'midNick': team[9],
                    'midTelegram': team[10],
                    'adcNick': team[11],
                    'adcTelegram': team[12],
                    'supportNick': team[13],
                    'supportTelegram': team[14],
                    'sub1Nick': team[15],
                    'sub1Telegram': team[16],
                    'sub2Nick': team[17],
                    'sub2Telegram': team[18]
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'team': team_data}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT value FROM settings WHERE key = 'registration_open'")
            reg_status = cur.fetchone()
            
            if reg_status and reg_status[0] == 'false':
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': False, 'error': 'Регистрация закрыта'}),
                    'isBase64Encoded': False
                }
            
            if body_data.get('type') == 'individual':
                preferred_roles = body_data.get('preferredRoles', [])
                has_friends = body_data.get('hasFriends', False)
                nickname = escape_sql(body_data.get('nickname', ''))
                telegram = escape_sql(body_data.get('telegram', ''))
                
                # Handle arrays for PostgreSQL
                preferred_roles_str = '{' + ','.join([f'"{escape_sql(r)}"' for r in preferred_roles]) + '}'
                
                friend1_nickname = escape_sql(body_data.get('friend1Nickname', '')) if has_friends and body_data.get('friend1Nickname') else 'NULL'
                friend1_telegram = escape_sql(body_data.get('friend1Telegram', '')) if has_friends and body_data.get('friend1Telegram') else 'NULL'
                friend1_roles = body_data.get('friend1Roles', []) if has_friends else []
                friend1_roles_str = '{' + ','.join([f'"{escape_sql(r)}"' for r in friend1_roles]) + '}' if friend1_roles else 'NULL'
                
                friend2_nickname = escape_sql(body_data.get('friend2Nickname', '')) if has_friends and body_data.get('friend2Nickname') else 'NULL'
                friend2_telegram = escape_sql(body_data.get('friend2Telegram', '')) if has_friends and body_data.get('friend2Telegram') else 'NULL'
                friend2_roles = body_data.get('friend2Roles', []) if has_friends else []
                friend2_roles_str = '{' + ','.join([f'"{escape_sql(r)}"' for r in friend2_roles]) + '}' if friend2_roles else 'NULL'
                
                cur.execute(
                    f"""INSERT INTO individual_players (
                        nickname, telegram, password_hash, preferred_roles, status,
                        has_friends, friend1_nickname, friend1_telegram, friend1_roles,
                        friend2_nickname, friend2_telegram, friend2_roles
                    ) VALUES ('{nickname}', '{telegram}', '', '{preferred_roles_str}', 'pending', {has_friends}, 
                        {'NULL' if friend1_nickname == 'NULL' else f"'{friend1_nickname}'"}, 
                        {'NULL' if friend1_telegram == 'NULL' else f"'{friend1_telegram}'"}, 
                        {'NULL' if friend1_roles_str == 'NULL' else f"'{friend1_roles_str}'"}, 
                        {'NULL' if friend2_nickname == 'NULL' else f"'{friend2_nickname}'"}, 
                        {'NULL' if friend2_telegram == 'NULL' else f"'{friend2_telegram}'"}, 
                        {'NULL' if friend2_roles_str == 'NULL' else f"'{friend2_roles_str}'"})
                    RETURNING id"""
                )
                player_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'playerId': player_id}),
                    'isBase64Encoded': False
                }
            
            password_hash = hash_password(body_data.get('password', ''))
            
            team_name = escape_sql(body_data.get('teamName', ''))
            captain_nick = escape_sql(body_data.get('captainNick', ''))
            captain_telegram = escape_sql(body_data.get('captainTelegram', ''))
            top_nick = escape_sql(body_data.get('topNick', ''))
            top_telegram = escape_sql(body_data.get('topTelegram', ''))
            jungle_nick = escape_sql(body_data.get('jungleNick', ''))
            jungle_telegram = escape_sql(body_data.get('jungleTelegram', ''))
            mid_nick = escape_sql(body_data.get('midNick', ''))
            mid_telegram = escape_sql(body_data.get('midTelegram', ''))
            adc_nick = escape_sql(body_data.get('adcNick', ''))
            adc_telegram = escape_sql(body_data.get('adcTelegram', ''))
            support_nick = escape_sql(body_data.get('supportNick', ''))
            support_telegram = escape_sql(body_data.get('supportTelegram', ''))
            sub1_nick = escape_sql(body_data.get('sub1Nick', ''))
            sub1_telegram = escape_sql(body_data.get('sub1Telegram', ''))
            sub2_nick = escape_sql(body_data.get('sub2Nick', ''))
            sub2_telegram = escape_sql(body_data.get('sub2Telegram', ''))
            
            cur.execute(
                f"""INSERT INTO teams (
                    team_name, captain_nick, captain_telegram, password_hash,
                    top_nick, top_telegram, jungle_nick, jungle_telegram,
                    mid_nick, mid_telegram, adc_nick, adc_telegram,
                    support_nick, support_telegram, sub1_nick, sub1_telegram,
                    sub2_nick, sub2_telegram, status
                ) VALUES ('{team_name}', '{captain_nick}', '{captain_telegram}', '{password_hash}', 
                          '{top_nick}', '{top_telegram}', '{jungle_nick}', '{jungle_telegram}',
                          '{mid_nick}', '{mid_telegram}', '{adc_nick}', '{adc_telegram}',
                          '{support_nick}', '{support_telegram}', '{sub1_nick}', '{sub1_telegram}',
                          '{sub2_nick}', '{sub2_telegram}', 'pending')
                RETURNING id"""
            )
            team_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'teamId': team_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            player_id = body_data.get('playerId')
            team_id = body_data.get('teamId')
            action = body_data.get('action')
            
            if player_id:
                new_status = escape_sql(body_data.get('status', ''))
                cur.execute(
                    f"UPDATE individual_players SET status = '{new_status}' WHERE id = {player_id}"
                )
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
            
            if action == 'update':
                auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
                session_token = event.get('headers', {}).get('X-Session-Token') or event.get('headers', {}).get('x-session-token')
                is_admin_update = False
                is_captain_update = False
                
                if auth_token:
                    cur.execute(
                        f"SELECT role FROM admin_users WHERE session_token = '{escape_sql(auth_token)}'"
                    )
                    admin_result = cur.fetchone()
                    is_admin_update = admin_result is not None
                
                if not is_admin_update and session_token:
                    cur.execute(
                        f"SELECT team_id FROM user_sessions WHERE session_token = '{escape_sql(session_token)}'"
                    )
                    session_result = cur.fetchone()
                    if session_result and session_result[0] == team_id:
                        is_captain_update = True
                
                if not is_admin_update and not is_captain_update:
                    return {
                        'statusCode': 403,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'success': False, 'error': 'Недостаточно прав для редактирования'}),
                        'isBase64Encoded': False
                    }
                
                if is_captain_update:
                    cur.execute("SELECT value FROM settings WHERE key = 'registration_open'")
                    reg_status = cur.fetchone()
                    
                    if reg_status and reg_status[0] == 'false':
                        return {
                            'statusCode': 403,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'success': False, 'error': 'Регистрация закрыта'}),
                            'isBase64Encoded': False
                        }
                
                team_name = escape_sql(body_data.get('teamName', ''))
                top_nick = escape_sql(body_data.get('topNick', ''))
                top_telegram = escape_sql(body_data.get('topTelegram', ''))
                jungle_nick = escape_sql(body_data.get('jungleNick', ''))
                jungle_telegram = escape_sql(body_data.get('jungleTelegram', ''))
                mid_nick = escape_sql(body_data.get('midNick', ''))
                mid_telegram = escape_sql(body_data.get('midTelegram', ''))
                adc_nick = escape_sql(body_data.get('adcNick', ''))
                adc_telegram = escape_sql(body_data.get('adcTelegram', ''))
                support_nick = escape_sql(body_data.get('supportNick', ''))
                support_telegram = escape_sql(body_data.get('supportTelegram', ''))
                sub1_nick = escape_sql(body_data.get('sub1Nick', ''))
                sub1_telegram = escape_sql(body_data.get('sub1Telegram', ''))
                sub2_nick = escape_sql(body_data.get('sub2Nick', ''))
                sub2_telegram = escape_sql(body_data.get('sub2Telegram', ''))
                
                if is_admin_update:
                    cur.execute(
                        f"""UPDATE teams SET 
                            team_name = '{team_name}',
                            top_nick = '{top_nick}', top_telegram = '{top_telegram}',
                            jungle_nick = '{jungle_nick}', jungle_telegram = '{jungle_telegram}',
                            mid_nick = '{mid_nick}', mid_telegram = '{mid_telegram}',
                            adc_nick = '{adc_nick}', adc_telegram = '{adc_telegram}',
                            support_nick = '{support_nick}', support_telegram = '{support_telegram}',
                            sub1_nick = '{sub1_nick}', sub1_telegram = '{sub1_telegram}',
                            sub2_nick = '{sub2_nick}', sub2_telegram = '{sub2_telegram}'
                        WHERE id = {team_id}"""
                    )
                else:
                    cur.execute(
                        f"""UPDATE teams SET 
                            top_nick = '{top_nick}', top_telegram = '{top_telegram}',
                            jungle_nick = '{jungle_nick}', jungle_telegram = '{jungle_telegram}',
                            mid_nick = '{mid_nick}', mid_telegram = '{mid_telegram}',
                            adc_nick = '{adc_nick}', adc_telegram = '{adc_telegram}',
                            support_nick = '{support_nick}', support_telegram = '{support_telegram}',
                            sub1_nick = '{sub1_nick}', sub1_telegram = '{sub1_telegram}',
                            sub2_nick = '{sub2_nick}', sub2_telegram = '{sub2_telegram}',
                            status = 'pending',
                            is_edited = true
                        WHERE id = {team_id}"""
                    )
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
            
            new_status = escape_sql(body_data.get('status', ''))
            
            if new_status == 'approved':
                cur.execute(
                    f"UPDATE teams SET status = '{new_status}', is_edited = false WHERE id = {team_id}"
                )
            else:
                cur.execute(
                    f"UPDATE teams SET status = '{new_status}' WHERE id = {team_id}"
                )
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
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            item_id = body_data.get('id')
            password = body_data.get('password')
            item_type = body_data.get('type')
            admin_action = body_data.get('adminAction', False)
            team_id = body_data.get('teamId')
            player_id = body_data.get('playerId')
            action = body_data.get('action')
            
            auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
            
            if action == 'clear_all' and auth_token:
                cur.execute(
                    f"SELECT role FROM admin_users WHERE session_token = '{escape_sql(auth_token)}'"
                )
                admin_result = cur.fetchone()
                
                if not admin_result or admin_result[0] != 'super_admin':
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется супер-админ'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("DELETE FROM teams")
                teams_deleted = cur.rowcount
                cur.execute("DELETE FROM individual_players")
                players_deleted = cur.rowcount
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'deletedTeams': teams_deleted,
                        'deletedPlayers': players_deleted
                    }),
                    'isBase64Encoded': False
                }
            
            if (team_id or player_id) and auth_token:
                cur.execute(
                    f"SELECT role FROM admin_users WHERE session_token = '{escape_sql(auth_token)}'"
                )
                admin_result = cur.fetchone()
                
                if not admin_result:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Требуется админ доступ'}),
                        'isBase64Encoded': False
                    }
                
                if team_id:
                    cur.execute(f"DELETE FROM teams WHERE id = {team_id}")
                elif player_id:
                    cur.execute(f"DELETE FROM individual_players WHERE id = {player_id}")
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            if admin_action:
                if not auth_token:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    f"SELECT role FROM admin_users WHERE session_token = '{escape_sql(auth_token)}'"
                )
                admin_result = cur.fetchone()
                
                if not admin_result:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Admin access required'}),
                        'isBase64Encoded': False
                    }
                
                if item_type == 'team':
                    cur.execute(f"DELETE FROM teams WHERE id = {item_id}")
                elif item_type == 'player':
                    cur.execute(f"DELETE FROM individual_players WHERE id = {item_id}")
                
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
            
            if not item_id or not password or not item_type:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id, password or type'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT value FROM settings WHERE key = 'registration_open'")
            reg_status = cur.fetchone()
            
            if reg_status and reg_status[0] == 'false':
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': False, 'error': 'Регистрация закрыта'}),
                    'isBase64Encoded': False
                }
            
            hashed_password = hash_password(password)
            
            if item_type == 'team':
                cur.execute(
                    f"SELECT password_hash FROM teams WHERE id = {item_id}"
                )
                result = cur.fetchone()
                
                if not result or result[0] != hashed_password:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid password'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f"DELETE FROM teams WHERE id = {item_id}")
                conn.commit()
            
            elif item_type == 'player':
                cur.execute(
                    f"SELECT password_hash FROM individual_players WHERE id = {item_id}"
                )
                result = cur.fetchone()
                
                if not result or (result[0] and result[0] != hashed_password):
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid password'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(f"DELETE FROM individual_players WHERE id = {item_id}")
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