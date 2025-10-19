import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  let [prompt, setPrompt] = useState(""); //Initialize with empty string because as a user we sent prompt in the form of string;
  let [reply, setReply] = useState(null); //Initialize with null value because backend will sent the response in the form of string, object, number or anyhitng else
  let [currThreadId, setCurrThreadId] = useState(uuidv4()); //Use UUID for initial threadID
  let [prevChats, setPrevChats] = useState([]); //store all chats of curr thread;
  let [newChat, setNewChat] = useState(true); //Track if new chat created;
  let [allThreads, setAllThreads] = useState([]); // store all threads or we can say threadMessage;

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  }; //Passing values
  return (
    <div className="App">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
