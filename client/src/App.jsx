import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001");

function App() {
  const [user, setUser] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!user.trim() || !text.trim()) return;
    socket.emit("sendMessage", { user, text });
    setText("");
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-title">Chat Room</div>
          <input
            className="name-input"
            placeholder="Your name"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>

        <div className="messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`message-row ${m.user === user ? "me" : "other"}`}
            >
              <div className="message-user-label">{m.user}</div>
              <div className="message-bubble">
                <div className="message-text">{m.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            className="message-input"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-button" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
