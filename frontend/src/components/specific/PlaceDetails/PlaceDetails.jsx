const PlaceDetails = ({ place }) => {
    
    const convertToReadableTime = (timeStr) => {
        // Function to convert the time portion to readable format
        const convertTime = (time) => {
            let [hour, minute] = time.match(/\d+/g).map(Number); // Extract hour and minute
            let period = time.includes('AM') ? 'AM' : 'PM'; // Determine AM or PM
    
            if (period === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period === 'AM' && hour === 12) {
                hour = 0;
            }
    
            return `${hour}:${minute.toString().padStart(2, '0')}`;
        };
    
        // Split the string by the dash "–" to separate opening and closing times
        const [day, timeRange] = timeStr.split(': ');
        const [openTime, closeTime] = timeRange.split(/\u2009–\u2009|\u2009–\u202f/);
    
        // Convert both times to readable 24-hour format
        const open = convertTime(openTime);
        const close = convertTime(closeTime);
    
        return `${day}: ${open} - ${close}`;
    }
    
    // Convert all time strings
    const readableTimes = place?.opening_hours?.map(convertToReadableTime);
    
    console.log(readableTimes); //check error

    
    return(
        <div>
            {place?.photo_reference? (
                <img src={place.photo_reference} alt="image cannot be displayed"></img>
            ) : (
                <div>image not available</div>
            )}
            <div>name: {place.name}</div>
            <div>address: {place.address}</div>
            <div>opening hours:</div>
            {place?.opening_hours? (
                readableTimes.map((times, index) => (
                    <div key={index}>{times}</div>
                ))
            ) : (
                <div>Operating hours not available</div>
            )}
            <div>rating: {place.rating}</div>
            <div>price level: {place.price_level}</div>
        </div>
    );
}

export default PlaceDetails;
        