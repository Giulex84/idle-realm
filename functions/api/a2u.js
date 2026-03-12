const PI_API = "https://api.minepi.com/v2/payments";

export const onRequestPost = async ({ request, env }) => {

  try {

    const body = await request.json();
    const { uid, amount, memo } = body;

    if (!uid || !amount) {
      return new Response(JSON.stringify({
        error: "missing parameters"
      }), { status: 400 });
    }

    const headers = {
      Authorization: `Key ${env.PI_API_KEY}`,
      "Content-Type": "application/json"
    };

    /* CREATE */

    const create = await fetch(PI_API, {
      method: "POST",
      headers,
      body: JSON.stringify({
        payment: {
          uid: uid,
          amount: amount,
          memo: memo || "Idle Realm reward",
          metadata: { source: "idle_realm_a2u" }
        }
      })
    });

    const createData = await create.json();

    if (!create.ok) {
      return new Response(JSON.stringify(createData), { status: 500 });
    }

    const paymentId = createData.identifier;

    /* APPROVE */

    const approve = await fetch(`${PI_API}/${paymentId}/approve`, {
      method: "POST",
      headers
    });

    const approveData = await approve.json();

    if (!approve.ok) {
      return new Response(JSON.stringify(approveData), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      paymentId
    }), { status: 200 });

  } catch (err) {

    console.error(err);

    return new Response(JSON.stringify({
      error: "server error"
    }), { status: 500 });

  }

};
