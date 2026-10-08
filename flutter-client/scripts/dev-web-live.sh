#!/usr/bin/env bash
# 热重载开发模式：改 Dart 代码即时生效，但首次启动需编译 1-2 分钟。
set -e
cd "$(dirname "$0")/.."

export FLUTTER_STORAGE_BASE_URL="${FLUTTER_STORAGE_BASE_URL:-https://storage.flutter-io.cn}"
export PUB_HOSTED_URL="${PUB_HOSTED_URL:-https://pub.flutter-io.cn}"
export PATH="$PWD/../.toolchain/flutter/bin:$PATH"

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

exec flutter run -d web-server --web-port "$PORT" --web-hostname "$HOST" \
  --dart-define=API_ENV=mock --dart-define=DEV_AUTO_LOGIN=1
