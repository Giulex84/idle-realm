import { useEffect, useState } from "react";

declare const Pi: any;

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.Pi) {
      setError("Pi SDK not available");
      return;
    }

    Pi.init({ version: "2.0" });

    Pi.authenticate(
      ["username"],
      (auth: any) => {
        setUsername(auth.user.username);
      },
      (err: any) => {
        console.error(err);
        setError("Authentication failed");
      }
    );
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!username) {
    return <div>Authenticating with Pi...</div>;
  }

  return (
    <div>
      <h1>Idle Realm</h1>
      <p>Welcome {username}</p>
    </div>
  );
}

export default App;
