import { useState, useEffect } from "react";

function CategoryForm({ onSubmit, initialData, onCancel, existingCategories }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        } else {
            setName("");
        }
        setError("");
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        // 🔹 Duplicate check
        const isDuplicate = existingCategories.some(
            (cat) =>
                cat.name.toLowerCase().trim() === name.toLowerCase().trim() &&
                (!initialData || initialData._id !== cat._id) // update paytida o‘zini o‘ziga tekshirmaydi
        );

        if (isDuplicate) {
            setError("This category already exists!");
            return;
        }

        onSubmit({ name });
        setName("");
        setError("");
    };

    return (
        <form className="cat-form" onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="cat-input"
            />
            <button type="submit" className="cat-btn">
                {initialData ? "Update" : "Add"}
            </button>
            {initialData && (
                <button type="button" onClick={onCancel} className="cat-btn cancel">
                    Cancel
                </button>
            )}

            {/* Error chiqarsa */}
            {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
        </form>
    );
}

export default CategoryForm;
