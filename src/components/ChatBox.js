import React from "react";
import "./ChatBox.css"; // ✅ Import CSS for styling

const ChatBox = ({ messages, messageText, setMessageText, sendMessage }) => {
  // ✅ Handle "Enter" key to send messages
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      
      {/* ✅ Input and Send Button */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown} // ✅ Handle Enter Key
          placeholder="Type a message..."
        />
        <button className="send-btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
