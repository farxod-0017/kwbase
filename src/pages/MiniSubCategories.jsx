// src/pages/MiniSubCategories.jsx
import { useEffect, useState } from "react";
import axios from "axios";
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

    useEffect(() => {
        fetchMiniSubs();
        fetchCategories();
        fetchSubCategories();
    }, []);

    useEffect(() => {
        let data = [...miniSubs];
        if (filterCategory) {
            data = data.filter((m) => m.categoryId === filterCategory);
        }
        if (filterSubCategory) {
            data = data.filter((m) => m.subCategoryId === filterSubCategory);
        }
        setFilteredMiniSubs(data);
    }, [filterCategory, filterSubCategory, miniSubs]);

    const fetchMiniSubs = async () => {
        const res = await axios.get("/minisubcategories");
        setMiniSubs(res.data);
        setFilteredMiniSubs(res.data);
    };

    const fetchCategories = async () => {
        const res = await axios.get("/categories");
        setCategories(res.data);
    };

    const fetchSubCategories = async () => {
        const res = await axios.get("/subcategories");
        setSubCategories(res.data);
    };

    const handleAdd = async () => {
        if (!newName.trim() || !categoryId || !subCategoryId) return;

        // Duplicate check (hatto boshqa category/subcategory bo‘lsa ham)
        const exists = miniSubs.some(
            (m) => m.name.toLowerCase() === newName.toLowerCase()
        );
        if (exists) {
            alert("Bunday nomli MiniSubCategory allaqachon mavjud!");
            return;
        }

        await axios.post("/minisubcategories", {
            name: newName,
            categoryId,
            subCategoryId,
        });

        setNewName("");
        setCategoryId("");
        setSubCategoryId("");
        fetchMiniSubs();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("O‘chirishni xohlaysizmi?")) return;
        await axios.delete(`/minisubcategories/${id}`);
        fetchMiniSubs();
    };

    const openEditModal = (mini) => {
        setEditingMiniSub(mini);
        setEditName(mini.name);
        setEditCategoryId(mini.categoryId);
        setEditSubCategoryId(mini.subCategoryId);
    };

    const handleUpdate = async () => {
        if (!editName.trim() || !editCategoryId || !editSubCategoryId) return;

        const exists = miniSubs.some(
            (m) =>
                m.name.toLowerCase() === editName.toLowerCase() &&
                m.id !== editingMiniSub.id
        );
        if (exists) {
            alert("Bunday nomli MiniSubCategory allaqachon mavjud!");
            return;
        }

        await axios.put(`/minisubcategories/${editingMiniSub.id}`, {
            name: editName,
            categoryId: editCategoryId,
            subCategoryId: editSubCategoryId,
        });

        setEditingMiniSub(null);
        fetchMiniSubs();
    };

    return (
        <div className="mini-page">
            <h2 className="text-xl font-bold mb-4">MiniSubCategories</h2>

            {/* Filter */}
            <div className="flex gap-2 mb-4">
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border px-2 py-1"
                >
                    <option value="">Filter by Category</option>
                    {/* {categories?.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))} */}
                </select>

                <select
                    value={filterSubCategory}
                    onChange={(e) => setFilterSubCategory(e.target.value)}
                    className="border px-2 py-1"
                >
                    <option value="">Filter by SubCategory</option>
                    {/* {subCategories?.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))} */}
                </select>
            </div>

            {/* Add form */}
            <div className="fixed bottom-4 left-4 bg-white shadow p-4 border">
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
                    {[1,2,3].map((c) => (
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
                        [1,2,3,4,].filter((s) => !categoryId || s.categoryId === categoryId)
                        .map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                </select>
                <button
                    onClick={handleAdd}
                    className="bg-black text-white px-4 py-1 hover:bg-gray-700"
                >
                    Add
                </button>
            </div>

            {/* Table */}
            <table className="w-full border mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Name</th>
                        <th className="border px-2 py-1">Category</th>
                        <th className="border px-2 py-1">SubCategory</th>
                        <th className="border px-2 py-1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* filteredMiniSubs? */}
                    {[1,2,3,4,5].map((m) => (
                        <tr key={m.id}>
                            <td className="border px-2 py-1">{m.id}</td>
                            <td className="border px-2 py-1">{m.name}</td>
                            <td className="border px-2 py-1">
                                {/* categories */}
                                {[1,2,3,4].find((c) => c.id === m.categoryId)?.name}
                            </td>
                            <td className="border px-2 py-1">
                                {/* subCategories? */}
                                {[1,2,3].find((s) => s.id === m.subCategoryId)?.name}
                            </td>
                            <td className="border px-2 py-1 flex gap-2">
                                <button
                                    onClick={() => openEditModal(m)}
                                    className="px-2 py-1 border hover:bg-gray-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(m.id)}
                                    className="px-2 py-1 border text-red-600 hover:bg-red-100"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit modal */}
            {editingMiniSub && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-4 shadow-lg border w-96">
                        <h3 className="text-lg font-bold mb-2">Edit MiniSubCategory</h3>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border w-full px-2 py-1 mb-2"
                        />
                        <select
                            value={editCategoryId}
                            onChange={(e) => setEditCategoryId(e.target.value)}
                            className="border w-full px-2 py-1 mb-2"
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
                            className="border w-full px-2 py-1 mb-2"
                        >
                            <option value="">SubCategory tanlang</option>
                            {subCategories
                                .filter((s) => !editCategoryId || s.categoryId === editCategoryId)
                                .map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingMiniSub(null)}
                                className="px-3 py-1 border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-3 py-1 bg-black text-white hover:bg-gray-700"
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
