import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import instance from "../API/axiosInstance";
import { jwtDecode } from "jwt-decode";
import "../App.css"; // Import CSS file for styling
import { Link } from "react-router-dom"; // Import Link from React Router

const Chat = () => {
  // State for users list and selected user ID
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for chat messages and message input
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // State for sender's ID
  const [senderId, setSenderId] = useState("");
  // grid sec
  const [users1, setUsers1] = useState([]);
  const [liveStatus, setOfflineSta] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.post(`/users/userList`);
        setUsers1(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  //grid end
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
    console.log("Selected user ID:", userId); // Log the selected user ID
    try {
      setMessages([]);
      const response = await instance.post(`/users/userChatHistory`, {
        receiver: userId,
        sender: senderId,
      });
      if (response.status === 404) {
        // Handle the case when no chat history is found
        console.log("No chat history found for the selected user.");
        setMessages([]); // Clear messages
      } else {
        const chatHistory = response.data;
        if (Array.isArray(chatHistory)) {
          setMessages(chatHistory);
        }
      }

      setSelectedUser(userId); // Set selectedUser with the correct user ID
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
        message: messageInput,
      });
      setMessages([
        ...messages,
        { sender: senderId, message: messageInput, isSender: true },
      ]);
      setMessageInput("");
    }
  };

  // UseEffect hook to handle receiving messages via Socket.io
  useEffect(() => {
    socket.on("privateMessage", ({ sender, message }) => {
      setMessages([...messages, { sender: sender, message: message }]);
    });
  }, [socket, messages]);
  // UseEffect hook to handle receiving messages via Socket.io
  useEffect(() => {
    socket.on("offlineResponse", ({ message }) => {
      setOfflineSta(false);
    });
  });
  useEffect(() => {
    socket.on("newUser", (newUser) => {
      console.log("object");
      console.log(newUser);
      setUsers1((prevUsers) => [...prevUsers, newUser]);
    });
  });

  return (
    <div className="chat-container1">
      {/* Add the button to navigate to UserGridComponent */}
      <Link to="/user-grid">
        <button>Go to User Grid</button>
      </Link>

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
            <h6>live {liveStatus.toString()}</h6>
            {/* Chat messages */}
            <ul className="chat-messages">
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={
                    message.isSender === true
                      ? "sent-message"
                      : "received-message"
                  }
                >
                  {message.message}
                </li>
              ))}
            </ul>
          </>
        )}
        {/* Message input field */}
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          disabled={!selectedUser} // Disable input when no user is selected
        />
        {/* Send button */}
        <button
          onClick={sendMessage}
          disabled={!selectedUser || messageInput.length === 0}
        >
          Send
        </button>
        {!selectedUser && <p>Select a user to start chatting</p>}
      </div>
      <div className="user-grid-container">
        <h1>User List</h1>
        <div className="user-grid">
          {users1.map((user) => (
            <div key={user._id.$oid} className="user-card">
              <h2>{user.userName}</h2>
              <h6>{user.passWord}</h6>
              <h4>{user.db}</h4>
              <h4>{user._id}</h4>
              {/* You can add more details here if needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
