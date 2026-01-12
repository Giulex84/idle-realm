export async function onRequestPost({ request, env }) {
  const body = await request.json();
  const { action, paymentId, txid } = body;

  const key = env.PI_API_KEY;
  if (!key) {
    return new Response("NO KEY", { status: 500 });
  }

  if (action === "approve") {
    const r = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: { Authorization: `Key ${key}` }
      }
    );
    return new Response("APPROVE " + r.status);
  }

  if (action === "complete") {
    const r = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid })
      }
    );
    return new Response("COMPLETE " + r.status);
  }

  return new Response("BAD ACTION", { status: 400 });
}
