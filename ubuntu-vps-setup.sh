#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  CAI DAT TU DONG DUC VINH SOLAR TREN UBUNTU VPS + POSTGRES"
echo "=========================================================="

DB_NAME="ducvinhsolar_db"
DB_USER="ducvinh_user"
DB_PASS="DucVinhPostgres2026!"
APP_PORT=3000

echo "[1/6] Cap nhat he thong & cai dat PostgreSQL, Nginx, Curl..."
sudo apt-get update -y
sudo apt-get install -y curl git nginx postgresql postgresql-contrib build-essential

echo "[2/6] Cai dat Node.js 20 LTS & PM2..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo npm install -g pm2 tsx

echo "[3/6] Khoi tao Database & User trong PostgreSQL tren Ubuntu..."
sudo systemctl enable postgresql
sudo systemctl start postgresql

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}' SUPERUSER;"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

echo "[4/6] Tao file .env ket noi PostgreSQL..."
cat > .env <<EOF
NODE_ENV=production
PORT=${APP_PORT}
SQL_HOST=127.0.0.1
SQL_DB_NAME=${DB_NAME}
SQL_USER=${DB_USER}
SQL_PASSWORD=${DB_PASS}
SQL_ADMIN_USER=${DB_USER}
SQL_ADMIN_PASSWORD=${DB_PASS}
EOF

echo "[5/6] Cai dat thu vien, khoi tao bang PostgreSQL & Build giao dien..."
npm install
npx drizzle-kit push --config=src/db/drizzle.config.ts
npm run build

echo "[6/6] Khoi chay Server voi PM2 & cau hinh Nginx..."
pm2 delete ducvinhsolar 2>/dev/null || true
pm2 start "npx tsx server.ts" --name ducvinhsolar
pm2 save

sudo tee /etc/nginx/sites-available/ducvinhsolar >/dev/null <<EOF
server {
    listen 80;
    server_name _;

    client_max_body_size 30M;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/ducvinhsolar /etc/nginx/sites-enabled/ducvinhsolar
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo "=========================================================="
echo "  HOAN TAT! Web Duc Vinh Solar + PostgreSQL da chay tai:"
echo "  -> http://$(hostname -I | awk '{print $1}')"
echo "=========================================================="
