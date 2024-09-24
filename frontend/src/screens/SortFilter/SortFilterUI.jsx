import { useNavigate } from "react-router-dom";

import SideBar from "../../components/SideBar/SideBar";
import SortFilterOptions from "./SortFilterOptions";

import "../screens.css";

import filterOptions from "./SortFilterOptions.json";

const SortFilterUI = () => {
    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate("/search-results");
    }
    return(
        <div>
            <SideBar />
            <div className="page">
                {filterOptions.map(
                    (filterOption) => (
                        <SortFilterOptions filter={filterOption.filter} options={filterOption.options} />
                    )
                )}
                <div>
                    <button onClick = {handleSubmit}>Search</button>
                </div>
            </div>
        </div>
    );
}

export default SortFilterUI