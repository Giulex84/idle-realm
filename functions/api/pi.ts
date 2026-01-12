export async function onRequest(context: any) {
  const { request, env } = context;

  const body = await request.json();
  const { action, paymentId, txid } = body;

  console.log("PI EVENT:", action, paymentId, txid);

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Key ${env.PI_API_KEY}`
  };

  if (action === "approve") {
    await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers
    });

    console.log("APPROVED:", paymentId);
  }

  if (action === "complete") {
    await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers,
      body: JSON.stringify({ txid })
    });

    console.log("COMPLETED:", paymentId);
  }

  return new Response("ok");
}
