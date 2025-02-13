import React from 'react';

function ProductCard({ plant }) {
  const statusClass = plant.status ? plant.status.toLowerCase().replace(' ', '-') : '';
  const isSoldOut = plant.status === 'Sold Out';

  return (
    <div className={`product-card ${statusClass}`}>
      <div className="product-title">{plant.name}</div>
      <img className="product-image" src={plant.image} alt={plant.name} />
      <div className="product-price">{plant.cost}</div>
      <div className="plantname_heading">
        <i>{plant.description}</i>
      </div>
      {plant.status && <div className="product-status">{plant.status}</div>}
      <button className="product-button" hidden={isSoldOut}>Add to Cart</button>
    </div>  
  );
}

export default ProductCard;