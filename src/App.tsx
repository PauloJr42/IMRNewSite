import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { useAuth } from './hooks/useAuth';
import { LogOut, Building2, Wrench } from 'lucide-react';
import { supabase } from './lib/supabase';

function App() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-md mx-auto">
        {user ? (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Bem vindo ao IMR Serviços!</h2>
                <p className="text-sm text-gray-600 mt-1">Logado como: {user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 
                  bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sair
              </button>
            </div>
            <div className="space-y-4">
              <a 
                href="https://wa.me/5585999878625" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-whatsapp flex items-center justify-center"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Falar com Atendente
              </a>
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSewophx1u3gwCOc-0qP3HmdZnVICA1pt6QzXfWryWhm0SH7Rg/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center"
              >
                <Wrench className="h-5 w-5 mr-2" />
                Solicitar Serviço
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">IMR Serviços</h1>
              <p className="text-gray-600">Soluções em Instalação, Manutenção e Reparo</p>
            </div>
            
            {isLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm onSuccess={() => setIsLogin(true)} />
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Não tem uma conta? Crie Uma' : 'Já tem uma conta? Seja Bem Vindo'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;