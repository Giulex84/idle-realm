export const onRequestPost = async ({ request, env }) => {

const PI_API = "https://api.minepi.com/v2/payments";

const headers = {
Authorization:`Key ${env.PI_API_KEY}`,
"Content-Type":"application/json"
};

try{

const body = await request.json();

const { uid, amount, memo } = body;

if(!uid || !amount){

return new Response(
JSON.stringify({error:"missing parameters"}),
{status:400}
);

}

/* -------------------------------- */
/* CHECK INCOMPLETE SERVER PAYMENTS */
/* -------------------------------- */

const incomplete = await fetch(
`${PI_API}/incomplete_server_payments`,
{ headers }
);

const incompleteData = await incomplete.json();

if(incomplete.ok && incompleteData.incomplete_server_payments?.length){

for(const payment of incompleteData.incomplete_server_payments){

try{

if(payment.transaction?.txid){

await fetch(`${PI_API}/${payment.identifier}/complete`,{
method:"POST",
headers,
body:JSON.stringify({
txid:payment.transaction.txid
})
});

}else{

await fetch(`${PI_API}/${payment.identifier}/cancel`,{
method:"POST",
headers
});

}

}catch(e){

console.error("cleanup error",e);

}

}

}

/* ------------ */
/* CREATE A2U */
/* ------------ */

const create = await fetch(PI_API,{
method:"POST",
headers,
body:JSON.stringify({
payment:{
uid,
amount,
memo:memo || "Idle Realm reward",
metadata:{source:"idle_realm_a2u"}
}
})
});

const createData = await create.json();

if(!create.ok){

return new Response(
JSON.stringify(createData),
{status:500}
);

}

const paymentId = createData.identifier;

/* ------------ */
/* SUBMIT */
/* ------------ */

const submit = await fetch(
`${PI_API}/${paymentId}/submit`,
{
method:"POST",
headers
}
);

const submitData = await submit.json();

if(!submit.ok){

return new Response(
JSON.stringify(submitData),
{status:500}
);

}

const txid = submitData.transaction?.txid;

if(!txid){

return new Response(
JSON.stringify({error:"missing txid"}),
{status:500}
);

}

/* ------------ */
/* COMPLETE */
/* ------------ */

const complete = await fetch(
`${PI_API}/${paymentId}/complete`,
{
method:"POST",
headers,
body:JSON.stringify({txid})
}
);

const completeData = await complete.json();

if(!complete.ok){

return new Response(
JSON.stringify(completeData),
{status:500}
);

}

return new Response(
JSON.stringify({
success:true,
paymentId,
txid
}),
{status:200}
);

}catch(err){

console.error(err);

return new Response(
JSON.stringify({error:"server error"}),
{status:500}
);

}

};
