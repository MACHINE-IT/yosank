import React, { useEffect, useState } from 'react'
import { Row, Button, Spin } from 'antd';
import axios from 'axios';
import './MovieDetails.css'
import Comments from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislikes';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE } from '../../Config'
import GridCards from '../../commons/GridCards';
import MainImage from '../../views/LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import Favorite from './Sections/Favorite';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';


function MovieDetailPage(props) {
    console.log("props", props.history.pathname);
    const movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForSearch, setLoadingForSearch] = useState(false)
    const [LoadingResults, setLoadingResults] = useState([]);
    const [LoadingForCasts, setLoadingForCasts] = useState(true)
    const [ActorToggle, setActorToggle] = useState(false)
    const movieVariable = {
        movieId: movieId
    }

    useEffect(() => {

        let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
        console.log("endpointForMovieInfo", endpointForMovieInfo);
        fetchDetailInfo(endpointForMovieInfo)

        axios.post('/api/comment/getComments', movieVariable)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    console.log('response.data.comments', response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get comments Info')
                }
            })

    }, []);
    useEffect(() => {
        if (props.status) {
            setLoadingForSearch(true)
        }
        else if (!props.status) {
            axios.get(`${props.data}`)
                .then(response => response.data)
                .then(data => setLoadingResults(data.results))
                .catch(error => console.error('Error:', error))
        }
    }, [props.status])
    console.table("loading results", LoadingResults);
    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    const fetchDetailInfo = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log(result)
                setMovie(result)
                setLoadingForMovie(false)

                let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
                fetch(endpointForCasts)
                    .then(result => result.json())
                    .then(result => {
                        console.log(result)
                        setCasts(result.cast)
                    })

                setLoadingForCasts(false)
            })
            .catch(error => console.error('Error:', error)
            )
    }

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    return (
        <div>
            {/* Header */}
            
            {!LoadingForMovie ?
                <MainImage
                    image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
                    MovieId={Movie.id}
                />
                :
                //<div>loading...</div>
                <div className="example">
                    <Spin />
                </div>
            }


            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div>


                {/* Movie Info */}
                {!LoadingForMovie ?
                    <MovieInfo movie={Movie} />
                    :
                    //<div>loading...</div>
                    <div className="example">
                        <Spin />
                    </div>
                }

                <br />
                {/* Actors Grid*/}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <Button className="toggle_actor_view_btn" style={{ color: '#BD0A28', borderColor: '#BD0A28' }} onClick={toggleActorView}>Toggle Actor View </Button>
                </div>

                {ActorToggle &&
                    <Row gutter={[16, 16]}>
                        {
                            !LoadingForCasts ? Casts.map((cast) => (
                                cast.profile_path &&
                                <GridCards actor image={cast.profile_path} characterName={cast.character} />
                            )) :
                                //<div>loading...</div>
                                <div className="example">
                                    <Spin />
                                </div>
                        }
                    </Row>
                }
                <br />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LikeDislikes movie movieId={movieId} userId={localStorage.getItem('userId')} />
                </div>

                {/* Comments */}
                <Comments movieTitle={Movie.original_title} CommentLists={CommentLists} postId={movieId} refreshFunction={updateComment} />

            </div>

        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        data: state.searchResult.s,
        data: state.searchResult.s,
        status: state.searchResult.status,
    }
}


export default connect(mapStateToProps, null)(MovieDetailPage)