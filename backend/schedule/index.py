'''
Business: Manage tournament match schedule - get all matches, create/update matches
Args: event with httpMethod, body, queryStringParameters
Returns: HTTP response with matches data or operation result
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {})
            check_published = query_params.get('check_published')
            
            if check_published == 'true':
                cursor.execute("SELECT value FROM settings WHERE key = 'schedule_published'")
                setting = cursor.fetchone()
                published = setting['value'] == 'true' if setting else False
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'published': published}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("SELECT value FROM settings WHERE key = 'schedule_published'")
            setting = cursor.fetchone()
            published = setting['value'] == 'true' if setting else False
            
            headers = event.get('headers', {})
            admin_token = headers.get('X-Admin-Token', headers.get('x-admin-token', ''))
            is_admin = False
            
            if admin_token:
                cursor.execute("SELECT id, role FROM admin_users WHERE session_token = %s", (admin_token,))
                admin = cursor.fetchone()
                is_admin = admin is not None
            
            if not published and not is_admin:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([]),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                SELECT 
                    id, match_date, match_time, 
                    team1_id, team2_id, team1_name, team2_name,
                    status, winner_team_id, score_team1, score_team2, round, stream_url
                FROM matches 
                ORDER BY match_date ASC, match_time ASC
            """)
            matches = cursor.fetchall()
            
            matches_list = []
            for match in matches:
                matches_list.append({
                    'id': match['id'],
                    'match_date': str(match['match_date']),
                    'match_time': str(match['match_time']),
                    'team1_name': match['team1_name'],
                    'team2_name': match['team2_name'],
                    'status': match['status'],
                    'winner_team_id': match['winner_team_id'],
                    'score_team1': match['score_team1'],
                    'score_team2': match['score_team2'],
                    'round': match['round'],
                    'stream_url': match['stream_url']
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(matches_list),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            headers = event.get('headers', {})
            admin_token = headers.get('X-Admin-Token', headers.get('x-admin-token', ''))
            
            if not admin_token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            cursor.execute("SELECT id, role FROM admin_users WHERE session_token = %s", (admin_token,))
            admin = cursor.fetchone()
            
            if not admin:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid token'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            team1_name = body_data['team1_name']
            team2_name = body_data['team2_name']
            
            cursor.execute("SELECT id FROM schedule_teams WHERE name = %s", (team1_name,))
            team1 = cursor.fetchone()
            team1_id = team1['id'] if team1 else None
            
            if not team1_id:
                cursor.execute("INSERT INTO schedule_teams (name) VALUES (%s) RETURNING id", (team1_name,))
                team1_id = cursor.fetchone()['id']
            
            cursor.execute("SELECT id FROM schedule_teams WHERE name = %s", (team2_name,))
            team2 = cursor.fetchone()
            team2_id = team2['id'] if team2 else None
            
            if not team2_id:
                cursor.execute("INSERT INTO schedule_teams (name) VALUES (%s) RETURNING id", (team2_name,))
                team2_id = cursor.fetchone()['id']
            
            cursor.execute("""
                INSERT INTO matches 
                (match_date, match_time, team1_id, team2_id, team1_name, team2_name, round, status, stream_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                body_data['match_date'],
                body_data['match_time'],
                team1_id,
                team2_id,
                team1_name,
                team2_name,
                body_data['round'],
                body_data.get('status', 'waiting'),
                body_data.get('stream_url', '')
            ))
            
            match_id = cursor.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': match_id, 'message': 'Match created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            headers = event.get('headers', {})
            admin_token = headers.get('X-Admin-Token', headers.get('x-admin-token', ''))
            
            if not admin_token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            cursor.execute("SELECT id, role FROM admin_users WHERE session_token = %s", (admin_token,))
            admin = cursor.fetchone()
            
            if not admin:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid token'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            if 'publish_schedule' in body_data:
                publish = body_data['publish_schedule']
                cursor.execute("""
                    UPDATE settings 
                    SET value = %s 
                    WHERE key = 'schedule_published'
                """, (str(publish).lower(),))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Schedule publication status updated'}),
                    'isBase64Encoded': False
                }
            
            match_id = body_data.get('id')
            
            cursor.execute("""
                UPDATE matches 
                SET status = %s, winner_team_id = %s, score_team1 = %s, score_team2 = %s, stream_url = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                body_data.get('status'),
                body_data.get('winner_team_id'),
                body_data.get('score_team1'),
                body_data.get('score_team2'),
                body_data.get('stream_url', ''),
                match_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Match updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            headers = event.get('headers', {})
            admin_token = headers.get('X-Admin-Token', headers.get('x-admin-token', ''))
            
            if not admin_token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            cursor.execute("SELECT id, role FROM admin_users WHERE session_token = %s", (admin_token,))
            admin = cursor.fetchone()
            
            if not admin:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid token'})
                }
            
            query_params = event.get('queryStringParameters', {})
            match_id = query_params.get('id')
            clear_all = query_params.get('clear_all')
            
            if clear_all == 'true':
                cursor.execute("DELETE FROM matches")
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'All matches cleared'}),
                    'isBase64Encoded': False
                }
            
            if not match_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Match ID required'})
                }
            
            cursor.execute("DELETE FROM matches WHERE id = %s", (match_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Match deleted'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()