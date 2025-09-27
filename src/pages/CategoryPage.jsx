import { useEffect, useState } from "react";
import api from "../api/axios";
import CategoryForm from "../components/CategoryForm";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // 🔹 Fetch all categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get("/categories");
            console.log(res);

            setCategories(res?.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Add new category
    const addCategory = async (data) => {
        try {
            await api.post("/categories", data);
            fetchCategories();
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    // 🔹 Update category
    const updateCategory = async (id, data) => {
        try {
            await api.put(`/categories/${id}`, data);
            fetchCategories();
            setEditingCategory(null);
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    // 🔹 Delete category
    const deleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    //test


    return (
        <div>
            <h2>Categories</h2>
            {/* Forma */}
            <CategoryForm
                onSubmit={editingCategory ? (data) => updateCategory(editingCategory.id, data) : addCategory}
                initialData={editingCategory}
                onCancel={() => setEditingCategory(null)}
                existingCategories={categories}   // 🔹 qo‘shildi
            />


            {/* Jadval */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table border="1" cellPadding="8" style={{ marginTop: "20px", borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.length > 0 ? (
                            categories.map((item, index) => {
                                return (                                
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item?.name}</td>
                                        <td>
                                            <button onClick={() => setEditingCategory(item)}>Edit</button>
                                            <button onClick={() => deleteCategory(item.id)} style={{ marginLeft: "10px", color: "red" }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }
                            )

                        ) : (
                            <tr>
                                <td colSpan="3">No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Categories;
