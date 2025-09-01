import React, { useState, useEffect, useCallback } from "react";
import { authorService } from "../services/api";
import './AuthorsPage.css';

const AuthorsPage = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [form, setForm] = useState({ firstName: "", lastName: "", country: "" });
    const [editingId, setEditingId] = useState(null);

    const loadAuthors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await authorService.getAll();
            setAuthors(data);
        } catch (e) {
            setError('Erreur lors du chargement des auteurs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAuthors();
    }, [loadAuthors]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredAuthors(authors);
        } else {
            setFilteredAuthors(
                authors.filter(a =>
                    a.fistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (a.country && a.country.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
    }, [authors, searchTerm]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editingId) {
                await authorService.update(editingId, form);
            } else {
                await authorService.create(form);
            }
            setForm({ firtName: "", lastName: "", country: "" });
            setEditingId(null);
            loadAuthors();
        } catch (e) {
            setError("Erreur lors de la sauvegarde de l'auteur");
        }
    };

    const handleEdit = author => {
        setForm({ firstName: author.firstName, lastName: author.lastName, country: author.country });
        setEditingId(author.id);
    };

    const handleDelete = async id => {
        if (!window.confirm('Supprimer cet auteur ?')) return;
        try {
            await authorService.delete(id);
            loadAuthors();
        } catch (e) {
            setError('Erreur lors de la supression');
        }
    };

    return (
        <div className="authors-page-container">
            <h2>Liste des autheurs</h2>
            <input
                type="text"
                placeholder="Rechercher un auteur..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-bar" />
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div>Chargement...</div>
            ) : (
                <table className="authors-table">
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Pays</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAuthors.map(author => (
                            <tr key={author.id} >
                                <td>{author.firstName}</td>
                                <td>{author.lastName}</td>
                                <td>{author.country}</td>
                                <td>
                                    <button onClick={() => handleEdit(author)} className="btn-edit">✏️</button>
                                    <button onClick={() => handleDelete(author.id)} className="btn-delete">🚮</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3>{editingId ? 'Modifier' : 'Ajouter'} un auteur</h3>
            <form onSubmit={handleSubmit} className="author-form">
                <input 
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={form.firstName}
                onChange={handleChange}
                required />
                <input 
                type="text"
                name="lastName"
                placeholder="Nom"
                value={form.lastName}
                onChange={handleChange}
                required />
                <input 
                type="text"
                name="country"
                placeholder="Pays"
                value={form.country}
                onChange={handleChange}
                />
                <button type="submit" className="btn-save">{editingId ? 'Enregistrer' : 'Ajouter'}</button>
                {editingId && <button type="button" onClick={() => { setForm({ firstName: "", lastName: "", country: ""}); setEditingId(null)}} className="btn-cancel">Annuler</button>}
            </form>
        </div >
    )
};

export default AuthorsPage;