import { Link } from "react-router-dom";

function Navbar() {
    return (
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/plants">Product List</Link>
          </li>
          <li>
            <Link to="/search">Search Product by Name</Link>
          </li>
          <li>
            <Link to="/filter">Filter Products by Category</Link>
          </li>
          <li>
            <Link to="/add">Add New Product</Link>
          </li>
          <li>
            <Link to="/update&delete">Update & Delete Product</Link>
          </li>
         
        </ul>
      </nav>
    );
  }

  export default Navbar;