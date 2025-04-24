import { useState, useEffect } from 'react';
import { Button, Input, Typography, List, ListItem } from "@material-tailwind/react";
import { LockClosedIcon, LockOpenIcon, UserIcon } from "@heroicons/react/24/solid";
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
  
  const { messages, sendMessage, connectionStatus } = useWebSocket(token, roomName);

  const fetchParticipants = async () => {
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
    } catch (_) {
      // Error will be shown through connection status
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  useEffect(() => {
    if (isInRoom) {
      fetchParticipants();
      // Fetch participants every 30 seconds
      const interval = setInterval(fetchParticipants, 30000);
      return () => clearInterval(interval);
    }
  }, [isInRoom, roomName, token]);

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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Typography 
            variant="h5" 
            color="blue-gray"
            className="flex items-center gap-2"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {roomPrivacy === 'private' ? (
              <LockClosedIcon className="h-5 w-5" />
            ) : (
              <LockOpenIcon className="h-5 w-5" />
            )}
            Room: {roomName}
          </Typography>
          {connectionStatus === 'connecting' && (
            <Typography
              color="blue-gray"
              className="text-sm"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Connecting...
            </Typography>
          )}
          {connectionStatus === 'closed' && (
            <Typography
              color="red"
              className="text-sm"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Connection lost. Reconnecting...
            </Typography>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            color="blue"
            variant="outlined"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center gap-2"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            <UserIcon className="h-4 w-4" />
            Participants ({participants.length})
          </Button>
          <Button
            color="blue"
            variant="outlined"
            onClick={handleLeaveRoom}
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Leave Room
          </Button>
          <Button
            color="red"
            onClick={onLogout}
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${showParticipants ? 'mr-64' : ''}`}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.username === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.username === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <div className="text-sm opacity-75">{message.username}</div>
                {message.message}
                <div className="text-xs opacity-50 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        {showParticipants && (
          <div className="w-64 bg-white border-l overflow-y-auto">
            <div className="p-4 border-b">
              <Typography
                variant="h6"
                color="blue-gray"
                placeholder={undefined}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Participants
              </Typography>
            </div>
            {isLoadingParticipants ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
              <List 
                placeholder={undefined}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                {participants.map((participant) => (
                  <ListItem
                    key={participant.username}
                    placeholder={undefined}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{participant.username}</span>
                      {participant.is_creator && (
                        <span className="text-xs text-blue-500">Creator</span>
                      )}
                    </div>
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        )}
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={connectionStatus !== 'connected'}
            className="flex-1"
            crossOrigin={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={connectionStatus !== 'connected'}
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}