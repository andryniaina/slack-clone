import { 
  Search, 
  ChevronDown, 
  Plus, 
  Send,
  Bold,
  Italic,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  Code,
  Quote,
  Paperclip,
  Mic,
  AtSign,
  Smile,
  MoreVertical,
  X,
} from 'lucide-react';
import avatar from '../../../assets/images/avatar.png';

export default function DirectMessages() {
  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-[260px] bg-[#3F0E40] flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-white font-semibold">Messages directs</h1>
            <ChevronDown className="text-white/70 ml-1 w-4 h-4" />
          </div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white rounded hover:bg-white/10">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Trouver un message direct"
              className="w-full h-7 bg-[#4A154B] text-white placeholder-white/60 text-sm px-7 rounded border border-white/30 focus:outline-none focus:border-white/60"
            />
            <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60" />
          </div>
        </div>

        {/* Empty State Message */}
        <div className="px-4 py-3">
          <div className="flex items-start">
            <span className="text-white/70 text-3xl mr-3">👋</span>
            <p className="text-white/70 text-sm">
              Personne ne manque à l'appel ? Ajoutez votre équipe et lancez la conversation.
            </p>
          </div>
          <button className="mt-2 px-3 py-1 text-sm text-white bg-white/10 rounded hover:bg-white/20">
            Ajouter des collègues
          </button>
        </div>

        {/* Direct Messages List */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {/* Direct Message Items */}
          <button className="w-full text-white/70 hover:bg-[#350D36] px-2 py-1 text-sm flex items-center rounded">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            Androuz
          </button>
          <button className="w-full text-white bg-[#1164A3] px-2 py-1 text-sm flex items-center rounded">
            <div className="relative mr-2">
              <img src={avatar} alt="Andriniaina" className="w-4 h-4 rounded-full" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-[#1164A3]"></div>
            </div>
            Andriniaina
            <span className="ml-1 text-xs text-white/50">vous</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-12 border-b border-gray-200 flex items-center px-4 justify-between bg-white">
          <div className="flex items-center">
            <div className="relative">
              <img src={avatar} alt="Andriniaina" className="w-6 h-6 rounded-full" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
            </div>
            <span className="ml-2 font-medium">Andriniaina</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-600 hover:text-gray-800">
              <MoreVertical className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6">
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img src={avatar} alt="Andriniaina" className="w-20 h-20 rounded-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <h2 className="text-lg font-semibold flex items-center">
                Andriniaina
                <span className="text-xs text-gray-500 ml-1">(vous)</span>
              </h2>
              <button className="mt-2 px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
                Modifier le profil
              </button>
              <p className="mt-4 text-sm text-gray-600 max-w-md">
                Ceci est votre espace. Préparez vos messages, dressez vos listes de choses à faire ou classez vos liens et vos fichiers. Vous pouvez aussi vous parler à vous-même, mais n'oubliez pas que vous serez votre seul interlocuteur.
              </p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="border border-gray-300 rounded-lg">
            {/* Formatting Toolbar */}
            <div className="px-3 py-2 border-b border-gray-200 flex items-center space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <Bold className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <Italic className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <Strikethrough className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <LinkIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <List className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <ListOrdered className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <Code className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <Quote className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Message Input Area */}
            <div className="px-3 py-2 min-h-[80px]">
              <div className="text-gray-400 text-sm">
                Notez quelque chose
              </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                  <AtSign className="w-4 h-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                  <Smile className="w-4 h-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                  <Paperclip className="w-4 h-4 text-gray-600" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                  <Mic className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                <Send className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 