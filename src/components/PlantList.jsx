import { Link } from "react-router-dom";

function PlantList({plants}) {
    return (
      <div>
        <h1>Plant List</h1>
        {plants.map((category, catIndex) => (
          <div key={catIndex}>
            <h2>{category.category}</h2>
            {category.plants.map((plant, index) => (
              <p key={index}>
                <Link to={`/plants/${plant.id}`}>{plant.name}</Link>
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
    export default PlantList;