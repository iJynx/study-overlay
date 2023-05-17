import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
import Head from 'next/head'
import { useForm } from "react-hook-form";
import Link from 'next/link'
import { useRouter } from 'next/router'
import { fetchSpotifyAccessToken, refreshToken } from '../utils/spotify';

// anonymous async func

export default function Home({ host, token, refreshTokenA }) {

  const { register, handleSubmit, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        // if token exists then set default for type as spotfiy
        type: token ? "spotify" : null
      }
    }
  );

  const type = watch("type");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (token) {
      // generate and display link
      const url = host + "spotify?token=" + token + "&refreshToken=" + refreshTokenA;
      setLink(url);
    }
  }, [])



  const onSubmit = data => {
    console.log(data)

    const { type, workingTime, restTime } = data;

    const timeNow = new Date().getTime();

    if (type === "pomodoro") {
      const url = devHost + "pomodoro?workingTime=" + workingTime + "&restTime=" + restTime + "&startTime=" + timeNow;

      setLink(url);
    }
    else if (type === "local") {
      const url = devHost + "localTime";

      setLink(url);
    }
  }


  const router = useRouter();

  return (
    <div className='bg-gray-900'>
      <Head>
        <title>Study Overlay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=' overflow-y-auto min-w-screen flex flex-col min-h-screen pb-10'>
        <div className='mx-auto pt-20 w-2/3'>
          <h1 className='text-3xl text-white'>Welcome to the <span className='font-bold text-indigo-500'>Study Overlay.</span></h1>
          <h3 className='text-gray-400'>an easy to use overlay that can be ported directly into OBS and other streaming software to add that special touch.</h3>
          <div className='grid grid-cols-3 gap-3 pt-4'>
            <div className='bg-white rounded-xl p-4 flex flex-col text-gray-500'>
              <h1 className='text-xl text-black font-bold'>Pomodoro Timer</h1>
              <h6>Add a simple but cute pomodoro timer to let others keep track of their studying with you!</h6>
            </div>
            <div className='bg-white rounded-xl p-4 flex flex-col text-gray-500'>
              <h1 className='text-xl text-black font-bold'>Spotify Tracker</h1>
              <h6>Let people listen see the songs you're listening to while studying.</h6>
            </div>
            <div className='bg-white rounded-xl p-4 flex flex-col text-gray-500'>
              <h1 className='text-xl text-black font-bold'>Local Timer</h1>
              <h6>Have your local time displayed.</h6>
            </div>
          </div>
          <div>
            <h1 className='my-6 text-xl'>
              This project is independently managed and hosted by Stefan Ciutina. To show support follow me <Link className="text-indigo-500 font-bold" href="https://instagram.com/stfn.c">@stfn.c</Link>.
            </h1>
          </div>
          <div className='text-gray-500'>
            <h1 className='text-3xl mt-10 text-white font-bold mb-1'>Steps</h1>
            <ul className='list-decimal'>
              <h1>(If you have already setup OBS skip to step 3)</h1>
              <li>Download OBS and open it</li>
              <li>Click add source (bottom left-ish area) and choose the camera option. Then press new and select your camera. You should see it pop up on the main screen now</li>
              <li>Scroll down to link generator and select type of overlay</li>
              <li>Complete details (if you selected pomodoro timer, then add how many minutes of work and how many minutes of rest)</li>
              <li>Press generate link and copy the link</li>
              <li>Open OBS and click "Add Source" (the plus button in the sources tab)</li>
              <li>Select "Browser" -> Create New -> Ok</li>
              <li>Then add the copied URL and change width to 1000 pixels and height to 200 pixels</li>
              <li>Lastly, add the filter "Chroma Key" to the browser source (this will make the background transparent)</li>
              <li>Enjoy!!</li>
            </ul>
          </div>
          <div>
            <h1 className='text-3xl mt-10 font-bold mb-1 text-indigo-500'><span className='text-white'>Link</span> Generator!</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-3 w-full gap-3 pb-4">
                <div className="flex items-center pl-4 border border-gray-200 rounded flex-1">
                  <input value="pomodoro" {...register("type", { required: "Please choose a site type" })} type="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                  <label className="w-full py-4 ml-2 text-sm font-medium text-gray-400"><span className="text-white font-bold">Pomodoro Timer</span> - cute little clock.</label>
                </div>
                <div className="flex items-center pl-4 border border-gray-200 rounded flex-1">
                  <input value="spotify" {...register("type")} type="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                  <label className="w-full py-4 ml-2 text-sm font-medium text-gray-400"><span className="text-white font-bold">Spotify Tracker</span> - show your current songs.</label>
                </div>
                <div className="flex items-center pl-4 border border-gray-200 rounded flex-1">
                  <input value="local" {...register("type")} type="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
                  <label className="w-full py-4 ml-2 text-sm font-medium text-gray-400"><span className="text-white font-bold">Local time</span> - display local time.</label>
                </div>
              </div>

              {
                type === "pomodoro" &&
                <div className="flex flex-col gap-2">
                  <input {...register("workingTime", { required: "Choose a working time for your pomodoro timer." })} type="text" className="rounded bg-gray-100 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-800 p-2.5 " placeholder="Work Time (minutes)" />
                  <input {...register("restTime", { required: "Choose a resting time for your pomodoro timer." })} type="text" className="rounded bg-gray-100 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-800 p-2.5 " placeholder="Rest Time (minutes)" />

                </div>
              }
              {
                type === "spotify" &&
                <div className=" gap-2 flex">
                  <button className='bg-green-400 rounded-xl text-white p-4 '
                    onClick={
                      () => {

                        let params = new URLSearchParams({
                          response_type: 'code',
                          client_id: "fb31251099ec4a96a54f36d223ceb448",
                          scope: "user-read-currently-playing",
                          redirect_uri: host,
                        });


                        const url = `https://accounts.spotify.com/authorize?${params.toString()}`


                        // go to it
                        router.push(url)
                      }
                    }
                  >
                    Click here to login to spotify
                  </button>
                </div>
              }
              {
                link &&
                <div className='mt-4'>
                  <h1 className='text-white font-bold'>Your link has been generated! Copy it from bellow.</h1>
                  <div className='m bg-indigo-500 rounded-xl text-white p-4 break-words'>
                    <Link href={link}>{link}</Link>

                  </div>
                </div>
              }
              <div className='flex flex-col text-red-500 font-bold py-4'>

                {errors.workingTime && <span>Please add a working time</span>}
                {errors.restTime && <span>Please add a rest time</span>}
              </div>
              <button type="submit" className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                Generate Link
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


// server side props
export async function getServerSideProps(context) {
  // get params

  const host = process.env.HOST;

  // check if code param exists
  const code = context.query.code
  const access_token = context.query.access_token


  if (code) {

    const data = await fetchSpotifyAccessToken(code, host);


    // go to /access

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    // go to ?access_token=accessToken&refresh_token=refreshToken

    context.res.writeHead(302, {
      Location: `/?access_token=${accessToken}&refresh_token=${refreshToken}`
    })
    context.res.end();


    return {
      props: {},
    };
  }

  if (access_token) {
    return {
      props: {
        token: access_token,
        refreshTokenA: context.query.refresh_token,
        host
      },
    };
  }

  return {
    props: {
      host
    }
  }
}
