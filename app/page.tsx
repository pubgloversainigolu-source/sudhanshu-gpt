"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {

  const [input, setInput] = useState("");
  const [chats, setChats] = useState<any[]>([
    { id: 1, title: "New Chat", messages: [] }
  ]);

  const [activeChat, setActiveChat] = useState(1);

  const bottomRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(c => c.id === activeChat);

  const updateChatMessages = (messages:any[]) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChat ? { ...chat, messages } : chat
      )
    );
  };

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = { role:"user", text:input };

    const updatedMessages = [
      ...currentChat.messages,
      userMessage,
      { role:"ai", text:"" }
    ];

    updateChatMessages(updatedMessages);

    setInput("");

    const res = await fetch("/api/chat",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({message:input})
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    let aiText = "";

    while(true){

      const {done,value} = await reader.read();

      if(done) break;

      aiText += decoder.decode(value);

      updateChatMessages(prev=>{
        const copy=[...prev];
        copy[copy.length-1].text = aiText;
        return copy;
      });

    }

  };

  const newChat = () => {

    const id = Date.now();

    setChats([
      ...chats,
      { id, title:"New Chat", messages:[] }
    ]);

    setActiveChat(id);

  };

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[currentChat?.messages]);

  return (

    <div style={{display:"flex",height:"100vh",background:"#0f172a",color:"white"}}>

      {/* Sidebar */}

      <div style={{
        width:"260px",
        borderRight:"1px solid #334155",
        padding:"20px"
      }}>

        <button
          onClick={newChat}
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"20px",
            background:"#22c55e",
            border:"none",
            borderRadius:"6px",
            color:"white",
            cursor:"pointer"
          }}
        >
          + New Chat
        </button>

        {chats.map(chat=>(
          <div
            key={chat.id}
            onClick={()=>setActiveChat(chat.id)}
            style={{
              padding:"10px",
              marginBottom:"8px",
              background: chat.id===activeChat ? "#1e293b":"transparent",
              borderRadius:"6px",
              cursor:"pointer"
            }}
          >
            {chat.title}
          </div>
        ))}

      </div>

      {/* Chat Area */}

      <main style={{
        flex:1,
        display:"flex",
        flexDirection:"column"
      }}>

        <h2 style={{
          padding:"20px",
          borderBottom:"1px solid #334155"
        }}>
          SudhanshuGPT 🤖
        </h2>

        <div style={{
          flex:1,
          overflowY:"auto",
          padding:"20px"
        }}>

          {currentChat?.messages.map((msg:any,i:number)=>(
            <div key={i} style={{
              display:"flex",
              justifyContent: msg.role==="user"?"flex-end":"flex-start",
              marginBottom:"15px"
            }}>
              <div style={{
                background: msg.role==="user"?"#2563eb":"#1e293b",
                padding:"12px 16px",
                borderRadius:"10px",
                maxWidth:"60%",
                whiteSpace:"pre-wrap"
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={bottomRef}></div>

        </div>

        <div style={{
          padding:"20px",
          borderTop:"1px solid #334155",
          display:"flex",
          gap:"10px"
        }}>

          <textarea
            value={input}
            placeholder="Ask something..."
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==="Enter" && !e.shiftKey){
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            style={{
              flex:1,
              padding:"12px",
              borderRadius:"6px",
              border:"none",
              resize:"none"
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding:"12px 20px",
              background:"#22c55e",
              border:"none",
              borderRadius:"6px",
              color:"white",
              cursor:"pointer"
            }}
          >
            Send
          </button>

        </div>

      </main>

    </div>

  );
}