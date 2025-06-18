"""
Sync specified columns from one Postgres database to another, avoiding duplicate rows.

Supports SQLAlchemy asyncpg URLs (e.g. postgresql+asyncpg://...).

Usage:
    python scripts/sync_columns.py --table TABLE \
        [--columns filename,mime_type,content,uploaded_at,deleted_at] \
        [--source-url-key DB_URL_LOCAL] [--dest-url-key DB_URL_PROD] [--dry-run]
"""

import argparse
import os
import sys
from typing import List, Tuple

import psycopg2
from dotenv import load_dotenv


def _load_connection_url(key: str) -> str:
    url = os.environ.get(key)
    if not url:
        sys.exit(f"Error: environment variable {key} is not set")
    return url


def _get_connection(url: str):
    if url.startswith("postgresql+asyncpg://"):
        url = "postgresql://" + url.split("://", 1)[1]
    return psycopg2.connect(url)


def _get_all_columns(conn, table: str) -> List[str]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = %s
              AND column_name != 'id'
            ORDER BY ordinal_position
        """,
            (table,),
        )
        return [row[0] for row in cur.fetchall()]


def _fetch_rows(conn, table: str, columns: List[str]) -> List[Tuple]:
    cols_sql = ", ".join(columns)
    with conn.cursor() as cur:
        cur.execute(f"SELECT {cols_sql} FROM {table}")
        return cur.fetchall()


def _insert_rows(conn, table: str, columns: List[str], rows: List[Tuple]) -> None:
    if not rows:
        return
    cols_sql = ", ".join(columns)
    placeholders = ", ".join(["%s"] * len(columns))
    insert_sql = f"INSERT INTO {table} ({cols_sql}) VALUES ({placeholders})"
    with conn.cursor() as cur:
        cur.executemany(insert_sql, rows)
    conn.commit()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Sync columns from one Postgres database to another, skipping duplicates"
    )
    parser.add_argument("--table", "-t", required=True, help="Name of the table to sync")
    parser.add_argument(
        "--columns",
        "-c",
        help=(
            "Comma-separated list of columns to sync. "
            "If omitted, all columns except 'id' will be synced."
        ),
    )
    parser.add_argument(
        "--source-url-key",
        default="DB_URL_LOCAL",
        help="Env var name for source DB URL (default: DB_URL_LOCAL)",
    )
    parser.add_argument(
        "--dest-url-key",
        default="DB_URL_PROD",
        help="Env var name for destination DB URL (default: DB_URL_PROD)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show how many rows would be inserted but do not insert",
    )
    args = parser.parse_args()

    load_dotenv()

    src_url = _load_connection_url(args.source_url_key)
    dst_url = _load_connection_url(args.dest_url_key)

    src_conn = _get_connection(src_url)
    dst_conn = _get_connection(dst_url)

    try:
        if args.columns:
            columns = [c.strip() for c in args.columns.split(",") if c.strip()]
        else:
            print(
                f"No columns specified, syncing all columns from table '{args.table}' except 'id'"
            )
            columns = _get_all_columns(src_conn, args.table)
            if not columns:
                sys.exit(f"Error: could not fetch columns for table '{args.table}'")
            print(f"Columns to sync: {', '.join(columns)}")

        src_rows = _fetch_rows(src_conn, args.table, columns)
        dst_rows = _fetch_rows(dst_conn, args.table, columns)

        dst_set = set(dst_rows)
        to_insert = [row for row in src_rows if row not in dst_set]

        print(f"{len(src_rows)} rows in source")
        print(f"{len(dst_rows)} rows in destination")
        print(f"{len(to_insert)} new rows to insert")

        if to_insert and not args.dry_run:
            _insert_rows(dst_conn, args.table, columns, to_insert)
            print("Inserted new rows")
    finally:
        src_conn.close()
        dst_conn.close()


if __name__ == "__main__":
    main()
