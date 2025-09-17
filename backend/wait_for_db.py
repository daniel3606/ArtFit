# backend/wait_for_db.py
import os, time, psycopg2

host = os.getenv("DB_HOST", "db")
port = int(os.getenv("DB_PORT", "5432"))
name = os.getenv("DB_NAME", "artfit")
user = os.getenv("DB_USER", "artfit")
password = os.getenv("DB_PASSWORD", "artfit")

for i in range(60):
    try:
        conn = psycopg2.connect(host=host, port=port, dbname=name, user=user, password=password)
        conn.close()
        print("DB is ready.")
        break
    except Exception as e:
        print(f"Waiting for DB... ({i+1}/60) {e}")
        time.sleep(1)
else:
    raise SystemExit("Postgres not reachable after 60s")
