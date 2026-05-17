import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, fetchMessages, selectConversation, messageReceived, clearMessages } from '../store/slices/chatSlice';
import { connectSocket, getSocket } from '../services/socket';

export default function Chat() {
  const dispatch = useDispatch();
  const { conversations, messages, currentConversationId, loading } = useSelector((state) => state.chat);
  const { user, accessToken } = useSelector((state) => state.auth);

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  // 1. Establish persistent Socket connection on mount
  useEffect(() => {
    if (!accessToken) return;
    
    const socket = connectSocket(accessToken);

    // Listen to real-time incoming messages
    socket.on('chat:message:received', (message) => {
      dispatch(messageReceived(message));
    });

    // Fetch conversation thread lists
    dispatch(fetchConversations());

    return () => {
      socket.off('chat:message:received');
      dispatch(clearMessages());
    };
  }, [accessToken, dispatch]);

  // 2. Scroll to bottom of chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Handle joining conversation room
  const handleSelectConversation = (convId) => {
    const socket = getSocket();
    
    // Leave previous room if open
    if (currentConversationId) {
      socket?.emit('chat:leave', { conversationId: currentConversationId });
    }

    dispatch(selectConversation(convId));
    dispatch(fetchMessages(convId));

    // Join new socket room
    socket?.emit('chat:join', { conversationId: convId });
  };

  // 4. Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !currentConversationId) return;

    const socket = getSocket();
    const activeConv = conversations.find(c => c.conversationId === currentConversationId);
    if (!activeConv) return;

    // Recipient is the other participant
    const receiverId = user.userId === activeConv.participant1Id 
      ? activeConv.participant2Id 
      : activeConv.participant1Id;

    // Emit message to WebSocket (will trigger database save & room broadcast on server)
    socket?.emit('chat:message', {
      conversationId: currentConversationId,
      receiverId,
      content: messageText,
      messageType: 'text'
    });

    setMessageText('');
  };

  const activeConv = conversations.find(c => c.conversationId === currentConversationId);
  
  // Find other participant details
  const getRecipientProfile = (conv) => {
    return user?.userId === conv?.participant1Id ? conv?.participant2 : conv?.participant1;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', flex: 1, maxHeight: 'calc(100vh - 150px)', padding: '1rem 0', textAlign: 'left' }} className="animate-fade-in">
      
      {/* Conversations Sidebar */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', overflowY: 'auto' }}>
        <h3 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>Inbox Chats</h3>
        
        {conversations.length === 0 ? (
          <p style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', margin: '2rem 0' }}>No active chats.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {conversations.map(conv => {
              const recipient = getRecipientProfile(conv);
              const isSelected = conv.conversationId === currentConversationId;
              const unread = user?.userId === conv.participant1Id ? conv.unreadCount1 : conv.unreadCount2;

              return (
                <div 
                  key={conv.conversationId}
                  style={{ 
                    padding: '0.85rem', 
                    borderRadius: '10px', 
                    background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)',
                    border: isSelected ? '1px solid hsl(var(--primary))' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleSelectConversation(conv.conversationId)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {recipient?.avatarUrl ? (
                      <img src={recipient.avatarUrl} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {recipient?.username?.substring(0,2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem' }}>{recipient?.username}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                        {conv.lastMessagePreview || 'Start chatting...'}
                      </span>
                    </div>
                  </div>

                  {unread > 0 && (
                    <span className="badge badge-error" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                      {unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Messages Window */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', height: '100%' }}>
        {currentConversationId ? (
          <>
            {/* Header details */}
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h3>Chat with {getRecipientProfile(activeConv)?.username}</h3>
            </div>

            {/* Scrollable messages area */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
              {messages.length === 0 ? (
                <p style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', margin: 'auto' }}>No messages yet. Send a greeting!</p>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === user.userId;
                  return (
                    <div 
                      key={msg.messageId} 
                      style={{ 
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                      <div 
                        style={{ 
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px', 
                          background: isMe ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' : 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          border: isMe ? 'none' : '1px solid var(--border-glass)',
                          fontSize: '0.95rem'
                        }}
                      >
                        {msg.content}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
            <h3>No Chat Selected</h3>
            <p style={{ marginTop: '0.5rem' }}>Choose an active conversation from the sidebar to start messaging.</p>
          </div>
        )}
      </div>

    </div>
  );
}
