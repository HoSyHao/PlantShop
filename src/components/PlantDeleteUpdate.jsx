import { useRef, useState } from "react";

const PlantDeleteUpdate = ({ plants, setPlants }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [showUForm, setShowUForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [lastImageUrl, setLastImageUrl] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "",
    description: "",
    cost: "",
    status: "",
    category: "",
  });

  const statusOptions = ["", "Sold Out", "Best Seller", "New Arrival", "Sale"];

  const handleUpdateClick = (plant, category) => {
    setSelectedPlant({ ...plant, category });
    const isFile = plant.image instanceof File;
    setFormData({
      id: plant.id,
      name: plant.name,
      image: isFile ? "" : plant.image,
      description: plant.description,
      cost: plant.cost,
      status: plant.status,
      category: category,
    });
    setLastImageUrl(isFile ? "" : plant.image);
    setImageFile(isFile ? plant.image : null);
    setCategoryError("");
    setShowUForm(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteClick = (plant) => {
    setSelectedPlant(plant);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    const updatedPlants = plants.map((category) => ({
      ...category,
      plants: category.plants.filter((p) => p.id !== selectedPlant.id),
    }));
    setPlants(updatedPlants);
    setShowConfirmDelete(false);
    setSelectedPlant(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "category" || name === "name") {
      const updatedName = name === "name" ? value : formData.name;
      const updatedCategory = name === "category" ? value : formData.category;
      const targetCategory = plants.find(
        (cat) => cat.category === updatedCategory
      );
      const isDuplicate = targetCategory?.plants.some(
        (p) => p.name === updatedName && p.id !== selectedPlant.id
      );
      setCategoryError(
        isDuplicate
          ? "A plant with this name already exists in this category!"
          : ""
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setFormData((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const clearFile = () => {
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image: lastImageUrl,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasChanges = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (key !== "image" && selectedPlant[key] !== value) {
        return true;
      }
    }
    return hasImageChanged();
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!categoryError && hasChanges()) {
      setShowConfirmUpdate(true);
    } else {
      setShowUForm(false);
      setSelectedPlant(null);
      setImageFile(null);
      setCategoryError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const confirmUpdate = () => {
    let updatedPlants = [...plants];

    updatedPlants = updatedPlants.map((category) => ({
      ...category,
      plants: category.plants.filter((p) => p.id !== selectedPlant.id),
    }));

    const updatedPlant = {
      ...formData,
      id: selectedPlant.id,
      image: imageFile || formData.image,
    };

    const categoryIndex = updatedPlants.findIndex(
      (cat) => cat.category === formData.category
    );
    if (categoryIndex !== -1) {
      updatedPlants[categoryIndex].plants.push(updatedPlant);
    } else {
      updatedPlants.push({
        category: formData.category,
        plants: [updatedPlant],
      });
    }

    setPlants(updatedPlants);
    setShowConfirmUpdate(false);
    setSelectedPlant(null);
    setImageFile(null);
    setCategoryError("");
    setShowUForm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getImageName = (image) => {
    if (image instanceof File) return image.name;
    if (typeof image === "string") return image;
    return "No image";
  };

  const hasImageChanged = () => {
    const newImage = imageFile || formData.image;
    const oldImage = selectedPlant.image;

    if (newImage === oldImage) return false;
    if (!newImage && !oldImage) return false;
    if (newImage instanceof File && oldImage instanceof File) {
      return newImage.name !== oldImage.name || newImage.size !== oldImage.size;
    }
    return true;
  };

  const handleCancelUpdate = () => {
    setShowUForm(false);
    setSelectedPlant(null);
    setImageFile(null);
    setCategoryError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="plant-management">
      <div className="plant-list">
        {plants.map((category) => (
          <div key={category.category}>
            <h2>
              <strong>{category.category}</strong>
            </h2>
            {category.plants.map((plant) => (
              <div
                key={plant.id}
                style={{
                  margin: "10px 0",
                  padding: "5px",
                  backgroundColor:
                    selectedPlant && selectedPlant.id === plant.id
                      ? "#e0f7fa" 
                      : "transparent", 
                  borderRadius: "4px", 
                }}
              >
                {plant.name}
                <button
                  onClick={() => handleUpdateClick(plant, category.category)}
                  style={{ marginLeft: "10px" }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(plant)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

     
      {selectedPlant && showUForm && !showConfirmUpdate && !showConfirmDelete && (
        <div
          className="update-form"
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            width: "400px",
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <h3>Update Plant</h3>
          <form onSubmit={handleUpdateSubmit}>
            <div>
              <label>ID:</label>
              <span> {formData.id}</span>
            </div>
            <div>
              <label>Name:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Image:</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                {imageFile && (
                  <>
                    <span style={{ marginLeft: "10px" }}>{imageFile.name}</span>
                    <button
                      type="button"
                      onClick={clearFile}
                      style={{ marginLeft: "10px", color: "red" }}
                    >
                      X
                    </button>
                  </>
                )}
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  disabled={imageFile !== null}
                  placeholder="Enter URL if no file selected"
                  style={{ marginLeft: "10px" }}
                />
              </div>
            </div>
            <div>
              <label>Description:</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Cost:</label>
              <input
                name="cost"
                value={formData.cost}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option || "None"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Category:</label>
              {categoryError && (
                <p style={{ color: "red", margin: "5px 0" }}>{categoryError}</p>
              )}
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
              >
                {plants.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: "10px" }}>
              <button type="submit" disabled={!!categoryError}>
                Submit Update
              </button>
              <button
                type="button"
                onClick={handleCancelUpdate}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showConfirmDelete && (
        <div className="confirm-modal">
          <p>
            Are you sure you want to delete {selectedPlant.name}, ID:{" "}
            {selectedPlant.id}?
          </p>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={() => setShowConfirmDelete(false)}>No</button>
        </div>
      )}

      {showConfirmUpdate && (
        <div className="confirm-modal">
          <p>
            Confirm changes for {selectedPlant.name}, ID: {selectedPlant.id}:
          </p>
          {Object.entries(formData).map(([key, value]) => {
            if (key !== "image" && selectedPlant[key] !== value) {
              return (
                <p key={key}>
                  {key}: {selectedPlant[key]} → {value}
                </p>
              );
            }
            return null;
          })}
          {hasImageChanged() && (
            <p>
              image: {getImageName(selectedPlant.image)} →{" "}
              {getImageName(imageFile || formData.image)}
            </p>
          )}
          <button onClick={confirmUpdate}>Confirm</button>
          <button onClick={() => setShowConfirmUpdate(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PlantDeleteUpdate;