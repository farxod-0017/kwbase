import { useEffect, useState } from 'react'
import '../styles/products.css'
import api from '../api/axios'


export default function ProductsPage() {
    const [loading, setLoading] = useState(false);
    const [addEditModal, setAddEditModal] = useState(false);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [miniSubs, setMiniSubs] = useState([]);

    const [selectedCatId, setSelectedCatId] = useState("");
    const [selectedSubId, setSelectedSubId] = useState("");
    const [selectedMinId, setSelectedMinId] = useState("");

    const [name, setName] = useState("");
    const [union, setUnion] = useState("");

    useEffect(() => {
        fetchMiniSubs();
        fetchCategories();
        fetchSubCategories();
    }, []);

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

    function openEditModal() {
        setAddEditModal(2)
    }
    return (
        <section className="product-page mini-page">
            <div className="fixed-head">
                <h2>Products Page</h2>
                <div className="product-head">
                    <div className="product-filter">
                        <select>
                            <option value="">Filter by Category (All)</option>
                        </select>
                        <select>
                            <option value="">Filter by SubCategory (All)</option>
                        </select>
                        <select>
                            <option value="">Filter by MiniSubCategory (All)</option>
                        </select>
                    </div>
                    <button onClick={() => setAddEditModal(1)} type="button">Add Product</button>
                </div>
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th>N</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>SubCategory</th>
                        <th>MiniSubcategory</th>
                        <th>Unit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Nomi</td>
                        <td>swd</td>
                        <td>dw</td>
                        <td>csfd</td>
                        <td>kg</td>
                        <td>
                            <div className="actions">
                                <button onClick={() => openEditModal()} className="btn primary" type="button">Edit</button>
                                <button className="btn danger" type="button">Delete</button>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
            {
                addEditModal && (
                    <div className='modal-backdrop'>
                        <div className="modal-window">
                            <div className="modal-row">
                                <h3>{addEditModal === 1 ? "Add Product" : "Edit MiniSubCategory"}</h3>
                                <select
                                    value={selectedCatId}
                                    onChange={(e) => setSelectedCatId(e.target.value)}
                                >
                                    <option value="">Category tanlang</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedSubId}
                                    onChange={(e) => setSelectedSubId(e.target.value)}
                                >
                                    <option value="">SubCategory tanlang</option>
                                    {subCategories
                                        .filter((s) => !selectedCatId || s.category_id === selectedCatId)
                                        .map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                </select>
                                <select
                                    value={selectedMinId}
                                    onChange={(e) => setSelectedMinId(e.target.value)}
                                >
                                    {miniSubs
                                        .filter((ms) => !selectedSubId || ms.parent_id === selectedSubId)
                                        .map((m) => {
                                            return (
                                                <option value={m.id}>{m.name}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <select
                                    value={union}
                                    onChange={(e) => setUnion(e.target.value)}
                                >
                                    <option value="kg">kg</option>
                                    <option value="to‘nna">to‘nna</option>
                                    <option value="dona">dona</option>
                                    <option value="m.kub">m.kub</option>
                                    <option value="metr">metr</option>
                                    <option value="litr">litr</option>
                                    <option value="m.kv">m.kv</option>
                                </select>
                            </div>

                            <div className="controls">
                                <button
                                    className="btn danger"
                                    onClick={() => setAddEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn primary"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </section>
    )
}