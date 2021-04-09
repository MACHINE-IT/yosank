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
    const [searchPath,setSearchPath] = useState([]);
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [CurrentPage, setCurrentPage] = useState(0)

    const {imagePath,orginal_title,overview} = searchbackrop_path

    console.log(props.SearchMenu);
    console.log("searchTermLanding = " + searchTerm);
    var path;
    var loadpath; 
    
     
        if (searchTerm != '') {

            path = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=1`;  
        
            loadpath = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${CurrentPage + 1}`;  
            
           // setMovies([ ]);
        }
        else if (searchTerm == '') {
            
            path = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
            
            loadpath = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;                            
            
           // setMovies([]);

        }

    
    console.log("path = "+path);
    console.log("loadpath = "+loadpath);
    useEffect(() => {
        const endpoint = path;
        console.log("endpoint path changed..");
        fetchMovies(endpoint)
    }, [path])


    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])


    const fetchMovies = (endpoint) => {
       
        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                // console.log(result)
                // console.log('Movies',...Movies)
                // console.log('result',...result.results)
                setMovies([...Movies, ...result.results])
                setMainMovieImage(MainMovieImage || result.results[0])
                setCurrentPage(result.page)
                console.log("movies Fetched from path: "+endpoint);
                console.log("movies Fetched : ",result); 
            }, setLoading(false))
            .catch(error => console.error('Error:', error)
            )
    }
    console.log( Movies);

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        console.log('CurrentPage', CurrentPage)
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
            buttonRef.current.click();
        }
    }

    useEffect(() => {
        setTimeout(() =>{
            store.subscribe(()=>{
                console.log("subscribed");
               /*  settypingStatus() */
               let status = store.getState().searchResult
             /*   let Movie = store.getState().searchResult */
               console.log("status",status.s);
             /*   setSearchMovies(Movie); */
                settypingStatus(status)
                setSearchPath(status.s)
            })
        })
    });
    /* if(typingStatus.status === true){
        console.log("loading")
    }
    else if(typingStatus.status === false){
        console.log("show search result");
        console.log("showing",typingStatus.s[0])
    } */
    useEffect(() => {
        fetch(searchPath)
        .then(response => response.json())
        .then(data =>{ 

            console.log('data',data.results)
            if(data.results.length > 0){
                setsearchbackrop_path({imagePath:data.results[0].backdrop_path,
                    orginal_title:data.results[0].original_title,overview:data.results[0].overview,
                movieId:data.results[0].id})
                return setSearchMovies(data.results);
            }
           
        });
    },[searchPath])

console.log(searchMovies.map(e =>{
    console.log("df",e.original_title);
}));
console.log(searchbackrop_path);

        

   
    
    return (

        <div>
        {
            typingStatus.status == "initial_result"?
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

                    {Loading &&
                        <div className="example">
                        <Spin />
                      </div>}

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
                        MovieId = {searchbackrop_path.id}
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

                    {Loading &&
                        <div>
                        <div className="example">
                                <Spin />
                            </div>,
                        </div>}

                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>Load More</button>
                    </div>
                </div>

            </div>
            </div>:null
         
           
            
             
        }
            

        </div>

    )
}
export default LandingPage;

/*  const matchStateToProps = (state)=>{
    return {results: state.searchResult}
}

const 

export default connect(mapStateToProps) */