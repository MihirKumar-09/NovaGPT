import "./Chat.css";
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";

// react-markdown - used for proper formating;
import ReactMarkdown from "react-markdown";
//rehype-hightlight - uesd for syntax highlighing ;
import rehypeHighlight from "rehype-highlight";
// CSS library to formating the style and color;
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  let { newChat, prevChats, reply } = useContext(MyContext);
  let [latestReply, setLatestReply] = useState(null);
  let bottomRef = useRef(null);

  useEffect(() => {
    // Load previous chat
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    // Latest reply separate => create type effect
    if (!prevChats?.length) return;

    const content = reply.split(" ");

    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx).join(" "));
      idx++;
      if (idx > content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  // 👇 Scroll to bottom whenever chats or latestReply update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  return (
    <>
      {newChat === true ? (
        <h1 className="newChatHead">What’s on your mind today?</h1>
      ) : (
        ""
      )}
      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {prevChats.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="gptDiv" key={latestReply}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {prevChats[prevChats.length - 1].content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="gptDiv" key={latestReply}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}

        {/* 👇 Always at the bottom for auto-scroll */}
        <div ref={bottomRef}></div>
      </div>
    </>
  );
}
