import { useState } from 'react';
import { AuthService } from '../../services/auth';

interface LoginFormData {
  email: string;
  password: string;
}

interface UseLoginForm {
  formData: LoginFormData;
  error: string | null;
  loading: boolean;
  showPassword: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent, onSuccess: (token: string) => Promise<void>) => Promise<void>;
}

export const useLoginForm = (): UseLoginForm => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.email) {
      setError('L\'adresse e-mail est requise');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('L\'adresse e-mail n\'est pas valide');
      return false;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent, onSuccess: (token: string) => Promise<void>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await AuthService.login(formData);
      await onSuccess(response.token);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    showPassword,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  };
}; 