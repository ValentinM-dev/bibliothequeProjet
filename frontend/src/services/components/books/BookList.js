import React, { useState, useEffect, useCallback } from "react";
import { bookService, authorService, editorService } from "../../api";
import BookCard from './BookCard';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import './BookList.css';

const BookListAdvanced = ({ onEdit }) => {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [editors, setEditors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect (() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        filterBooks();
    }, [books, searchTerm]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [booksData, authorsData, editorsData] = await Promise.all([
                bookService.getAll(),
                authorService.getAll(),
                editorService.getAll()
            ]);
            setBooks(booksData);
            setAuthors(authorsData);
            setEditors(editorsData);
        } catch (error) {
            setError('Erreur lors du chargement des données');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBooks = useCallback(() => {
        if (!searchTerm.trim()) {
            setFilteredBooks(books);
            return;
        }

        const filtered = books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()) || (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        setFilteredBooks(filtered);
    }, [books, searchTerm]);

    const handleDeleteBook = async (bookId) => {
        if(!window.confirm('Etes-vous sûr de vouloir supprimer ce livre ?')) {
            return;
        }

        try {
            await bookService.delete(bookId);
            setBooks(prev => prev.filter(book => book.id !== bookId));
        } catch (error) {
            alert('Erreur lors de la suppression du livre');
            console.error('Erreur:', error);
        }
    };

    const getAuthorInfo = (authorIri) => {
        const authorId = authorIri.split('/').pop();
        return authors.find(author => String(author.id) === String(authorId));
    };

    const getEditorInfo = (editorIri) => {
        const editorId = editorIri.split('/').pop();
        return editors.find(editor => String(editor.id) === String(editorId));
    };

    if (loading) {
        return <LoadingSpinner message='Chargement de la bibliothèque...' />;
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={loadInitialData} className="retry-btn">
                    🔄️ Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="book-list-container">
            <div className="book-list-header">
                <h2>📚 Notre collection de livres</h2>
                <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Rechercher un livre..." />
                <p className="book-count">
                    {filteredBooks.length} livre {filteredBooks.length > 1 ? 's' : ''} {searchTerm && `trouvé${filteredBooks.length > 1 ? 's' : ''} pour "${searchTerm}"`}
                </p>
            </div>

            {filteredBooks.length === 0 ? (
                <div className="empty-state">
                    {searchTerm ? (
                        <p>Aucun livre trouvé pour "{searchTerm}"</p>
                    ) : ( <p>Aucun livre dans la bibliotèque</p>

                    )}
                </div>
            ) : (
                <div className="books-grid">
                    {filteredBooks.map(book => {
                        const authorInfo = getAuthorInfo(book.author);
                        const editorInfo = getEditorInfo(book.editor);
                        return (
                            <BookCard
                            key={book.id}
                            book={{...book, authorInfo, editorInfo}}
                            onEdit={onEdit}
                            onDelete={handleDeleteBook} />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookListAdvanced;