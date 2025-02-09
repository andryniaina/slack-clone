import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLoginForm } from '../../../hooks/auth/useLoginForm';
import { AuthLayout } from '../../layouts/AuthLayout';
import { FormInput } from '../../components/UI/FormInput';
import { Button } from '../../components/UI/Button';
import { PasswordToggleButton } from '../../components/Auth/PasswordToggleButton';

export default function Login() {
  const { login } = useAuth();
  const { 
    formData: { email, password },
    error,
    loading,
    showPassword,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  } = useLoginForm();

  const handleLogin = async (e: React.FormEvent) => {
    await handleSubmit(e, login);
  };

  return (
    <AuthLayout
      title="Se connecter à votre espace de travail"
      subtitle="Nous vous suggérons d'utiliser l'adresse e-mail que vous utilisez au travail."
    >
      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="rounded-md shadow-sm space-y-4">
          <FormInput
            icon={Mail}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={loading}
            required
            placeholder="nom@email-travail.com"
            value={email}
            onChange={handleChange}
          />

          <FormInput
            icon={Lock}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={loading}
            required
            placeholder="Mot de passe"
            value={password}
            onChange={handleChange}
            rightElement={
              <PasswordToggleButton
                showPassword={showPassword}
                onToggle={togglePasswordVisibility}
                disabled={loading}
              />
            }
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
        >
          Se connecter avec e-mail
        </Button>

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
    </AuthLayout>
  );
} 