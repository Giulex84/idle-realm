import { useEffect, useState } from "react";

declare global {
  interface Window {
    Pi: any;
  }
}

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.Pi) {
      console.error("Pi SDK not loaded");
      return;
    }

    // ⛔ inizializza UNA volta
    window.Pi.init({ version: "2.0" });

    // 🔒 se già autenticato, NON richiamare
    if (username) return;

    window.Pi.authenticate(
      ["username"],
      (auth: any) => {
        console.log("Pi auth success", auth);
        setUsername(auth.user.username);
        setLoading(false);
      },
      (error: any) => {
        console.error("Pi auth failed", error);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <div>Authenticating with Pi...</div>;
  }

  if (!username) {
    return <div>Authentication failed.</div>;
  }

  return <h1>Welcome {username}</h1>;
}

export default App;
