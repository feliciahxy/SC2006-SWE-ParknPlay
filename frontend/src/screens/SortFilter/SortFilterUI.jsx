import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import SortFilterOptions from "./SortFilterOptions";

import "../screens.css";

import filterOptions from "./SortFilterOptions.json";

const SortFilterUI = () => {
    console.log("SortFilterUI rendered");
    const navigate = useNavigate();

    const [filters, setFilters] = useState(() => {
        const initialFilterOptions = {};
        filterOptions.forEach(filterOption => {
            initialFilterOptions[filterOption.filter] = '';
        });
        return initialFilterOptions;
    });

    const handleSubmit = () => {
        navigate("/search-results");
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