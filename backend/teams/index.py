import json
import os
import psycopg2
from typing import Dict, Any

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
            status_filter = params.get('status', 'approved')
            
            cur.execute(
                """SELECT id, team_name, captain_nick, captain_telegram, status, created_at,
                          top_nick, top_telegram, jungle_nick, jungle_telegram, 
                          mid_nick, mid_telegram, adc_nick, adc_telegram,
                          support_nick, support_telegram, sub1_nick, sub1_telegram,
                          sub2_nick, sub2_telegram 
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
                'sub2Telegram': t[19]
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
            
            cur.execute(
                """INSERT INTO teams (
                    team_name, captain_nick, captain_telegram,
                    top_nick, top_telegram, jungle_nick, jungle_telegram,
                    mid_nick, mid_telegram, adc_nick, adc_telegram,
                    support_nick, support_telegram, sub1_nick, sub1_telegram,
                    sub2_nick, sub2_telegram, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending')
                RETURNING id""",
                (
                    body_data.get('teamName'),
                    body_data.get('captainNick'),
                    body_data.get('captainTelegram'),
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
            team_id = body_data.get('teamId')
            new_status = body_data.get('status')
            
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