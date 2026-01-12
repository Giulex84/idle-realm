// functions/pi.ts
export async function onRequestPost({ request, env }) {
  let body: any;

  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { action, paymentId, txid } = body;
  const PI_API_KEY = env.PI_API_KEY;

  if (!PI_API_KEY) {
    return new Response("PI_API_KEY not set", { status: 500 });
  }

  if (!paymentId) {
    return new Response("paymentId missing", { status: 400 });
  }

  const headers: HeadersInit = {
    Authorization: `Key ${PI_API_KEY}`,
    "Content-Type": "application/json"
  };

  try {
    // STEP 1 — APPROVE PAYMENT (entro 60s)
    if (action === "approve") {
      const res = await fetch(
        `https://api.minepi.com/v2/payments/${paymentId}/approve`,
        {
          method: "POST",
          headers
        }
      );

      if (!res.ok) {
        const text = await res.text();
        return new Response(
          "Approve failed: " + text,
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, step: "approved" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // STEP 2 — COMPLETE PAYMENT
    if (action === "complete") {
      if (!txid) {
        return new Response("txid missing", { status: 400 });
      }

      const res = await fetch(
        `https://api.minepi.com/v2/payments/${paymentId}/complete`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ txid })
        }
      );

      if (!res.ok) {
        const text = await res.text();
        return new Response(
          "Complete failed: " + text,
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, step: "completed" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("Invalid action", { status: 400 });

  } catch (err: any) {
    return new Response(
      "Server error: " + err.message,
      { status: 500 }
    );
  }
}
