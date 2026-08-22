/**
 * Empire Goal Form → Telegram Proxy Worker
 * 
 * This Cloudflare Worker:
 *   1. Verifies access codes (so only authorized students can use the form)
 *   2. Receives form submissions and forwards them to Telegram
 * 
 * Environment variables (set in Cloudflare dashboard):
 *   TG_BOT_TOKEN   — your Telegram bot token
 *   TG_CHAT_ID     — your personal/admin chat ID
 *   ACCESS_CODE    — the code students need to enter (change anytime from dashboard!)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Route: POST /verify — check access code
    if (request.method === 'POST' && url.pathname === '/verify') {
      try {
        const { code } = await request.json();
        if (!code) {
          return jsonResponse({ valid: false, error: 'No code provided' }, 400);
        }
        const isValid = code.trim() === (env.ACCESS_CODE || '').trim();
        return jsonResponse({ valid: isValid }, 200);
      } catch (err) {
        return jsonResponse({ valid: false, error: 'Invalid request' }, 400);
      }
    }

    // Route: POST / — submit form answers
    if (request.method === 'POST' && (url.pathname === '/' || url.pathname === '')) {
      try {
        const data = await request.json();

        // Verify access code is included with submission
        if (!data._code || data._code.trim() !== (env.ACCESS_CODE || '').trim()) {
          return jsonResponse({ error: 'Invalid access code' }, 403);
        }

        // Validate required fields
        if (!data.name || !data.goal) {
          return jsonResponse({ error: 'Missing required fields' }, 400);
        }

        // Build formatted Telegram message
        const tgUsername = data.telegram_username ? '@' + data.telegram_username : 'N/A';
        const sourceLabel = data.source === 'telegram_webapp' ? 'Telegram WebApp' : 'رابط مباشر';

        let msg = '👑 <b>إجابة جديدة — Empire Goal Form</b>\n';
        msg += '━━━━━━━━━━━━━━━━━━\n\n';
        msg += '👤 <b>الاسم:</b> ' + escapeHtml(data.name) + '\n';
        msg += '🔗 <b>Telegram:</b> ' + tgUsername + '\n';
        msg += '📍 <b>المصدر:</b> ' + sourceLabel + '\n';
        msg += '🕐 <b>الوقت:</b> ' + (data.timestamp || new Date().toISOString()) + '\n\n';
        msg += '━━━━━━━━━━━━━━━━━━\n\n';
        msg += '🎯 <b>هدفي الأساسي:</b>\n' + escapeHtml(data.goal) + '\n\n';
        msg += '💡 <b>ليه مهم:</b>\n' + escapeHtml(data.why || '—') + '\n\n';
        msg += '✨ <b>لو حققت هدفي:</b>\n' + escapeHtml(data.future || '—') + '\n\n';
        msg += '⚠️ <b>لو ما التزمتش:</b>\n' + escapeHtml(data.risk || '—') + '\n\n';
        msg += '📊 <b>مستوى الجدية:</b> ' + (data.commitment_scale || '?') + '/10\n';
        msg += '💬 <b>السبب:</b> ' + escapeHtml(data.scale_reason || '—') + '\n\n';
        msg += '🚧 <b>أكبر تحدي:</b>\n' + escapeHtml(data.obstacle || '—') + '\n\n';
        msg += '✊ <b>التزامي:</b>\n' + escapeHtml(data.commitment || '—') + '\n\n';
        msg += '☀️ <b>عادتي اليومية:</b>\n' + escapeHtml(data.habit || '—') + '\n\n';
        msg += '💌 <b>رسالة لنفسي:</b>\n' + escapeHtml(data.message || '—') + '\n\n';
        msg += '━━━━━━━━━━━━━━━━━━\n';
        msg += '🏛 Empire English Community';

        // Send to Telegram
        const tgUrl = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`;
        const tgRes = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TG_CHAT_ID,
            text: msg,
            parse_mode: 'HTML',
          }),
        });

        const tgData = await tgRes.json();

        if (tgData.ok) {
          return jsonResponse({ status: 'ok', message: 'Sent successfully' }, 200);
        } else {
          console.error('Telegram error:', tgData);
          return jsonResponse({ error: 'Telegram delivery failed' }, 502);
        }
      } catch (err) {
        console.error('Worker error:', err);
        return jsonResponse({ error: 'Internal server error' }, 500);
      }
    }

    // Any other request
    return jsonResponse({ error: 'Not found' }, 404);
  },
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}
