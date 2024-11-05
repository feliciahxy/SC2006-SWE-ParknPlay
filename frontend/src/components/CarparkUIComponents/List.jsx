import styles from "../../styles/CarparkUI.module.css";

const List = ({ carparks, highlightedIndex }) => {
    return(
        <div>
            {carparks.length === 0 ? (
                <p>No carparks available.</p>
            ) : (
                <ul className={styles.listContainer}>
                    {carparks.map((carpark, index) => (
                        <li key={index} className={styles.listItems}>
                            <h4
                                className={styles.carparkName}
                                style={{
                                    color: highlightedIndex === index ? 'red' : 'black',
                                }}
                            >
                                {carpark.carpark_name}
                            </h4>
                            <p>Distance: {carpark.distance.toFixed(2)} meters</p>
                            <p>Available Lots: {carpark.available_lots}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default List