export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  // 1) Test semplice da browser: GET /api/pi?ping=1
  if (request.method === "GET" && url.searchParams.get("ping") === "1") {
    return new Response("PI FUNCTION OK", { status: 200 });
  }

  // 2) POST /api/pi (usato dal pagamento)
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { action, paymentId, txid } = body;

  const key = env.PI_API_KEY;
  if (!key) return new Response("NO_KEY", { status: 500 });
  if (!paymentId) return new Response("NO_PAYMENT_ID", { status: 400 });

  // APPROVE
  if (action === "approve") {
    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { Authorization: `Key ${key}` }
    });
    const text = await r.text();
    return new Response(`APPROVE_${r.status}: ${text}`, { status: 200 });
  }

  // COMPLETE
  if (action === "complete") {
    if (!txid) return new Response("NO_TXID", { status: 400 });

    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });
    const text = await r.text();
    return new Response(`COMPLETE_${r.status}: ${text}`, { status: 200 });
  }

  return new Response("BAD_ACTION", { status: 400 });
}
