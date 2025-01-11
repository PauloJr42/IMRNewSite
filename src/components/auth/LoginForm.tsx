import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Login realizado com sucesso!');
     // window.location.href = './indeximr.html';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Por favor, insira seu email primeiro');
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar email de recuperação');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-primary pl-10"
            placeholder="Digite seu email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-primary pl-10"
            placeholder="Digite sua senha"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            'Entrar'
          )}
        </button>

        <button
          type="button"
          onClick={handleResetPassword}
          disabled={resetLoading}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {resetLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            'Esqueceu sua senha?'
          )}
        </button>
      </div>
    </form>
  );
}