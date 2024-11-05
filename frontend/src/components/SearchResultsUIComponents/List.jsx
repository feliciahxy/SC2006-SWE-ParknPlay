import styles from "../../styles/SearchResultsUI.module.css";

const API_KEY = 'AIzaSyAw5vUAgT4udrj3MgbQYECpH-TWgUBFmyM';

const List = ({ results, itemRefs, handleMarkerClick, handleLocationSelect, handleAddToFavourites }) => {
    return(
        <ul className={styles.listContainer}>
            {results.map((result, index) => (
                <li 
                    key={index} 
                    className={styles.listItems} 
                    ref={el => itemRefs.current[index] = el}
                >
                    {result?.photo ? (
                        <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photo}&key=${API_KEY}`} alt="image cannot be displayed"></img>
                    ) : (
                        <div>Image not available</div>
                    )}
                    <h3
                        onClick={() => handleMarkerClick(index)}
                        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                        className={styles.carparkName}
                    >
                        {result.name}
                    </h3>
                    <p>{result.address}</p>
                    <p>Rating: {result.rating || 'N/A'}</p>
                    <button 
                        onClick={() => handleLocationSelect(result.coordinates, result.name)} 
                        className={styles.nearbyCarparksButton}
                    >
                        View Nearby Carparks
                    </button>
                    <button 
                        onClick={() => handleAddToFavourites(result)} 
                        className={styles.favouritesButton}
                    >
                        Add to Favourites
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default List