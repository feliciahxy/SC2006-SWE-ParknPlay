import axios from 'axios';

const favourites_URL = 'http://127.0.0.1:8000/parknplay/favourites'

export const sendPlaceToFavourites = async (place, action) => {
    const token = localStorage.getItem('token');
    
    try {
        const response = await axios.post(favourites_URL, { place, action }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        },);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getFavouritesData = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(favourites_URL, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
         });
        console.log(response);
        const { data: { favourites } } = response;
        return favourites;
    } catch (error) {
        console.error(error);
    }
}
