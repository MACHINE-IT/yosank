import React, { useEffect, useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { Menu } from 'antd';
import { Input } from 'antd';
import LandingPage from '../../LandingPage/LandingPage';
import { useDispatch } from 'react-redux';
import { addSearchResult, showInitialResult, typing } from '../../../../actions/user_actions';


const SearchMenu = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    /* const [debouncedTerm,setDebouncedTerm] = useState(""); */


    const { Search } = Input;
    const onSearch = value => console.log(value);

    const dispatch = useDispatch();

    function searchChangeHandler(e) {
        e.preventDefault();
        console.log(e.target.value);
        setSearchTerm(e.target.value.trim());
        //<LandingPage props.searchItem={(e.target.value)} />
    }
    console.log("searchTerm = " + searchTerm);
    


    useEffect(() => {

        
        const fetch = async()=>{
             dispatch(addSearchResult(searchTerm))
        }
        if(searchTerm === "" || searchTerm.length === 0){
                 dispatch(showInitialResult());
        }
        else{
            dispatch(typing(true))
            

            const timeoutId = setTimeout(() =>{
                if(searchTerm != '' || searchTerm.length == 0){
                    fetch() 
                    dispatch(typing(false));
                       console.log("running now");
                }
             },500)
           
             return()=>{
                console.log("cleanup");
                clearInterval(timeoutId);
            }  
        }
       
         
        
    },[searchTerm])

console.log("searchTerm.length",searchTerm.length)
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