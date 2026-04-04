import React from 'react'
import ProductCard from './ProductCard'
import { ProductData } from './Data'

function ProductsCard() {
  return (
    <>
      {ProductData.map((product, index) => (
        <ProductCard
          key={index}
          name={product.name}
          image={product.image}
          price={product.price}
          description={product.description}
          stock={product.stock}
        />
      ))}
    </>
  )
}

export default ProductsCard
