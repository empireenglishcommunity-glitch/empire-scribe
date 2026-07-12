# eec-form — AI Agent Steering Rules

> This file is automatically loaded by Kiro and any AI agent working on
> this repository.

## Session Protocol

Full session commands (`/start`, `/status`, `/sync`, `/sync dry`,
`/checkpoint`) and standing ecosystem-wide rules live in
`empireenglishcommunity-glitch/Kiro-Master-Index/.kiro/steering/AI-AGENT-PROTOCOL.md`.
Read that file at the start of every session, before anything below.

## Project Identity

- **Project:** Empire Student Goals Form + poster generator — students submit their learning goal, get a shareable dark/gold styled poster back via Telegram.
- **Parent project:** Empire English Community
- **Repository:** `empireenglishcommunity-glitch/eec-form`
- **Live at:** https://goals.empireenglish.online (Cloudflare Pages)
- **Related:** `html2img/` in this repo is the self-hosted poster-image rendering service (Docker, port 3200) referenced in `Kiro-Master-Index/README.md`'s infrastructure table as `empire-html2img`.

## Repo-Specific Notes

- This Pages project was **redeployed fresh** on 2026-07-11 during the `empireenglish.online` DNS zone migration — the original lived under a Cloudflare account that became permanently inaccessible. See `Kiro-Master-Index/SESSION_CONTINUITY.md`'s "session 5" section before assuming anything about the current Cloudflare project/account this deploys to.
- `n8n-workflow-goal-poster.json` is the exported n8n workflow that receives the form submission webhook and triggers poster generation — keep in sync with whatever's actually imported on the live n8n instance if you change the form's submission shape.
