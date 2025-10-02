"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const CORRECT_PASSWORD = "369963";

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("navada_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("navada_auth", "true");
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Spline Background */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src='https://my.spline.design/squarechipsfallinginplace-UO2xpf3fdQZzFK32zpOZfsW0/'
          frameBorder='0'
          width='100%'
          height='100%'
          className="absolute inset-0"
        />
      </div>

      {/* Password Input Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 max-w-md w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">NAVADA</h1>
              <p className="text-gray-400 text-sm">Welcome to the Future!</p>
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter passlock"
                className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500"
                autoFocus
              />

              {error && (
                <p className="text-red-400 text-sm text-center">
                  Incorrect passlock. Please try again.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Access
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}