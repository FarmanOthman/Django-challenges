import { useEffect, useState, useCallback } from 'react';
import { LockClosedIcon, LockOpenIcon, UserGroupIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface Room {
  id: number;
  name: string;
  privacy: 'public' | 'private';
  creator: string;
  created_at: string;
  participant_count: number;
}

interface RoomListProps {
  token: string;
  onJoinRoom: (roomName: string, privacy: 'public' | 'private') => void;
}

export function RoomList({ token, onJoinRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPrivacy, setNewRoomPrivacy] = useState('public');
  const [accessMessage, setAccessMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/chat/rooms/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to fetch rooms');
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      setError('Network error: Unable to fetch rooms');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      setError('Room name cannot be empty');
      return;
    }
    
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/chat/room/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          room_name: newRoomName,
          privacy: newRoomPrivacy
        })
      });

      if (response.ok) {
        setIsCreateModalOpen(false);
        setNewRoomName('');
        await fetchRooms();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create room');
      }
    } catch (err) {
      console.error('Failed to create room:', err);
      setError('Network error: Unable to create room');
    }
  };

  const handleJoinRoom = async (room: Room) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/chat/room/${room.name}/join/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onJoinRoom(room.name, room.privacy);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to join room');
      }
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('Network error: Unable to join room');
    }
  };

  const handleSendAccessRequest = async () => {
    if (!selectedRoom || !accessMessage.trim()) {
      setError('Please enter a username to invite');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/chat/room/${selectedRoom.name}/invite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: accessMessage })
      });

      if (response.ok) {
        setIsRequestModalOpen(false);
        setSelectedRoom(null);
        setAccessMessage('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send access request');
      }
    } catch (err) {
      console.error('Failed to send access request:', err);
      setError('Network error: Unable to send request');
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chat Rooms</h1>
          <p className="text-gray-600">Join a room or create your own</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Create Room
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={fetchRooms}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Room List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {searchQuery ? 'No rooms match your search' : 'No rooms available'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRooms.map((room) => (
              <div key={room.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`rounded-full p-3 ${room.privacy === 'private' ? 'bg-gray-100' : 'bg-blue-100'}`}>
                      {room.privacy === 'private' ? (
                        <LockClosedIcon className="h-6 w-6 text-gray-600" />
                      ) : (
                        <LockOpenIcon className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{room.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span>Created by {room.creator}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(room.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{room.participant_count}</span>
                    </div>
                    
                    {room.privacy === 'private' ? (
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsRequestModalOpen(true);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Request Access
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinRoom(room)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Join Room
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Create New Room</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <input
                  id="roomName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="privacy" className="block text-sm font-medium text-gray-700 mb-1">
                  Privacy Setting
                </label>
                <select
                  id="privacy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newRoomPrivacy}
                  onChange={(e) => setNewRoomPrivacy(e.target.value)}
                >
                  <option value="public">Public - Anyone can join</option>
                  <option value="private">Private - By invitation only</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Access Modal */}
      {isRequestModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Request Access to {selectedRoom.name}</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600">This is a private room. Please enter the username to invite:</p>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter username to invite..."
                value={accessMessage}
                onChange={(e) => setAccessMessage(e.target.value)}
              />
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsRequestModalOpen(false);
                  setSelectedRoom(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAccessRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}