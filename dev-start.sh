# MAC AND LINUX

#!/usr/bin/env bash
set -euo pipefail

# 1) Ensure .env exists in repo root
if [ ! -f .env ]; then
  echo ".env not found at repo root. Copy .env.example to .env and edit."
  exit 1
fi

# Export root .env to environment for child processes
export $(grep -v '^#' .env | xargs)

# create backend data dir & file if missing
mkdir -p backend/data
touch backend/data/dev.db

# Start backend
( cd backend && ./gradlew -q bootRun ) &
BACKEND_PID=$!
echo "Started backend (pid: $BACKEND_PID)"

# Start frontend (CRA) using root .env for REACT_APP_ vars if you like.
# For CRA, frontend/.env.local is auto-loaded. We'll copy REACT_ vars there (safe for dev).
cp frontend/.env.example frontend/.env.local 2>/dev/null || true
# If root .env has REACT_APP_ entries, overwrite frontend/.env.local with them:
grep '^REACT_APP_' .env 2>/dev/null > /dev/null && grep '^REACT_APP_' .env > frontend/.env.local || true

( cd frontend && npm start )

# On exit, kill backend
kill $BACKEND_PID
