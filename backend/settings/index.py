import json
import os
import psycopg2
from typing import Dict, Any

def escape_sql(value: str) -> str:
    return value.replace("'", "''")

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage tournament settings like registration open/close
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
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute("SELECT key, value FROM settings")
            settings = cur.fetchall()
            
            settings_dict = {s[0]: s[1] for s in settings}
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'settings': settings_dict}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            key = body_data.get('key')
            value = body_data.get('value')
            
            # Convert value to JSON string if it's not already a string
            if not isinstance(value, str):
                value = json.dumps(value, ensure_ascii=False)
            
            cur.execute(
                f"""
                INSERT INTO settings (key, value, updated_at) 
                VALUES ('{escape_sql(key)}', '{escape_sql(value)}', CURRENT_TIMESTAMP)
                ON CONFLICT (key) DO UPDATE 
                SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
                """
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