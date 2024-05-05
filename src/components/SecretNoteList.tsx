import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SecretNoteService from '../services/SecretNoteService';
import { SecretNote } from '../models/SecretNote';
import CryptoJS from 'crypto-js';
import AddSecretNote from './AddSecretNote';

// private key to decrypt
const SECRET_KEY = 'your-secret-key';

// show all list that store in data base with option to edit and remove
const SecretNoteList: React.FC = () => {
  const [secretNotes, setSecretNotes] = useState<SecretNote[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedSecretNote, setEditedSecretNote] = useState<SecretNote | null>(null);

  useEffect(() => {
    fetchSecretNotes();
  }, []);

  const fetchSecretNotes = async () => {
    try {
      const notes = await SecretNoteService.getAllSecretNotes();
      setSecretNotes(notes);
    } catch (error) {
      console.error('Error fetching secret notes:', error);
    }
  };

  const decryptPassword = (encryptedPassword: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleEdit = (note: SecretNote) => {
    setEditingNoteId(note.id);
    setEditedSecretNote({ ...note, encryptedPassword: decryptPassword(note.encryptedPassword) });
  };

  const handleSave = async () => {
    if (editedSecretNote) {
      const updatedNote: SecretNote = {
        ...editedSecretNote,
        encryptedPassword: CryptoJS.AES.encrypt(editedSecretNote.encryptedPassword, SECRET_KEY).toString(),
      };
      try {
        await SecretNoteService.updateSecretNote(updatedNote.id, updatedNote);
        setEditingNoteId(null);
        setEditedSecretNote(null);
        fetchSecretNotes();
      } catch (error) {
        console.error('Error updating secret note:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingNoteId(null);
    setEditedSecretNote(null);
  };

  const handleDelete = async (noteId: number) => {
    try {
      await SecretNoteService.deleteSecretNote(noteId);
      fetchSecretNotes();
    } catch (error) {
      console.error('Error deleting secret note:', error);
    }
  };
  const handleAddSecretNote = () => {
    fetchSecretNotes();
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Secret Notes</Typography>
      </Grid>
      <Grid item xs={12}>
        <List>
          {secretNotes.map((note) => (
            <ListItem key={note.id}>
              {editingNoteId === note.id ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      value={editedSecretNote?.name || ''}
                      onChange={(e) => setEditedSecretNote({ ...editedSecretNote!, name: e.target.value })}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Website"
                      value={editedSecretNote?.website || ''}
                      onChange={(e) => setEditedSecretNote({ ...editedSecretNote!, website: e.target.value })}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      value={editedSecretNote?.email || ''}
                      onChange={(e) => setEditedSecretNote({ ...editedSecretNote!, email: e.target.value })}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Password"
                      value={editedSecretNote?.encryptedPassword || ''}
                      onChange={(e) => setEditedSecretNote({ ...editedSecretNote!, encryptedPassword: e.target.value })}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <>
                  <ListItemText
                    primary={note.name}
                    secondary={`Website: ${note.website}, Email: ${note.email}, Password: ${decryptPassword(
                      note.encryptedPassword
                    )}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(note)}
                      disabled={editingNoteId !== null}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(note.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12}>
        <AddSecretNote onAddSecretNote={handleAddSecretNote} />
      </Grid>
    </Grid>
  );
};

export default SecretNoteList;