import axios from 'axios';

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