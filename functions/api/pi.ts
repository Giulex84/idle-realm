export async function onRequestPost({ request, env }) {
  const body = await request.json();

  const res = await fetch(
    `https://api.minepi.com/v2/payments/${body.paymentId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Key ${env.PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text = await res.text();
  return new Response(text, { status: res.status });
}
