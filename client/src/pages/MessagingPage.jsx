import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import { timeAgo } from '../utils/timeAgo';
import { CiChat1 } from 'react-icons/ci';

export default function MessagingPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null); // The other user's ID
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load conversations
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
      // If the message is for the currently active chat
      if (
        (message.senderId === activeChatId && message.receiverId === user.id) ||
        (message.senderId === user.id && message.receiverId === activeChatId)
      ) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
      
      // Update conversations list with latest message
      // (Simplified logic: in a real app you'd move the convo to top)
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
    <div className="container mt-4" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="row h-100">
        
        {/* Left Sidebar - Conversations List */}
        <div className="col-md-4 h-100 d-flex flex-column">
          <Card className="h-100 d-flex flex-column p-0 overflow-hidden" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
            <div className="p-3 border-bottom d-flex align-items-center" style={{ height: '70px', backgroundColor: 'var(--bg-card)' }}>
              <h5 className="m-0" style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Messaging</h5>
            </div>
            <div className="flex-grow-1 overflow-auto" style={{ backgroundColor: 'var(--bg-card)' }}>
              {conversations.length === 0 ? (
                <div className="p-5 text-center text-muted d-flex flex-column align-items-center">
                  <div style={{ marginBottom: '16px', color: 'var(--color-border)' }}>
                    <CiChat1 size={48} />
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 500 }}>No conversations yet.</div>
                </div>
              ) : (
                conversations.map(c => {
                  const other = getOtherParticipant(c);
                  if (!other) return null;
                  
                  return (
                    <div 
                      key={c._id}
                      className={`d-flex align-items-center p-3 border-bottom`}
                      onClick={() => {
                        setActiveChatId(other._id || other.id);
                        setActiveChatUser(other);
                      }}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'background-color 0.2s ease', 
                        backgroundColor: activeChatId === (other._id || other.id) ? 'var(--color-overlay-hover)' : 'transparent' 
                      }}
                    >
                      <div className="position-relative">
                        <img src={other.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${other._id}`} alt="avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
                        {onlineUsers.includes(other._id || other.id) && (
                          <div style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', backgroundColor: '#10b981', border: '2px solid #fff', borderRadius: '50%' }}></div>
                        )}
                      </div>
                      <div className="ms-3 overflow-hidden" style={{ flex: 1 }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong className="text-truncate" style={{ fontSize: '15px', color: 'var(--color-text-main)', fontWeight: 600 }}>{other.firstName} {other.lastName}</strong>
                          {c.lastMessage && <small className="text-muted" style={{ fontSize: '12px' }}>{timeAgo(c.lastMessage.createdAt)}</small>}
                        </div>
                        <small className="text-muted text-truncate d-block" style={{ fontSize: '13px' }}>
                          {c.lastMessage ? c.lastMessage.content : 'New conversation'}
                        </small>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Pane - Active Chat */}
        <div className="col-md-8 h-100 d-flex flex-column">
          <Card className="h-100 d-flex flex-column p-0 overflow-hidden" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
            {activeChatUser ? (
              <>
                <div className="p-3 border-bottom d-flex align-items-center" style={{ height: '70px', backgroundColor: 'var(--bg-card)' }}>
                  <Link to={`/profile/${activeChatUser._id || activeChatUser.id}`} className="text-decoration-none d-flex align-items-center hover-opacity" style={{ color: 'var(--color-text-main)' }}>
                    <div className="position-relative">
                      <img src={activeChatUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${activeChatUser._id}`} alt="avatar" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
                      {onlineUsers.includes(activeChatUser._id || activeChatUser.id) && (
                        <div style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', backgroundColor: '#10b981', border: '2px solid #fff', borderRadius: '50%' }}></div>
                      )}
                    </div>
                    <strong className="ms-3 fs-5" style={{ fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>{activeChatUser.firstName} {activeChatUser.lastName}</strong>
                  </Link>
                </div>

                <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3" style={{ backgroundColor: 'var(--bg-body)' }}>
                  {messages.map((m, i) => {
                    const isMine = m.senderId === user.id;
                    return (
                      <div key={m._id || i} className={`d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div 
                          className="px-4 py-2 d-flex flex-column"
                          style={{ 
                            maxWidth: '75%',
                            backgroundColor: isMine ? 'var(--color-primary)' : 'var(--bg-card)',
                            color: isMine ? '#ffffff' : 'var(--color-text-main)',
                            fontSize: '15px',
                            lineHeight: '1.5',
                            borderRadius: isMine ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            border: isMine ? 'none' : '1px solid var(--color-border)'
                          }}
                        >
                          <div>{m.content}</div>
                          {m.createdAt && (
                            <small style={{ fontSize: '11px', marginTop: '4px', opacity: 0.8, textAlign: isMine ? 'right' : 'left' }}>
                              {timeAgo(m.createdAt)}
                            </small>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-top" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <form onSubmit={sendMessage} className="d-flex gap-2 align-items-center">
                    <input 
                      type="text" 
                      className="form-control flex-grow-1" 
                      placeholder="Write a message..." 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      style={{ borderRadius: '50px', padding: '12px 20px', border: '1px solid var(--color-border)', backgroundColor: 'var(--bg-body)' }}
                    />
                    <button type="submit" className="btn-h-primary" disabled={!input.trim()} style={{ borderRadius: '50px', padding: '12px 24px', fontWeight: 600 }}>
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-100 d-flex align-items-center justify-content-center text-muted flex-column" style={{ backgroundColor: 'var(--bg-card)' }}>
                <div style={{ marginBottom: '24px', color: 'var(--color-border)' }}>
                  <CiChat1 size={64} />
                </div>
                <h4 style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Your Messages</h4>
                <p style={{ fontSize: '15px' }}>Select a conversation from the left to start chatting.</p>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
