/* import GoogleMapReact from 'google-map-react';

const Map = () => {
    console.log("display map");
    const coordinates = { lat: 0, long: 0 };
    return(
        <div>
            <GoogleMapReact 
                bootstrapURLKeys={{ key: 'AIzaSyCWTO-xfrXyfdPDEAokY3N8gxOcd3TO3Ek' }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={''}
                onChange={''}
                onChildClick={''}>
                
            </GoogleMapReact>
        </div>
    );
}

export default Map;
 */

import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const MapComponent = () => {
  const singaporeCenter = [1.3521, 103.8198]; // Singapore lat-lng

  useEffect(() => {
    // OneMap example for adding markers or other custom functionalities
    // You can use OneMap's API here to fetch data, markers, etc.
  }, []);

  return (
    <MapContainer center={singaporeCenter} zoom={15} style={{ height: '450px', width: '450px' }}>
      <TileLayer
        url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
        attribution='&copy; <img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
      />
      <Marker position={singaporeCenter}>
        <Popup>
          A marker at Singapore.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
