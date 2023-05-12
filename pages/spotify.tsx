import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import SpotifyWebApi from 'spotify-web-api-js';
import { useRouter } from 'next/router';
import axios from 'axios';
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
import { fetchSpotifyAccessToken, refreshToken } from '../utils/spotify';

// anonymous async func

export default function Home({ token, refreshTokenA }) {
  async function fetchWebApi(endpoint, method, body) {
    if (!stateToken) {
      return;
    }
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${stateToken}`,
      },
      method,
      body: JSON.stringify(body)
    });
    return await res.json();
  }

  async function getCurrentPlaying() {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
      'v1/me/player/currently-playing',
    ));
  }

  // const [token, setToken] = useState('')
  const [songName, setSongName] = useState('')
  const [artistName, setArtistName] = useState('')
  const [progress, setProgress] = useState(0)
  const [actualProgress, setActualProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [albumCover, setAlbumCover] = useState('')

  let [stateToken, setStateToken] = useState(token)

  useEffect(() => {

    if (!token) {
      return;
    }

    try {
      // do every 5 seconds
      let a = setInterval(() => {
        console.log("checking")
        getCurrentPlaying().then(currentPlaying => {

          if (currentPlaying.error && currentPlaying.error.status === 401) {
            // cancel interval
            // refresh token
            refreshToken(refreshTokenA).then(data => {
              setStateToken(data.access_token)
            })
            return;
          }



          setSongName(currentPlaying.item.name)
          setArtistName(currentPlaying.item.artists[0].name)
          setProgress(currentPlaying.progress_ms)
          setActualProgress(currentPlaying.progress_ms)
          setDuration(currentPlaying.item.duration_ms)
          setAlbumCover(currentPlaying.item.album.images[0].url)
        })
      }, 1000)
    } catch (error) {
    }
  }, [])

  // useEffect(() => {
  //   if (progress && progress > 0) {
  //     const currentProgress = progress;

  //     let count = 0;
  //     const interval = setInterval(() => {
  //       if(count < 5) {
  //         setActualProgress(currentProgress + 1000)
  //         count++;
  //       } else {
  //         clearInterval(interval)
  //       }
  //     }, 1000)
  //   }
  // }, [progress])

  // make center of page current minutes and seconds
  const [currentDate, setCurrentDate] = useState(new Date("2021-01-01T00:00:00"))
  useEffect(() => {
    const interval = setInterval(() => {
      // set minutes and seconds
      const newDate = new Date()
      setCurrentDate(newDate)

    }, 1000)
    return () => clearInterval(interval)
  }, [])


  if (!token) {
    return (<div>

      <h1>
        token not found. you are not meant to access this link directly. use the link generator
      </h1>
    </div>)
  }
  return (
    <div
      className={`w-full h-screen flex flex-grow bg-green-500 font-sans text-white`}
    >
      <div>
        <div className='flex p-2 '>

          <div className='h-[100px] w-[100px]'>
            <Image src={albumCover} width={500} height={500} className="rounded-[1rem]" />
          </div>
          <div className='flex flex-col -mt-4'>

            <h1 className='text-[3rem] font-extrabold flex my-auto ml-4'>

              {songName} <span className='text-[1.5rem] my-auto mx-6'>by</span> {artistName}
            </h1>
            <div className='flex -my-1 -'>
              <div className='text-[1.5rem] my-auto mx-6'>
                {Math.floor(actualProgress / 60000)}:{((actualProgress / 1000) % 60).toFixed(0).toString().padStart(2, '0')}
              </div>

              <div className='h-3 w-[400px] bg-gray-300 rounded-lg overflow-none my-auto'>
                <div
                  style={{ width: `${progress / duration * 100}%` }}
                  className={`rounded-lg h-full bg-gray-700`}>
                </div>
              </div>
              {/* 
              <div className='h-[10px] w-[500px] bg-white rounded-[1rem] my-auto relative'>
                <div className={`h-[10px] w-[402px] bg-blue-500 rounded-[1rem] absolute z-10`} ></div>
              </div> */}

              <div className='text-[1.5rem] my-auto mx-6'>
                {Math.floor(duration / 60000)}:{((duration / 1000) % 60).toFixed(0).toString().padStart(2, '0')}
              </div>

            </div>
          </div>
        </div>
      </div>


    </div>
  )
}



// server side props
export async function getServerSideProps(context) {
    // get params
  
    const access_token = context.query.token

    if (access_token) {
      return {
        props: {
          token: access_token,
          refreshTokenA: context.query.refreshToken
        },
      };
    }
  
    return {
      props: {
  
      }
    }
  }
  