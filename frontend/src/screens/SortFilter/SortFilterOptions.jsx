const SortFilterOptions = ({filter, options}) => {
    return(
        <div>
            <label>{filter}</label>
            <select>
                {options.map(
                    (option) => (
                        <option value={option}>{option}</option>
                    )
                )}
            </select>
        </div>
    );
}

export default SortFilterOptions;