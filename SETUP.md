# Empire Scribe — Setup Guide

## How It Works (Updated Flow)

```
Student fills form (index.html)
        ↓
Form POSTs answers to n8n webhook
        ↓
n8n formats all answers into a clean message
        ↓
Message is sent to YOUR Telegram (admin)
        ↓
You create the poster manually and send it back
```

No more HTML→Image service needed. No more broken poster pipeline.

---

## What You Need To Configure in n8n

### 1. Import the Workflow

1. Open your n8n instance (e.g. `https://bot.empireenglish.online`)
2. Go to **Workflows → Import from File**
3. Upload `n8n-workflow-goal-poster.json`
4. The workflow will appear as **"Empire Goal Form → Telegram Admin"**

### 2. Set Up Telegram Bot Credentials

1. In n8n, go to **Settings → Credentials**
2. Create a new **Telegram API** credential named `Empire Bot`
3. Paste your bot token (get one from [@BotFather](https://t.me/BotFather) if you don't have one)

### 3. Set Your Admin Chat ID

The workflow sends all student answers to your personal Telegram (or a group).

**To find your chat ID:**
- Message [@userinfobot](https://t.me/userinfobot) on Telegram — it will reply with your numeric ID
- Or use [@RawDataBot](https://t.me/RawDataBot)

**Then in n8n:**

Option A — Environment Variable (recommended):
- Set `EMPIRE_ADMIN_CHAT_ID` in your n8n environment (docker-compose, .env, etc.)

Option B — Hardcode in the workflow:
- Open the **"Send to Admin Telegram"** node
- Replace `{{ $env.EMPIRE_ADMIN_CHAT_ID }}` with your numeric chat ID (e.g. `123456789`)

### 4. Activate the Workflow

- Open the workflow in n8n
- Toggle the **Active** switch ON (top right)
- The webhook URL will be: `https://bot.empireenglish.online/webhook/goal-form`

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
| `n8n-workflow-goal-poster.json` | n8n workflow — import this into your n8n |
| `html2img/` | OLD poster image service — no longer needed, can be removed |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Student submits but you don't get a message | Check workflow is **active** in n8n. Check the n8n execution log for errors. |
| "Unauthorized" error in n8n | Bot token is wrong or expired. Regenerate from @BotFather. |
| "Chat not found" error | Your chat ID is wrong. Make sure you've messaged your bot at least once (bots can't initiate conversations). |
| Form shows "⚠️ فيه مشكلة" | The n8n webhook URL isn't reachable. Check that `https://bot.empireenglish.online/webhook/goal-form` is up. |

---

## Optional: Remove html2img

The `html2img/` folder contains the old Puppeteer-based poster generation service. It's no longer used in this flow. You can safely delete it or keep it for future use.
