import React from 'react';
import ProductCard from './ProductCard';

function Category({ category }) {
  return (
    <div>
      <h1>
        <div className="plant_heading">{category.category}</div>
      </h1>
      <div className="product-list">
        {category.plants.map((plant, index) => (
          <ProductCard key={index} plant={plant} />
        ))}
      </div>
    </div>
  );
}

export default Category;