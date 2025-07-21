import { supabase } from '../utils/supabase';

/**
 * All note-related operations using Supabase.
 * Each function handles communication, errors, and returns data or throws as appropriate.
 * Table structure: see assets/supabase.md
 */

// PUBLIC_INTERFACE
export async function fetchNotes() {
  /** Fetch all notes from Supabase, ordered by creation time descending. */
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function getNote(noteId) {
  /** Fetch a single note by ID from Supabase. */
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function addNote({ title, content }) {
  /** Create a new note in Supabase. Returns the created note. */
  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, content }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function updateNote(noteId, { title, content }) {
  /** Update an existing note by ID. Returns the updated note. */
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', noteId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function deleteNote(noteId) {
  /** Delete a note by ID. Returns the deleted note data. */
  const { data, error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
