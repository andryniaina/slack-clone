import arobase from '../../../assets/images/arobase.svg';

export default function Activity() {
  return (
    <div className="flex h-full bg-[#3E0F3F]">
      {/* Left Sidebar */}
      <div className="w-[260px] bg-[#512654] flex flex-col flex-shrink-0 rounded-lg">
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center">
            <h1 className="text-white font-semibold">Activité</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="text-white/70 text-4xl mb-4">☀️</div>
          <h2 className="text-white font-medium mb-2">Rien de neuf</h2>
          <p className="text-white/70 text-sm">
            Vous pouvez reprendre vos activités.
          </p>
          <button className="mt-4 text-[#1D9BD1] text-sm hover:underline">
            Afficher toute l'activité
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center max-w-md text-center">
          <img 
            src={arobase} 
            alt="Arobase" 
            className="w-32 h-32 mb-6 opacity-80"
          />
          <p className="text-gray-500 text-sm">
            Voici votre fil d'activité. Nous vous tiendrons au courant des activités importantes concernant vous et votre équipe.
          </p>
        </div>
      </div>
    </div>
  );
} 