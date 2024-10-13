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


const favourites_URL = 'http://127.0.0.1:8000/parknplay/favourites'

export const sendPlaceToFavourites = async (place, action) => {
    try {
        const response = await axios.post(favourites_URL, { place, action }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getFavouritesData = async () => {
    try {
        const response = await axios.get(favourites_URL);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}



const carparks_URL = 'https://api.data.gov.sg/v1/transport/carpark-availability';
const carparks_options = {};

export const getCarparksData = async () => {
    try {
      const response = await axios.get(carparks_URL, carparks_options);
      const { data: { items } } = response;
      const { carpark_data } = items[0];
      console.log(carpark_data);
      return carpark_data;
    } catch (error) {
      console.error(error);
    }
}
/* 
{
    "items": [
        {
            "timestamp": "2024-10-07T14:27:27+08:00",
            "carpark_data": [
                {
                    "carpark_info": [
                        {
                            "total_lots": "105",
                            "lot_type": "C",
                            "lots_available": "25"
                        }
                    ],
                    "carpark_number": "HE12",
                    "update_datetime": "2024-10-07T14:26:41"
                },
                {
                    "carpark_info": [
                        {
                            "total_lots": "583",
                            "lot_type": "C",
                            "lots_available": "22"
                        }
                    ],
                    "carpark_number": "HLM",
                    "update_datetime": "2024-10-07T14:26:29"
                },
                {
                    "carpark_info": [
                        {
                            "total_lots": "10",
                            "lot_type": "C",
                            "lots_available": "0"
                        }
                    ],
                    "carpark_number": "H3BL",
                    "update_datetime": "2024-10-07T14:26:17"
                }
            ]
        }
    ]
} */