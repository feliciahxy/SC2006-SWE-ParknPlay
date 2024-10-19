import axios from 'axios';

const places_URL = 'http://127.0.0.1:8000/parknplay/search';

export const sendFilters = async (data) => {
    try {
        const response = await axios.post(places_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getPlacesData = async () => {
    try {
        const response = await axios.get(places_URL);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}