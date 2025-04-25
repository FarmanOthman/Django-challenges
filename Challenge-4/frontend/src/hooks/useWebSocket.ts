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
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!token || !roomName) return;

    try {
      // Close any existing connection
      if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
        socketRef.current.close();
      }

      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/?token=${token}`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat_message') {
            setMessages(prev => [...prev, data]);
          } else if (data.type === 'chat_history') {
            setMessages(data.messages || []);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
        setConnectionStatus('closed');
        
        // Attempt reconnection if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          console.log(`Attempting reconnect in ${timeout}ms`);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, timeout);
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('closed');
      
      // Attempt reconnection with delay
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connect();
        }, timeout);
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
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
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message }));
    } else {
      console.warn('WebSocket is not connected, message not sent');
      // Attempt to reconnect if not connected
      if (connectionStatus !== 'connecting') {
        connect();
      }
    }
  }, [socket, connectionStatus, connect]);

  return { messages, sendMessage, connectionStatus };
}