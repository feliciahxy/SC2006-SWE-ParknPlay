import axios from 'axios';

const restaurants_URL = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary';

const restaurants_options = {
  params: {
    bl_latitude: '11.847676',
    tr_latitude: '12.838442',
    bl_longitude: '109.095887',
    tr_longitude: '109.149359',
    restaurant_tagcategory_standalone: '10591',
    restaurant_tagcategory: '10591',
    limit: '30',
    currency: 'USD',
    open_now: 'false',
    lunit: 'km',
    lang: 'en_US'
  },
  headers: {
    'x-rapidapi-key': '47804b6dc0msh83469174cf7d62ep1ec204jsnbf5d120fa014',
    'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
  }
};

export const getPlacesData = async () => {
    try {
        const { data: { data } } = await axios.get(restaurants_URL, restaurants_options);
        console.log(data);
        return data;
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