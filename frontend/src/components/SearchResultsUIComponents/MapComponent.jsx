import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';

import styles from '../../styles/SearchResultsUI.module.css';

const API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM';

const MapComponent = ({ results, handleMarkerClick, openIndex, handleLocationSelect }) => {
    
    const defaultCenter = results[0]?.coordinates || { lat: 0, lng: 0 };

    return(
        <>
            <APIProvider apiKey={API_KEY}>
                <div className={styles.mapDisplay}>
                    <Map
                        defaultZoom={13}
                        defaultCenter={defaultCenter}
                        mapId='55d3df35a2143bdc'
                    >
                        {results.map((result, index) => (
                            <AdvancedMarker
                                key={index}
                                position={result.coordinates}
                                onClick={() => handleMarkerClick(index)}
                            >
                                <Pin />
                                {openIndex === index &&
                                (<InfoWindow position={result.coordinates}>
                                    <div>
                                        <strong>{result.name}</strong><br />
                                        {result.address}<br />
                                        Rating: {result.rating || 'N/A'}
                                        <br />
                                        <button 
                                            className={styles.viewCarparksButton}
                                            onClick={() => handleLocationSelect(result.coordinates, result.name)} 
                                            style={{ 
                                                marginTop: '10px', 
                                                padding: '5px 10px', 
                                                backgroundColor: '#28a745', 
                                                color: 'white', 
                                                border: 'none', 
                                                borderRadius: '5px', 
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            View Carparks
                                        </button>
                                    </div>
                                </InfoWindow>)}
                            </AdvancedMarker>
                        ))}
                    </Map>
                </div>
            </APIProvider>
        </>
    )
}

export default MapComponent