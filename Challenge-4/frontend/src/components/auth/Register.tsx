import { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

interface RegisterProps {
  onSwitchToLogin: () => void;
  onSubmit: (username: string, password: string) => Promise<void>;
}

export function Register({ onSwitchToLogin, onSubmit }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim() && password === confirmPassword) {
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
        Sign Up
      </Typography>
      <Typography 
        color="gray" 
        className="mt-1 font-normal"
        placeholder={undefined}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        Create an account to start chatting.
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
          <Input
            type="password"
            size="lg"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword !== ''}
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
          Sign Up
        </Button>
        <Typography 
          color="gray" 
          className="mt-4 text-center font-normal"
          placeholder={undefined}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Already have an account?{" "}
          <span
            onClick={onSwitchToLogin}
            className="font-medium text-blue-500 transition-colors hover:text-blue-700 cursor-pointer"
          >
            Sign In
          </span>
        </Typography>
      </form>
    </Card>
  );
}