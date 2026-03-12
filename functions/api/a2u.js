export const onRequestPost = async ({ request, env }) => {

const PI_API = "https://api.minepi.com/v2/payments"

try {

const { uid, amount } = await request.json()

const headers = {
Authorization:`Key ${env.PI_API_KEY}`,
"Content-Type":"application/json"
}

/* CREATE PAYMENT */

const create = await fetch(PI_API,{
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

/* SUBMIT */

const submit = await fetch(`${PI_API}/${paymentId}/submit`,{
method:"POST",
headers
})

const submitData = await submit.json()

const txid = submitData.transaction.txid

/* COMPLETE */

await fetch(`${PI_API}/${paymentId}/complete`,{
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
