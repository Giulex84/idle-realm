const PI_API_KEY = process.env.PI_API_KEY;

if (!PI_API_KEY) {
  throw new Error("PI_API_KEY not set");
}

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
}
