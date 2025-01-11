import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (!minLength) errors.push('pelo menos 8 caracteres');
  if (!hasUpperCase) errors.push('uma letra maiúscula');
  if (!hasLowerCase) errors.push('uma letra minúscula');
  if (!hasNumbers) errors.push('um número');
  if (!hasSpecialChar) errors.push('um caractere especial');

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors
  };
};

interface RegisterFormProps {
  onSuccess: () => void;
  darkMode: boolean;
}

export function RegisterForm({ onSuccess, darkMode }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validatePassword(formData.password);
    if (!isValid) {
      toast.error(`Senha deve conter: ${errors.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              phone: formData.phone,
              first_name: formData.firstName,
              last_name: formData.lastName,
            }
          ]);

        if (insertError) throw insertError;
      }

      toast.success('Cadastro realizado com sucesso!');
      onSuccess();
      window.location.href = 'https://imrservicos.netlify.app';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      setPasswordTouched(true);
    }
  };

  const { isValid, errors } = validatePassword(formData.password);
  const showPasswordErrors = passwordTouched && !isValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Primeiro Nome
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className={`input-primary pl-10 ${darkMode ? 'dark-mode' : ''}`}
              placeholder="João"
              style={{ color: darkMode ? 'white' : 'black' }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Sobrenome
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className={`input-primary pl-10 ${darkMode ? 'dark-mode' : ''}`}
              placeholder="Silva"
              style={{ color: darkMode ? 'white' : 'black' }}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`input-primary pl-10 ${darkMode ? 'dark-mode' : ''}`}
            placeholder="joao@exemplo.com"
            style={{ color: darkMode ? 'white' : 'black' }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Telefone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className={`input-primary pl-10 ${darkMode ? 'dark-mode' : ''}`}
            placeholder="(85) 98765-4321"
            style={{ color: darkMode ? 'white' : 'black' }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className={`input-primary pl-10 ${showPasswordErrors ? 'border-red-500' : ''} ${darkMode ? 'dark-mode' : ''}`}
            placeholder="••••••••"
            style={{ color: darkMode ? 'white' : 'black' }}
          />
        </div>
        {showPasswordErrors && (
          <div className="mt-2 text-sm text-red-600">
            Senha deve conter:
            <ul className="list-disc pl-5 mt-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-6"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
        ) : (
          'Criar Conta'
        )}
      </button>
    </form>
  );
}