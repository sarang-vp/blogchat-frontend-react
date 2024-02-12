import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update form status to submitting
    setFormStatus({ ...formStatus, submitting: true });

    try {
      // Send form data to the API
      const response = await fetch(`${process.env.LOCALIP}/addusers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.status===200) {
        console.log("status")
        // Form submitted successfully
        setFormStatus({ ...formStatus, submitted: true });
      } else {
        // Form submission failed
        setFormStatus({ ...formStatus, error: 'Form submission failed.' });
      }
    } catch (error) {
      // An error occurred while submitting the form
      setFormStatus({ ...formStatus, error: 'An error occurred while submitting the form.' });
    } finally {
      // Reset form status after submission
      // setFormStatus({ ...formStatus, submitting: false });
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h4">Contact Us</Typography>
      {formStatus.submitted ? (
        <Typography color="success">Form submitted successfully!</Typography>
      ) : formStatus.error ? (
        <Typography color="error">{formStatus.error}</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={formStatus.submitting}>
                {formStatus.submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
}

export default ContactForm;
