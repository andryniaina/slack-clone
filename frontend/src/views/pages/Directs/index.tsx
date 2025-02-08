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
  Loader2,
  Type,
} from 'lucide-react';
import { useState, useRef, KeyboardEvent } from 'react';
import avatar from '../../../assets/images/avatar.png';
import { useUsers } from '../../../hooks/user';
import { useAuth } from '../../../contexts/AuthContext';
import { User } from '../../../data/dtos/user';
import clsx from 'clsx';

export default function Directs() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading, error } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [isFormatting, setIsFormatting] = useState({
    bold: false,
    italic: false,
    strike: false,
    link: false,
    bulletList: false,
    numberList: false,
    code: false,
    quote: false,
  });
  const inputRef = useRef<HTMLDivElement>(null);

  // Trier les utilisateurs
  const sortedUsers = users
    ?.sort((a, b) => {
      // Trier d'abord par statut en ligne
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      // Puis par nom d'utilisateur
      return (a.username || a.email).localeCompare(b.username || b.email);
    }) ?? [];

  // Rendu d'un utilisateur dans la liste
  const renderUserItem = (user: User) => (
    <button 
      key={user._id}
      onClick={() => setSelectedUser(user)}
      className={clsx(
        "w-full text-white/70 hover:bg-[#350D36] px-2 py-1 text-sm flex items-center rounded group",
        selectedUser?._id === user._id && "bg-[#1164A3] text-white hover:bg-[#1164A3]"
      )}
    >
      <div className={clsx(
        "w-4 h-4 rounded-full mr-2",
        user.isOnline ? "bg-green-500" : "bg-gray-500"
      )} />
      <span className={clsx(
        "group-hover:text-white",
        selectedUser?._id === user._id && "text-white"
      )}>
        {user.username || user.email}
        {user._id === currentUser?._id && (
          <span className="ml-1 text-xs text-white/50">vous</span>
        )}
      </span>
    </button>
  );

  const handleFormat = (type: keyof typeof isFormatting) => {
    setIsFormatting(prev => ({ ...prev, [type]: !prev[type] }));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // TODO: Implement message sending
    console.log('Sending message:', message);
    setMessage('');
    setIsFormatting({
      bold: false,
      italic: false,
      strike: false,
      link: false,
      bulletList: false,
      numberList: false,
      code: false,
      quote: false,
    });
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-[260px] bg-[#3F0E40] flex flex-col flex-shrink-0">
        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Direct Messages */}
          <div>
            <div className="flex items-center justify-between px-2 py-1 text-white/70 hover:text-white cursor-pointer">
              <div className="flex items-center">
                <ChevronDown size={16} className="mr-1" />
                <span className="text-sm font-medium">Messages directs</span>
              </div>
            </div>
            <div className="mt-1 space-y-0.5">
              {isLoading ? (
                <div className="flex items-center justify-center py-4 text-white/70">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm">Chargement...</span>
                </div>
              ) : error ? (
                <div className="px-2 py-4 text-red-400 text-sm text-center">
                  Une erreur est survenue lors du chargement des utilisateurs
                </div>
              ) : sortedUsers.length === 0 ? (
                <div className="px-2 py-4 text-white/70 text-sm text-center">
                  Aucun utilisateur disponible
                </div>
              ) : (
                sortedUsers.map(renderUserItem)
              )}
              <button className="w-full text-white/70 hover:bg-[#350D36] px-2 py-1 text-sm flex items-center rounded">
                <Plus size={16} className="mr-2" />
                Ajouter des collègues
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-12 border-b border-gray-200 flex items-center px-4 justify-between bg-white">
              <div className="flex items-center">
                <div className="relative">
                  <img src={selectedUser.avatar || avatar} alt={selectedUser.username || selectedUser.email} className="w-6 h-6 rounded-full" />
                  <div className={clsx(
                    "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white",
                    selectedUser.isOnline ? "bg-green-500" : "bg-gray-500"
                  )}></div>
                </div>
                <span className="ml-2 font-medium">{selectedUser.username || selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-gray-600 hover:text-gray-800">
                  <MoreVertical className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
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
                    <img src={selectedUser.avatar || avatar} alt={selectedUser.username || selectedUser.email} className="w-20 h-20 rounded-lg" />
                    <div className={clsx(
                      "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white",
                      selectedUser.isOnline ? "bg-green-500" : "bg-gray-500"
                    )}></div>
                  </div>
                  <h2 className="text-lg font-semibold flex items-center">
                    {selectedUser.username || selectedUser.email}
                    {selectedUser._id === currentUser?._id && (
                      <span className="text-xs text-gray-500 ml-1">(vous)</span>
                    )}
                  </h2>
                  {selectedUser._id === currentUser?._id && (
                    <button className="mt-2 px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
                      Modifier le profil
                    </button>
                  )}
                  {selectedUser._id === currentUser?._id ? (
                    <p className="mt-4 text-sm text-gray-600 max-w-md">
                      Ceci est votre espace. Préparez vos messages, dressez vos listes de choses à faire ou classez vos liens et vos fichiers. Vous pouvez aussi vous parler à vous-même, mais n'oubliez pas que vous serez votre seul interlocuteur.
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-gray-600 max-w-md">
                      {selectedUser.bio || `Envoyez un message à ${selectedUser.username || selectedUser.email} pour démarrer une conversation.`}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="border border-gray-300 rounded-lg">
                {/* Formatting Toolbar */}
                <div className="px-3 py-2 border-b border-gray-200 flex items-center space-x-1">
                  <button 
                    onClick={() => handleFormat('bold')}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100",
                      isFormatting.bold && "bg-gray-100"
                    )}
                  >
                    <Bold className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleFormat('italic')}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100",
                      isFormatting.italic && "bg-gray-100"
                    )}
                  >
                    <Italic className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleFormat('strike')}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100",
                      isFormatting.strike && "bg-gray-100"
                    )}
                  >
                    <Strikethrough className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleFormat('link')}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100",
                      isFormatting.link && "bg-gray-100"
                    )}
                  >
                    <LinkIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleFormat('bulletList')}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100",
                      isFormatting.bulletList && "bg-gray-100"
                    )}
                  >
                    <List className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleFormat('numberList')}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100",
                      isFormatting.numberList && "bg-gray-100"
                    )}
                  >
                    <ListOrdered className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleFormat('code')}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100",
                      isFormatting.code && "bg-gray-100"
                    )}
                  >
                    <Code className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleFormat('quote')}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100",
                      isFormatting.quote && "bg-gray-100"
                    )}
                  >
                    <Quote className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Message Input Area */}
                <div 
                  ref={inputRef}
                  contentEditable
                  role="textbox"
                  className={clsx(
                    "px-3 py-2 min-h-[80px] focus:outline-none",
                    "text-gray-900 text-sm",
                    !message && "before:content-[attr(data-placeholder)] before:text-gray-400"
                  )}
                  data-placeholder={selectedUser._id === currentUser?._id ? 
                    "Notez quelque chose" : 
                    `Envoyer un message à ${selectedUser.username || selectedUser.email}`
                  }
                  onInput={(e) => setMessage(e.currentTarget.textContent || '')}
                  onKeyDown={handleKeyDown}
                  style={{
                    fontWeight: isFormatting.bold ? 'bold' : 'normal',
                    fontStyle: isFormatting.italic ? 'italic' : 'normal',
                    textDecoration: isFormatting.strike ? 'line-through' : 'none',
                  }}
                />

                {/* Bottom Toolbar */}
                <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                      <Type className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                      <AtSign className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                      <Smile className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded",
                      message.trim() ? "text-[#007a5a] hover:bg-[#007a5a]/10" : "text-gray-400"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une conversation
              </h2>
              <p className="text-sm text-gray-500">
                Choisissez un utilisateur dans la liste pour démarrer une conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 