"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function Home() {

  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("")
  const [from, setFrom] = useState("") 
  const searchParam = useSearchParams()
  const [msgs, setMsgs] = useState([])
  const [online,setOnline] = useState(false)
  const [profile, setProfile] = useState({})

  useEffect(() => {
    if (!searchParam.get("from")) return;
    const newSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WSS}/xyz?from=${searchParam.get("from") || from}`);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Client connected!");
      setOnline(true)
    }

    newSocket.onmessage = (event) => {
      let receive = JSON.parse(event.data)
      console.log("Received message:", receive);
      if (receive.event == "messages") {
        setMsgs(receive.data)
        scrollBottom()
      }
    }


    newSocket.onclose = () => {
      // console.log("Client disconnected!");
    }

    setFrom(searchParam.get("from"))

    switch(searchParam.get("from")) {
      case "mveF0lJezBoka":
        setProfile({
          name: "Cena",
          avatar: "assets/images/avatar/cena.png"
        }) 
        break;
      case "ebakj657tBj0ta":
        setProfile({
          name: "John",
          avatar: "assets/images/avatar/john.webp"
        }) 
       break;
      default:
        setProfile({
          name: "Lucia",
          avatar: "assets/images/avatar/lucia.png"
        }) 
    }

    return () => newSocket.close();
  }, [searchParam.get("from"), online])

  const sendMessage = () => {
    socket.send(JSON.stringify({ event: 'send', data: msg }))
    setMsg("")
    scrollBottom()
  }

  const scrollBottom = () => {
    const el = document.getElementById('chat-feed');
    setTimeout(() => {
      el.scrollIntoView(false)
    },150)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
     sendMessage()
    }
  }

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
          <div className="flex flex-row items-center justify-center h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="ml-2 font-bold text-2xl">QuickChat</div>
          </div>
          {Object.keys(profile).length > 0 && <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
            <div className="h-20 w-20 rounded-full border overflow-hidden">
              <img src={`/${profile?.avatar}`} alt="Avatar" className="h-full w-full" />
            </div>
            <div className="text-sm font-semibold mt-2">{profile?.name}</div>
            <div className="flex flex-row items-center mt-3">
              <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full">
                <div className="h-3 w-3 bg-white rounded-full self-end mr-1" />
              </div>
              <div className="leading-none ml-1 text-xs">Active</div>
            </div>
          </div>}
          <div className="flex flex-col mt-8">
            <div className="flex flex-row items-center justify-between text-xs">
              <span className="font-bold">Choose Acting As</span>
              <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">4</span>
            </div>
            <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
              {
                from != "mveF0lJezBoka" && <Link href={`/?from=mveF0lJezBoka`} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                  <Image src="/assets/images/avatar/cena.png" width={50} height={50} alt=""></Image>
                </div>
                <div className="ml-2 text-sm font-semibold">Cena</div>
              </Link>
              }
              {from != "ebakj657tBj0ta" && <Link href={`/?from=ebakj657tBj0ta`} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                <Image src="/assets/images/avatar/john.webp" width={50} height={50} alt=""></Image>
                </div>
                <div className="ml-2 text-sm font-semibold">John</div>
              </Link>}
              {from != "l3x678hjhjll" && <Link href={`/?from=l3x678hjhjll`} className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                <Image src="/assets/images/avatar/lucia.png" width={50} height={50} alt=""></Image>
                </div>
                <div className="ml-2 text-sm font-semibold">Lucia</div>
              </Link>}
            </div>

          </div>
        </div>
        <div className="flex flex-col flex-auto h-full p-6 bg-gray-100">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2" id="chat-feed">
                  {msgs.map((v, i) =>
                    v.SenderId != from ? (<div key={i} className="col-start-1 col-end-8 p-3 rounded-lg">
                      <div className="flex flex-row items-center">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          <Image src={`/${v.sender.avatar}`} width={50} height={50}></Image>
                        </div>
                        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                          <div>{v.message}</div>
                        </div>
                      </div>
                    </div>)
                      :
                      (<div key={i} className="col-start-6 col-end-13 p-3 rounded-lg">
                        <div className="flex items-center justify-start flex-row-reverse">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                            <Image src={`/${v.sender.avatar}`} width={50} height={50} alt=""></Image>
                          </div>
                          <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                            <div>{v.message}</div>
                          </div>
                        </div>
                      </div>)
                  )}
                  {msgs.length == 0 && <span>Welcome new chatbot</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div>
                <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input onKeyDown={handleKeyDown} value={msg} onChange={e => setMsg(e.currentTarget.value)} type="text" className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
                  <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button onClick={e => sendMessage()} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                  <span>Send</span>
                  <span className="ml-2">
                    <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
