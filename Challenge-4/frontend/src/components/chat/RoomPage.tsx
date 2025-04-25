import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Input, Typography, List, ListItem, Badge } from "@material-tailwind/react";
import { LockClosedIcon, LockOpenIcon, UserIcon, PaperAirplaneIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useWebSocket } from '../../hooks/useWebSocket';
import { RoomList } from './RoomList';

interface Participant {
  username: string;
  is_creator: boolean;
}

interface RoomPageProps {
  token: string;
  onLogout: () => void;
}

export function RoomPage({ token, onLogout }: RoomPageProps) {
  const [newMessage, setNewMessage] = useState('');
  const [roomName, setRoomName] = useState<string>('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [roomPrivacy, setRoomPrivacy] = useState<'public' | 'private'>('public');
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [username, setUsername] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, connectionStatus } = useWebSocket(token, roomName);

  useEffect(() => {
    // Extract username from token
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload?.username) {
          setUsername(payload.username);
        }
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }, [token]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchParticipants = useCallback(async () => {
    if (!roomName) return;
    
    try {
      setIsLoadingParticipants(true);
      const response = await fetch(`http://localhost:8000/chat/room/${roomName}/participants/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      // Error will be shown through connection status
    } finally {
      setIsLoadingParticipants(false);
    }
  }, [roomName, token]);

  useEffect(() => {
    if (isInRoom) {
      fetchParticipants();
      // Fetch participants every 30 seconds
      const interval = setInterval(fetchParticipants, 30000);
      return () => clearInterval(interval);
    }
  }, [isInRoom, roomName, token, fetchParticipants]);

  const handleJoinRoom = async (selectedRoomName: string, privacy: 'public' | 'private') => {
    setRoomName(selectedRoomName);
    setRoomPrivacy(privacy);
    setIsInRoom(true);
  };

  const handleLeaveRoom = () => {
    setIsInRoom(false);
    setRoomName('');
    setParticipants([]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  if (!isInRoom) {
    return <RoomList token={token} onJoinRoom={handleJoinRoom} />;
  }

  // Utility function to create default props required by Material Tailwind
  const createMTProps = () => ({
    placeholder: undefined,
    onPointerEnterCapture: undefined,
    onPointerLeaveCapture: undefined
  });

  const getConnectionStatusBadge = () => {
    if (connectionStatus === 'connected') {
      return <Badge color="green" className="h-3 w-3 rounded-full" {...createMTProps()} />;
    } else if (connectionStatus === 'connecting') {
      return <Badge color="amber" className="h-3 w-3 rounded-full" {...createMTProps()} />;
    } else {
      return <Badge color="red" className="h-3 w-3 rounded-full" {...createMTProps()} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Typography 
            variant="h5" 
            color="blue-gray"
            className="flex items-center gap-2 font-semibold"
            {...createMTProps()}
          >
            {roomPrivacy === 'private' ? (
              <LockClosedIcon className="h-5 w-5 text-amber-500" />
            ) : (
              <LockOpenIcon className="h-5 w-5 text-green-500" />
            )}
            {roomName}
            
            <div className="flex items-center ml-3">
              {getConnectionStatusBadge()}
              <span className="text-xs ml-2 text-gray-500">
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Reconnecting...'}
              </span>
            </div>
          </Typography>
        </div>
        
        <div className="flex gap-2">
          <Button
            color={showParticipants ? "blue" : "gray"}
            variant={showParticipants ? "filled" : "outlined"}
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center gap-2"
            {...createMTProps()}
          >
            <UserIcon className="h-4 w-4" />
            {participants.length}
          </Button>
          <Button
            color="blue-gray"
            variant="outlined"
            size="sm"
            onClick={handleLeaveRoom}
            className="flex items-center gap-2"
            {...createMTProps()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Leave
          </Button>
          <Button
            color="red"
            variant="outlined"
            size="sm"
            onClick={onLogout}
            {...createMTProps()}
          >
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages area */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${showParticipants ? 'mr-64' : ''}`}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p>No messages yet</p>
                <p className="text-sm">Be the first to send a message!</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isCurrentUser = message.username === username;
              const showUsername = index === 0 || messages[index - 1].username !== message.username;
              return (
                <div
                  key={index}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm rounded-2xl px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-white shadow-md text-gray-800 border border-gray-200'
                    }`}
                  >
                    {showUsername && !isCurrentUser && (
                      <div className="text-sm font-medium text-blue-500 mb-1">{message.username}</div>
                    )}
                    <div className="break-words">{message.message}</div>
                    <div className="text-xs opacity-75 mt-1 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Participants sidebar */}
        {showParticipants && (
          <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto shadow-md">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <Typography
                variant="h6"
                color="blue-gray"
                className="font-medium"
                {...createMTProps()}
              >
                Participants ({participants.length})
              </Typography>
            </div>
            {isLoadingParticipants ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
              <List className="p-0" {...createMTProps()}>
                {participants.map((participant) => (
                  <ListItem
                    key={participant.username}
                    className="py-2 hover:bg-gray-50"
                    {...createMTProps()}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={participant.username === username ? "font-medium" : ""}>
                        {participant.username === username ? `${participant.username} (you)` : participant.username}
                      </span>
                      {participant.is_creator && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Creator</span>
                      )}
                    </div>
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={connectionStatus !== 'connected'}
            className="flex-1 focus:border-blue-500"
            containerProps={{ className: "min-w-0" }}
            crossOrigin={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            placeholder="Type a message..."
          />
          <Button 
            onClick={handleSendMessage}
            disabled={connectionStatus !== 'connected'}
            className="flex items-center gap-2"
            {...createMTProps()}
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}