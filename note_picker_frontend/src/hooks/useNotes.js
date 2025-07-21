import { useCallback, useEffect, useState } from 'react';
import * as notesService from '../services/notesService';

/**
 * Custom hook to manage notes (CRUD), loading, error states, and selected note.
 * Returns { notes, loading, error, selectedNote, ...handlers }
 */

// PUBLIC_INTERFACE
export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Load notes from DB
  const fetchAllNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notesService.fetchNotes();
      setNotes(data);
      if (data.length > 0 && !selectedNoteId) {
        setSelectedNoteId(data[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [selectedNoteId]);

  // Add a new note, update list
  const createNote = async (payload) => {
    setSaving(true);
    setError(null);
    try {
      const newNote = await notesService.addNote(payload);
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
      return newNote;
    } catch (err) {
      setError(err.message || 'Failed to add note');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Update a note
  const saveNote = async (noteId, payload) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await notesService.updateNote(noteId, payload);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? updated : n))
      );
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to save note');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Delete a note and update list
  const removeNote = async (noteId) => {
    setDeleting(true);
    setError(null);
    try {
      await notesService.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      // If deleted note was selected, choose the next one
      if (noteId === selectedNoteId) {
        setSelectedNoteId((prev) => {
          const idx = notes.findIndex((n) => n.id === prev);
          const next = notes[idx + 1] || notes[idx - 1] || null;
          return next ? next.id : null;
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to delete note');
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  // Fetch notes initially on mount
  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  // Get selected note object
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return {
    notes,
    loading,
    saving,
    deleting,
    error,
    selectedNote,
    selectedNoteId,
    setSelectedNoteId,
    fetchAllNotes,
    createNote,
    saveNote,
    removeNote,
  };
}
