import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState<string[]>(['hii there', 'what are you doing?']);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Use ws:// protocol for WebSocket
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    // Handle WebSocket open event
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'join',
          payload: {
            roomId: 'red',
          },
        })
      );
    };

    // Handle incoming messages
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = inputRef.current.value.trim();
      if (message) {
        wsRef.current.send(
          JSON.stringify({
            type: 'chat',
            payload: {
              message: message, // Use the actual input value
            },
          })
        );
        inputRef.current.value = ''; // Clear the input field
      }
    }
  };

  return (
    <div className="h-screen bg-black">
      <div className="h-[85vh] overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="m-8">
            <span className="bg-white text-black rounded-md p-4">{message}</span>
          </div>
        ))}
      </div>
      <div className="bg-white w-full flex">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message here..."
          className="flex-1 p-4"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white p-4"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;