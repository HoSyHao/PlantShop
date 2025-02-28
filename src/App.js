
import { plants as initialPlants } from "./plants_06.js";
import "./assets/ProductList.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PlantList from "./components/PlantList.jsx";
import PlantDetail from "./components/PlantDetail.jsx";
import SearchProduct from "./components/SearchProduct.jsx";
import FilterProducts from "./components/FilterProducts.jsx";
import AddProduct from "./components/AddProduct.jsx";
import PlantDeleteUpdate from "./components/PlantDeleteUpdate.jsx";
import { useState } from "react";

function App() {
  const [plants, setPlants] = useState(initialPlants);
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/plants" element={<PlantList plants={plants}/>} />
          <Route path="/plants/:id" element={<PlantDetail plants={plants}/>} />

          <Route path="/search" element={<SearchProduct plants={plants} />} />
          <Route path="/filter" element={<FilterProducts plants={plants}/>} />
          <Route path="/add" element={<AddProduct plants={plants} setPlants={setPlants} />} />
          <Route path="/update&delete" element={<PlantDeleteUpdate plants={plants} setPlants={setPlants}/>} />
        </Routes>
      </div>
    </Router>
  );
}















export default App;
