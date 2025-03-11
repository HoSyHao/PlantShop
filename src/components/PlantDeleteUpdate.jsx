import { useRef, useState } from "react";

const PlantDeleteUpdate = ({ plants, setPlants }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showUForm, setShowUForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [lastImageUrl, setLastImageUrl] = useState("");
  const [nameError, setNameError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "",
    description: "",
    cost: "",
    status: "",
    category: "", // Giữ category trong dữ liệu nhưng không hiển thị trong giao diện chính
  });

  const statusOptions = ["", "Sold Out", "Best Seller", "New Arrival", "Sale"];

  const getImageSrc = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string" && image) {
      return `/assets/images/${image}`;
    }
    return "/assets/images/placeholder.jpg";
  };

  const checkImageExists = (src, callback) => {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = src;
  };

  const handleUpdateClick = (plant) => {
    setSelectedPlant(plant);
    const isFile = plant.image instanceof File;
    setFormData({
      id: plant.id,
      name: plant.name,
      image: isFile ? "" : plant.image,
      description: plant.description,
      cost: plant.cost,
      status: plant.status,
      category: plant.category,
    });
    setLastImageUrl(isFile ? "" : plant.image);
    setImageFile(isFile ? plant.image : null);
    setImagePreview(
      isFile ? URL.createObjectURL(plant.image) : getImageSrc(plant.image)
    );
    setNameError("");
    setImageError("");
    setShowUForm(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteClick = (plant) => {
    setSelectedPlant(plant);
    setShowConfirmDelete(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image" && !imageFile) {
      if (value.trim() === "") {
        setImagePreview(null);
        setImageError("");
      } else {
        const src = getImageSrc(value);
        checkImageExists(src, (exists) => {
          if (exists) {
            setImagePreview(src);
            setImageError("");
          } else {
            setImagePreview(null);
            setImageError("File not found");
          }
        });
      }
    }

    if (name === "name") {
      const allPlants = plants.flatMap(cat => cat.plants);
      const isDuplicate = allPlants.some(
        (p) => p.name === value && p.id !== selectedPlant.id
      );
      setNameError(
        isDuplicate ? "A plant with this name already exists!" : ""
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
      setImagePreview(URL.createObjectURL(file));
      setImageError("");
    }
  };

  const clearFile = () => {
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image: lastImageUrl,
    }));
    setImagePreview(getImageSrc(lastImageUrl));
    setImageError("");
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
    if (!nameError && hasChanges()) {
      setShowConfirmUpdate(true);
    } else {
      resetForm();
    }
  };

  const confirmUpdate = () => {
    // Lấy danh sách phẳng của tất cả plants
    const allPlants = plants.flatMap(category =>
      category.plants.map(plant => ({
        ...plant,
        category: category.category,
      }))
    );

    // Loại bỏ sản phẩm cũ
    const filteredPlants = allPlants.filter(p => p.id !== selectedPlant.id);

    // Tạo sản phẩm đã update
    const updatedPlant = {
      ...formData,
      id: selectedPlant.id,
      image: imageFile || formData.image,
    };

    // Thêm sản phẩm đã update vào đầu danh sách
    filteredPlants.unshift(updatedPlant);

    // Nhóm lại theo category để giữ cấu trúc dữ liệu
    const updatedPlants = [];
    filteredPlants.forEach(plant => {
      const categoryIndex = updatedPlants.findIndex(cat => cat.category === plant.category);
      if (categoryIndex !== -1) {
        updatedPlants[categoryIndex].plants.push(plant);
      } else {
        updatedPlants.push({
          category: plant.category,
          plants: [plant],
        });
      }
    });

    setPlants(updatedPlants);
    resetForm();
  };

  const confirmDelete = () => {
    let updatedPlants = [...plants];
    updatedPlants = updatedPlants.map((category) => ({
      ...category,
      plants: category.plants.filter((p) => p.id !== selectedPlant.id),
    })).filter(category => category.plants.length > 0); // Loại bỏ category rỗng
    setPlants(updatedPlants);
    resetForm();
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
    resetForm();
  };

  const handleCancelConfirm = () => {
    resetForm();
  };

  const resetForm = () => {
    setShowUForm(false);
    setShowConfirmUpdate(false);
    setShowConfirmDelete(false);
    setSelectedPlant(null);
    setImageFile(null);
    setImagePreview(null);
    setNameError("");
    setImageError("");
    setFormData({
      id: "",
      name: "",
      image: "",
      description: "",
      cost: "",
      status: "",
      category: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Lấy danh sách phẳng để hiển thị
  const allPlants = plants.flatMap(category => category.plants);

  return (
    <div
      className="plant-management"
      style={{ padding: "20px", position: "relative" }}
    >
      <div className="plant-list">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "flex-start",
          }}
        >
          {allPlants.map((plant) => (
            <div
              key={plant.id}
              style={{
                width: "calc(20% - 16px)", // 5 sản phẩm trên 1 hàng (100% / 5 = 20%)
                padding: "10px",
                backgroundColor:
                  selectedPlant && selectedPlant.id === plant.id
                    ? "#e0f7fa"
                    : "transparent",
                border: "1px solid #ddd",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              {getImageSrc(plant.image) && (
                <img
                  src={getImageSrc(plant.image)}
                  alt={plant.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginBottom: "10px",
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <p>
                <strong>{plant.name}</strong>
              </p>
              <p>{plant.cost}</p>
              <p>{plant.description}</p>
              <p>{plant.status || "None"}</p>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleUpdateClick(plant)}
                  style={{ marginRight: "10px" }}
                  disabled={showUForm || showConfirmUpdate || showConfirmDelete}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(plant)}
                  style={{ backgroundColor: "#ff4444", color: "white" }}
                  disabled={showUForm || showConfirmUpdate || showConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(showUForm || showConfirmUpdate || showConfirmDelete) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}

      {selectedPlant && showUForm && !showConfirmUpdate && !showConfirmDelete && (
        <div
          className="update-form"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            padding: "10px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            display: "flex",
          }}
        >
          <div style={{ flex: 1, paddingRight: "10px" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>Update Plant</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div style={{ marginBottom: "5px" }}>
                <label>ID: {formData.id}</label>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <label>Name:</label>
                {nameError && (
                  <p style={{ color: "red", fontSize: "12px", margin: "2px 0" }}>
                    {nameError}
                  </p>
                )}
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  style={{ width: "150px", padding: "2px" }}
                />
              </div>
              <div style={{ marginBottom: "5px" }}>
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ marginBottom: "5px" }}
                />
                {imageFile && (
                  <button
                    type="button"
                    onClick={clearFile}
                    style={{ color: "red", fontSize: "12px" }}
                  >
                    Remove
                  </button>
                )}
                <div style={{ position: "relative" }}>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    placeholder="Filename (e.g., plant1.jpg)"
                    ref={imageInputRef}
                    style={{
                      width: "150px",
                      marginTop: "5px",
                      padding: "2px",
                      paddingRight: "25px",
                      display: imageFile ? "none" : "block",
                    }}
                    disabled={imageFile !== null}
                  />
                </div>
                {imageError && (
                  <p style={{ color: "red", fontSize: "12px", margin: "2px 0" }}>
                    {imageError}
                  </p>
                )}
              </div>
              <div style={{ marginBottom: "5px" }}>
                <label>Desc:</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  style={{ width: "150px", padding: "2px" }}
                />
              </div>
              <div style={{ marginBottom: "5px" }}>
                <label>Cost:</label>
                <input
                  name="cost"
                  value={formData.cost}
                  onChange={handleFormChange}
                  style={{ width: "150px", padding: "2px" }}
                />
              </div>
              <div style={{ marginBottom: "5px" }}>
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  style={{ width: "150px", padding: "2px" }}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option || "None"}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <label>Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  style={{ width: "150px", padding: "2px" }}
                >
                  {plants.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: "10px" }}>
                <button
                  type="submit"
                  disabled={!!nameError}
                  style={{ padding: "5px" }}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancelUpdate}
                  style={{ marginLeft: "5px", padding: "5px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <div style={{ width: "300px" }}>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
        </div>
      )}

      {showConfirmUpdate && (
        <div
          className="confirm-modal"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
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
            <div style={{ margin: "10px 0" }}>
              <p>Image change:</p>
              <div style={{ display: "flex", gap: "20px" }}>
                <div>
                  <p>Old:</p>
                  {getImageSrc(selectedPlant.image) && (
                    <img
                      src={getImageSrc(selectedPlant.image)}
                      alt="Old"
                      style={{ maxWidth: "150px", maxHeight: "150px" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>
                <div>
                  <p>New:</p>
                  {getImageSrc(imageFile || formData.image) && (
                    <img
                      src={getImageSrc(imageFile || formData.image)}
                      alt="New"
                      style={{ maxWidth: "150px", maxHeight: "150px" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          <button onClick={confirmUpdate}>Confirm</button>
          <button onClick={handleCancelConfirm} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      )}

      {showConfirmDelete && (
        <div
          className="confirm-modal"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
          <p>
            Are you sure you want to delete {selectedPlant.name} (ID: {selectedPlant.id})?
          </p>
          <button onClick={confirmDelete} style={{ backgroundColor: "#ff4444", color: "white" }}>
            Delete
          </button>
          <button onClick={handleCancelConfirm} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantDeleteUpdate;