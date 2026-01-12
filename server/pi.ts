// server/pi.ts

const PI_API_KEY = process.env.PI_API_KEY;

if (!PI_API_KEY) {
  throw new Error("PI_API_KEY not set");
}

/**
 * Approva un pagamento Pi
 * Deve essere chiamato ENTRO 60s
 */
export async function approvePayment(paymentId: string) {
  const res = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/approve`,
    {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`
      }
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Approve failed: " + text);
  }

  return true;
}

/**
 * Completa un pagamento Pi
 * Chiude definitivamente la transazione
 */
export async function completePayment(
  paymentId: string,
  txid: string
) {
  const res = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Complete failed: " + text);
  }

  return true;
}
