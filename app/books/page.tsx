"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/Toast";
import { BookOpen, Plus, Check, Trash2, X } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: "reading" | "finished" | "want-to-read";
  addedAt: string;
}

export default function BooksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [filter, setFilter] = useState<"all" | "reading" | "finished" | "want-to-read">("all");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    const saved = localStorage.getItem("powerbook-books");
    if (saved) setBooks(JSON.parse(saved));
  }, [user, router]);

  const saveBooks = (updated: Book[]) => {
    setBooks(updated);
    localStorage.setItem("powerbook-books", JSON.stringify(updated));
  };

  const addBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const book: Book = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      totalPages: parseInt(totalPages) || 0,
      currentPage: 0,
      status: "want-to-read",
      addedAt: new Date().toISOString(),
    };
    saveBooks([book, ...books]);
    setTitle("");
    setAuthor("");
    setTotalPages("");
    setShowAdd(false);
    toast("Book added!", "success");
  };

  const updatePage = (id: string, page: number) => {
    const updated = books.map((b) => {
      if (b.id !== id) return b;
      const newPage = Math.max(0, Math.min(page, b.totalPages || Infinity));
      return {
        ...b,
        currentPage: newPage,
        status: (newPage > 0 && b.totalPages > 0 && newPage >= b.totalPages
          ? "finished"
          : newPage > 0
          ? "reading"
          : b.status) as Book["status"],
      };
    });
    saveBooks(updated);
  };

  const markFinished = (id: string) => {
    const updated = books.map((b) =>
      b.id === id ? { ...b, status: "finished" as const, currentPage: b.totalPages || b.currentPage } : b
    );
    saveBooks(updated);
    toast("Book finished!", "success");
  };

  const deleteBook = (id: string) => {
    saveBooks(books.filter((b) => b.id !== id));
  };

  if (!user) return null;

  const filtered = filter === "all" ? books : books.filter((b) => b.status === filter);
  const readingCount = books.filter((b) => b.status === "reading").length;
  const finishedCount = books.filter((b) => b.status === "finished").length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-in">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight">My Books</h1>
            <p className="text-sm text-text-muted mt-1">
              {readingCount} reading &middot; {finishedCount} finished
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Plus size={14} />
            Add Book
          </button>
        </div>

        {/* Add book form */}
        {showAdd && (
          <div className="bg-surface-raised rounded-2xl border border-border p-5 mb-6 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-text">Add a Book</h3>
              <button onClick={() => setShowAdd(false)} className="text-text-muted hover:text-text">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={addBook} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book title"
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl text-sm focus:outline-none focus:border-border-focus"
                required
              />
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author (optional)"
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl text-sm focus:outline-none focus:border-border-focus"
              />
              <input
                type="number"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="Total pages (optional)"
                min="1"
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl text-sm focus:outline-none focus:border-border-focus"
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium text-sm"
              >
                Add Book
              </button>
            </form>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 bg-surface-sunken rounded-xl p-1 mb-6">
          {(["all", "reading", "finished", "want-to-read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-surface-raised text-text shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {f === "want-to-read" ? "To Read" : f}
            </button>
          ))}
        </div>

        {/* Book list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-surface-sunken rounded-2xl flex items-center justify-center mx-auto mb-3">
              <BookOpen size={24} className="text-text-muted" />
            </div>
            <p className="text-sm text-text-muted">
              {filter === "all" ? "No books yet. Add one to start tracking!" : `No ${filter} books`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((book) => (
              <div
                key={book.id}
                className="bg-surface-raised rounded-2xl border border-border p-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-text">{book.title}</h3>
                    {book.author && (
                      <p className="text-xs text-text-muted mt-0.5">by {book.author}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {book.status !== "finished" && (
                      <button
                        onClick={() => markFinished(book.id)}
                        className="p-1.5 text-text-muted hover:text-success transition-colors"
                        title="Mark as finished"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="p-1.5 text-text-muted hover:text-danger transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {book.totalPages > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-text-muted mb-1">
                      <span>Progress</span>
                      <span>
                        {book.currentPage} / {book.totalPages} pages (
                        {Math.round((book.currentPage / book.totalPages) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-sunken rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          book.status === "finished" ? "bg-success" : "bg-secondary"
                        }`}
                        style={{
                          width: `${Math.min(
                            (book.currentPage / book.totalPages) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    {book.status !== "finished" && (
                      <input
                        type="range"
                        min="0"
                        max={book.totalPages}
                        value={book.currentPage}
                        onChange={(e) => updatePage(book.id, parseInt(e.target.value))}
                        className="w-full mt-2 accent-secondary"
                      />
                    )}
                  </div>
                )}

                <div className="mt-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                      book.status === "finished"
                        ? "bg-success/10 text-success"
                        : book.status === "reading"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-surface-sunken text-text-muted"
                    }`}
                  >
                    {book.status === "want-to-read" ? "To Read" : book.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
