export async function onRequestPost({ request, env }) {
  const body = await request.json();
  const { action, paymentId } = body;

  if (action !== "approve") {
    return new Response("Invalid action", { status: 400 });
  }

  const res = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/approve`,
    {
      method: "POST",
      headers: {
        Authorization: `Key ${env.PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text = await res.text();
  return new Response(text);
}
