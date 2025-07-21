import React, { useEffect, useState } from 'react';

/**
 * NoteEditor shows the selected note (title/content), allows editing, saving, and creating new notes.
 *
 * Props:
 * - note: the selected note object (or null)
 * - onSave: fn(noteId, {title, content}) for editing
 * - onCreate: fn({title, content}) for new note
 * - saving: bool, saving state
 * - loading: bool, loading state
 * - setSelectedNoteId: fn to select a note (for after creation)
 */

export default function NoteEditor({
  note,
  onSave,
  onCreate,
  saving,
  loading,
  setSelectedNoteId,
}) {
  // Local state for title/content inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(false);

  // When note changes, fill editor fields
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setEditing(false);
    } else {
      setTitle('');
      setContent('');
      setEditing(false);
    }
  }, [note]);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setTitle(note?.title || '');
    setContent(note?.content || '');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    try {
      await onSave(note.id, { title, content });
      setEditing(false);
    } catch {
      // error UI handled via parent
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    try {
      const created = await onCreate({ title, content });
      setTitle('');
      setContent('');
      setEditing(false);
      setSelectedNoteId(created.id);
    } catch {
      // error UI handled via parent
    }
  };

  if (loading) {
    return <div style={styles.status}>Loading…</div>;
  }

  return (
    <section style={styles.editor}>
      {note ? (
        editing ? (
          <form onSubmit={handleSave} style={styles.form}>
            <input
              style={styles.titleInput}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              maxLength={120}
              autoFocus
            />
            <textarea
              style={styles.contentInput}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your note here..."
              rows={12}
            />
            <div style={styles.formActions}>
              <button
                style={styles.saveBtn}
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h2 style={styles.noteTitle}>{note.title || '(Untitled)'}</h2>
            <div style={styles.noteMeta}>
              <span>Created: {new Date(note.created_at).toLocaleString()}</span>
              {note.updated_at && (
                <span style={{ marginLeft: 12, color: '#999' }}>
                  Updated: {new Date(note.updated_at).toLocaleString()}
                </span>
              )}
            </div>
            <pre style={styles.noteContent}>{note.content}</pre>
            <div style={styles.toolbar}>
              <button style={styles.editBtn} onClick={handleEdit}>
                Edit
              </button>
            </div>
          </div>
        )
      ) : (
        // Add new note area
        <form onSubmit={handleCreate} style={styles.form}>
          <h2 style={styles.noteTitle}>Create New Note</h2>
          <input
            style={styles.titleInput}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            maxLength={120}
            autoFocus
          />
          <textarea
            style={styles.contentInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your note here…"
            rows={12}
          />
          <div style={styles.formActions}>
            <button
              style={styles.saveBtn}
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Add Note'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

const styles = {
  editor: {
    flex: 1,
    padding: 32,
    maxWidth: 700,
    margin: '0 auto',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: 700,
    margin: '0 0 10px 0',
  },
  noteMeta: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  noteContent: {
    fontFamily: 'inherit',
    background: '#f9f9fa',
    borderRadius: 8,
    padding: 20,
    fontSize: 17,
    minHeight: 200,
    margin: '12px 0',
    whiteSpace: 'pre-wrap',
    border: '1px solid #eee',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  titleInput: {
    fontSize: 18,
    padding: 8,
    borderRadius: 6,
    border: '1px solid #ddd',
    marginBottom: 4,
  },
  contentInput: {
    fontSize: 15,
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ddd',
    minHeight: 180,
  },
  formActions: {
    display: 'flex',
    gap: 10,
    marginTop: 6,
    alignItems: 'center',
  },
  saveBtn: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '8px 20px',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
  },
  cancelBtn: {
    background: '#eee',
    color: '#222',
    border: 'none',
    padding: '8px 18px',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 400,
    cursor: 'pointer',
  },
  toolbar: {
    marginTop: 14,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  editBtn: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    borderRadius: 6,
    padding: '7px 16px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  status: {
    color: '#777',
    fontSize: 18,
    textAlign: 'center',
    padding: '34px 0',
  },
};
