import React, { useState } from "react";

function hash(str) {
  // Simple hash for demo (not cryptographically secure)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

export default function PasswordGate({ onUnlock }) {
  const [username, setUsername] = useState(() => localStorage.getItem("diary_last_user") || "");
  const [step, setStep] = useState(null);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  // Check if user exists when username changes
  React.useEffect(() => {
    if (!username) {
      setStep(null);
      return;
    }
    const userHash = localStorage.getItem("diary_pw_hash_" + username);
    setStep(userHash ? "enter" : "set");
  }, [username]);

  function handleSet(e) {
    e.preventDefault();
    if (pw.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
  localStorage.setItem("diary_pw_hash_" + username, hash(pw));
  localStorage.setItem("diary_last_user", username);
  setStep("enter");
  setPw("");
  setError("");
  }

  function handleEnter(e) {
    e.preventDefault();
    const stored = localStorage.getItem("diary_pw_hash_" + username);
    if (hash(pw) === stored) {
      setError("");
      sessionStorage.setItem("diary_user", username);
      localStorage.setItem("diary_last_user", username);
      onUnlock();
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100">
      <form className="bg-white/90 rounded-3xl shadow-xl p-10 w-full max-w-sm mx-auto flex flex-col items-center border-2 border-pink-200" onSubmit={step === "set" ? handleSet : handleEnter}>
        <div className="text-5xl mb-2 text-pink-400 text-center">🔒✨</div>
        <h2 className="text-3xl font-extrabold mb-4 text-blue-500 text-center font-cursive tracking-wide">
          {step === null ? "Welcome!" : step === "set" ? "Set a Password" : "Enter Password"}
        </h2>
        <div className="mb-4 text-purple-500 text-center text-base font-cursive">
          Welcome to <span className="font-bold text-pink-400">DiaryMe</span>!<br />Your private, cute diary app.<br />Set a password to keep your notes safe and secret. 💖
        </div>
        <input
          type="text"
          className="w-full p-3 border-2 border-blue-200 rounded-xl mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 bg-blue-50 placeholder-pink-300 font-cursive"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        {step && (
          <input
            type="password"
            className="w-full p-3 border-2 border-pink-200 rounded-xl mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-pink-50 placeholder-blue-300 font-cursive"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
        )}
        {error && <div className="text-red-400 mb-2 text-center font-bold font-cursive">{error}</div>}
        <button type="submit" className="w-full bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 text-white py-3 rounded-xl font-extrabold text-lg shadow hover:scale-105 transition-transform duration-200" disabled={!username || (step && !pw)}>
          {step === null ? "Next" : step === "set" ? "Set Password" : "Unlock"}
        </button>
      </form>
      <style>{`
        .font-cursive { font-family: 'Comic Sans MS', 'Comic Sans', cursive; }
      `}</style>
    </div>
  );
}
