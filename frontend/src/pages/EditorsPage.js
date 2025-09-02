import React, { useState, useEffect, useCallback, use } from "react";
import { editorService } from "../services/api";
import './EditorsPage.css';

const EditorsPage = () => {
    const [editors, setEditors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEditors, setFilteredEditors] = useState([]);
    const [form, setForm] = useState({ name: "", creationDate: "", headquarters: ""});
    const [editingId, setEditingId] = useState(null);

    const loadEditors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await editorService.getAll();
            setEditors(data);
        } catch (e) {
            setError('Errur lors du chargement des éditeurs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEditors();
    }, [loadEditors]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEditors(editors);
        } else {
            setFilteredEditors(
                editors.filter(e =>
                    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    e.headquarters.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (e.creationDate && e.creationDate.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
    }, [editors, searchTerm]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if(editingId) {
                await editorService.update(editingId, form);
            } else {
                await editorService.create(form);
            }
            setForm({ name: "", creationDate: "", headquarters: ""});
            setEditingId(null);
            loadEditors();
        } catch (e) {
            setError("Erreur lors de la sauvegarde de l'éditeur");
        }
    };

    const handleEdit = editor => {
        setForm({ name: editor.name, creationDate: editor.creationDate, headquarters: editor.headquarters});
        setEditingId(editor.id);
    };

    const handleDelete = async id => {
        if (!window.confirm('Supprimer cet éditeur ?')) return;
        try {
            await editorService.delete(id);
            loadEditors();
        } catch (e) {
            setError('Erreur lors de la supression');
        }
    };

    return (
        <div className="authors-page-container">
            <h2>Liste des éditeurs</h2>
            <input
                type="text"
                placeholder="Rechercher un éditeur..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-bar" />
            {error && <div className="error-mesage">{error}</div>}
            {loading ? (
                <div>Chargement...</div>
            ) : (
                <table className="authors-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Date de création</th>
                            <th>Siége Social</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEditors.map(editor => (
                            <tr key={editor.id}>
                                <td>{editor.name}</td>
                                <td>{editor.creationDate}</td>
                                <td>{editor.headquarters}</td>
                                <td>
                                    <button onClick={() => handleEdit(editor)} className="btn-edit">✏️</button>
                                    <button onClick={() => handleDelete(editor.id)} className="btn-delete">🚮</button>
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
                    name="name"
                    placeholder="Nom"
                    value={form.name}
                    onChange={handleChange}
                    required />
                
                <input 
                    type="text"
                    name="creationDate"
                    placeholder="Date de création"
                    value={form.creationDate}
                    onChange={handleChange}
                    required />

                <input 
                    type="text"
                    name="headquarters"
                    placeholder="Siége Social"
                    value={form.headquarters}
                    onChange={handleChange}
                    required />

                <button type="submit" className="btn-save">{editingId ? "Enregistrer" : "Ajouter"}</button>
                {editingId && <button type="button" onClick={() => { setForm({ name: "", creationDate: "", headquarters: ""}); setEditingId(null)}} className="btn-cancel">Annuler</button>}
            </form>
        </div>
    )
};

export default EditorsPage;