import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/categories" className={({ isActive }) => isActive ? "active" : ""}>
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/subcategories" className={({ isActive }) => isActive ? "active" : ""}>
              SubCategories
            </NavLink>
          </li>
          <li>
            <NavLink to="/minisubcategories" className={({ isActive }) => isActive ? "active" : ""}>
              MiniSubCategories
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>
              Products
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
