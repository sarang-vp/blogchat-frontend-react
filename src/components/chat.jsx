import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import instance from "../API/axiosInstance";
import { jwtDecode } from "jwt-decode";
import "../App.css"; // Import CSS file for styling

const Chat = () => {
  // State for users list and selected user ID
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for chat messages and message input
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // State for sender's ID
  const [senderId, setSenderId] = useState("");

  // Socket.io initialization
  const socket = io(process.env.REACT_APP_LOCALIP);
  socket.on("connect", () => {
    socket.emit("setUsername", senderId);
  });
  // Decode token and set sender's ID when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    if (decodedToken) {
      setSenderId(decodedToken._id);
    }

    fetchUserList();
  }, []);

  // Fetch users list from the backend
  const fetchUserList = async () => {
    try {
      const response = await instance.post(`/users/userList`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  // Function to handle user selection and load chat messages
  const handleUserSelect = async (userId) => {
    try {
      const response = await instance.post(`/users/userChatHistory`, {
        receiver: userId,
        sender: senderId,
      });
      const chatHistory = response.data;
      setMessages(chatHistory);
      setSelectedUser(userId);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Function to send a message
  const sendMessage = () => {
    if (messageInput.trim() !== "" && selectedUser && senderId) {
      socket.emit("privateMessage", {
        sender: senderId,
        recipient: selectedUser,
        message: messageInput
      });
      setMessages([...messages, { sender: senderId, message: messageInput }]);
      setMessageInput("");
    }
  };

  // UseEffect hook to handle receiving messages via Socket.io
  useEffect(() => {
    socket.on("privateMessage", ({ sender, message }) => {
      setMessages([...messages, { sender:sender, message:message }]);
    });
  }, [socket, messages]);

  return (
    <div className="chat-container">
      {/* User list section */}
      <div className="user-list">
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} onClick={() => handleUserSelect(user._id)}>
              {user.userName}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat thread section */}
      <div className="chat-thread">
        {selectedUser && (
          <>
            <h5>Chat with {selectedUser}</h5>
            {/* Chat messages */}
            <ul className="chat-messages">
              {messages.map((message, index) => (
                <li key={index} className={message.sender === senderId ? "sent-message" : "received-message"}>
                  {message.message}
                </li>
              ))}
            </ul>
            {/* Message input field */}
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            {/* Send button */}
            {messages.length > 0 && (
              <button onClick={sendMessage}>Send</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
