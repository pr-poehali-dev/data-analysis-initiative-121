import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Business: Возвращает список заявок для админ-панели. Требует пароль в заголовке X-Admin-Password.
    Args: event - dict с httpMethod, headers
          context - объект с request_id
    Returns: HTTP-ответ со списком заявок (JSON)
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': cors,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    headers = event.get('headers') or {}
    provided = headers.get('X-Admin-Password') or headers.get('x-admin-password') or ''
    expected = os.environ.get('ADMIN_PASSWORD', '')

    if not expected or provided != expected:
        return {
            'statusCode': 401,
            'headers': cors,
            'body': json.dumps({'error': 'Unauthorized'}),
        }

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, full_name, phone, email, vk, telegram, created_at "
                "FROM leads ORDER BY created_at DESC LIMIT 500"
            )
            rows = cur.fetchall()
    finally:
        conn.close()

    leads = [
        {
            'id': r[0],
            'full_name': r[1],
            'phone': r[2],
            'email': r[3],
            'vk': r[4],
            'telegram': r[5],
            'created_at': r[6].isoformat() if r[6] else None,
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'leads': leads}),
    }
