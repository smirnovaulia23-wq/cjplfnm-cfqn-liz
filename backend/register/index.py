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

def escape_sql(value: str) -> str:
    return value.replace("'", "''")

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
        
        cur.execute(f"""
            INSERT INTO team_registrations (
                team_name, captain_nick, captain_telegram,
                top_nick, top_telegram, jungle_nick, jungle_telegram,
                mid_nick, mid_telegram, adc_nick, adc_telegram,
                support_nick, support_telegram,
                sub1_nick, sub1_telegram, sub2_nick, sub2_telegram
            ) VALUES ('{team_name}', '{captain_nick}', '{captain_telegram}', 
                      '{top_nick}', '{top_telegram}', '{jungle_nick}', '{jungle_telegram}',
                      '{mid_nick}', '{mid_telegram}', '{adc_nick}', '{adc_telegram}',
                      '{support_nick}', '{support_telegram}',
                      '{sub1_nick}', '{sub1_telegram}', '{sub2_nick}', '{sub2_telegram}')
            RETURNING id
        """)
    elif reg_type == 'individual':
        player_nick = escape_sql(body_data.get('playerNick', ''))
        player_telegram = escape_sql(body_data.get('playerTelegram', ''))
        main_role = escape_sql(body_data.get('mainRole', ''))
        alternative_role = escape_sql(body_data.get('alternativeRole', ''))
        friend1_nick = escape_sql(body_data.get('friend1Nick', '')) if body_data.get('friend1Nick') else ''
        friend1_telegram = escape_sql(body_data.get('friend1Telegram', '')) if body_data.get('friend1Telegram') else ''
        friend2_nick = escape_sql(body_data.get('friend2Nick', '')) if body_data.get('friend2Nick') else ''
        friend2_telegram = escape_sql(body_data.get('friend2Telegram', '')) if body_data.get('friend2Telegram') else ''
        
        # Handle NULL values for optional fields
        friend1_nick_val = f"'{friend1_nick}'" if friend1_nick else 'NULL'
        friend1_telegram_val = f"'{friend1_telegram}'" if friend1_telegram else 'NULL'
        friend2_nick_val = f"'{friend2_nick}'" if friend2_nick else 'NULL'
        friend2_telegram_val = f"'{friend2_telegram}'" if friend2_telegram else 'NULL'
        
        cur.execute(f"""
            INSERT INTO individual_registrations (
                player_nick, player_telegram, main_role, alternative_role,
                friend1_nick, friend1_telegram, friend2_nick, friend2_telegram
            ) VALUES ('{player_nick}', '{player_telegram}', '{main_role}', '{alternative_role}',
                      {friend1_nick_val}, {friend1_telegram_val}, {friend2_nick_val}, {friend2_telegram_val})
            RETURNING id
        """)
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
