import React, { useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { Menu } from 'antd';
import { Input } from 'antd';
//import LandingPage from '../../LandingPage/LandingPage';
import '../../NavBar/Sections/Navbar.css';

const SearchMenu = (props) => {
    console.log("props = " + props);
    const [searchTerm, setSearchTerm] = useState("");
    const { Search } = Input;
    const onSearch = value => console.log(value);

    function searchChangeHandler(e) {
        e.preventDefault();
        console.log(e.target.value);
        setSearchTerm(e.target.value);
        props.onChange(e.target.value);
    }
    console.log("searchTerm = " + searchTerm);
    //console.log(props.onChange);

    return (
        <div className="searchMenu">
            <Menu mode={props.mode} />

            <Search
                placeholder="Search"
                allowClear onSearch={onSearch}
                style={{ width: 400 }}
                onChange={(e) => searchChangeHandler(e)}
            />
            

            {/*
            console.log("Search Term = " + searchTerm);
           <LandingPage search={searchTerm}/>
            */}
        </div>
    )
}

export default SearchMenu;