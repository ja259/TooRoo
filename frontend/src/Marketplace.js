import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaSearch, FaShoppingCart, FaHeart, FaStar, FaTag, FaMapMarkerAlt,
    FaFilter, FaSort, FaTshirt, FaMobileAlt, FaLaptop, FaCouch, FaBook,
    FaTools, FaBicycle, FaGamepad, FaUtensils, FaBaby, FaMusic
} from 'react-icons/fa';
import './Marketplace.css';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/marketplace');
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products');
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };
        fetchProducts();
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredProducts = products
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(product => selectedCategory === '' || product.category === selectedCategory)
        .filter(product => Object.keys(filters).every(key => filters[key] === '' || product[key] === filters[key]))
        .sort((a, b) => {
            if (sortOption === 'price-asc') return a.price - b.price;
            if (sortOption === 'price-desc') return b.price - a.price;
            return 0;
        });

    return (
        <div className="marketplace-container">
            <h1>Marketplace</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="search-filter-bar">
                <div className="search-bar">
                    <FaSearch />
                    <input type="text" placeholder="Search for products..." value={searchTerm} onChange={handleSearch} />
                </div>
                <div className="filters">
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                    <select value={sortOption} onChange={handleSortChange}>
                        <option value="">Sort By</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                    <div className="additional-filters">
                        <FaFilter />
                        <select name="location" value={filters.location || ''} onChange={handleFilterChange}>
                            <option value="">Location</option>
                            <option value="nearby">Nearby</option>
                            <option value="international">International</option>
                        </select>
                        <select name="rating" value={filters.rating || ''} onChange={handleFilterChange}>
                            <option value="">Rating</option>
                            <option value="4">4 Stars & Up</option>
                            <option value="3">3 Stars & Up</option>
                            <option value="2">2 Stars & Up</option>
                            <option value="1">1 Star & Up</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="products">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>${product.price}</p>
                        <div className="product-actions">
                            <button><FaShoppingCart /> Add to Cart</button>
                            <button><FaHeart /> Wishlist</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;
