export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  if (request.method === "GET") {
    return new Response("PI FUNCTION OK", { status: 200 });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!env.PI_API_KEY) {
    return new Response("NO_API_KEY", { status: 500 });
  }

  const body = await request.json();

  const res = await fetch(
    `https://api.minepi.com/v2/payments/${body.paymentId}/complete`,
    {
      method: "POST",
      headers: {
        "Authorization": `Key ${env.PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text = await res.text();
  return new Response(text, { status: res.status });
};
