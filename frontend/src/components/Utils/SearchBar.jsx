import { Input } from "antd";
import React from "react";

const { Search } = Input;

const SearchBar = ({ placeholder, onSearch }) => {
    return (
        <div className="mb-4">
            <Search
                placeholder={placeholder || "Search..."}
                allowClear
                onSearch={onSearch}
                enterButton
                required
            />
        </div>
    );
};

export default SearchBar;
