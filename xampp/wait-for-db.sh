#!/bin/bash
set -e

host="${MYSQL_HOST:-db}"
port="${MYSQL_PORT:-3306}"

echo "⏳ Waiting for MySQL to be ready at $host:$port..."

# Wait until the TCP port is open
until nc -z "$host" "$port"; do
  echo "MySQL not ready yet... retrying in 3s"
  sleep 3
done

echo "✅ MySQL port is open! Starting Apache..."
exec apache2-foreground
