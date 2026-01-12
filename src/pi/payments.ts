declare const Pi: any;

export function payWithPi() {
  Pi.createPayment(
    {
      amount: 1,
      memo: "Idle Realm test payment",
      metadata: { item: "test_1" }
    },
    {
      onReadyForServerApproval: async (paymentId: string) => {
        await fetch("/api/pi/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },

      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        await fetch("/api/pi/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
      },

      onCancel: () => {
        console.log("Payment cancelled");
      },

      onError: (e: any) => {
        console.error(e);
      }
    }
  );
}
