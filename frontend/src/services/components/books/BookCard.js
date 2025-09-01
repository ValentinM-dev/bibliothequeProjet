import React from "react";
import './BookCard.css';

const BookCard = ({ book, onDelete, onEdit }) => {
    const GetAuthorName = (authorInfo) => {
        if (authorInfo && authorInfo.firstName) {
            return `${authorInfo.firstName} ${authorInfo.lastName}`;
        }

        return 'Auteur non chargé';
    };

    const GetEditorName = (editorInfo) => {
        if (editorInfo && editorInfo.name) {
            return `${editorInfo.name} ${editorInfo.headquarters}`
        }

        return 'Editeur non chargé';
    };

    const handleImageError = (e) => {
        e.target.src = 'https://placehold.co/200x300/cccccc/666666?text=Image+non+disponible';
    };

    return (
        <div className="book-card">
            <div className="book-image-container">
                <img 
                src={book.image || 'https://placehold.co/200x300/cccccc/666666?text=Pas+d\'image'}
                alt={book.title} 
                className="book-image"
                onError={handleImageError}/>
            </div>

            <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">Par {GetAuthorName(book.authorInfo)}</p>
                <p className="book-author">Edité par {GetEditorName(book.editorInfo)}</p>
                {book.description && (
                    <p className="book-description">
                        {book.description.length > 100 ? `${book.description.substring(0,100)}...` : book.description }
                    </p>
                )}

                <div className="book-meta">
                    <span>📄 {book.pages} pages</span>
                </div>
            </div>

            <div className="book-actions">
                <button className="btn btn-edit"
                onClick={() => onEdit(book)} >
                ✏️ Modifier
                </button>
                <button
                className="btn btn-delete"
                onClick={() => onDelete(book.id)}>
                    🚮 Supprimer
                </button>
            </div>
        </div>
    );
};

export default BookCard;