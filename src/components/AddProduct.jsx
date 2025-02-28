/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct({ plants, setPlants }) { 
    const [newProduct, setNewProduct] = useState({
        id: "",
        name: "",
        image: null,
        description: "",
        cost: "",
        status: "",
        category: "", 
    });
  
    const [categorySelected, setCategorySelected] = useState(false); 
    const navigate = useNavigate();
  
    const categories = Array.isArray(plants)
        ? [...new Set(plants.map((cat) => cat.category))]
        : [];
  
    const getNextId = () => {
        if (!Array.isArray(plants) || plants.length === 0) return "PL001";
        const allPlants = plants.flatMap(cat => cat.plants || []);
        const maxIdNum = allPlants.length > 0 
            ? Math.max(...allPlants.map(plant => {
                const numPart = plant.id?.replace("PL", "") || "0";
                return parseInt(numPart, 10);
            }))
            : 0;
        const nextNum = maxIdNum + 1;
        return `PL${nextNum.toString().padStart(3, "0")}`;
    };
  
    useEffect(() => {
        setNewProduct(prev => ({ ...prev, id: getNextId() }));
    }, [plants]);
  
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const selectedCategory = plants.find(cat => cat.category === newProduct.category);
        const isDuplicate = selectedCategory?.plants.some(
            plant => plant.name.toLowerCase() === newProduct.name.trim().toLowerCase()
        );

        if (isDuplicate) {
            alert("A plant with this name already exists in this category!");
            return;
        }

        const updatedPlants = Array.isArray(plants) ? [...plants] : [];
        const categoryIndex = updatedPlants.findIndex(
            (cat) => cat.category === newProduct.category
        );
        
        const plantToAdd = {
            ...newProduct,
            image: newProduct.image,
        };

        if (categoryIndex !== -1) {
            updatedPlants[categoryIndex].plants.push(plantToAdd);
        } else {
            updatedPlants.push({
                category: newProduct.category,
                plants: [plantToAdd],
            });
        }
        setPlants(updatedPlants);
        alert(`New plant with ID ${plantToAdd.id} added successfully!`);
        navigate("/plants"); 
    };
  
    const handleImageChange = (e) => {
        const file = e.target.files[0]; 
        if (file && file.type.startsWith("image/")) {
            setNewProduct({ ...newProduct, image: file });
        }
    };
  
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setNewProduct({ ...newProduct, category: selectedCategory });
        setCategorySelected(!!selectedCategory); 
    };
  
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isFormValid = () => {
        return (
            categorySelected &&
            newProduct.name.trim() !== "" &&
            newProduct.description.trim() !== "" &&
            newProduct.cost.trim() !== "" &&
            newProduct.image !== null
        );
    };
  
    const statusOptions = ["", "Sold Out", "Best Seller", "New Arrival", "Sale"];
  
    return (
        <div className="plant-management">
            <div className="update-form" style={{ marginTop: '20px' }}>
                <h3>Add New Plant</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Category:</label>
                        <select
                            name="category"
                            value={newProduct.category}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
  
                    <div style={{ opacity: categorySelected ? 1 : 0.5, pointerEvents: categorySelected ? "auto" : "none" }}>
                        <div>
                            <label>ID:</label>
                            <span> {newProduct.id}</span>
                        </div>
                        <div>
                            <label>Name:</label>
                            <input
                                name="name"
                                value={newProduct.name}
                                onChange={handleFormChange}
                                disabled={!categorySelected}
                            />
                        </div>
                        <div>
                            <label>Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={!categorySelected}
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <input
                                name="description"
                                value={newProduct.description}
                                onChange={handleFormChange}
                                disabled={!categorySelected}
                            />
                        </div>
                        <div>
                            <label>Cost:</label>
                            <input
                                name="cost"
                                value={newProduct.cost}
                                onChange={handleFormChange}
                                disabled={!categorySelected}
                            />
                        </div>
                        <div>
                            <label>Status:</label>
                            <select
                                name="status"
                                value={newProduct.status}
                                onChange={handleFormChange}
                                disabled={!categorySelected}
                            >
                                {statusOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option || "None"}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
  
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" disabled={!isFormValid()}>
                            Add Plant
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;