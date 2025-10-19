import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from "uuid";

export default function Sidebar() {
  let {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);
  let [isCollapes, setIsCollapes] = useState(false);
  // Handle Collapes;
  const handleCollapes = () => {
    setIsCollapes(!isCollapes);
  };

  const getAllThreads = async () => {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`);
      let res = await response.json();
      let filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filterData);
      // ThreadId, title
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]);
  };

  let changeThread = async (newThreadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`
      );
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };
  let deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/thread/${threadId}`,
        { method: "DELETE" }
      );
      const res = await response.json();
      console.log(res);

      // updated thread;
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className={`sidebar ${isCollapes ? "collapsed" : ""}`}>
      {/* New chat button */}
      <button onClick={createNewChat} title="Create New Chat">
        <img src="src/assets/logo.png" alt="gpt logo" className="logo" />
        <i className="fa-solid fa-edit"></i>
      </button>

      {/* History */}

      <ul className="history">
        {allThreads.map((thread, idx) => (
          <li key={idx} className="history-item">
            <span
              className="thread-title"
              onClick={() => changeThread(thread.threadId)}
            >
              {thread.title}
            </span>
            <i
              className="fa-solid fa-trash delete-icon"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* SignIn */}

      <div className="sign">
        <p>NovaGPT &#10084;&#65039;</p>
        {isCollapes === true ? (
          <i
            className={`fa-solid fa-down-left-and-up-right-to-center ${
              isCollapes === true ? "collapes" : " "
            }`}
            title="Collaps"
            onClick={handleCollapes}
          ></i>
        ) : (
          <i
            className={` fa-solid fa-compress ${
              isCollapes === true ? "collapes" : " "
            }`}
            title="Collaps"
            onClick={handleCollapes}
          ></i>
        )}
      </div>
    </section>
  );
}
