import React, { useState, useEffect } from "react";
import { bookService, authorService, editorService } from "../../api";
import './BookForm.css';

const BookForm = ({ bookId = null, onSave, onCancel }) => {
    const [book, setBook] = useState({
        title: '',
        description: '',
        pages: '',
        image: '',
        author: '',
        editor: ''
    });

    const [authors, setAuthors] = useState([]);
    const [editors, setEditors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAuthors();
        if (bookId) {
            loadBook(bookId);
        }
    }, [bookId]);

    useEffect(() => {
        loadEditors();
        if (bookId) {
            loadBook(bookId);
        }
    }, [bookId])

    const loadAuthors = async (id) => {
        try {
            const authorsData = await authorService.getAll();
            setAuthors(authorsData);
        } catch (error) {
            console.error('Erreur lors du chargement des auteurs:', error);
        }
    };

    const loadEditors = async (id) => {
        try {
            const editorsData = await editorService.getAll();
            setEditors(editorsData);
        } catch (error) {
            console.error('Erreur lors du chargement des éditeurs:', error);
        }
    }

    const loadBook = async (id) => {
        try {
            const bookData = await bookService.getById(id);
            setBook({
                title: bookData.title,
                description: bookData.description || '',
                pages: bookData.pages,
                image: bookData.image || '',
                author: bookData.author['@id'] || bookData.author,
                editor: bookData.editor['@id'] || bookData.editor
            });
        } catch (error) {
            setError('Erreur lors du chargement du livre');
        }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setBook(prev => ({
            ...prev,
            [name]:value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!book.title.trim() || !book.author || !book.pages) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const bookData = {
                ...book,
                pages: parseInt(book.pages),
                author: book.author.startsWith('/api/authors/') ? book.author : `/api/authors/${book.author}`,
                editor: book.editor.startsWith('/api/editors/') ? book.editor : `/api/editors/${book.editor}`
            };

            let savedBook;
            if (bookId) {
                savedBook = await bookService.update(bookId, bookData);
            } else {
                savedBook = await bookService.create(bookData);
            }

            if (onSave) {
                onSave(savedBook);
            }
        } catch (error) {
            setError('Erreur lors de la sauvegarde du livre');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="book-form-container">
            <h3>{bookId ? 'Modifier le livre' : 'Ajouter un nouveau livre'}</h3>

            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="book-form">
                <div className="form-group">
                    <label htmlFor="title">Titre *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={book.title}
                        onChange={handleInputChange}
                        placeholder="Titre du livre" required />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Auteur *</label>
                    <select
                        id="author"
                        name="author"
                        value={book.author}
                        onChange={handleInputChange}
                        required>
                        <option value="">Sélectionner un auteur</option>
                        {authors.map(author => (
                            <option key={author.id} value={`/api/authors/${author.id}`}>
                                {author.firstName} {author.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="editor">Editeur *</label>
                    <select 
                        id="editor"
                        name="editor"
                        value={book.editor}
                        onChange={handleInputChange}
                        required>
                            {/* <option value="">Sélectionner un éditeur</option> */}
                            {editors.map(editor => {
                                <option key={editor.id} value={`/api/editors/${editor.id}`}>
                                    {/* {editor.name} {editor.headquarters} */} Ceci est un test
                                </option>
                            })}
                        </select>
                </div>

                <div className="form-group">
                    <label htmlFor="pages">Nombre de pages *</label>
                    <input
                        type="number"
                        id="pages"
                        name="pages"
                        value={book.pages}
                        onChange={handleInputChange}
                        placeholder="Nombre de pages"
                        min="1"
                        required />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Url de l'image</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={book.image}
                        onChange={handleInputChange}
                        placeholder="https://exemple.com/image.jpg" />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={book.description}
                        onChange={handleInputChange}
                        placeholder="Description du livre"
                        rows="4" />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-cancel"
                        disabled={loading}>
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}>
                        {loading ? 'Sauvegarde...' : (bookId ? 'Modifier' : 'Créer')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookForm;