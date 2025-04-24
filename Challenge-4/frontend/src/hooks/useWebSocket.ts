import { useState, useEffect, useCallback, useRef } from 'react';

export type ConnectionStatus = 'connecting' | 'connected' | 'closed';

interface Message {
  type: string;
  message: string;
  username: string;
  timestamp: string;
}

export function useWebSocket(token: string | null, roomName: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!token || !roomName) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/?token=${token}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        setMessages(prev => [...prev, data]);
      } else if (data.type === 'chat_history') {
        setMessages(data.messages);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setConnectionStatus('closed');
      
      // Attempt reconnection if we haven't exceeded max attempts
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connect();
        }, timeout);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
      if (reconnectTimeoutRef.current !== undefined) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [token, roomName]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connect]);

  const sendMessage = useCallback((message: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message }));
    }
  }, [socket]);

  return { messages, sendMessage, connectionStatus };
}