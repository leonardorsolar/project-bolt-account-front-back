import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';

function AuthContent() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </h1>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm text-center w-full"
        >
          {isLogin
            ? 'Não tem uma conta? Registre-se'
            : 'Já tem uma conta? Entre'}
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
}

export default App;