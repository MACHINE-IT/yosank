import React, { useState } from 'react';
import { Menu } from 'antd';
import { Input } from 'antd';
import LandingPage from '../../LandingPage/LandingPage';

const SearchMenu = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { Search } = Input;
    const onSearch = value => console.log(value);

    function searchChangeHandler(e) {
        e.preventDefault();
        console.log(e.target.value);
        setSearchTerm(e.target.value);
        
    }


    return (
        <div className="searchMenu">
            <Menu mode={props.mode} />

            <Search
                placeholder="Search"
                allowClear onSearch={onSearch}
                style={{ width: 400 }}
                onChange={(e) => searchChangeHandler(e)}
            />

            
        </div>
    )
}

export default SearchMenu;