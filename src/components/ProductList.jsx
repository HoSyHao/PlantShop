import React from 'react'
import '../assets/ProductList.css'
import Category from './Category'
import plants from '../plants'

function ProductList() {
    
  return (
    <div className="product-grid">
      {plants.map((category, index) => (
        <Category key={index} category={category} />
      ))}
    </div>
  )
}

export default ProductList