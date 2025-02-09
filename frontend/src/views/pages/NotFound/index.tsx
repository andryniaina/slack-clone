import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#431343] to-[#5B315E] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Numéro 404 stylisé */}
        <h1 className="text-9xl font-bold text-white/90 tracking-widest">
          404
        </h1>
        
        {/* Message d'erreur */}
        <h2 className="mt-8 text-2xl font-semibold text-white/90">
          Page non trouvée
        </h2>
        <p className="mt-4 text-white/70">
          Désolé, la page que vous recherchez semble avoir disparu dans les méandres du chat...
        </p>

        {/* Bouton de retour */}
        <button
          onClick={() => navigate('/app/dashboard')}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
        >
          <Home size={20} />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
} 