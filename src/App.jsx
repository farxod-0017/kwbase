import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import Categories from './pages/CategoryPage';
import SubCategories from './pages/SubCategories';
import MiniSubCategories from './pages/MiniSubCategories';
import ProductsPage from './pages/ProductsPage';

// Sahifalar (hozircha bo‘sh komponentlar)
// function Categories() {
//   return <h2>Categories Page</h2>;
// }
// function SubCategories() {
//   return <h2>SubCategories Page</h2>;
// }
// function Products() {
//   return <h2>Products Page</h2>;
// }

// Layout
function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="categories" element={<Categories />} />
          <Route path="subcategories" element={<SubCategories />} />
          <Route path='minisubcategories' element={<MiniSubCategories/>}/>
          <Route path="products" element={<ProductsPage/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

