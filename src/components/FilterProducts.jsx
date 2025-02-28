import { useState } from "react";
import { Link } from "react-router-dom";

function FilterProducts( {plants}) {
    const [category, setCategory] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
  
    const handleFilter = (e) => {
      const selectedCategory = e.target.value;
      setCategory(selectedCategory);
      const filtered = plants
        .filter((cat) => cat.category === selectedCategory)
        .flatMap((cat) => cat.plants);
      setFilteredProducts(filtered);
    };
  
    return (
      <div>
        <h1>Filter Products by Category</h1>
        <select value={category} onChange={handleFilter}>
          <option value="">Select Category</option>
          {plants.map((cat, index) => (
            <option key={index} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>
        <ul>
          {filteredProducts.map((plant, index) => (
            <li key={index}>
              <Link to={`/plant/${plant.id}`}>
                {plant.name} - {plant.cost} ({plant.status || "No Status"})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  export default FilterProducts;