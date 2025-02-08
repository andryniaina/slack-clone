import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, Lock } from 'lucide-react';
import { AuthService } from '../../../services/auth';
import { useAuth } from '../../../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!email) {
      setError('L\'adresse e-mail est requise');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('L\'adresse e-mail n\'est pas valide');
      return false;
    }
    if (!password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });
      await login(response.token);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/slack-logo.svg"
            alt="Slack"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Se connecter à votre espace de travail
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nous vous suggérons d'utiliser l'adresse e-mail que vous utilisez au travail.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="nom@email-travail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#611f69] hover:bg-[#4a1751] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#611f69] disabled:bg-[#611f69]/50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter avec e-mail'}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm">
              <span className="text-gray-500">Nouveau sur Slack ?</span>{' '}
              <Link
                to="/register"
                className="font-medium text-[#611f69] hover:text-[#4a1751]"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 