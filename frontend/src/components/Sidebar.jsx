import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false); // State to track sidebar visibility

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleSearchCarparks = () => {
        navigate('/sort-filter');
    };

    const handleFavourites = () => {
        navigate('/favourites');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed); // Toggle the collapsed state
    };

    return (
        <div style={{ display: 'flex' }}>
            <aside style={{ ...sidebarStyle, width: isCollapsed ? '10px' : '200px' }}>
                <button onClick={toggleSidebar} style={toggleButtonStyle}>
                    {isCollapsed ? '>' : '<'}
                </button>
                {!isCollapsed && (
                    <>
                        <h2 style={{ textAlign: 'center' }}>Menu</h2>
                        <button style={buttonStyle} onClick={handleSearchCarparks}>Search Carparks</button>
                        <button style={buttonStyle} onClick={handleFavourites}>Favourites</button>
                        <button style={buttonStyle} onClick={handleLogout}>Logout</button>
                    </>
                )}
            </aside>
            <main style={{ ...mainStyle, marginLeft: isCollapsed ? '50px' : '220px' }}>
                {/* Main content goes here */}
            </main>
        </div>
    );
};

// Sidebar styles
const sidebarStyle = {
    height: '100vh', // Full height of the viewport
    backgroundColor: '#f8f9fa',
    padding: '10px 0', // Reduced padding for collapsed state
    position: 'fixed', // Fix to the left side
    left: 0,
    top: 0,
    borderRight: '1px solid #ddd',
    transition: 'width 0.3s', // Smooth transition for width change
};

// Main content styles
const mainStyle = {
    padding: '20px', // Add some padding for main content
    transition: 'margin-left 0.3s', // Transition for smooth effect
};

// Button styles
const buttonStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px', // Adjusted font size for smaller buttons
};

// Toggle button style
const toggleButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '5px',
    width: '100%',
    fontSize: '18px',
};

export default Sidebar;
