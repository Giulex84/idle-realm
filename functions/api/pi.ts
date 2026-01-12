export async function onRequest(context: any) {
  const { request, env } = context;
  const body = await request.json();

  const PI_API_KEY = env.PI_API_KEY;
  if (!PI_API_KEY) {
    return new Response("Missing PI_API_KEY", { status: 500 });
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Key ${PI_API_KEY}`
  };

  // APPROVE
  if (body.action === "approve") {
    const res = await fetch(
      `https://api.minepi.com/v2/payments/${body.paymentId}/approve`,
      { method: "POST", headers }
    );
    return new Response("approved");
  }

  // COMPLETE
  if (body.action === "complete") {
    const res = await fetch(
      `https://api.minepi.com/v2/payments/${body.paymentId}/complete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ txid: body.txid })
      }
    );
    return new Response("completed");
  }

  return new Response("invalid action", { status: 400 });
}
