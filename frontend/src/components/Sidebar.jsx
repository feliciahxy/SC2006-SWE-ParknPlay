import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(true); 

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

    const handleChangePassword = () => {
        navigate('/change-password'); 
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed); 
    };

    return (
        <div style={{ display: 'flex' }}>
            <aside style={{ ...sidebarStyle, width: isCollapsed ? '30px' : '200px' }}>
                <button onClick={toggleSidebar} style={toggleButtonStyle}>
                {isCollapsed ? (
                        <div style={hamburgerStyle}> {/* Hamburger icon when collapsed */}
                            <div style={lineStyle}></div>
                            <div style={lineStyle}></div>
                            <div style={lineStyle}></div>
                        </div>
                    ) : (
                        '<' 
                    )}
                </button>
                {!isCollapsed && (
                    <>
                        <h2 style={{ textAlign: 'center' }}>Menu</h2>
                        <button style={buttonStyle} onClick={handleSearchCarparks}>Search Carparks</button>
                        <button style={buttonStyle} onClick={handleFavourites}>Favourites</button>
                        <button style={buttonStyle} onClick={handleChangePassword}>Change Password</button> {/* Add this line */}
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


const sidebarStyle = {
    height: '100vh', 
    backgroundColor: '#f8f9fa',
    padding: '10px 10', 
    position: 'fixed', 
    left: 0,
    top: 0,
    borderRight: '1px solid #ddd',
    transition: 'width 0.3s', 
    zIndex: 1000,
};


const mainStyle = {
    padding: '20px',
    transition: 'margin-left 0.3s', 
};


const buttonStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px', 
};


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

const hamburgerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '20px',
    height: '20px',
};

const lineStyle = {
    width: '15px',
    height: '2px',
    backgroundColor: 'white',
    margin: '2px 0',
};

export default Sidebar;
