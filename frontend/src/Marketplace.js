import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Marketplace.css';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/marketplace');
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="marketplace-container">
            <h1>Marketplace</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="products">
                {products.map(product => (
                    <div key={product.id} className="product">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>${product.price}</p>
                        <button>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;
