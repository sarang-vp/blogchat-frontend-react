import React, { useState, useEffect } from "react";
import instance from "../API/axiosInstance";
import "../App.css"; // Import CSS file for styling

const UserGridComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.post(`/users/userList`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="user-grid-container">
      <h1>User List</h1>
      <div className="user-grid">
        {users.map((user) => (
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
  );
};

export default UserGridComponent;
