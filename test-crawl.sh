#!/bin/bash

echo "🚀 Starting dev server..."
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 10

echo "📰 Testing news crawl..."
curl -X GET \
  -H "Authorization: Bearer accvip_test_secret_key_2025" \
  http://localhost:3000/api/cron/fetch-news \
  -s | jq '.'

echo ""
echo "🛑 Stopping server..."
kill $SERVER_PID

echo "✅ Done!"
