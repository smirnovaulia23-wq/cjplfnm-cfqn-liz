import json
import os
import hashlib
import psycopg2
from typing import Dict, Any

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
            
            if params.get('type') == 'individual':
                cur.execute(
                    """SELECT id, nickname, telegram, preferred_roles, status, created_at,
                              has_friends, friend1_nickname, friend1_telegram, friend1_role,
                              friend2_nickname, friend2_telegram, friend2_role
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
                    'friend1Role': p[9],
                    'friend2Nickname': p[10],
                    'friend2Telegram': p[11],
                    'friend2Role': p[12]
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
                    """SELECT id, team_name, captain_nick, captain_telegram, status, created_at,
                              top_nick, top_telegram, jungle_nick, jungle_telegram, 
                              mid_nick, mid_telegram, adc_nick, adc_telegram,
                              support_nick, support_telegram, sub1_nick, sub1_telegram,
                              sub2_nick, sub2_telegram, is_edited 
                       FROM teams WHERE id = %s""",
                    (team_id,)
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
                """SELECT id, team_name, captain_nick, captain_telegram, status, created_at,
                          top_nick, top_telegram, jungle_nick, jungle_telegram, 
                          mid_nick, mid_telegram, adc_nick, adc_telegram,
                          support_nick, support_telegram, sub1_nick, sub1_telegram,
                          sub2_nick, sub2_telegram, is_edited 
                   FROM teams WHERE status = %s ORDER BY created_at DESC""",
                (status_filter,)
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
                
                cur.execute(
                    """INSERT INTO individual_players (
                        nickname, telegram, preferred_roles, status,
                        has_friends, friend1_nickname, friend1_telegram, friend1_role,
                        friend2_nickname, friend2_telegram, friend2_role
                    ) VALUES (%s, %s, %s, 'pending', %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id""",
                    (
                        body_data.get('nickname'),
                        body_data.get('telegram'),
                        preferred_roles,
                        has_friends,
                        body_data.get('friend1Nickname') if has_friends else None,
                        body_data.get('friend1Telegram') if has_friends else None,
                        body_data.get('friend1Role') if has_friends else None,
                        body_data.get('friend2Nickname') if has_friends else None,
                        body_data.get('friend2Telegram') if has_friends else None,
                        body_data.get('friend2Role') if has_friends else None
                    )
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
            
            cur.execute(
                """INSERT INTO teams (
                    team_name, captain_nick, captain_telegram, password_hash,
                    top_nick, top_telegram, jungle_nick, jungle_telegram,
                    mid_nick, mid_telegram, adc_nick, adc_telegram,
                    support_nick, support_telegram, sub1_nick, sub1_telegram,
                    sub2_nick, sub2_telegram, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending')
                RETURNING id""",
                (
                    body_data.get('teamName'),
                    body_data.get('captainNick'),
                    body_data.get('captainTelegram'),
                    password_hash,
                    body_data.get('topNick'),
                    body_data.get('topTelegram'),
                    body_data.get('jungleNick'),
                    body_data.get('jungleTelegram'),
                    body_data.get('midNick'),
                    body_data.get('midTelegram'),
                    body_data.get('adcNick'),
                    body_data.get('adcTelegram'),
                    body_data.get('supportNick'),
                    body_data.get('supportTelegram'),
                    body_data.get('sub1Nick'),
                    body_data.get('sub1Telegram'),
                    body_data.get('sub2Nick'),
                    body_data.get('sub2Telegram')
                )
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
                new_status = body_data.get('status')
                cur.execute(
                    "UPDATE individual_players SET status = %s WHERE id = %s",
                    (new_status, player_id)
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
                cur.execute(
                    """UPDATE teams SET 
                        team_name = %s,
                        top_nick = %s, top_telegram = %s,
                        jungle_nick = %s, jungle_telegram = %s,
                        mid_nick = %s, mid_telegram = %s,
                        adc_nick = %s, adc_telegram = %s,
                        support_nick = %s, support_telegram = %s,
                        sub1_nick = %s, sub1_telegram = %s,
                        sub2_nick = %s, sub2_telegram = %s,
                        status = 'pending',
                        is_edited = true
                    WHERE id = %s""",
                    (
                        body_data.get('teamName'),
                        body_data.get('topNick'), body_data.get('topTelegram'),
                        body_data.get('jungleNick'), body_data.get('jungleTelegram'),
                        body_data.get('midNick'), body_data.get('midTelegram'),
                        body_data.get('adcNick'), body_data.get('adcTelegram'),
                        body_data.get('supportNick'), body_data.get('supportTelegram'),
                        body_data.get('sub1Nick'), body_data.get('sub1Telegram'),
                        body_data.get('sub2Nick'), body_data.get('sub2Telegram'),
                        team_id
                    )
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
            
            new_status = body_data.get('status')
            
            if new_status == 'approved':
                cur.execute(
                    "UPDATE teams SET status = %s, is_edited = false WHERE id = %s",
                    (new_status, team_id)
                )
            else:
                cur.execute(
                    "UPDATE teams SET status = %s WHERE id = %s",
                    (new_status, team_id)
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
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()