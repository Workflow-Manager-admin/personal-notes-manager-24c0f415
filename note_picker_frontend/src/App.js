import React, { useState, useEffect } from 'react';
import './App.css';
import { useNotes } from './hooks/useNotes';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';

function App() {
  const [theme, setTheme] = useState('light');
  const {
    notes, loading, saving, deleting, error,
    selectedNote, selectedNoteId, setSelectedNoteId,
    createNote, saveNote, removeNote,
  } = useNotes();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App" style={{
      display: "flex", flexDirection: "row", minHeight: "100vh", textAlign: "initial"
    }}>
      {/* Sidebar */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ position: "fixed", zIndex: 100 }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <NotesList
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelect={setSelectedNoteId}
        onDelete={removeNote}
        loading={loading}
        deleting={deleting}
        error={error}
      />
      {/* Main: Editor (create or edit) */}
      <NoteEditor
        note={selectedNote}
        onSave={saveNote}
        onCreate={createNote}
        saving={saving}
        loading={loading}
        setSelectedNoteId={setSelectedNoteId}
      />
    </div>
  );
}

export default App;
