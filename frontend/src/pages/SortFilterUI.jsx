import React from 'react';

const SortFilterUI = ({ setRegion, setPlacetype, setPrice, onSearch }) => {
    return (
        <div>
            <h2>Search Places</h2>
            <input type="text" onChange={(e) => setRegion(e.target.value)} placeholder="Region" />
            <input type="text" onChange={(e) => setPlacetype(e.target.value)} placeholder="Place Type" />
            <input type="text" onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
            <button onClick={onSearch}>Search</button>
        </div>
    );
};

export default SortFilterUI;