import { useState, useRef, useEffect } from "react";

/**
 * Chatbot Page (Static Version)
 * 
 * - Simple help chatbot UI
 * - No backend connection
 * - Auto scroll
 * - Clean layout like other pages
 */

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 Welcome to VetCare System!" },
    { sender: "bot", text: "How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getBotReply = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("appointment")) {
      return "You can book an appointment from the Appointments page.";
    } else if (msg.includes("doctor")) {
      return "Our veterinary doctors are available from 9 AM to 5 PM.";
    } else if (msg.includes("pet")) {
      return "You can manage your pets from the Pets page.";
    } else if (msg.includes("hello") || msg.includes("hi")) {
      return "Hi there! 😊 How can I assist you?";
    } else if (msg.includes("bye")) {
      return "Goodbye! 👋 Take care of your pets!";
    } else {
      return "I'm here to help with appointments, pets, and doctors information.";
    }
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    const botReply = { sender: "bot", text: getBotReply(input) };

    setMessages(prev => [...prev, userMessage, botReply]);
    setInput("");
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Help Chatbot</h1>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>
            Ask questions about appointments, pets, or doctors
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-header">💬 Vet Assistant</h3>

        <div
          style={{
            height: "400px",
            overflowY: "auto",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px"
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "0.5rem"
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "12px",
                  backgroundColor:
                    msg.sender === "user" ? "#007bff" : "#e9ecef",
                  color: msg.sender === "user" ? "#fff" : "#000"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "1rem",
            gap: "0.5rem"
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;