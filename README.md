# BELAL-BOTX666-MAX
2026 Advanced Messenger Chatbot by Belal

### <br>   ❖ DEPLOY_WORKFLOWS ❖
```
name: BELAL BOTX666

on:
  workflow_dispatch:
  push:
    branches: [main]
  schedule:
    - cron: "0 */6 * * *"   # প্রতি ৬ ঘণ্টায় auto restart

# একসাথে শুধু একটা Action চলবে — নতুন চালু হলে পুরানোটা cancel হবে
concurrency:
  group: bot-runner
  cancel-in-progress: true

jobs:
  bot:
    runs-on: ubuntu-latest
    timeout-minutes: 360

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'        # ✅ NEW: npm cache — install দ্রুত হবে

      - name: Install system dependencies
        run: |
          sudo apt-get update -qq
          sudo apt-get install -y ffmpeg python3 python3-pip build-essential --fix-missing || true
          sudo pip3 install yt-dlp --break-system-packages 2>/dev/null || true

      # ✅ NEW: required folders তৈরি — না থাকলে বট crash করে
      - name: Create required folders
        run: |
          mkdir -p Script/commands/cache
          mkdir -p Script/events/cache/joinGif
          mkdir -p Script/events/leaveGif
          mkdir -p languages logs tmp backup utils assets
          [ -f Script/commands/cache/data.json ] || echo '{"adminbox":{}}' > Script/commands/cache/data.json
          echo "✅ Folders ready"

      - name: Inject API keys into config.json
        run: |
          node -e "
          const fs = require('fs');
          const c = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
          const k = JSON.parse(fs.readFileSync('keys.json', 'utf-8'));
          c.APIKEYS.GROQ     = k.GROQ_KEY    || '';
          c.APIKEYS.GROQ2    = k.GROQ_KEY2   || '';
          c.APIKEYS.GROQ3    = k.GROQ_KEY3   || '';
          c.APIKEYS.GROQ4    = k.GROQ_KEY4   || '';
          c.APIKEYS.GEMINI   = k.GEMINI_KEY  || '';
          c.APIKEYS.GEMINI2  = k.GEMINI_KEY2 || '';
          c.APIKEYS.GEMINI3  = k.GEMINI_KEY3 || '';
          c.APIKEYS.GEMINI4  = k.GEMINI_KEY4 || '';
          c.APIKEYS.VOICERSS = k.VOICERSS    || '7434460c8e2f4b39b8a21ac708f21fee';
          fs.writeFileSync('config.json', JSON.stringify(c, null, 2));
          console.log('✅ API keys injected');
          "

      - name: Install npm packages
        run: |
          npm install --legacy-peer-deps
          npm rebuild canvas --update-binary 2>/dev/null || true
          # ✅ NEW: v8.0 নতুন packages
          npm install string-similarity node-schedule --save --legacy-peer-deps 2>/dev/null || true

      - name: Run Bot
        run: node index.js
        timeout-minutes: 350
        env:
          NODE_ENV: production
          TZ:       Asia/Dhaka
          # ✅ NEW: memory limit বাড়াও — বড় কমান্ডে crash কমবে
          NODE_OPTIONS: "--max-old-space-size=4096"
