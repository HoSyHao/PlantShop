/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function PlantList({ plants }) {
  const [displayedPlants, setDisplayedPlants] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const itemsPerPage = 6;
  const observerRef = useRef(null);
  const navigate = useNavigate();

  // Đếm tổng số plant từ mảng plants
  const totalPlants = plants.reduce((acc, category) => acc + category.plants.length, 0);
  const totalPages = Math.ceil(totalPlants / itemsPerPage);
  const hasNextPage = page <= totalPages;

  // Hàm lấy nguồn ảnh
  const getImageSrc = (plant) => {
    if (plant.image instanceof File) {
      return URL.createObjectURL(plant.image);
    } else if (typeof plant.image === "string" && plant.image) {
      return `/assets/images/${plant.image}`;
    }
    return ""; // Trả về chuỗi rỗng nếu không có ảnh
  };

  // Hàm tải dữ liệu với delay giả
  const loadMorePlants = (currentPage) => {
    if (isLoading || currentPage > totalPages) return;

    setIsLoading(true);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalPlants);

    const allPlants = plants.flatMap(category =>
      category.plants.map(plant => ({
        ...plant,
        category: category.category,
      }))
    );

    const newPlants = allPlants.slice(startIndex, endIndex);

    setTimeout(() => {
      if (currentPage === 1) {
        setDisplayedPlants(newPlants); // Trang 1 thì ghi đè, không nối
      } else {
        setDisplayedPlants(prev => [...prev, ...newPlants]); // Các trang sau thì nối
      }
      setPage(currentPage + 1);
      setIsLoading(false);
      if (currentPage === 1) setIsInitialLoad(false);
    }, 1000);
  };

  // Tải dữ liệu ban đầu khi component mount hoặc khi plants thay đổi
  useEffect(() => {
    setDisplayedPlants([]);
    setPage(1);
    setIsInitialLoad(true);
    loadMorePlants(1);
  }, [plants]);

  // Thiết lập IntersectionObserver
  useEffect(() => {
    if (isInitialLoad || !observerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && hasNextPage) {
          loadMorePlants(page);
        }
      },
      { threshold: 0.5 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [isLoading, hasNextPage, page, isInitialLoad]);

  return (
    <div className="plant-list">
      <h1>Plant List</h1>
      <div className="plant-grid">
        {displayedPlants.map((plant) => (
          <div key={plant.id} className="plant-card">
            <img src={getImageSrc(plant)} alt={plant.name} />
            <h3>{plant.name}</h3>
            <button className="detail-btn" onClick={() => navigate(`/plants/${plant.id}`)}>
              Detail
            </button>
          </div>
        ))}
      </div>
      {totalPlants > 0 && (
        <div ref={observerRef} className="loading-indicator">
          {isLoading && <p>Loading more plants...</p>}
          {!hasNextPage && displayedPlants.length > 0 && <p>No more plants to load</p>}
        </div>
      )}
    </div>
  );
}

export default PlantList;