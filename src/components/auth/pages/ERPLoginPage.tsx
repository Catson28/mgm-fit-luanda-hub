"use client"
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    setError('');
  };

// Update the handleSubmit function to use the proper type
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    if (data.twoFactor) {
      setIsTwoFactor(true);
      setSuccess('Verification code sent to your email.');
    } else if (data.success) {
      setSuccess(data.success);
    } else {
      // Login successful, redirect or update state
      window.location.href = '/admin'; // Redirect to dashboard
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unknown error occurred');
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-12 lg:p-16">
        <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black font-montserrat mb-2">
            <span className="text-mgmred">MGM</span>
            <span className="text-mgmblue">FITNESS</span>
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">
            {isTwoFactor ? 'Verificação em duas etapas' : 'Acesso à conta'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isTwoFactor ? (
            <>
              <div className="space-y-4">
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mgmblue focus:border-mgmblue sm:text-sm"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <div className="text-sm">
                      <a href="/forgot-password" className="font-medium text-mgmblue hover:text-mgmred">
                        Esqueceu a senha?
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mgmblue focus:border-mgmblue sm:text-sm"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Código de verificação
              </label>
              <input
                id="code"
                name="code"
                type="text"
                autoComplete="one-time-code"
                required
                value={formData.code}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mgmblue focus:border-mgmblue sm:text-sm"
                placeholder="Digite o código enviado para seu email"
              />
              <p className="mt-2 text-sm text-gray-500">
                Enviamos um código de verificação para {formData.email}
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-mgmblue hover:bg-mgmred focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mgmblue transition-colors duration-200"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : isTwoFactor ? (
                <>Verificar</>
              ) : (
                <>Entrar</>
              )}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </div>
        </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Ou</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <a href="/register" className="font-medium text-mgmblue hover:text-mgmred">
                  Inscreva-se
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden md:block md:w-1/2 bg-mgmblue relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div
          className="h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("/api/placeholder/800/1200")`,
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start p-12 z-20">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6">
              Bem-vindo de volta à MGM Fitness
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Entre na sua conta para acessar seu plano de treino personalizado,
              agendar sessões e acompanhar seu progresso.
            </p>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <div className="h-2 w-6 rounded-full bg-mgmred"></div>
              <div className="h-2 w-2 rounded-full bg-white/50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}