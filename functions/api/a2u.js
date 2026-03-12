export const onRequestPost = async ({ request, env }) => {

const PI_API = "https://api.minepi.com/v2/payments";

try {

const body = await request.json();

const { uid, amount, memo } = body;

if (!uid || !amount) {

return new Response(
JSON.stringify({ error:"missing parameters" }),
{ status:400 }
);

}

const headers = {
Authorization:`Key ${env.PI_API_KEY}`,
"Content-Type":"application/json"
};

/* CREATE PAYMENT (A2U) */

const create = await fetch(PI_API,{
method:"POST",
headers,
body:JSON.stringify({
payment:{
uid:uid,
amount:amount,
memo:memo || "Idle Realm reward",
metadata:{source:"idle_realm_a2u"}
}
})
});

const createData = await create.json();

if(!create.ok){

return new Response(
JSON.stringify(createData),
{ status:500 }
);

}

const paymentId = createData.identifier;

/* SUBMIT PAYMENT */

const submit = await fetch(`${PI_API}/${paymentId}/submit`,{
method:"POST",
headers
});

const submitData = await submit.json();

if(!submit.ok){

return new Response(
JSON.stringify(submitData),
{ status:500 }
);

}

const txid = submitData.transaction.txid;

/* COMPLETE PAYMENT */

const complete = await fetch(`${PI_API}/${paymentId}/complete`,{
method:"POST",
headers,
body:JSON.stringify({ txid })
});

const completeData = await complete.json();

if(!complete.ok){

return new Response(
JSON.stringify(completeData),
{ status:500 }
);

}

return new Response(
JSON.stringify({
success:true,
paymentId,
txid
}),
{ status:200 }
);

}catch(err){

console.error(err);

return new Response(
JSON.stringify({ error:"server error" }),
{ status:500 }
);

}

};
