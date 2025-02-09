import { Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useRegisterForm } from '../../../hooks/auth/useRegisterForm';
import { AuthLayout } from '../../layouts/AuthLayout';
import { FormInput } from '../../components/UI/FormInput';
import { Button } from '../../components/UI/Button';
import { PasswordToggleButton } from '../../components/Auth/PasswordToggleButton';

export default function Register() {
  const { login } = useAuth();
  const {
    formData: { email, username, password, confirmPassword },
    error,
    loading,
    showPassword,
    showConfirmPassword,
    handleChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
  } = useRegisterForm();

  const handleRegister = async (e: React.FormEvent) => {
    await handleSubmit(e, login);
  };

  return (
    <AuthLayout
      title="Créer votre compte"
      subtitle="Nous vous suggérons d'utiliser l'adresse e-mail que vous utilisez au travail."
    >
      <form className="mt-8 space-y-6" onSubmit={handleRegister}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="rounded-md shadow-sm space-y-4">
          <FormInput
            icon={User}
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            disabled={loading}
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={handleChange}
          />

          <FormInput
            icon={Mail}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={loading}
            placeholder="nom@email-travail.com"
            value={email}
            onChange={handleChange}
          />

          <FormInput
            icon={Lock}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            disabled={loading}
            placeholder="Mot de passe (minimum 6 caractères)"
            value={password}
            onChange={handleChange}
            minLength={6}
            rightElement={
              <PasswordToggleButton
                showPassword={showPassword}
                onToggle={togglePasswordVisibility}
                disabled={loading}
              />
            }
          />

          <FormInput
            icon={Lock}
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            disabled={loading}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={handleChange}
            minLength={6}
            rightElement={
              <PasswordToggleButton
                showPassword={showConfirmPassword}
                onToggle={toggleConfirmPasswordVisibility}
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
          Créer un compte
        </Button>

        <div className="text-center">
          <div className="text-sm">
            <span className="text-gray-500">Vous avez déjà un compte ?</span>{' '}
            <Link
              to="/login"
              className="font-medium text-[#611f69] hover:text-[#4a1751]"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
} 