import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
const API_URL = import.meta.env.VITE_API_URL;

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  let [loading, setLoading] = useState(false);
  let [isOpen, setIsOpen] = useState(false); // Set the default value as false ;

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    console.log("message", prompt, "threadId", currThreadId);
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch(`${API_URL}/api/chat`, options);
      let res = await response.json();
      console.log(res.reply);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // Append new chat into previous chat;
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);
  let profileHandle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          NovaGPT <i className="fa-solid fa-angle-down"></i>
        </span>
        <div className="userIconDiv" onClick={profileHandle}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen ? (
        <div className="dropDown">
          <div className="dropDownItems">
            <i class="fa-solid fa-cloud-arrow-up"></i>Upgrade plan
          </div>
          <div className="dropDownItems">
            <i class="fa-solid fa-helicopter-symbol"></i>Help
          </div>
          <div className="dropDownItems">
            <i class="fa-solid fa-gear"></i>Settings
          </div>
        </div>
      ) : (
        ""
      )}
      <Chat></Chat>
      <BeatLoader
        color="#fff"
        loading={loading}
        style={{ marginBottom: "10px" }}
      ></BeatLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anyhting"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-arrow-up"></i>
          </div>
        </div>
        <p className="info">
          NovaGPT can make mistakes. Check important info. See{" "}
          <a href="#">Cookie Preferences</a>.
        </p>
      </div>
    </div>
  );
}
