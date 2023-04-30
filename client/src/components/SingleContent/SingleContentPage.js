import axios from "axios";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {img_300, unavailable, img_500} from "../../images/Default";
import SingleData from "../SingleData/SingleData";
import "./SinglePage.css";
import Myloader from "react-spinners/ClipLoader";
import ScrollComments from "../ScrollComments/ScrollComments";

import Carousel from "../Carousel/Carousel";
import GoogleTrends from "../GoogleTrends/GoogleTrends";

const TMDB_KEY = "dfe8923f3e487ce951bd22dcd3dfccfc";
const SPOTIFY_CLIENT_ID = "580c268cc1c142abb5e4697ca23b19a4";
const SPOTIFY_CLIENT_SECRET = "8bc9e2a2a2794c909fcbf4db3e1280b4";

const SinglePage = () => {
    const [content, setContent] = useState();
    const [similarMovies, setSimilarMovies] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState();
    // eslint-disable-next-line
    const [color, setColor] = useState("grey");
    const {id, mediaType} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const nameComment = searchParams.get("name") || "";

    const nav = useNavigate();

    const fetchData = async () => {
        try {
            if (mediaType != "Song") {
                const {data} = await axios.get(` 
        https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${TMDB_KEY}&page=1`);
                // eslint-disable-next-line
                setContent(data);
                setIsLoading(true);
            } else {
                const AUTH_URL = "https://accounts.spotify.com/api/token";
                const response = await axios.post(
                    AUTH_URL,
                    {
                        grant_type: "client_credentials",
                        client_id: SPOTIFY_CLIENT_ID,
                        client_secret: SPOTIFY_CLIENT_SECRET,
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                const access_token = response.data.access_token;

                const {data} = await axios.get(
                    `https://api.spotify.com/v1/tracks/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "appliation/json",
                        },
                    }
                );

                const relevantData = {
                    backdrop_path: data.album.images[0].url,
                    poster_path: data.album.images[1].url,
                    name: data.name,
                    release_date: data.album.release_date,
                    vote_average: data.popularity / 10,
                    genres: [{id: 16, name: "Animation"}],
                    tagline: "",
                    overview: "",
                    runtime: Math.round(data.duration_ms / 60000, 2),
                    production_companies: [{id: 10, name: data.artists[0].name}],
                    status: "Released",
                    artist_id: data.artists[0].id,
                };

                setContent(relevantData);
                setIsLoading(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                nav("/error");
            }
        }
    };

    const fetchComments = async (name) => {
        const {data} = await axios.get(
            `http://localhost:5000/apiv1/search/${name}`
        );
        setComments(data);
        // console.log(data);
    };

    const fetchSimilarMovies = async () => {
        try {
            if (mediaType !== "Song") {
                const {data} = await axios.get(` 
     https://api.themoviedb.org/3/${mediaType}/${id}/similar?api_key=${TMDB_KEY}`);
                // eslint-disable-next-line
                const dataSlice = data.results;
                const filter = dataSlice.slice(0, 7);

                // eslint-disable-next-line
                setSimilarMovies(filter);
                setIsLoading(true);
            } else {
                const AUTH_URL = "https://accounts.spotify.com/api/token";
                const response = await axios.post(
                    AUTH_URL,
                    {
                        grant_type: "client_credentials",
                        client_id: SPOTIFY_CLIENT_ID,
                        client_secret: SPOTIFY_CLIENT_SECRET,
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                const access_token = response.data.access_token;

                const {data} = await axios.get(
                    `https://api.spotify.com/v1/tracks/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "appliation/json",
                        },
                    }
                );

                const {data: res} = await axios.get(
                    `https://api.spotify.com/v1/recommendations?seed_artists=${data.artists[0].id}&seed_tracks=${id}&market=US&limit=7`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "appliation/json",
                        },
                    }
                );

                const required = res.tracks.map((r1) => ({
                    poster_path: r1.album.images[1].url,
                    title: r1.name,
                    id: r1.id,
                    artist: r1.artists[0].name,
                    release_date: r1.album.release_date,
                    vote_average: r1.popularity / 10,
                    mediaType,
                }));

                setSimilarMovies(required);
                setIsLoading(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    console.log(comments);

    useEffect(() => {
        window.scroll(0, 0);

        fetchData();
        fetchSimilarMovies();
        fetchComments(nameComment);
        // eslint-disable-next-line
    }, [id, setContent]);

    return (
        <>
            {isLoading ? (
                <>
                    <div>
                        {content && (
                            <div
                                className='open__modal'
                                style={{
                                    backgroundImage: `url(${
                                        mediaType === "Song"
                                            ? `${content.backdrop_path}`
                                            : `https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${content.backdrop_path}`
                                    })`,
                                }}
                            >
                                <div className='poster__img'>
                                    {mediaType !== "Song" ? (
                                        <img
                                            src={
                                                content.poster_path
                                                    ? `${img_300}/${content.poster_path}`
                                                    : unavailable
                                            }
                                            alt=''
                                        />
                                    ) : (
                                        <img
                                            src={
                                                content.poster_path ? content.poster_path : unavailable
                                            }
                                            alt=''
                                        />
                                    )}
                                </div>

                                <div className='backdrop__img'>
                                    {mediaType !== "Song" ? (
                                        <img
                                            src={
                                                content.backdrop_path
                                                    ? `${img_500}/${content.backdrop_path}`
                                                    : unavailable
                                            }
                                            alt=''
                                        />
                                    ) : (
                                        <img
                                            src={
                                                content.backdrop_path
                                                    ? content.backdrop_path
                                                    : unavailable
                                            }
                                            alt=''
                                        />
                                    )}
                                </div>

                                <div className='open__detailsPage'>
                                    <h3>{content.original_title || content.name}</h3>
                                    <div
                                        style={{
                                            zIndex: "1000",
                                            marginTop: "10px",
                                            textAlign: "left",
                                        }}
                                        className='year'
                                    >
                                        {(
                                            content.first_air_date ||
                                            content.release_date ||
                                            "-----"
                                        ).substring(0, 4)}{" "}
                                        .
                                        <b className='vote_back'>
                                            <b className='tmdb'>TMDB</b>
                                            <b className='vote_ave'>-⭐{content.vote_average}</b>
                                        </b>
                                    </div>
                                    <h5
                                        style={{
                                            display: "flex",
                                            fontSize: "12px",
                                        }}
                                        className='genreList'
                                    >
                                        {content.genres.map((n, i) => {
                                            return (
                                                <p
                                                    key={n.id}
                                                    style={{fontSize: "13px", marginLeft: "6px"}}
                                                    className='mygenre'
                                                >
                                                    {i > 0 && ", "}
                                                    {n.name}
                                                </p>
                                            );
                                        })}
                                    </h5>
                                    <div className='tagline'>
                                        <h5>{content.tagline}</h5>
                                    </div>
                                    <div className='overview'>
                                        <p>{content.overview}</p>
                                    </div>
                                    <div className='other_lists'>
                                        <ul>
                                            <li>
                                                DURATION:{" "}
                                                <span>
                          {mediaType === "tv"
                              ? `${content.episode_run_time[0]} min episodes`
                              : `${content.runtime} min`}
                        </span>
                                            </li>
                                            {mediaType === "tv" ? (
                                                <li>
                                                    SEASONS: <span>{content.number_of_seasons}</span>
                                                </li>
                                            ) : (
                                                ""
                                            )}

                                            <li>
                                                STUDIO:
                                                {content.production_companies.map((studio, i) => {
                                                    return (
                                                        <span key={studio.id}>
                              {" "}
                                                            {i > 0 && ",  "}
                                                            {studio.name}
                            </span>
                                                    );
                                                })}
                                            </li>
                                            {mediaType === "movie" ? (
                                                <li>
                                                    RELEASE DATE: <span>{content.release_date}</span>
                                                </li>
                                            ) : (
                                                ""
                                            )}
                                            <li>
                                                STATUS: <span>{content.status}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='all__cast px-5 pt-5'>
                        <div className='cast__title'>
                            <h2>Cast</h2>
                        </div>
                        <div>
                            <Carousel mediaType={mediaType} id={id}/>
                        </div>
                    </div>
                    <div className='all__cast px-5 pt-5'>
                        <div className='cast__title'>
                            <h2>Reddit Comments</h2>
                        </div>
                        <div>{comments && <ScrollComments comments={comments}/>}</div>
                    </div>
                    <GoogleTrends
                        type="TIMESERIES"
                        keyword={content.original_title}
                        url="https://ssl.gstatic.com/trends_nrtr/2051_RC11/embed_loader.js"
                    />
                    <GoogleTrends
                        type="GEO_MAP"
                        keyword={content.original_title}
                        url="https://ssl.gstatic.com/trends_nrtr/2051_RC11/embed_loader.js"
                    />
                    <div className='similar__shows'>
                        <div className='btn__title'>
                            <h5>You May Also Like </h5>
                        </div>
                        <div className='similar'>
                            {similarMovies &&
                                similarMovies.map((n) => <SingleData key={n.id} {...n} />)}
                        </div>
                    </div>
                </>
            ) : (
                <div className='load_app' style={{height: "500px"}}>
                    <Myloader color={color} size={60}/>
                    <p
                        className='pt-4 text-secondary text-loading'
                        style={{textTransform: "capitalize", fontSize: "1rem"}}
                    >
                        Loading Please Wait...
                    </p>
                </div>
            )}
        </>
    );
};

export default SinglePage;
