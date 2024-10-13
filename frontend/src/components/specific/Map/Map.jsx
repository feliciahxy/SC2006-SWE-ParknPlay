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

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const MapComponent = ({placesList, setPlaceClicked }) => {

  const carparkIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

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
      {/* {placesList.map((place) => (
        <Marker
          position={place.coordinates}
          eventHandlers={{
            click: (e) => {
              console.log('marker clicked', e);
              setPlaceClicked(place);
              //get carpark details from backend
              //setCarparkList([carparks]);
            },
          }}
          >
          <Popup>
            name: {place.name} <br /> address: {place.address} <br /> rating: {place.rating} <br /> price level: {place.price_level}
          </Popup>
        </Marker>
      ))} */}
      {placesList.map((place) => {
        let coordinates = [];
        coordinates[0] = place?.lat;
        coordinates[1] = place?.lng;
        return(
        <Marker position={coordinates} icon={carparkIcon}
          eventHandlers={{
            click: (e) => {
              console.log('marker clicked', e);
              setPlaceClicked(place);
              //get carpark details from backend
              //setCarparkList([carparks]);
            },
          }}
          >
          <Popup>
            name: {place.name} <br /> 
            address: {place.address} <br />
            rating: {place.rating} <br />
            price level: {place.price_level}
          </Popup>
        </Marker>
      )})}
    </MapContainer>
  );
};

export default MapComponent;

/* 
name = details.get('name', 'N/A')
        location = details.get('geometry', {}).get('location', {})
        lat = location.get('lat', 'N/A')
        lng = location.get('lng', 'N/A')
        address = details.get('formatted_address', 'N/A')
        rating = details.get('rating', 'N/A')
        price_level = details.get('price_level', 'N/A')
        opening_hours = details.get('opening_hours', {}).get('weekday_text', 'N/A')
        photos = details.get('photos', [])
        photo_reference = photos[0]['photo_reference'] if photos else 'N/A' */