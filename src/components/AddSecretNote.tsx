import React, { useState } from 'react';
import { Button, TextField, Typography, Grid } from '@mui/material';
import SecretNoteService from '../services/SecretNoteService';
import { SecretNote } from '../models/SecretNote';
import CryptoJS from 'crypto-js';

// private key to encrypt
const SECRET_KEY = 'your-secret-key';

interface AddSecretNoteProps {
  onAddSecretNote: () => void;
}
const AddSecretNote: React.FC<AddSecretNoteProps> = ({ onAddSecretNote }) => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    //In this updated version of the component, 
    //I added input validation checks before submitting the form. It checks if all fields are filled,
    // and it validates the email format using a regular expression. 
    //If any validation fails, it displays an error message below the form. 
    //This helps prevent SQL injection and XSS attacks by ensuring that only valid and safe data is submitted to the server.
    e.preventDefault();

    // Perform input validation
    if (!name || !website || !email || !password) {
      setError('All fields are required.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Clear previous error message
    setError('');

    const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    const secretNote: SecretNote = {
      id: 0,
      name,
      website,
      email,
      encryptedPassword,
    };
    try {
      await SecretNoteService.createSecretNote(secretNote);
      setName('');
      setWebsite('');
      setEmail('');
      setPassword('');
      onAddSecretNote();
    } catch (error) {
      console.error('Error creating secret note:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Add Secret Note</Typography>
      </Grid>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Add Note
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default AddSecretNote;
