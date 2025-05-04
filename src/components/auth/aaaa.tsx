"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  expiresIn: number;
}

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const loginData: LoginResponse = await response.json();

      // Store tokens and user info
      localStorage.setItem("accessToken", loginData.token);
      localStorage.setItem("refreshToken", loginData.refreshToken);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      // Optional: Set expiration for the token
      const expirationTime = Date.now() + (loginData.expiresIn * 1000);
      localStorage.setItem("tokenExpiration", expirationTime.toString());

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication error"
      };
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("All fields are required");
      setIsPending(false);
      return;
    }

    try {
      const result = await handleLogin({ email, password });

      if (!result.success) {
        setError(result.error || "Login failed");
        return;
      }

      // Successful login - use window.location for navigation
      alert("Login successful!");
      window.location.href = "/home";
    } catch {
      setError("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>

          <div className="flex items-center justify-between mt-4">
            <Button variant="link" className="px-0 h-auto" asChild>
              <a href="/forgot-password">
                Forgot password?
              </a>
            </Button>
            <Button variant="link" className="px-0 h-auto" asChild>
              <a href="/register">
                Create account
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};