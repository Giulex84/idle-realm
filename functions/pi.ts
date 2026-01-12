export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { action, paymentId } = body;

    if (!env.PI_API_KEY) {
      return new Response("Missing PI_API_KEY", { status: 500 });
    }

    if (action === "approve") {
      const res = await fetch(
        `https://api.minepi.com/v2/payments/${paymentId}/complete`,
        {
          method: "POST",
          headers: {
            "Authorization": `Key ${env.PI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await res.text();
      return new Response(data, { status: 200 });
    }

    return new Response("Unknown action", { status: 400 });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
};
