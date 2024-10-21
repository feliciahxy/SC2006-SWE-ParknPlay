import axios from 'axios';

const favourites_URL = 'http://127.0.0.1:8000/parknplay/favourites'

export const sendPlaceToFavourites = async (place, action, token) => {    
    try {
        const response = await axios.post(favourites_URL, { place, action }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        },);

        if (response.status !== 200) {
            throw new Error(response.data.error || 'Something went wrong')
        }

        return response.data;
    } catch (error) {
        console.error("Error sending place to FavouritesMgr: ", error.response || error.message || error);
        throw error;
    }
}

export const getFavouritesData = async (token) => {
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
