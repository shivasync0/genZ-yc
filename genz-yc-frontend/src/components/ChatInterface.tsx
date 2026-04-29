import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  senderId: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey! Saw your builder score. Huge fan of your Rust repos.', senderId: 'other' },
    { id: '2', text: 'Thanks! I noticed you are working on AI agents. Lets chat.', senderId: 'me' }
  ]);
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);

  // Example match and user data
  const matchId = 'match-123';
  const myUserId = 'me';

  useEffect(() => {
    // Connect to the NestJS WebSocket Gateway we built earlier
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    
    socketRef.current.on('connect', () => {
      console.log('Connected to Chat Server');
      socketRef.current?.emit('joinMatch', { matchId });
    });

    socketRef.current.on('newMessage', (payload: any) => {
      // Only append if it's from the other person to avoid duplicates since we append optimistically
      if (payload.senderId !== myUserId) {
        setMessages(prev => [...prev, { id: Math.random().toString(), text: payload.text, senderId: payload.senderId }]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const payload = { matchId, senderId: myUserId, text: input };
    
    // Send to WebSocket
    socketRef.current?.emit('sendMessage', payload);
    
    // Optimistic UI update
    setMessages(prev => [...prev, { id: Math.random().toString(), text: input, senderId: myUserId }]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
      <div className="glass-panel" style={{ height: '70vh', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, #10ac84, #1dd1a1)' }}></div>
           <div>
             <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Alex Rivera</h3>
             <span style={{ fontSize: '0.8rem', color: '#1dd1a1' }}>Online</span>
           </div>
        </div>

        {/* Message Area */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => {
            const isMe = msg.senderId === 'me';
            return (
              <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                <div style={{
                  background: isMe ? 'var(--primary-color)' : 'var(--panel-bg-hover)',
                  padding: '1rem 1.25rem',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  color: isMe ? '#000' : '#fff',
                  border: isMe ? 'none' : '1px solid var(--border-color)',
                  boxShadow: isMe ? '0 4px 15px rgba(255, 255, 255, 0.15)' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your new co-founder..."
              style={{ flex: 1, background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem 1.5rem', color: '#fff', outline: 'none', fontFamily: 'inherit', fontSize: '1rem' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem' }}>
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatInterface;
