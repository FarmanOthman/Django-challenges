import { useState } from 'react';
import { Button, Input, Card, Typography, Spinner } from "@material-tailwind/react";
import { useWebSocket } from '../../hooks/useWebSocket';

interface RoomPageProps {
  token: string;
  onLogout: () => void;
}

export function RoomPage({ token, onLogout }: RoomPageProps) {
  const [newMessage, setNewMessage] = useState('');
  const [roomName, setRoomName] = useState<string>('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { messages, sendMessage, connectionStatus } = useWebSocket(token, roomName);

  const handleJoinRoom = async () => {
    if (!roomName.trim()) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat/room/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ room_name: roomName })
      });

      if (response.ok) {
        setIsInRoom(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to join room');
      }
    } catch (error) {
      setError('Failed to connect to server');
      console.error('Error joining room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  if (!isInRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card 
          color="transparent" 
          shadow={false} 
          className="items-center"
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <Typography 
            variant="h4" 
            color="blue-gray"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Join a Chat Room
          </Typography>
          {error && (
            <Typography
              color="red"
              className="mt-2 text-center"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {error}
            </Typography>
          )}
          <div className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="lg"
                label="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                disabled={isLoading}
                crossOrigin={undefined}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              />
            </div>
            <Button 
              className="mt-6" 
              fullWidth 
              onClick={handleJoinRoom}
              disabled={isLoading}
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner 
                    className="h-4 w-4"
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  /> 
                  Joining...
                </div>
              ) : (
                'Join Room'
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white p-4 shadow-md flex justify-between items-center">
        <div>
          <Typography 
            variant="h5" 
            color="blue-gray"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
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
        <Button
          color="red"
          onClick={handleLogout}
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Logout
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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