import { Link, useParams } from "react-router-dom";

function PlantDetail({ plants }) {
    const { id } = useParams(); 

    const plant = plants
        .flatMap((category) => category.plants)
        .find((p) => p.id === id); 

    if (!plant) return <p>Plant not found</p>;

    const getImageSrc = () => {
        if (plant.image instanceof File) {
            return URL.createObjectURL(plant.image);
        } else if (typeof plant.image === "string") {
            return `/assets/images/${plant.image}`;
        }
        return "";
    };

    return (
        <div>
            <h2>{plant.name}</h2>
            <img
                src={getImageSrc()}
                alt={plant.name}
                width="200"
                height="200"
                onError={(e) => (e.target.src = "/assets/images/placeholder.jpg")} 
            />
            <p>{plant.description}</p>
            <p>Price: {plant.cost}</p>
            {plant.status && <p>Status: {plant.status}</p>}
            <Link to="/plants">Back</Link>
        </div>
    );
}

export default PlantDetail;