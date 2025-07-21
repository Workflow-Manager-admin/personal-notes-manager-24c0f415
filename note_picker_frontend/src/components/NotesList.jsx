import React from 'react';

/**
 * NotesList UI component displays a sidebar list of notes, highlights active note,
 * allows selection, and deleting. Shows loading/error states.
 *
 * Props:
 *  - notes: array of note objects
 *  - selectedNoteId: id of the currently selected note
 *  - onSelect: fn(noteId) to select note
 *  - onDelete: fn(noteId) to delete note
 *  - loading: bool, is loading notes
 *  - deleting: bool, is deleting
 *  - error: error message, if any
 */

export default function NotesList({
  notes,
  selectedNoteId,
  onSelect,
  onDelete,
  loading,
  deleting,
  error,
}) {
  return (
    <aside className="notes-list-sidebar" style={styles.sidebar}>
      <h2 style={styles.title}>Your Notes</h2>
      {loading ? (
        <div style={styles.status}>Loading notes…</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : notes.length === 0 ? (
        <div style={styles.status}>No notes yet. Create one!</div>
      ) : (
        <ul style={styles.list}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                ...styles.item,
                ...(note.id === selectedNoteId ? styles.activeItem : {}),
              }}
              onClick={() => onSelect(note.id)}
            >
              <div>
                <strong>{note.title || <em>(Untitled)</em>}</strong>
                <br />
                <small style={{ color: '#999' }}>
                  {new Date(note.created_at).toLocaleString()}
                </small>
              </div>
              <button
                style={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!deleting && window.confirm('Delete this note?')) {
                    onDelete(note.id);
                  }
                }}
                disabled={deleting}
                aria-label="Delete note"
                title="Delete"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 320,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    padding: 20,
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  title: {
    margin: '0 0 16px 0',
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: '0.02em',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '12px 8px',
    marginBottom: 6,
    borderRadius: 8,
    background: 'transparent',
    border: '1px solid transparent',
    transition: 'background 0.2s, border 0.2s',
  },
  activeItem: {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    fontWeight: 600,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#d33',
    fontSize: 18,
    cursor: 'pointer',
    marginLeft: 12,
    transition: 'color 0.2s',
  },
  status: {
    color: '#888',
    padding: '24px 0',
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: '#d33',
    padding: '10px',
    border: '1px solid #fdd',
    borderRadius: 8,
    background: '#fff0f0',
    textAlign: 'center',
    fontSize: 15,
  },
};
