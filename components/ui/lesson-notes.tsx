"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { Textarea } from "./textarea"
import { Input } from "./input"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import {
  BookmarkPlus,
  StickyNote,
  Trash2,
  Edit3,
  Save,
  X,
  Plus,
  Clock
} from "lucide-react"
import { toast } from "sonner"

interface Note {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

interface Bookmark {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

interface LessonNotesProps {
  lessonId: string
  courseId: string
  className?: string
}

export function LessonNotes({ lessonId, courseId, className }: LessonNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isAddingBookmark, setIsAddingBookmark] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [newBookmarkContent, setNewBookmarkContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Keys for localStorage
  const noteStorageKey = `draft-note-${lessonId}`
  const bookmarkStorageKey = `draft-bookmark-${lessonId}`

  useEffect(() => {
    fetchNotesAndBookmarks()
    // Load draft content from localStorage
    loadDrafts()
  }, [lessonId, courseId])

  // Load draft content from localStorage
  const loadDrafts = () => {
    try {
      const savedNote = localStorage.getItem(noteStorageKey)
      const savedBookmark = localStorage.getItem(bookmarkStorageKey)

      if (savedNote) {
        setNewNote(savedNote)
      }
      if (savedBookmark) {
        setNewBookmarkContent(savedBookmark)
      }
    } catch (error) {
      console.error('Error loading drafts:', error)
    }
  }

  // Save draft to localStorage
  const saveDraft = (key: string, content: string) => {
    try {
      if (content.trim()) {
        localStorage.setItem(key, content)
      } else {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }

  // Clear draft from localStorage
  const clearDraft = (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error clearing draft:', error)
    }
  }

  const fetchNotesAndBookmarks = async () => {
    try {
      const response = await fetch(`/api/learning/notes?lessonId=${lessonId}`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes || [])
        setBookmarks(data.bookmarks || [])
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/learning/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "note",
          lessonId,
          content: newNote
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(prev => [data.note, ...prev])
        setNewNote("")
        setIsAddingNote(false)
        clearDraft(noteStorageKey) // Clear saved draft
        toast.success("Note added successfully!")
      } else {
        toast.error("Failed to add note")
      }
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("Failed to add note")
    } finally {
      setLoading(false)
    }
  }

  const addBookmark = async () => {
    if (!newBookmarkContent.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/learning/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bookmark",
          lessonId,
          content: newBookmarkContent
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBookmarks(prev => [data.bookmark, ...prev])
        setNewBookmarkContent("")
        setIsAddingBookmark(false)
        clearDraft(bookmarkStorageKey) // Clear saved draft
        toast.success("Bookmark added successfully!")
      } else {
        toast.error("Failed to add bookmark")
      }
    } catch (error) {
      console.error("Error adding bookmark:", error)
      toast.error("Failed to add bookmark")
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/learning/notes?type=note&id=${noteId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== noteId))
        toast.success("Note deleted")
      } else {
        toast.error("Failed to delete note")
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      toast.error("Failed to delete note")
    }
  }

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      const response = await fetch(`/api/learning/notes?type=bookmark&id=${bookmarkId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId))
        toast.success("Bookmark deleted")
      } else {
        toast.error("Failed to delete bookmark")
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error)
      toast.error("Failed to delete bookmark")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setIsAddingNote(true)}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          <StickyNote className="h-4 w-4 mr-2" />
          Add Note
        </Button>
        <Button
          onClick={() => setIsAddingBookmark(true)}
          size="sm"
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
        >
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Add Bookmark
        </Button>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-blue-400" />
                Add New Note
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingNote(false)
                  setNewNote("")
                  clearDraft(noteStorageKey)
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={newNote}
              onChange={(e) => {
                const value = e.target.value
                setNewNote(value)
                saveDraft(noteStorageKey, value)
              }}
              placeholder="Write your note here..."
              className="bg-black/30 border-gray-600 text-white min-h-[100px]"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={addNote}
                disabled={loading || !newNote.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
              <Button
                onClick={() => {
                  setIsAddingNote(false)
                  setNewNote("")
                  clearDraft(noteStorageKey)
                }}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Bookmark Form */}
      {isAddingBookmark && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookmarkPlus className="h-5 w-5 text-yellow-400" />
                Add New Bookmark
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingBookmark(false)
                  setNewBookmarkContent("")
                  clearDraft(bookmarkStorageKey)
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={newBookmarkContent}
              onChange={(e) => {
                const value = e.target.value
                setNewBookmarkContent(value)
                saveDraft(bookmarkStorageKey, value)
              }}
              placeholder="Write your bookmark content..."
              className="bg-black/30 border-gray-600 text-white min-h-[100px]"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={addBookmark}
                disabled={loading || !newBookmarkContent.trim()}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Bookmark
              </Button>
              <Button
                onClick={() => {
                  setIsAddingBookmark(false)
                  setNewBookmarkContent("")
                  clearDraft(bookmarkStorageKey)
                }}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookmarkPlus className="h-5 w-5 text-yellow-400" />
            Bookmarks ({bookmarks.length})
          </h4>
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="bg-gray-800/30 border-gray-700 border-l-4 border-l-yellow-500">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm mb-2 whitespace-pre-wrap">{bookmark.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(bookmark.createdAt)}
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteBookmark(bookmark.id)}
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notes Section */}
      {notes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-blue-400" />
            Notes ({notes.length})
          </h4>
          {notes.map((note) => (
            <Card key={note.id} className="bg-gray-800/30 border-gray-700 border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm mb-2 whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(note.createdAt)}
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteNote(note.id)}
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {notes.length === 0 && bookmarks.length === 0 && !isAddingNote && !isAddingBookmark && (
        <Card className="bg-gray-800/20 border-gray-700 border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="space-y-3">
              <div className="flex justify-center space-x-2">
                <StickyNote className="h-8 w-8 text-gray-600" />
                <BookmarkPlus className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-gray-400">No notes or bookmarks yet</p>
              <p className="text-gray-500 text-sm">Add notes and bookmarks to enhance your learning experience</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}