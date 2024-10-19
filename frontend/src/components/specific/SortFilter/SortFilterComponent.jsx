import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import SortFilterOptions from "./SortFilterOptions";

import filterOptions from "./SortFilterOptions.json";

import { sendFilters } from '../../../api/PlacesServices';

const SortFilterUI = () => {
    const navigate = useNavigate();

    const [filters, setFilters] = useState(() => {
        const initialFilterOptions = {};
        filterOptions.forEach(filterOption => {
            initialFilterOptions[filterOption.filter] = '';
        });
        return initialFilterOptions;
    });

    const handleSubmit = () => {
        //post filter data to backend
        //backend will get attractions from google places api based on filters
        //backend will post attractions to search-results ui
        
        console.log(filters);   //check error

        sendFilters(filters)
            .then((data) => {
                console.log(data);
                navigate("/search-results");
            })
            .catch((error) => {
                console.error('Error posting filter data: ', error);
            });
    };
    const handleSelectOption = (e, filterKey) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: e.target.value
        }));
    };

    return(
        <div>
            <div>
                {filterOptions.map(
                    (filterOption) => (
                        <SortFilterOptions
                            key={filterOption.filter}
                            filter={filterOption.filter}
                            options={filterOption.options}
                            selectedOption={filters[filterOption.filter]}
                            onSelectOption={(e) => handleSelectOption(e, filterOption.filter)} />
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