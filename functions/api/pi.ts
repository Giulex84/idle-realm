export interface Env {
  PI_API_KEY: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  });

async function piCall(
  env: Env,
  path: string,
  method: "POST" | "GET" = "POST",
  body?: any
) {
  try {

    const res = await fetch(`https://api.minepi.com/v2${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${env.PI_API_KEY}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    let data: any = null;

    try {
      data = await res.json();
    } catch {
      data = { error: "Invalid JSON response from Pi API" };
    }

    if (!res.ok) return { ok: false, data };

    return { ok: true, data };

  } catch (err) {

    console.error("Pi API call failed", err);

    return {
      ok: false,
      data: { error: "Pi API request failed" }
    };

  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {

  try {

    const body = await request.json();

    const { action, paymentId, txid } = body;

    if (!action || !paymentId) {
      return json(
        { ok: false, message: "Missing action or paymentId" },
        400
      );
    }

    /* -------------------- */
    /* APPROVE PAYMENT U2A  */
    /* -------------------- */

    if (action === "approve") {

      const r = await piCall(
        env,
        `/payments/${paymentId}/approve`
      );

      return json(r, r.ok ? 200 : 500);

    }

    /* -------------------- */
    /* COMPLETE PAYMENT U2A */
    /* -------------------- */

    if (action === "complete") {

      if (!txid) {
        return json(
          { ok: false, message: "Missing txid" },
          400
        );
      }

      const r = await piCall(
        env,
        `/payments/${paymentId}/complete`,
        "POST",
        { txid }
      );

      return json(r, r.ok ? 200 : 500);

    }

    /* -------------------- */
    /* CANCEL PAYMENT       */
    /* -------------------- */

    if (action === "cancel") {

      const r = await piCall(
        env,
        `/payments/${paymentId}/cancel`
      );

      return json(r, r.ok ? 200 : 500);

    }

    return json(
      { ok: false, message: "Invalid action" },
      400
    );

  } catch (err) {

    console.error(err);

    return json(
      { ok: false, message: "Server error" },
      500
    );

  }

};
