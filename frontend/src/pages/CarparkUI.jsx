import React, { useEffect, useState } from 'react';

const CarparkUI = ({ selectedLocation }) => {
    const [carparks, setCarparks] = useState([]);

    useEffect(() => {
        if (selectedLocation) {
            const fetchCarparks = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/find_nearest_carparks/?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCarparks(data);
                    } else {
                        console.error('Error fetching carparks:', await response.json());
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };
            fetchCarparks();
        }
    }, [selectedLocation]);

    if (!selectedLocation) {
        return <p>Please select a location first.</p>;
    }

    return (
        <div>
            <h2>Nearby Carparks</h2>
            {carparks.length === 0 ? (
                <p>No carparks available.</p>
            ) : (
                <ul>
                    {carparks.map((carpark, index) => (
                        <li key={index}>
                            <h3>{carpark.carpark_name}</h3>
                            <p>Address: {carpark.carpark_name}</p> {/* Assuming address is stored in carpark_name */}
                            <p>Distance: {carpark.distance.toFixed(2)} meters</p>
                            <p>Available Lots: {carpark.available_lots}</p>
                            <p>Total Lots: {carpark.total_lots}</p> {/* Display total lots if available */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CarparkUI;
