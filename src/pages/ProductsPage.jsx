import { useEffect, useState } from 'react'
import '../styles/products.css'
import api from '../api/axios'


export default function ProductsPage() {
    const [loading, setLoading] = useState(false);
    const [addEditModal, setAddEditModal] = useState(false);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [miniSubs, setMiniSubs] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productBase, setProductBase] = useState(1);

    const [selectedCatId, setSelectedCatId] = useState("");
    const [selectedSubId, setSelectedSubId] = useState("");
    const [selectedMinId, setSelectedMinId] = useState("");
    const [editingProductId, setEditingProductId] = useState("")

    const [filterCatId, setFilterCatId] = useState("");
    const [filterSubId, setFilterSubId] = useState("");
    const [filterMiniId, setFilterMiniId] = useState("")

    const [name, setName] = useState("");
    const [unit, setUnit] = useState("");

    let [pagin, setPagin] = useState(1)

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

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/products/page?page=${pagin}`)
            setProducts(res.data);
            setFilteredProducts(res.data.data);
            setProductBase(1);
        }
        catch (error) {
            console.log("fetch products:", error);
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchProducts()
    }, [pagin])

    function controlMini(id) {
        setSelectedMinId(id);
        const unit = miniSubs?.find((item) => item.id === id)?.unit
        setUnit(unit)
    };
    function updateBase(e) {
        if (productBase === 1 && e !==1) {
            fetchProducts();
        } else if (productBase === 2) {
            fetchMiniProducts()
        }
        if(e===1 && filterMiniId !== "") {            
            fetchProducts()
        }
    };
    function clearFilters() {
        setFilterCatId("");
        setFilterSubId("");
        setFilterMiniId("");
        setProductBase(1);
        updateBase(1);
    };

    function clickPrev() {
        if (products.page === 1) {
            setPagin(products.totalPages)
        } else {
            setPagin(--pagin)
        }
    };
    function clickNext() {
        if (products.page === products.totalPages) {
            setPagin(1)
        } else {
            setPagin(++pagin)
        }
    }


    function openAddModal() {
        setAddEditModal(1);
        setName("");
        setUnit("");
        setSelectedCatId("");
        setSelectedSubId("");
        setSelectedMinId("");
    }
    const handleAdd = async () => {
        if (!name.trim() || !selectedMinId || !unit) {
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
        const exists = filteredProducts.some(
            (m) => m.name.toLowerCase() === name.toLowerCase()
        );
        if (exists) {
            alert("Bunday nomli Product allaqachon mavjud!");
            return;
        }

        await api.post("/products", {
            name: name,
            unit: unit,
            subcategory_id: selectedMinId,
        });
        updateBase()
        setAddEditModal(false)
    };


    function openEditModal(pr) {
        setEditingProductId(pr.id)
        setSelectedCatId(pr.subcategory.parent.category.id);
        setSelectedSubId(pr.subcategory.parent.id);
        setSelectedMinId(pr.subcategory.id);
        setName(pr.name)
        setUnit(pr.unit || "")
        setAddEditModal(2);
    };
    const handleUpdate = async () => {
        if (!name.trim() || !selectedMinId || !unit) {
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
        const exists = filteredProducts.some(
            (m) => m.name.toLowerCase() === name.toLowerCase() &&
                m.id !== editingProductId
        );
        if (exists) {
            alert("Bunday nomli Product allaqachon mavjud!");
            return;
        }

        await api.put(`/products/${editingProductId}`, {
            name: name,
            unit: unit,
            subcategory_id: selectedMinId,
        });
        updateBase()
        setAddEditModal(false)
    };

    const handleDelete = async (id) => {
        if (!window.confirm("O‘chirishni xohlaysizmi?")) return;
        await api.delete(`/products/${id}`);
        updateBase();
    };

    // Filters Gets
    const fetchMiniProducts = async () => {
        if (filterMiniId === "") return
        try {
            setLoading(true)
            const res = await api.get(`/products/subcategory/${filterMiniId}`);
            if (res.data) {
                setFilteredProducts(res.data);
                setProductBase(2);
                console.log("ok");
            }
        }
        catch (error) {
            console.log("fetch mini products:", error);
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchMiniProducts()
    }, [filterMiniId]);


    return (
        <section className="product-page mini-page">
            <div className="fixed-head">
                <h2>Products Page</h2>
                <div className="product-head">
                    <div className="product-filter">
                        <select
                            value={filterCatId}
                            onChange={(e) => setFilterCatId(e.target.value)}
                        >
                            <option value="">Category tanlang</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterSubId}
                            onChange={(e) => setFilterSubId(e.target.value)}
                        >
                            <option value="">SubCategory tanlang</option>
                            {subCategories
                                .filter((s) => !filterCatId || s.category_id === filterCatId)
                                .map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                        </select>
                        <select
                            value={filterMiniId}
                            onChange={(e) => setFilterMiniId(e.target.value)}
                        >
                            <option value="">MiniSubCategory tanlang</option>
                            {miniSubs
                                .filter((ms) => !filterSubId || ms.parent_id === filterSubId)
                                .map((m) => {
                                    return (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    )
                                })
                            }
                        </select>
                        <button onClick={() => clearFilters()} className='clear-filters'>Clear Filters</button>
                    </div>
                    <button onClick={() => openAddModal()} type="button">Add Product</button>
                </div>
            </div>

            <div className="table_wrap">
                {loading ?
                    <p>Loading ...</p> :
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
                            {filteredProducts.length > 0 ?
                                filteredProducts.map((pr, index) => {
                                    return (
                                        <tr key={pr.id}>
                                            <td>{index + 1}</td>
                                            <td>{pr.name}</td>
                                            <td>{pr.subcategory.parent.category.name}</td>
                                            <td>{pr.subcategory.parent.name}</td>
                                            <td>{pr.subcategory.name}</td>
                                            <td>{pr.unit || "-"}</td>
                                            <td>
                                                <div className="actions">
                                                    <button onClick={() => openEditModal(pr)} className="btn primary" type="button">Edit</button>
                                                    <button onClick={() => handleDelete(pr.id)} className="btn danger" type="button">Delete</button>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                })
                                :
                                <tr><td><p>Not Found</p></td></tr>
                            }
                        </tbody>
                    </table>
                }
            </div>
            {productBase === 1 ?
                <div className="pagination">
                    <button onClick={() => clickPrev()} type="button">prev</button>
                    <div className="pagin_center">
                        <h4>
                            {products.page + "/" + products.totalPages}
                        </h4>
                    </div>
                    <button onClick={() => clickNext()} type='button'>next</button>
                </div> :
                <span></span>
            }
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
                                    onChange={(e) => controlMini(e.target.value)}
                                >
                                    <option value="">MiniSubCategory tanlang</option>
                                    {miniSubs
                                        .filter((ms) => !selectedSubId || ms.parent_id === selectedSubId)
                                        .map((m) => {
                                            return (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input
                                    placeholder='Product name'
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                >
                                    <option value="">unit:</option>
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
                                {addEditModal === 1 ?
                                    <button
                                        className="btn primary"
                                        onClick={() => handleAdd()}
                                    >
                                        Save
                                    </button>
                                    :
                                    <button
                                        type="button"
                                        className='btn primary'
                                        onClick={() => handleUpdate()}
                                    >
                                        Save(edit)
                                    </button>

                                }

                            </div>
                        </div>
                    </div>
                )
            }

        </section>
    )
}