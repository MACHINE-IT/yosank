import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    TYPING_SEARCH_BAR,
    INITIAL_RESULT
} from './types';
import { API_KEY, API_URL, USER_SERVER } from '../components/Config.js';


export function registerUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/login`, dataToSubmit)
        .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser() {
    const request = axios.get(`${USER_SERVER}/logout`)
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addSearchResult(searchTerm){
    const path = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=1`;  
    

        const request = path

    return {
        type: "ADD_SEARCH_RESULT",
        payload: {request,searchTerm}
    }
}
export function typing(status){
    return{
        type: TYPING_SEARCH_BAR,
        payload: { 
            loading:status
        }     
    }
}

export function showInitialResult(){
    return{
        type: INITIAL_RESULT,
        payload: "initial_result"
    }
}