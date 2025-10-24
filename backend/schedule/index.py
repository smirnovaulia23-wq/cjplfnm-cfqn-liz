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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
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
            
            cursor.execute("""
                INSERT INTO matches 
                (match_date, match_time, team1_id, team2_id, team1_name, team2_name, round, status, stream_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                body_data['match_date'],
                body_data['match_time'],
                0,  # team1_id placeholder
                0,  # team2_id placeholder
                body_data['team1_name'],
                body_data['team2_name'],
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
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()