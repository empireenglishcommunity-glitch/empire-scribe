# Empire Student Goals Form

A student-facing form for submitting a learning goal, which generates a
shareable dark/gold styled poster image and delivers it back via
Telegram.

**Live at:** https://goals.empireenglish.online (Cloudflare Pages)

**Parent project:** Empire English Community — for full cross-project
context, history, and infrastructure state, see
`empireenglishcommunity-glitch/Kiro-Master-Index` (start with its
`README.md` and `SESSION_CONTINUITY.md`).

## What's in this repo

| Path | Purpose |
|------|---------|
| `index.html` | The form itself — Telegram Mini App integration, auto-detects user ID |
| `html2img/` | Self-hosted poster-image rendering service (Node + Dockerfile), deployed as `empire-html2img` on the Hetzner server, port 3200 |
| `n8n-workflow-goal-poster.json` | Exported n8n workflow — receives the form's webhook submission, triggers poster generation, sends the result back via Telegram |

## Deploying

This repo auto-deploys `index.html` to Cloudflare Pages on push to `main`.
The `html2img/` service deploys separately via Docker on the Hetzner
server — see `Kiro-Master-Index/SESSION_CONTINUITY.md` for the current
deployment history (this project was redeployed fresh during the
2026-07-11 DNS zone migration; see that session's notes before assuming
anything about the current Cloudflare project/account).

## AI Agent Notes

See `.kiro/steering/project-rules.md` for the session protocol and
repo-specific rules before making changes here.
