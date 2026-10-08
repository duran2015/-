#!/usr/bin/env bash
# 预览入口：直接服务 build/web 静态产物（秒开，无编译等待）。
# 修改代码后需要重新构建：flutter build web --release \
#   --dart-define=API_ENV=mock --dart-define=DEV_AUTO_LOGIN=1
# 需要热重载调试时改用 scripts/dev-web-live.sh（flutter run，首启需编译 1-2 分钟）。
set -e
cd "$(dirname "$0")/.."

PORT="${PORT:-3000}"
HOST="${HOST:-0.0.0.0}"
while [ $# -gt 0 ]; do
  case "$1" in
    --port|-p) PORT="$2"; shift 2 ;;
    --port=*)  PORT="${1#*=}"; shift ;;
    --host|-H) HOST="$2"; shift 2 ;;
    --host=*)  HOST="${1#*=}"; shift ;;
    *) shift ;;
  esac
done

if [ ! -f build/web/index.html ]; then
  echo "build/web 不存在，请先运行 flutter build web --release" >&2
  exit 1
fi

exec python3 -m http.server "$PORT" --bind "$HOST" --directory build/web
