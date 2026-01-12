export interface Env {
  PI_API_KEY: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  });

async function piCall(env: Env, path: string, body?: any) {
  const res = await fetch(`https://api.minepi.com/v2${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${env.PI_API_KEY}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();
  if (!res.ok) return { ok: false, data };
  return { ok: true, data };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json();

  if (body.action === "approve") {
    const r = await piCall(env, `/payments/${body.paymentId}/approve`);
    return json(r, r.ok ? 200 : 500);
  }

  if (body.action === "complete") {
    const r = await piCall(env, `/payments/${body.paymentId}/complete`, {
      txid: body.txid
    });
    return json(r, r.ok ? 200 : 500);
  }

  return json({ ok: false, message: "Invalid action" }, 400);
};
