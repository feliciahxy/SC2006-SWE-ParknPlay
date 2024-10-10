import React, { useEffect } from 'react';

const MapComponent = () => {
    useEffect(() => {
        // Load the Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=places&callback=initMap`;
        script.async = true;
        document.body.appendChild(script);

        // Define the initMap function
        window.initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });

            // Use the Places library here
            const service = new window.google.maps.places.PlacesService(map);
            // Example: search for places
            service.nearbySearch({ location: { lat: -34.397, lng: 150.644 }, radius: 500 }, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    results.forEach(place => {
                        new window.google.maps.Marker({
                            position: place.geometry.location,
                            map: map,
                        });
                    });
                }
            });
        };

        // Cleanup script on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default MapComponent;

/* 
https://developers.google.com/maps/documentation/javascript/places
 */