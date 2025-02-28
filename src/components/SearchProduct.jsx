import { useState } from "react";
import { Link } from "react-router-dom";

function SearchProduct({ plants }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
  
    const handleSearchInput = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const handleSearchClick = () => {
      const term = searchTerm.toLowerCase();
      if (!term) return;
      
      const filteredPlants = plants
        .flatMap((category) => category.plants)
        .filter((plant) => plant.name.toLowerCase().startsWith(term));
      setResults(filteredPlants);
    };
  
    return (
      <div>
        <h1>Search Product by Name</h1>
        <label>Name: </label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInput}
          placeholder="Enter plant name..."
        />
        <button onClick={handleSearchClick}>Search</button>
        <ul>
          {results.map((plant, index) => (
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

  export default SearchProduct;