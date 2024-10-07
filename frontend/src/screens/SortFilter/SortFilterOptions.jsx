const SortFilterOptions = ({filter, options, selectedOption, onSelectOption}) => {
    return(
        <div>
            <label>{filter}</label>
            <select
                value = {selectedOption}
                onChange = {(e) => onSelectOption(e)}>
                {options.map(
                    (option) => (
                        <option key={option} value={option}>{option}</option>
                    )
                )}
            </select>
        </div>
    );
}

export default SortFilterOptions;