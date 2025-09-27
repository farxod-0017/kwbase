import { useEffect, useState } from "react";
import api from "../api/axios";
import '../styles/subCateg.css'

function SubCategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");

  const [filterCategory, setFilterCategory] = useState("");

  // 🔹 Update modal state
  const [editingSubCat, setEditingSubCat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/subcategories");
      setSubCategories(res.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add subcategory
  const addSubCategory = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedCategory) return;

    // 🔹 Duplicate check (global)
    const isDuplicate = subCategories.some(
      (sc) => sc.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (isDuplicate) {
      setError("This SubCategory already exists!");
      return;
    }

    try {
      await api.post("/subcategories", { name, category_id: selectedCategory });
      setName("");
      setSelectedCategory("");
      setError("");
      fetchSubCategories();
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  // Update subcategory
  const updateSubCategory = async (e) => {
    e.preventDefault();
    if (!editingSubCat.name.trim() || !editingSubCat.category_id) return;

    // 🔹 Duplicate check (global, o‘zidan tashqari)
    const isDuplicate = subCategories.some(
      (sc) =>
        sc.name.toLowerCase().trim() === editingSubCat.name.toLowerCase().trim() &&
        sc.id !== editingSubCat.id
    );
    if (isDuplicate) {
      alert("This SubCategory already exists!");
      return;
    }

    try {
      await api.put(`/subcategories/${editingSubCat._id}`, {
        name: editingSubCat.name,
        category_id: editingSubCat.category_id,
      });
      setModalOpen(false);
      setEditingSubCat(null);
      fetchSubCategories();
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  // Delete
  const deleteSubCategory = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      await api.delete(`/subcategories/${id}`);
      fetchSubCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  // Filtered list
  const filteredSubCategories = filterCategory
    ? subCategories.filter((sc) => sc.category_id === filterCategory)
    : subCategories;

  return (
    <div>
      <h2>SubCategories</h2>

      {/* Filter */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="cat-input"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Form (fixed) */}
      <form onSubmit={addSubCategory} className="subcat-form">
        <input
          type="text"
          placeholder="SubCategory name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="cat-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="cat-input"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="cat-btn">Add</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Jadval */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "80px", borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>SubCategory Name</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubCategories.length > 0 ? (
              filteredSubCategories.map((sc, index) => (
                <tr key={sc.id}>
                  <td>{index + 1}</td>
                  <td>{sc.name}</td>
                  <td>{sc.category?.name}</td>
                  <td>
                    <button onClick={() => { setEditingSubCat(sc); setModalOpen(true); }}>Edit</button>
                    <button onClick={() => deleteSubCategory(sc.id)} style={{ marginLeft: "10px", color: "red" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No subcategories found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit SubCategory</h3>
            <form onSubmit={updateSubCategory}>
              <input
                type="text"
                value={editingSubCat?.name || ""}
                onChange={(e) => setEditingSubCat({ ...editingSubCat, name: e.target.value })}
                className="cat-input"
              />
              <select
                value={editingSubCat?.category_id || ""}
                onChange={(e) => setEditingSubCat({ ...editingSubCat, category_id: e.target.value })}
                className="cat-input"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: "10px" }}>
                <button type="submit" className="cat-btn">Update</button>
                <button type="button" onClick={() => setModalOpen(false)} className="cat-btn cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubCategories;
