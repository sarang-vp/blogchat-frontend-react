import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

function UserGrid() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.17:3001/customers')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <Grid container spacing={2}>
      {users.map((user) => (
        <Grid item xs={12} md={4} key={user._id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography>{user.companyCode}</Typography>
              {/* Add other user information as needed */}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default UserGrid;
