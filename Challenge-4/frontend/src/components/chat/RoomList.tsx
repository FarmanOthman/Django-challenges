import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";

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
  onJoinRoom: (roomName: string) => void;
}

export function RoomList({ token, onJoinRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPrivacy, setNewRoomPrivacy] = useState<'public' | 'private'>('public');
  const [inviteUsername, setInviteUsername] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

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
    } catch (error: unknown) {
      void error; // Explicitly ignore the error
      setError('Network error: Unable to fetch rooms');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleCreateRoom = async () => {
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
        setIsCreateOpen(false);
        setNewRoomName('');
        fetchRooms();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create room');
      }
    } catch (error: unknown) {
      void error; // Explicitly ignore the error
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
        onJoinRoom(room.name);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to join room');
      }
    } catch (error: unknown) {
      void error; // Explicitly ignore the error
      setError('Network error: Unable to join room');
    }
  };

  const handleInviteUser = async () => {
    if (!selectedRoom || !inviteUsername) return;

    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/chat/room/${selectedRoom.name}/invite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: inviteUsername })
      });

      if (response.ok) {
        setSelectedRoom(null);
        setInviteUsername('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to invite user');
      }
    } catch (error: unknown) {
      void error; // Explicitly ignore the error
      setError('Network error: Unable to send invitation');
    }
  };

  return (
    <div className="p-4">
      <Card 
        className="w-full max-w-[800px] mx-auto"
        placeholder={undefined}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <Typography 
            variant="h5" 
            color="blue-gray"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Available Rooms
          </Typography>
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Create Room
          </Button>
        </div>
        
        {error && (
          <Typography
            color="red"
            className="p-4 text-center"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {error}
          </Typography>
        )}

        {loading ? (
          <div className="p-4 text-center">Loading rooms...</div>
        ) : (
          <List 
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {rooms.map((room) => (
              <ListItem
                key={room.id}
                className="flex justify-between items-center"
                placeholder={undefined}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                <div className="flex items-center gap-3">
                  <ListItemPrefix 
                    placeholder={undefined}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {room.privacy === 'private' ? (
                      <LockClosedIcon className="h-5 w-5" />
                    ) : (
                      <LockOpenIcon className="h-5 w-5" />
                    )}
                  </ListItemPrefix>
                  <div>
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      placeholder={undefined}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      {room.name}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                      placeholder={undefined}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      Created by {room.creator}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    variant="ghost"
                    value={`${room.participant_count} members`}
                    color={room.privacy === 'private' ? 'blue-gray' : 'blue'}
                  />
                  {room.privacy === 'private' ? (
                    <Button
                      size="sm"
                      variant="outlined"
                      onClick={() => setSelectedRoom(room)}
                      placeholder={undefined}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      Request Access
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleJoinRoom(room)}
                      placeholder={undefined}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      Join
                    </Button>
                  )}
                </div>
              </ListItem>
            ))}
          </List>
        )}
      </Card>

      {/* Create Room Dialog */}
      <Dialog 
        open={isCreateOpen} 
        handler={() => setIsCreateOpen(false)}
        placeholder={undefined}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <DialogHeader 
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Create New Room
        </DialogHeader>
        <DialogBody 
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <div className="flex flex-col gap-4">
            <Input
              label="Room Name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              crossOrigin={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            />
            <Select
              label="Privacy"
              value={newRoomPrivacy}
              onChange={(value) => setNewRoomPrivacy(value as 'public' | 'private')}
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <Option value="public">Public</Option>
              <Option value="private">Private</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter 
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <Button
            variant="text"
            color="red"
            onClick={() => setIsCreateOpen(false)}
            className="mr-1"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleCreateRoom}
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Create
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog
        open={!!selectedRoom}
        handler={() => setSelectedRoom(null)}
        placeholder={undefined}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <DialogHeader 
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Request Access to {selectedRoom?.name}
        </DialogHeader>
        <DialogBody 
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <Input
            label="Your Message"
            value={inviteUsername}
            onChange={(e) => setInviteUsername(e.target.value)}
            crossOrigin={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
        </DialogBody>
        <DialogFooter 
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <Button
            variant="text"
            color="red"
            onClick={() => setSelectedRoom(null)}
            className="mr-1"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleInviteUser}
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Send Request
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}