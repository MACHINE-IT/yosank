import React, { useState } from 'react'
import { Typography } from 'antd';
import YouTube from "react-youtube";
import  './style.css';
import { fetchMovieVideo } from '../../../../services';
const { Title } = Typography;


function MainImage(props) {
    const [open,setOpen] = useState(false)
    const [videoId,setVideoId] = useState("");
    const playTrailer = () =>{
        fetchMovieVideo(props.MovieId)
        .then((data) =>
        {
            setVideoId(data.key);
        }
        );
        setOpen(true);
     
    }

    const closePopup =() =>{
        setOpen(false);
    }

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

    return (
        <div
            style={{
                background:
                    `linear-gradient(to bottom, rgba(0,0,0,0)
            39%,rgba(0,0,0,0)
            41%,rgba(0,0,0,0.65)
            100%),
            url('${props.image}'), #1c1c1c`,
                height: '500px',
                backgroundSize: '100%, cover',
                backgroundPosition: 'center, center',
                width: '100%',
                position: 'relative'
            }}
        >
            <div>
                <div style={{ position: 'absolute', maxWidth: '500px', bottom: '2rem', marginLeft: '2rem' }} >
                    <Title style={{ color: 'white' }} level={2} > {props.title} </Title>
                    <p style={{ color: 'white', fontSize: '1rem' }}  >{props.text} </p>
                    <button cursor="pointer" onClick={()=>{playTrailer()}}>Play Trailer</button>
                    {
                        open ? 
                        <div className="trailer_container">
                            <div className="trailer_item">
                                <div className="header">
                                <h1>{props.title}</h1>
                                <button className="close_btn" onClick={()=>{closePopup()}} >X</button>
                                </div>
                                <YouTube videoId={videoId} opts={opts}></YouTube>
                            </div>
                            <div className="overlay"></div>
                        </div>

                        : null
                    }
                </div>
            </div>
        </div>
    )
}

export default MainImage