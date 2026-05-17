import json
import os
import re
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Business: Принимает заявки с лендинга и сохраняет их в БД.
    Args: event - dict с httpMethod, body (ФИО, телефон, email, vk?, telegram?)
          context - объект с request_id
    Returns: HTTP-ответ со статусом сохранения
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': cors,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': cors,
            'body': json.dumps({'error': 'Invalid JSON'}),
        }

    full_name = (body.get('full_name') or '').strip()
    phone = (body.get('phone') or '').strip()
    email = (body.get('email') or '').strip()
    vk = (body.get('vk') or '').strip() or None
    telegram = (body.get('telegram') or '').strip() or None

    if not full_name or not phone or not email:
        return {
            'statusCode': 400,
            'headers': cors,
            'body': json.dumps({'error': 'ФИО, телефон и email обязательны'}),
        }

    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        return {
            'statusCode': 400,
            'headers': cors,
            'body': json.dumps({'error': 'Некорректный email'}),
        }

    full_name_safe = full_name.replace("'", "''")
    phone_safe = phone.replace("'", "''")
    email_safe = email.replace("'", "''")
    vk_safe = "NULL" if vk is None else "'" + vk.replace("'", "''") + "'"
    tg_safe = "NULL" if telegram is None else "'" + telegram.replace("'", "''") + "'"

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO leads (full_name, phone, email, vk, telegram) "
                f"VALUES ('{full_name_safe}', '{phone_safe}', '{email_safe}', {vk_safe}, {tg_safe}) "
                "RETURNING id"
            )
            lead_id = cur.fetchone()[0]
        conn.commit()
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True, 'id': lead_id}),
    }
