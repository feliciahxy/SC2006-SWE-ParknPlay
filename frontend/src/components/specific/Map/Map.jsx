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

import { MapContainer } from 'react-leaflet';

const ChildComponent = () => {
    //const map = useMap();
    /* return(
        <>
            <TileLayer 
                url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png" 
                attribution='<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'/>
            <Marker position={[1.3521, 103.8198]}>
                <Popup>Hello world</Popup>
            </Marker>
        </>
    ); */

    var basemap = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
        detectRetina: true,
        maxZoom: 19,
        minZoom: 11,
        /** DO NOT REMOVE the OneMap attribution below **/
        attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
     });
     return basemap;
}
const Map = ({ center, zoom }) => {
    return(
        <MapContainer center = {center} zoom = {zoom}>
            <ChildComponent />
        </MapContainer>
    );
}

export default Map;