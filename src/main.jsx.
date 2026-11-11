import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Bot, Plus, Send, Sun, Moon, Menu, X, Sparkles, MessageSquare, Trash2, Globe2 } from "lucide-react";
import "./styles.css";

const WELCOME = "Hi! I'm Manish AI. 👋 Ask me anything, and let's figure it out together!";
const starterPrompts = [
  { icon: "✦", title: "Explain a concept", text: "Explain a difficult science concept in simple words." },
  { icon: "⌘", title: "Help me code", text: "Teach me the basics of Python with a small example." },
  { icon: "∑", title: "Solve a problem", text: "Help me solve a maths problem step by step." },
  { icon: "文", title: "Speak Tamil", text: "வணக்கம்! உங்களைப் பற்றி அறிமுகப்படுத்துங்கள்." }
];

function newChat() {
  return { id: crypto.randomUUID(), title: "New chat", messages: [{ role: "assistant", content: WELCOME }] };
}

function App() {
  const [chats, setChats] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("manish-chats") || "[]");
      return saved.length ? saved : [newChat()];
    } catch { return [newChat()]; }
  });
  const [activeId, setActiveId] = useState(() => chats[0]?.id);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const activeChat = chats.find(c => c.id === activeId) || chats[0];

  useEffect(() => { localStorage.setItem("manish-chats", JSON.stringify(chats)); }, [chats]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeChat?.messages, loading]);

  function updateChat(id, updater) {
    setChats(prev => prev.map(c => c.id === id ? updater(c) : c));
  }
  function startNewChat() {
    const chat = newChat();
    setChats(prev => [chat, ...prev]);
    setActiveId(chat.id);
    setInput("");
    setSidebarOpen(false);
    setNotice("");
  }
  function removeChat(id, event) {
    event.stopPropagation();
    const remaining = chats.filter(c => c.id !== id);
    const next = remaining.length ? remaining : [newChat()];
    setChats(next);
    if (activeId === id) setActiveId(next[0].id);
  }
  async function sendMessage(value = input) {
    const content = value.trim();
    if (!content || loading || !activeChat) return;
    setInput("");
    setNotice("");
    const id = activeChat.id;
    const nextMessages = [...activeChat.messages, { role: "user", content }];
    updateChat(id, c => ({
      ...c,
      title: c.messages.length <= 1 ? content.slice(0, 32) : c.title,
      messages: nextMessages
    }));
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.filter(m => m.role === "user" || (m.role === "assistant" && m.content !== WELCOME)).slice(-30) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      updateChat(id, c => ({ ...c, messages: [...c.messages, { role: "assistant", content: data.reply }] }));
    } catch (err) {
      setNotice(err.message || "Could not connect to Manish AI. Make sure the backend is running.");
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-icon"><Bot size={21} /></div>
          <div><div className="brand-name">Manish <span>AI</span></div><div className="brand-caption">Your AI companion</div></div>
          <button className="icon-btn mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <button className="new-chat" onClick={startNewChat}><Plus size={17}/> New chat <span>⌘ K</span></button>
        <div className="side-label">RECENT CHATS</div>
        <div className="chat-list">
          {chats.map(chat => (
            <button key={chat.id} className={`history-item ${chat.id === activeId ? "selected" : ""}`} onClick={() => { setActiveId(chat.id); setSidebarOpen(false); }}>
              <MessageSquare size={16}/><span>{chat.title}</span>
              <span className="delete-chat" role="button" tabIndex={0} aria-label="Delete chat" onClick={e => removeChat(chat.id, e)} onKeyDown={e => e.key === "Enter" && removeChat(chat.id, e)}><Trash2 size={14}/></span>
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="profile-avatar">M</div>
          <div className="profile-info"><strong>Manish AI</strong><span>Ready to help you learn</span></div>
          <Sparkles size={17} className="profile-sparkle"/>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button className="icon-btn menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
            <div className="mobile-brand"><div className="brand-icon"><Bot size={18}/></div><strong>Manish <span>AI</span></strong></div>
            <div className="model-chip"><span className="status-dot"/> Manish Assistant <span className="chip-chevron">▾</span></div>
          </div>
          <div className="top-actions">
            <div className="language-chip"><Globe2 size={14}/> English / தமிழ்</div>
            <button className="icon-btn theme-btn" onClick={() => setDark(v => !v)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
          </div>
        </header>

        <section className={`conversation ${activeChat?.messages.length <= 1 ? "welcome-view" : ""}`}>
          {activeChat?.messages.length <= 1 ? (
            <div className="welcome">
              <div className="hero-icon"><Bot size={34}/><span className="hero-spark">✦</span></div>
              <div className="eyebrow"><span/> YOUR EVERYDAY AI COMPANION</div>
              <h1>Hey there! What’s on<br className="desktop-break"/> your <span>mind today?</span></h1>
              <p className="welcome-sub">{WELCOME}</p>
              <div className="starter-grid">
                {starterPrompts.map(item => <button key={item.title} className="starter-card" onClick={() => sendMessage(item.text)}><span className="starter-icon">{item.icon}</span><span className="starter-title">{item.title}</span><span className="starter-text">{item.text}</span><span className="starter-arrow">↗</span></button>)}
              </div>
              <div className="welcome-foot"><Sparkles size={14}/> Curious minds welcome. Big questions too.</div>
            </div>
          ) : (
            <div className="messages">
              {activeChat?.messages.map((message, index) => (
                <div key={index} className={`message-row ${message.role}`}>
                  {message.role === "assistant" && <div className="message-avatar"><Bot size={17}/></div>}
                  <div className="message-content">
                    <div className="message-author">{message.role === "assistant" ? "Manish AI" : "You"}</div>
                    <div className="message-bubble">{message.content}</div>
                  </div>
                  {message.role === "user" && <div className="user-avatar">Y</div>}
                </div>
              ))}
              {loading && <div className="message-row assistant"><div className="message-avatar"><Bot size={17}/></div><div className="message-content"><div className="message-author">Manish AI</div><div className="typing"><i/><i/><i/><span>Thinking...</span></div></div></div>}
              <div ref={bottomRef}/>
            </div>
          )}
        </section>

        <div className="composer-wrap">
          {notice && <div className="error-notice">{notice}</div>}
          <form className="composer" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Message Manish..." rows={1} aria-label="Message Manish AI" />
            <div className="composer-bottom"><span><kbd>↵</kbd> send <span className="composer-sep">·</span> <kbd>⇧ ↵</kbd> new line</span><button className="send-btn" type="submit" disabled={!input.trim() || loading} aria-label="Send message"><Send size={17}/></button></div>
          </form>
          <div className="disclaimer">Manish AI can make mistakes. Double-check important information.</div>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
