import axios from 'axios';

const register_URL = 'http://127.0.0.1:8000/parknplay/users';

export const sendNewlyCreatedUser = async (data) => {
    try {
        const response = await axios.post(register_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const {data: {token}} = response;
        return token;
    } catch (error) {
        console.error(error);
    }
}

const login_URL = 'http://127.0.0.1:8000/parknplay/login';

export const sendUserLoginDetails = async (data) => {
    try {
        const response = await axios.post(login_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const { data: { token }} = response;
        return token;
    } catch (error) {
        console.error(error);
    }
}

const new_password_URL = 'http://127.0.0.1:8000/parknplay/changePassword';
export const sendChangedPassword = async (data) => {
    try {
        const response = await axios.post(new_password_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


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



const carparks_URL = 'http://127.0.0.1:8000/parknplay/carparks';

export const getCarparksData = async (lat, lng) => {

    try {
      const response = await axios.get(carparks_URL, {
        params: {
            lat: lat,
            lon: lng
        }
      });
      const { data: { carparks } } = response;
      console.log(carparks);
      return carparks;
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