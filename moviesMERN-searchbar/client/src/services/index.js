import axios from "axios"
import { API_KEY, API_URL } from "../components/Config"

const POST_URL = `/videos?api_key=${API_KEY}&language=en-US`


export const fetchMovieVideo = async (id) =>{

    const {data} = await axios.get(`${API_URL}/movie/${id}/${POST_URL}`)
    .then(response => response)
    .catch(err =>console.error(err)) ;
    return data.results[0];
}