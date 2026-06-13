# Zukerino Payment Links — Setup Guide

This tool gives staff a simple web page: type the price, get a Clover payment link, and send it to the customer while they're on the phone. The customer pays by card on a secure Clover page — no card numbers ever touch you or this app.

There are three one-time setup steps, then daily use. Budget about 15 minutes.

---

## Part 1 — Get your Clover API keys (one time)

You need two things from Clover: a **private API token** and your **merchant ID**. Both come from the same screen.

1. Go to **clover.com** and log in with the Clover account Zukerino pays for (the owner/admin login).
2. In the top-right, click **Settings** → **View all settings**.
3. Scroll to the **Ecommerce** section and click **Ecommerce API Tokens**.
4. A **Two-Factor Authentication Required** pop-up will appear the first time. Follow the prompts to turn on 2FA (you'll confirm a code by text or email). This is required before Clover will show any tokens.
5. Go back to **Settings → View all settings → Ecommerce → Ecommerce API Tokens**. Click **Get Started**, then **Allow** when it asks for location (Clover uses this for fraud protection).
6. Click **Create New Token**.
7. For **Integration type**, choose **Hosted checkout**. *(This is important — a token created as "iFrame" or "API" will be rejected by this tool.)*
8. Click **Create Token**.

Clover now shows you:

- a **Private token** — a long secret string, and
- your **Merchant ID** — a shorter code right next to it.

Copy both somewhere safe for the next step. Treat the private token like a password — anyone with it can create charges on your account.

> **If you don't see "Ecommerce API Tokens":** your plan may not have online/card-not-present payments turned on yet. Call Clover support or your merchant rep and ask them to **enable Ecommerce / online payments (Hosted Checkout)** for your account, then come back to step 3.
>
> **Note:** Clover allows only **one** Ecommerce API token per account. If one already exists for another system you use, don't delete it without checking — that could break the other system.

---

## Part 2 — Put the keys into Vercel

In your Vercel project, go to **Settings → Environment Variables** and add these three. The names must match **exactly**:

| Name | Value | Required |
|------|-------|----------|
| `CLOVER_API_TOKEN` | the **Private token** from Part 1 | Yes |
| `CLOVER_MERCHANT_ID` | the **Merchant ID** from Part 1 | Yes |
| `CLOVER_BASE_URL` | leave this one out for live payments | No |

> You mentioned you already added a value to Vercel env. Just make sure the names are spelled exactly `CLOVER_API_TOKEN` and `CLOVER_MERCHANT_ID` — if you used different names, either rename them or tell me and I'll match the code to your names.
>
> `CLOVER_BASE_URL` only matters for testing: set it to `https://apisandbox.dev.clover.com` if you're using a **sandbox** token, or leave it unset for real payments (defaults to `https://api.clover.com`).

After adding or changing env vars, **redeploy** so they take effect (Vercel → Deployments → ⋯ → Redeploy).

---

## Part 3 — Deploy the app

The project lives in the `clover-payment-link` folder. Pick whichever is easiest:

**Option A — Vercel CLI (fastest):**
```bash
cd clover-payment-link
npx vercel        # first run links/creates the project
npx vercel --prod # publishes the live URL
```

**Option B — Git:** push the `clover-payment-link` folder to a GitHub repo and import it at vercel.com/new. Vercel auto-detects the setup (static page + `/api` function) — no build settings needed.

That's it. Vercel gives you a URL like `https://zukerino-pay.vercel.app`. Bookmark it on the shop's phone/computer.

---

## Daily use

1. Open the bookmarked page.
2. Type the **amount** (the price you'd quote on the phone). The other fields are optional — adding the customer's email sends them a receipt.
3. Tap **Generate payment link**.
4. **Copy** it, or tap **Text it** to send by SMS, and read/send it to the customer.
5. They pay on Clover's page. The payment shows up in your normal Clover dashboard.

The link is valid for **15 minutes** — designed for paying right away on the call. If it expires, just generate a new one.

---

## Troubleshooting

- **"Clover rejected the request"** → the token isn't a **Hosted checkout** token, or the merchant ID is wrong. Recreate the token with the correct integration type (Part 1, step 7).
- **"Server not configured"** → the env vars aren't set, or were added after the last deploy. Check the names and **redeploy**.
- **Payments don't appear in Clover** → confirm `CLOVER_BASE_URL` isn't pointed at sandbox; live payments need it unset (or `https://api.clover.com`).
- **Need a longer-lived link** (customer pays hours later) → Clover's built-in **Virtual Terminal → Invoicing** emails a link that lasts for days. That's a no-code feature in your Clover dashboard and a better fit for delayed payment.
