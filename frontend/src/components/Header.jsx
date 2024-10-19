
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleSearchCarparks = () => {
        navigate('/sort-filter');
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
            <button onClick={handleSearchCarparks}>Search Carparks</button>
            <button onClick={handleLogout}>Logout</button>
        </header>
    );
};

export default Header;
