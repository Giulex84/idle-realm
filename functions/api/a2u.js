const PI_API = "https://api.minepi.com/v2/payments";

export const onRequestPost = async ({ request, env }) => {

  try {

    const body = await request.json();
    console.log("BODY:", body);

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

    console.log("Creating payment...");

    const create = await fetch(PI_API,{
      method:"POST",
      headers,
      body:JSON.stringify({
        payment:{
          uid,
          amount,
          memo: memo || "Idle Realm reward",
          metadata:{ source:"idle_realm_a2u" }
        }
      })
    });

    const text = await create.text();
    console.log("PI RESPONSE:", text);

    return new Response(text,{
      status:create.status,
      headers:{ "content-type":"application/json" }
    });

  } catch(err){

    console.error("SERVER ERROR:", err);

    return new Response(JSON.stringify({
      error:"server error",
      message: err.message
    }),{ status:500 });

  }

};
