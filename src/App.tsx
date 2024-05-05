import React from 'react';
import { Container } from '@mui/material';
import SecretNoteList from './components/SecretNoteList';
import AddSecretNote from './components/AddSecretNote';

const App: React.FC = () => {
  return (
    <Container>
      <h1>Password Manager</h1>
      <SecretNoteList />
    </Container>
  );
};

export default App;
