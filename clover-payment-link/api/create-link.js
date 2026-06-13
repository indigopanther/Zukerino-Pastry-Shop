// Serverless function: creates a Clover Hosted Checkout session and returns a pay link.
// The private Clover token never reaches the browser — it lives only in Vercel env vars.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = process.env.CLOVER_API_TOKEN;
  const merchantId = process.env.CLOVER_MERCHANT_ID;
  // Production North America by default. Override in Vercel env if needed:
  //   Sandbox/testing -> https://apisandbox.dev.clover.com
  //   Europe          -> https://api.eu.clover.com
  const baseUrl = (process.env.CLOVER_BASE_URL || 'https://api.clover.com').replace(/\/+$/, '');

  if (!token || !merchantId) {
    return res.status(500).json({
      error: 'Server not configured. Set CLOVER_API_TOKEN and CLOVER_MERCHANT_ID in Vercel → Settings → Environment Variables.'
    });
  }

  // Body may arrive parsed or as a raw string depending on runtime.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const { amount, itemName, customerName, customerEmail, note } = body;

  const dollars = Number(amount);
  if (!Number.isFinite(dollars) || dollars <= 0) {
    return res.status(400).json({ error: 'Enter a valid amount greater than $0.00.' });
  }
  // Clover expects the price in cents as an integer.
  const priceCents = Math.round(dollars * 100);

  const customer = {};
  if (customerName && String(customerName).trim()) {
    const parts = String(customerName).trim().split(/\s+/);
    customer.firstName = parts[0];
    if (parts.length > 1) customer.lastName = parts.slice(1).join(' ');
  }
  if (customerEmail && String(customerEmail).trim()) {
    customer.email = String(customerEmail).trim();
  }

  const lineItem = {
    name: itemName && String(itemName).trim() ? String(itemName).trim() : 'Zukerino order',
    price: priceCents,
    unitQty: 1
  };
  if (note && String(note).trim()) lineItem.note = String(note).trim();

  const payload = {
    customer,
    shoppingCart: { lineItems: [lineItem] }
  };

  try {
    const resp = await fetch(`${baseUrl}/invoicingcheckoutservice/v1/checkouts`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-Clover-Merchant-Id': merchantId,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!resp.ok) {
      return res.status(resp.status).json({
        error:
          (data && (data.message || data.error)) ||
          `Clover rejected the request (HTTP ${resp.status}). Check the token type is "Hosted checkout" and the merchant ID is correct.`,
        status: resp.status
      });
    }

    return res.status(200).json({
      url: data.href,
      checkoutSessionId: data.checkoutSessionId,
      expiresAt: data.expirationTime, // Unix ms; link is valid ~15 minutes
      amount: dollars
    });
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach Clover: ' + err.message });
  }
};
