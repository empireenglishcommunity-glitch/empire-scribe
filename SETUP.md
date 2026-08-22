# Empire Scribe — Setup Guide

## How It Works

```
Student fills form (index.html)
        ↓
Form POSTs answers to Cloudflare Worker
        ↓
Worker formats message & sends to Telegram Bot API (token hidden)
        ↓
You receive all answers on your Telegram
        ↓
You create the poster manually and send it back
```

No bot token exposed in the frontend. No n8n. No extra services.

---

## Deploy the Cloudflare Worker (one-time setup)

### 1. Install Wrangler (if you don't have it)

```bash
npm install -g wrangler
wrangler login
```

### 2. Deploy the worker

```bash
cd worker
wrangler deploy
```

This gives you a URL like: `https://empire-goal-form.YOUR-SUBDOMAIN.workers.dev`

### 3. Set the secrets (bot token + chat ID)

```bash
wrangler secret put TG_BOT_TOKEN
# When prompted, paste: 8677727344:AAFaWQa6ZGXt6qVkcCNOnOAoI3r9KkoVF14

wrangler secret put TG_CHAT_ID
# When prompted, paste: 8355378781
```

### 4. Update the Worker URL in index.html (if different)

In `index.html`, find this line:
```javascript
var WORKER_URL = "https://empire-goal-form.empireenglishcommunity-glitch.workers.dev";
```

Replace it with your actual worker URL from step 2.

### 5. (Optional) Add custom domain

In Cloudflare Dashboard → Workers → empire-goal-form → Settings → Triggers → Custom Domains:
- Add `goals-api.empireenglish.online` (or any subdomain you prefer)

---

## What the Admin Receives

Every time a student submits the form, you get a Telegram message like:

```
👑 إجابة جديدة — Empire Goal Form
━━━━━━━━━━━━━━━━━━

👤 الاسم: أحمد
🔗 Telegram: @ahmed_ali
📍 المصدر: رابط مباشر
🕐 الوقت: 2026-08-22T10:30:00Z

━━━━━━━━━━━━━━━━━━

🎯 هدفي الأساسي:
عايز أتكلم بطلاقة في الشغل

💡 ليه مهم:
عشان أترقى وأشتغل مع عملاء أجانب

... (all 9 answers)

━━━━━━━━━━━━━━━━━━
🏛 Empire English Community
```

---

## Files Overview

| File | Purpose |
|------|---------|
| `index.html` | The student-facing goal form (deployed to goals.empireenglish.online) |
| `worker/worker.js` | Cloudflare Worker — proxies form data to Telegram securely |
| `worker/wrangler.toml` | Worker config for deployment |
| `n8n-workflow-goal-poster.json` | DEPRECATED — no longer needed |
| `html2img/` | DEPRECATED — no longer needed |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Student submits but you don't get a message | Check worker logs: `wrangler tail` — look for errors |
| "Telegram delivery failed" in worker logs | Bot token is wrong or expired. Re-set: `wrangler secret put TG_BOT_TOKEN` |
| "Chat not found" in worker logs | Make sure you've messaged @empire_ops_eec_bot at least once |
| CORS errors in browser console | Worker already handles CORS — make sure you deployed latest version |
| Form shows "⚠️ فيه مشكلة" | Worker URL is wrong in index.html, or worker isn't deployed |

---

## Security

- ✅ Bot token is stored as a Cloudflare secret (never in code/browser)
- ✅ Chat ID is stored as a Cloudflare secret
- ✅ Worker validates required fields before forwarding
- ✅ HTML entities are escaped to prevent injection
- ✅ Google Sheets backup still works (no-cors, fire-and-forget)
