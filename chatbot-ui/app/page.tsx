"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChat([...chat, userMessage]);

    setMessage("");

    try {
      const response = await fetch("http://artemiswealth.ai/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const botMessage = { role: "bot", content: data.reply };

      setChat([...chat, userMessage, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Artemis Wealth Chatbot</h1>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        <div className="h-80 overflow-y-auto border-b border-gray-300 p-2">
          {chat.map((msg, index) => (
            <p key={index} className={`p-2 rounded-md ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
            </p>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 border p-2 rounded-l-md"
            placeholder="Ask a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r-md">Send</button>
        </div>
      </div>
    </div>
  );
}