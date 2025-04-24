import { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

interface LoginProps {
  onSwitchToRegister: () => void;
  onSubmit: (username: string, password: string) => Promise<void>;
}

export function Login({ onSwitchToRegister, onSubmit }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      await onSubmit(username, password);
    }
  };

  return (
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
        Sign In
      </Typography>
      <Typography 
        color="gray" 
        className="mt-1 font-normal"
        placeholder={undefined}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        Enter your credentials to chat.
      </Typography>
      <form 
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex flex-col gap-6">
          <Input
            size="lg"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            crossOrigin={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
          <Input
            type="password"
            size="lg"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            crossOrigin={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
        </div>
        <Button 
          className="mt-6" 
          fullWidth 
          type="submit"
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Sign In
        </Button>
        <Typography 
          color="gray" 
          className="mt-4 text-center font-normal"
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Don't have an account?{" "}
          <span
            onClick={onSwitchToRegister}
            className="font-medium text-blue-500 transition-colors hover:text-blue-700 cursor-pointer"
          >
            Sign Up
          </span>
        </Typography>
      </form>
    </Card>
  );
}