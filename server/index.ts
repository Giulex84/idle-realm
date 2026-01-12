import express from "express";
import { approvePayment, completePayment } from "./pi";

const app = express();
app.use(express.json());

app.post("/api/pi/approve", async (req, res) => {
  try {
    await approvePayment(req.body.paymentId);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/pi/complete", async (req, res) => {
  try {
    await completePayment(req.body.paymentId, req.body.txid);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log("Pi backend running");
});

