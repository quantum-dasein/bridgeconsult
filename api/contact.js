// Vercel serverless function: forwards contact form submissions to Telegram.
// Required env vars (Vercel → Project → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — token from @BotFather (never commit it)
//   TELEGRAM_CHAT_ID   — one or more chat ids, comma-separated

const escapeHtml = (s) =>
    String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIds = (process.env.TELEGRAM_CHAT_ID || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!token || chatIds.length === 0) {
        return res.status(500).json({ ok: false, error: 'Telegram is not configured' });
    }

    let body = req.body || {};
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const name = String(body.name || '').trim().slice(0, 200);
    const email = String(body.email || '').trim().slice(0, 200);
    const message = String(body.message || '').trim().slice(0, 3000);
    const page = String(body.page || '').slice(0, 300);

    if (!name || !email || !message) {
        return res.status(400).json({ ok: false, error: 'Missing fields' });
    }

    const text =
        '<b>Новая заявка с сайта bridgeconsult.uz</b>\n\n' +
        `<b>Имя:</b> ${escapeHtml(name)}\n` +
        `<b>Email:</b> ${escapeHtml(email)}\n\n` +
        `${escapeHtml(message)}` +
        (page ? `\n\n<i>${escapeHtml(page)}</i>` : '');

    const results = await Promise.allSettled(
        chatIds.map((chatId) =>
            fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
            }).then((r) => r.ok)
        )
    );

    const delivered = results.some((r) => r.status === 'fulfilled' && r.value);
    return res.status(delivered ? 200 : 502).json({ ok: delivered });
};
