// src/pages/MiniSubCategories.jsx
import { useEffect, useState } from "react";
// import axios from "axios";
import api from '../api/axios'
import '../styles/miniSubCategories.css'

function MiniSubCategories() {
    const [miniSubs, setMiniSubs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredMiniSubs, setFilteredMiniSubs] = useState([]);

    const [newName, setNewName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");

    const [filterCategory, setFilterCategory] = useState("");
    const [filterSubCategory, setFilterSubCategory] = useState("");

    const [editingMiniSub, setEditingMiniSub] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [editSubCategoryId, setEditSubCategoryId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMiniSubs();
        fetchCategories();
        fetchSubCategories();
    }, []);

    useEffect(() => {
        let data = [...miniSubs];
        if (filterCategory) {
            data = data.filter((m) => m.category_id === filterCategory);
        }
        if (filterSubCategory) {
            data = data.filter((m) => m.parent_id === filterSubCategory);
        }
        setFilteredMiniSubs(data);
    }, [filterCategory, filterSubCategory, miniSubs]);

    const fetchMiniSubs = async () => {
        try {
            setLoading(true)
            const res = await api.get("/subcategories/child");
            setMiniSubs(res.data);
            setFilteredMiniSubs(res.data);
        }
        catch (error) {
            console.log("fetch mini sub cat:", error);
        }
        finally {
            setLoading(false)
        }

    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSubCategories = async () => {
        const res = await api.get("/subcategories");
        setSubCategories(res.data);
    };

    const handleAdd = async () => {
        if (!newName.trim() || !categoryId || !subCategoryId) {
            return (
                // [!newName.trim() || !categoryId || !subCategoryId].filter((note)=> note == true).map((item)=>{
                //     return (
                //         alert("To'ldirilmagan:", item)
                //     )
                // });
                alert("Malumotlar to'ldirilmagan")
            )
        };

        // Duplicate check (hatto boshqa category/subcategory bo‘lsa ham)
        const exists = miniSubs.some(
            (m) => m.name.toLowerCase() === newName.toLowerCase()
        );
        if (exists) {
            alert("Bunday nomli MiniSubCategory allaqachon mavjud!");
            return;
        }

        await api.post("/subcategories", {
            name: newName,
            category_id: categoryId,
            parent_id: subCategoryId,
        });

        setNewName("");
        setCategoryId("");
        setSubCategoryId("");
        fetchMiniSubs();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("O‘chirishni xohlaysizmi?")) return;
        await api.delete(`/subcategories/${id}`);
        fetchMiniSubs();
    };

    const openEditModal = (mini) => {
        setEditingMiniSub(mini);
        setEditName(mini.name);
        setEditCategoryId(mini.category_id);
        setEditSubCategoryId(mini.parent_id);
    };

    const handleUpdate = async () => {
        if (!editName.trim() || !editCategoryId || !editSubCategoryId) return (
            alert("Ma'lumotlarni to'ldiring")
        );

        const exists = miniSubs.some(
            (m) =>
                m.name.toLowerCase() === editName.toLowerCase() &&
                m.id !== editingMiniSub.id
        );
        if (exists) {
            alert("Bunday nomli MiniSubCategory allaqachon mavjud!");
            return;
        }

        await api.put(`/subcategories/${editingMiniSub.id}`, {
            name: editName,
            category_id: editCategoryId,
            parent_id: editSubCategoryId,
        });

        setEditingMiniSub(null);
        fetchMiniSubs();
    };

    return (
        <div className="mini-page">
            <h2>MiniSubCategories</h2>

            {/* Filter */}
            <div className="filters">
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-control"
                >
                    <option value="">Filter by Category(All)</option>
                    {categories.length > 0 ?
                        categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        )) : "Yuklanmoqda"}
                </select>

                <select
                    value={filterSubCategory}
                    onChange={(e) => setFilterSubCategory(e.target.value)}
                    className="form-control"
                >
                    <option value="">Filter by SubCategory(All)</option>
                    {subCategories?.filter((s) => !filterCategory || s.category_id === filterCategory).map((item) =>{
                        return (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        )
                    })}
                </select>
            </div>

            {/* Add form */}
            <div className="fixed-add">
                <input
                    type="text"
                    placeholder="MiniSubCategory nomi"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border px-2 py-1 mr-2"
                />
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="border px-2 py-1 mr-2"
                >
                    <option value="">Category tanlang</option>
                    {/* categories? */}
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <select
                    value={subCategoryId}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                    className="border px-2 py-1 mr-2"
                >
                    <option value="">SubCategory tanlang</option>
                    {/* subCategories */}
                    {
                        subCategories?.filter((s) => !categoryId || s.category_id === categoryId)
                            .map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                </select>
                <button
                    onClick={handleAdd}
                    className="btn primary"
                >
                    Add
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading ...</p>
            ) :
                <table className="table">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>SubCategory</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* filteredMiniSubs? */}
                        {filteredMiniSubs.length > 0 ?
                            filteredMiniSubs.map((m, index) => {
                                return (
                                    <tr key={m.id}>
                                        <td>{index + 1}</td>
                                        <td>{m.name}</td>
                                        <td>
                                            {/* categories */}
                                            {categories?.find((c) => c.id === m.category_id)?.name}
                                        </td>
                                        <td>
                                            {/* subCategories? */}
                                            {subCategories?.find((s) => s.id === m.parent_id)?.name}
                                        </td>
                                        <td className="actions">
                                            <button
                                                onClick={() => openEditModal(m)}
                                                className="btn primary"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(m.id)}
                                                className="btn danger"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }) : <tr><td><p>Mavjud Emas</p></td></tr>}
                    </tbody>
                </table>
            }
            {/* Edit modal */}
            {editingMiniSub && (
                <div className="modal-backdrop">
                    <div className="modal-window">
                        <div className="modal-row">

                            <h3>Edit MiniSubCategory</h3>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <select
                                value={editCategoryId}
                                onChange={(e) => setEditCategoryId(e.target.value)}
                            >
                                <option value="">Category tanlang</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={editSubCategoryId}
                                onChange={(e) => setEditSubCategoryId(e.target.value)}
                            >
                                <option value="">SubCategory tanlang</option>
                                {subCategories
                                    .filter((s) => !editCategoryId || s.category_id === editCategoryId)
                                    .map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="controls">
                            <button
                            className="btn danger"
                                onClick={() => setEditingMiniSub(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn primary"
                                onClick={handleUpdate}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MiniSubCategories;
