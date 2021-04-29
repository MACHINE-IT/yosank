
import React, { useEffect, useState, useRef } from 'react'
import './Landingpage.css';
import { Typography, Row, Spin } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE, POSTER_SIZE } from '../../Config'
import MainImage from './Sections/MainImage'
import GridCard from '../../commons/GridCards'
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import { spacing } from '@material-ui/system';
import SearchMenu from '../LandingPage/Sections/SearchMenu'
import { connect, useStore } from 'react-redux';
const { Title } = Typography;


function LandingPage(props) {
    const store = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    console.log("searchIitialTerm = " + searchTerm);
    const [typingStatus, settypingStatus] = useState(false);
    const buttonRef = useRef(null);

    const [Movies, setMovies] = useState([]);
    const [searchMovies, setSearchMovies] = useState([]);
    const [searchbackrop_path, setsearchbackrop_path] = useState({
        imagePath: "",
        orginal_title: "",
        overview: "",
        movieId: ""
    });
    const [searchStatus, setSearchStatus] = useState([]);
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [CurrentPage, setCurrentPage] = useState(0)
    const [counts, setCounts] = useState({
        total_pages: 500,
        total_results: 10000
    });
    // const [pageCount, setPageCount] = useState(1);
    const hasNext = counts.total_pages > CurrentPage;


    const { imagePath, orginal_title, overview } = searchbackrop_path

    console.log(props.SearchMenu);
    console.log("searchTermLanding = " + searchTerm);
    var path;
    var loadpath;


    if (props.results.status === false) {

        path = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${props.results.s.searchTerm}&page=1`;

        loadpath = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${props.results.s.searchTerm}&page=${CurrentPage + 1}`;

    }
    else if (searchTerm == '') {

        path = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

        loadpath = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;

    }


    console.log("path = " + path);
    console.log("loadpath = " + loadpath);


    function reset() {
        setMainMovieImage(null)
        return setMovies([])
    }


    useEffect(() => {
        setSearchStatus(props.results.status);
        const endpoint = path;
        function call() {
            if (Movies.length > 0 && props.results.status == "initial_result") {
                console.log("running the condition");
                reset();
                return fetchMovies(endpoint)
            }
            else if (props.results.status == 'initial_result') {
                console.log('running initial_result')
                fetchMovies(endpoint)
            }
            else if (props.results.status) {
                console.log('running true')
                reset();
                setLoading(true);
            }
            else if (props.results.status === false) {
                console.log('running false')
                setLoading(false);
                reset();
                fetchMovies(props.results.s.request)
            }
        }
        return call();

    }, [props.results.status, searchStatus])
    console.log('props', props.results);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])


    const fetchMovies = (endpoint) => {
        console.log("running endpoint", endpoint);
        fetch(endpoint)
            .then(result => result.json())
            .then(result => {


                setMainMovieImage(MainMovieImage || result.results[0])
                setCurrentPage(result.page)
                setCounts({
                    total_pages: result.total_pages,
                    total_results: result.total_results
                });
                console.log("movies Fetched from path: " + endpoint);
                console.log("movies Fetched : ", result);

                return setMovies([...Movies, ...result.results])

            },
                setLoading(false))
            .catch(error => {
                if (error) {
                    setLoading(true);
                }
                console.error('Error:', error)
            })
    }

    console.log(Movies);

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)

        console.log('CurrentPage', CurrentPage)
        console.log('loadpath', loadpath);

        endpoint = loadpath;

        fetchMovies(endpoint);

    }

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 1) {
            // loadMoreItems()
            console.log('clicked')
            // buttonRef.current.click();

        }
    }

    return (
        <div>
            {
                <div>

                    <div style={{ width: '100%', margin: '0' }}>
                        {MainMovieImage &&
                            <MainImage
                                image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
                                title={MainMovieImage.original_title}
                                text={MainMovieImage.overview}
                                MovieId={MainMovieImage.id}
                            />
                        }

                        <div style={{ width: '85%', margin: '1rem auto' }}>

                            <Title level={2} >
                                {props.results.status === false ? `${props.results.s.searchTerm}` : "Latest movies"}
                            </Title>
                            <hr />
                            <Row gutter={[16, 16]}>
                                {Movies && Movies.map((movie, index) => (
                                    <React.Fragment key={index}>
                                        <GridCard
                                            image={movie.poster_path ?
                                                `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                                : null}
                                            movieId={movie.id}
                                            movieName={movie.title}
                                        />
                                    </React.Fragment>
                                ))}
                            </Row>

                            {
                                Loading &&
                                <div className="example">
                                    <Spin />
                                </div>
                            }

                            <br />
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {hasNext
                                    ? (
                                        <div>
                                            <button
                                                ref={buttonRef}
                                                className="loadMore"
                                                onClick={loadMoreItems}
                                            >
                                                Load More
                                        </button><br />
                                            <ArrowDropDownRoundedIcon
                                                id="load_more_icon"
                                                ref={buttonRef}
                                                // className="loadMore"
                                                onClick={loadMoreItems} />
                                        </div>
                                    )
                                    : (
                                        <div>
                                            Showing {counts.total_results} of {counts.total_results} results
                                        </div>
                                    )

                                }


                            </div>
                        </div>

                    </div>
                </div>
            }
        </div>
    )
}

const matchStateToProps = (state) => {
    return { results: state.searchResult }
}

export default connect(matchStateToProps, null)(LandingPage)

/* 
import React, { useEffect, useState, useRef } from 'react'
import './Landingpage.css';
import { Typography, Row, Spin } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE, POSTER_SIZE } from '../../Config'
import MainImage from './Sections/MainImage'
import GridCard from '../../commons/GridCards'
import SearchMenu from '../LandingPage/Sections/SearchMenu'
import { connect, useStore } from 'react-redux';
const { Title } = Typography;


function LandingPage(props) {
    const store = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    console.log("searchIitialTerm = " + searchTerm);
    const [typingStatus,settypingStatus] = useState(false);
    const buttonRef = useRef(null);

    const [Movies, setMovies] = useState([]);
    const [searchMovies,setSearchMovies] = useState([]);
    const [searchbackrop_path,setsearchbackrop_path] = useState({
        imagePath:"",
        orginal_title:"",
        overview:"",
        movieId:""
    }); 
    const [searchStatus,setSearchStatus] = useState();
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [CurrentPage, setCurrentPage] = useState(0)

    const {imagePath,orginal_title,overview} = searchbackrop_path

    console.log(props.SearchMenu);
    console.log("searchTermLanding = " + searchTerm);
    var path;
    var loadpath; 
    
     
        if (props.results.status === false) {

            path = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${props.results.s.searchTerm}&page=1`;  
              
            loadpath = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${props.results.s.searchTerm}&page=${CurrentPage + 1}`;  
        
        }
        else if (searchTerm == '') {
            
            path = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
            
            loadpath = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;                            
        
        }

    
    console.log("path = "+path);
    console.log("loadpath = "+loadpath);


    function reset () {
        setMainMovieImage(null)
       return  setMovies([])
    }


    useEffect(() => {
        setSearchStatus(props.results.status);
        const endpoint = path;
       function call(){
        if(Movies.length > 0 && props.results.status == "initial_result"){
            console.log("running the condition");
            reset();
            return fetchMovies(endpoint)
        }
        else if(props.results.status == 'initial_result'){
            console.log('running initial_result')
            fetchMovies(endpoint)
        }
        else if(props.results.status){
            console.log('running true')
            reset();
            setLoading(true);
        }
        else if(props.results.status === false){
            console.log('running false')
            setLoading(false);
            reset();
            fetchMovies(props.results.s.request)
        }
       }
       return call();

    }, [props.results.status,searchStatus])

    console.log('props',props.results);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])


    const fetchMovies = (endpoint) => {
  console.log("running endpoint", endpoint);
        fetch(endpoint)
        .then(result => result.json())
        .then(result => {
            
           
            setMainMovieImage(MainMovieImage || result.results[0])
            setCurrentPage(result.page)
            console.log("movies Fetched from path: "+endpoint);
            console.log("movies Fetched : ",result); 
           
            return setMovies([...Movies, ...result.results])
            
        },  
        setLoading(false))
        .catch(error => {
            if(error){
                setLoading(true);
            }
            console.error('Error:', error)})
    }


    console.log( Movies);

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        
        console.log('CurrentPage', CurrentPage)
        console.log('loadpath', loadpath);

            endpoint = loadpath;
        
        fetchMovies(endpoint);
    }

    const handleScroll = () => {

        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 1) {
          
            console.log('clicked')
            buttonRef.current.click();
        }
    }

    return (
        <div>
        { 
            <div>

            <div style={{ width: '100%', margin: '0' }}>
                {MainMovieImage && 
                    <MainImage
                        image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
                        title={MainMovieImage.original_title}
                        text={MainMovieImage.overview}
                        MovieId = {MainMovieImage.id}
                     />
                 }

                <div style={{ width: '85%', margin: '1rem auto' }}>

                    <Title level={2} > 
                     { props.results.status === false ? `Results for: ${props.results.s.searchTerm}` : "Latest movies"}
                      </Title>
                    <hr />
                    <Row gutter={[16, 16]}>
                        {Movies && Movies.map((movie, index) => (
                            <React.Fragment key={index}>
                                <GridCard
                                    image={movie.poster_path ?
                                        `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                        : null}
                                    movieId={movie.id}
                                    movieName={movie.title}
                                />
                            </React.Fragment>
                        ))}
                    </Row>

                     {
                        Loading &&
                        <div className="example">
                            <Spin />
                        </div>
                     }

                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>Load More</button>
                    </div>
                </div>

            </div>
            </div>   
        }
        </div>
    )
}

 const matchStateToProps = (state)=>{
    return {results: state.searchResult}
}

export default connect(matchStateToProps,null)(LandingPage)
 */




/* 
            typingStatus.status == "initial_result" ?

            <div>

            <div style={{ width: '100%', margin: '0' }}>
                {MainMovieImage && 
                    <MainImage
                        image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
                        title={MainMovieImage.original_title}
                        text={MainMovieImage.overview}
                        MovieId = {MainMovieImage.id}
                     />
                 }

                <div style={{ width: '85%', margin: '1rem auto' }}>

                    <Title level={2} > Latest movies </Title>
                    <hr />
                    <Row gutter={[16, 16]}>
                        {Movies && Movies.map((movie, index) => (
                            <React.Fragment key={index}>
                                <GridCard
                                    image={movie.poster_path ?
                                        `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                        : null}
                                    movieId={movie.id}
                                    movieName={movie.title}
                                />
                            </React.Fragment>
                        ))}
                    </Row>

                     {
                        Loading &&
                        <div className="example">
                            <Spin />
                        </div>
                     }

                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>Load More</button>
                    </div>
                </div>

            </div>
            </div>:null

            || 

            typingStatus.status ?
            <div>
            <div className="example">
                        <Spin />
                    </div>,   
            </div>
            :null

            ||

            typingStatus.status === false ?

            <div>
            <div style={{ width: '100%', margin: '0' }}>
               
                    <MainImage
                        image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${searchbackrop_path.imagePath}`}
                        title={searchbackrop_path.orginal_title}
                        text={searchbackrop_path.overview}
                        MovieId = {searchbackrop_path.movieId}
                     />
                

                <div style={{ width: '85%', margin: '1rem auto' }}>

                    <Title level={2} > Latest movies </Title>
                    <hr />
                    <Row gutter={[16, 16]}>
                        {searchMovies && searchMovies.map((movie, index) => (
                            <React.Fragment key={index}>
                                <GridCard
                                    image={movie.poster_path ?
                                        `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                        : null}
                                    movieId={movie.id}
                                    movieName={movie.title}
                                />
                            </React.Fragment>
                        ))}
                    </Row>

                    {
                        Loading &&
                        <div>
                        <div className="example">
                                <Spin />
                            </div>,
                        </div>
                    }

                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>Load More</button>
                    </div>
                </div>

            </div>
            </div>:null

          */