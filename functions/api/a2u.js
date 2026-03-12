export const onRequestPost = async ({ request, env }) => {

const API = "https://api.minepi.com/v2"
const headers = {
Authorization: `Key ${env.PI_API_KEY}`,
"Content-Type":"application/json"
}

try {

/* STEP 1 — CLEAN ONGOING PAYMENTS */

const pending = await fetch(`${API}/payments/incomplete_server_payments`,{
headers
})

const pendingData = await pending.json()

if(pendingData.incomplete_server_payments?.length){

for(const p of pendingData.incomplete_server_payments){

await fetch(`${API}/payments/${p.identifier}/cancel`,{
method:"POST",
headers
})

}

}

/* STEP 2 — CREATE NEW PAYMENT */

const { uid, amount } = await request.json()

const create = await fetch(`${API}/payments`,{
method:"POST",
headers,
body:JSON.stringify({
payment:{
uid,
amount,
memo:"Idle Realm reward",
metadata:{source:"idle_realm"}
}
})
})

const payment = await create.json()

const paymentId = payment.identifier

/* STEP 3 — SUBMIT */

const submit = await fetch(`${API}/payments/${paymentId}/submit`,{
method:"POST",
headers
})

const submitData = await submit.json()

const txid = submitData.transaction.txid

/* STEP 4 — COMPLETE */

await fetch(`${API}/payments/${paymentId}/complete`,{
method:"POST",
headers,
body:JSON.stringify({txid})
})

return new Response(JSON.stringify({
success:true,
txid
}))

}catch(e){

console.error(e)

return new Response(JSON.stringify({
error:"A2U failed"
}),{status:500})

}

}
