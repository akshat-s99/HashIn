import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { timeAgo } from '../utils/timeAgo';
import { CiChat1, CiSearch, CiMenuKebab } from 'react-icons/ci';

export default function MessagingPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get('/messages/conversations').then((res) => {
      setConversations(res.data?.data || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeChatId) {
      api.get(`/messages/${activeChatId}`).then((res) => {
        setMessages(res.data?.data || []);
        scrollToBottom();
      }).catch(console.error);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (data) => {
      const { message } = data;
      if (
        (message.senderId === activeChatId && message.receiverId === user.id) ||
        (message.senderId === user.id && message.receiverId === activeChatId)
      ) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
      
      setConversations((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex(c => c._id === message.conversationId);
        if (idx !== -1) {
          copy[idx].lastMessage = message;
        }
        return copy;
      });
    };

    const handleOnlineUsers = (usersArray) => {
      setOnlineUsers(usersArray);
    };

    socket.on('receive_message', handleReceive);
    socket.on('message_sent', handleReceive);
    socket.on('online_users', handleOnlineUsers);

    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('message_sent', handleReceive);
      socket.off('online_users', handleOnlineUsers);
    };
  }, [socket, activeChatId, user.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChatId || !socket) return;

    socket.emit('send_message', {
      receiverId: activeChatId,
      content: input,
    });
    
    setInput('');
  };

  const getOtherParticipant = (convo) => {
    return convo.participants.find(p => p._id !== user.id || p.id !== user.id);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] relative overflow-hidden bg-surface-dim z-10 w-full">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{background: 'radial-gradient(circle at 70% 30%, rgba(220, 20, 60, 0.15) 0%, transparent 50%)'}}></div>
      
      {/* Left Column: Conversation List */}
      <aside className={`w-full md:w-[320px] flex-shrink-0 flex flex-col h-full border-r border-white/10 glass-panel z-10 relative ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-md pb-4 flex flex-col gap-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">Messaging</h2>
          </div>
          {/* Search Bar */}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"><CiSearch /></span>
            <input className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 font-body-sm text-on-surface placeholder:font-code-block placeholder:text-on-surface-variant/50 focus:border-primary outline-none transition-colors" placeholder="Search conversations..." type="text" />
          </div>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {conversations.length === 0 ? (
            <div className="p-5 flex flex-col items-center justify-center h-full text-on-surface-variant opacity-70">
              <CiChat1 size={48} className="mb-4" />
              <div className="font-body-sm">No conversations yet.</div>
            </div>
          ) : (
            conversations.map(c => {
              const other = getOtherParticipant(c);
              if (!other) return null;
              const isActive = activeChatId === (other._id || other.id);
              
              return (
                <div 
                  key={c._id}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-colors border-l-2 ${isActive ? 'bg-white/5 border-primary' : 'border-transparent hover:bg-white/5'}`}
                  onClick={() => {
                    setActiveChatId(other._id || other.id);
                    setActiveChatUser(other);
                  }}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-label-mono text-label-mono text-on-surface border border-white/10 overflow-hidden text-uppercase">
                      {other.avatar ? <img src={other.avatar} className="w-full h-full object-cover" /> : <>{other.firstName?.charAt(0)}{other.lastName?.charAt(0)}</>}
                    </div>
                    {onlineUsers.includes(other._id || other.id) && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4ade80] rounded-full border-2 border-surface-container-low"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">{other.firstName} {other.lastName}</span>
                      {c.lastMessage && <span className="font-label-mono text-label-mono text-on-surface-variant/70 text-[10px] shrink-0 ml-2">{timeAgo(c.lastMessage.createdAt)}</span>}
                    </div>
                    <p className={`font-body-sm text-body-sm truncate ${isActive ? 'text-on-surface-variant' : 'text-on-surface-variant/70'}`}>
                      {c.lastMessage ? c.lastMessage.content : 'New conversation'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
      
      {/* Right Column: Active Chat View */}
      <section className={`flex-1 flex flex-col h-full z-10 relative ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChatUser ? (
          <>
            {/* Chat Header */}
            <header className="h-16 px-md flex items-center justify-between border-b border-white/10 glass-panel shrink-0 bg-surface/50">
              <div className="flex items-center gap-3">
                <button className="md:hidden text-on-surface-variant mr-2" onClick={() => setActiveChatId(null)}>
                  ←
                </button>
                <Link to={`/profile/${activeChatUser._id || activeChatUser.id}`} className="flex items-center gap-3 text-decoration-none group">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-label-mono text-label-mono text-on-surface border border-white/10 overflow-hidden text-uppercase">
                      {activeChatUser.avatar ? <img src={activeChatUser.avatar} className="w-full h-full object-cover" /> : <>{activeChatUser.firstName?.charAt(0)}{activeChatUser.lastName?.charAt(0)}</>}
                    </div>
                    {onlineUsers.includes(activeChatUser._id || activeChatUser.id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4ade80] rounded-full border-2 border-surface-container-low"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-body-sm text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{activeChatUser.firstName} {activeChatUser.lastName}</h3>
                    <p className="font-label-mono text-label-mono text-on-surface-variant/70 text-[10px]">{activeChatUser.headline || 'Member'}</p>
                  </div>
                </Link>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 text-on-surface-variant hover:text-on-surface">
                  <CiMenuKebab size={20} />
                </button>
              </div>
            </header>
            
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-md flex flex-col gap-sm">
              {messages.map((m, i) => {
                const isMine = m.senderId === user.id;
                
                return (
                  <div key={m._id || i} className={`flex gap-3 max-w-[85%] ${isMine ? 'self-end' : 'self-start'}`}>
                    {!isMine && (
                      <div className="w-8 h-8 rounded-full bg-surface-container flex flex-shrink-0 items-center justify-center font-label-mono text-[10px] text-on-surface border border-white/10 mt-auto hidden md:flex overflow-hidden">
                        {activeChatUser.avatar ? <img src={activeChatUser.avatar} className="w-full h-full object-cover" /> : <>{activeChatUser.firstName?.charAt(0)}</>}
                      </div>
                    )}
                    <div className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`${isMine ? 'bg-primary-container text-on-primary-container rounded-2xl rounded-tr-sm rounded-br-sm shadow-[0_0_20px_rgba(220,20,60,0.15)] border-none' : 'bg-surface-container-low backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm'} p-3 font-body-sm text-body-sm`}>
                        {m.content}
                      </div>
                      <span className={`font-label-mono text-[10px] text-on-surface-variant/50 ${isMine ? 'mr-1' : 'ml-1'}`}>
                        {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-surface/50">
              <form onSubmit={sendMessage} className="flex gap-2 items-center">
                <input 
                  type="text" 
                  className="flex-grow bg-white/5 border border-white/10 rounded-full py-3 px-5 text-on-surface font-body-sm focus:border-primary outline-none transition-colors"
                  placeholder="Message..." 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()} 
                  className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold font-label-mono disabled:opacity-50 transition-opacity"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-70">
            <CiChat1 size={64} className="mb-4" />
            <h4 className="font-headline-md font-bold text-on-surface mb-2">Your Messages</h4>
            <p className="font-body-sm">Select a conversation from the left to start chatting.</p>
          </div>
        )}
      </section>
    </div>
  );
}
