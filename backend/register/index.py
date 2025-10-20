'''
Business: Save tournament registration (team or individual) to database
Args: event - dict with httpMethod, body containing registration data
      context - object with request_id attribute
Returns: HTTP response with success or error message
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    reg_type = body_data.get('type')
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if reg_type == 'team':
        cur.execute("""
            INSERT INTO team_registrations (
                team_name, captain_nick, captain_telegram,
                top_nick, top_telegram, jungle_nick, jungle_telegram,
                mid_nick, mid_telegram, adc_nick, adc_telegram,
                support_nick, support_telegram,
                sub1_nick, sub1_telegram, sub2_nick, sub2_telegram
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
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
        ))
    elif reg_type == 'individual':
        cur.execute("""
            INSERT INTO individual_registrations (
                player_nick, player_telegram, main_role, alternative_role,
                friend1_nick, friend1_telegram, friend2_nick, friend2_telegram
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            body_data.get('playerNick'),
            body_data.get('playerTelegram'),
            body_data.get('mainRole'),
            body_data.get('alternativeRole'),
            body_data.get('friend1Nick'),
            body_data.get('friend1Telegram'),
            body_data.get('friend2Nick'),
            body_data.get('friend2Telegram')
        ))
    else:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid registration type'}),
            'isBase64Encoded': False
        }
    
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'id': result['id'],
            'message': 'Регистрация успешно сохранена'
        }),
        'isBase64Encoded': False
    }
