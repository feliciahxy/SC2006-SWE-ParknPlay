import { useEffect, useState } from 'react';

import "../screens.css";

import { getCarparksData } from "../../api/api";
import SideBar from "../../components/specific/SideBar/SideBar";

const CarparkUI = () => {
    const [carparks, setCarparks] = useState([]);
    useEffect(() => {
        getCarparksData()
            .then((data) => {
                console.log(data);
                setCarparks(data);
            });
    })
    return(
        <div class="page">
            <SideBar />
            {/* {nearbyCarparkList.map((carpark) => (
                <div>
                    <div>{carpark.carparkName}</div>
                    <div>{carpark.region}</div>
                    <div>{carpark.numSlots}</div>
                    <div>{carpark.locationCoordinates}</div>
                </div>
            ))} */}
        </div>
    );
}

export default CarparkUI