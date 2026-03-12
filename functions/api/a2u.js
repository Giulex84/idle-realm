const PI_API = "https://api.minepi.com/v2/payments"

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  })
}

async function safeJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { error: text }
  }
}

async function fetchWithTimeout(url, options = {}, timeout = 8000) {

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {

    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    })

    clearTimeout(id)
    return res

  } catch (err) {

    clearTimeout(id)
    throw err

  }

}

export const onRequestPost = async ({ request, env }) => {

  try {

    const body = await request.json()

    const { uid, amount, memo } = body

    if (!uid || !amount) {
      return json({ error: "missing parameters" }, 400)
    }

    const headers = {
      Authorization: `Key ${env.PI_API_KEY}`,
      "Content-Type": "application/json"
    }

    /* CLEANUP ONGOING PAYMENTS */

    const incomplete = await fetchWithTimeout(
      `${PI_API}/incomplete_server_payments`,
      { headers }
    )

    const incompleteData = await safeJson(incomplete)

    if (
      incomplete.ok &&
      incompleteData.incomplete_server_payments?.length
    ) {

      for (const payment of incompleteData.incomplete_server_payments) {

        try {

          if (payment.transaction?.txid) {

            await fetchWithTimeout(
              `${PI_API}/${payment.identifier}/complete`,
              {
                method: "POST",
                headers,
                body: JSON.stringify({
                  txid: payment.transaction.txid
                })
              }
            )

          } else {

            await fetchWithTimeout(
              `${PI_API}/${payment.identifier}/cancel`,
              {
                method: "POST",
                headers
              }
            )

          }

        } catch (e) {

          console.error("cleanup error", e)

        }

      }

    }

    /* CREATE PAYMENT */

    const create = await fetchWithTimeout(PI_API, {
      method: "POST",
      headers,
      body: JSON.stringify({
        payment: {
          uid,
          amount,
          memo: memo || "Idle Realm reward",
          metadata: { source: "idle_realm_a2u" }
        }
      })
    })

    const createData = await safeJson(create)

    if (!create.ok) {

      console.error("CREATE ERROR", createData)

      return json(createData, 500)

    }

    const paymentId = createData.identifier

    /* SUBMIT TRANSACTION */

    const submit = await fetchWithTimeout(
      `${PI_API}/${paymentId}/submit_transaction`,
      {
        method: "POST",
        headers
      }
    )

    const submitData = await safeJson(submit)

    if (!submit.ok) {

      console.error("SUBMIT ERROR", submitData)

      return json(submitData, 500)

    }

    const txid = submitData.transaction?.txid

    if (!txid) {
      return json({ error: "missing txid" }, 500)
    }

    /* COMPLETE */

    const complete = await fetchWithTimeout(
      `${PI_API}/${paymentId}/complete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ txid })
      }
    )

    const completeData = await safeJson(complete)

    if (!complete.ok) {

      console.error("COMPLETE ERROR", completeData)

      return json(completeData, 500)

    }

    return json({
      success: true,
      paymentId,
      txid
    })

  } catch (err) {

    console.error("SERVER ERROR", err)

    return json({ error: "server error" }, 500)

  }

}
