"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: message
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        text: data.reply
      };

      setMessages([...newMessages, aiMessage]);

    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", text: "Error contacting AI" }
      ]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
        <h2>SudhanshuGPT 🤖</h2>

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                background: msg.role === "user" ? "#2563eb" : "#1e293b",
                color: "white",
                padding: "12px",
                borderRadius: "10px",
                maxWidth: "60%"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #333",
          display: "flex",
          gap: "10px"
        }}
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask your AI something..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            resize: "none"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            background: "#22c55e",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>

    </main>
  );
}