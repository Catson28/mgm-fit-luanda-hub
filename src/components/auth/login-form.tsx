"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface LoginFormData {
  email: string | undefined;
  password: string | undefined;
  code?: string;
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
  success?: string;
  email?: string;
  password?: string;
  twoFactor?: boolean;
}

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }, // Changed from just "errors"
  } = useForm<LoginFormData>();

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
      if (loginData.success === "Confirmation email sent!") { };

      if (loginData.twoFactor) {
        setValue('email', loginData.email);
        setValue('password', loginData.password);
        setShowTwoFactor(true);
        return { success: true };
      }

      localStorage.setItem("accessToken", loginData.token);
      localStorage.setItem("refreshToken", loginData.refreshToken);
      localStorage.setItem("user", JSON.stringify(loginData.user));

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

  const onSubmit = async (formData: LoginFormData) => {
    setError(null);
    setIsPending(true);

    try {
      const result = await handleLogin(formData);

      if (!result.success) {
        setError(result.error || "Login failed");
        return;
      }

      // Successful login - use window.location for navigation
      // alert("Login successful!");
      // window.location.href = "/home";
    } catch {
      setError("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!showTwoFactor && (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
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
              </div>
            </CardContent>
          </Card>
        )}

        {showTwoFactor && (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Two factor code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="123456"
                      {...register("code", { required: true })}
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
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </>
  );
};