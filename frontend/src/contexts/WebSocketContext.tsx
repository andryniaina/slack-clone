import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '../config/api';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const queryClient = useQueryClient();

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connectSocket = () => {
      if (!user) return;

      // Nettoyer l'ancienne connexion si elle existe
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      try {
        // Créer une connexion Socket.IO avec des options de reconnexion
        const socket = io(API_CONFIG.BASE_URL, {
          withCredentials: true,
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: maxReconnectAttempts,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        // Gestionnaires d'événements de connexion
        socket.on('connect', () => {
          reconnectAttempts.current = 0;
          socket.emit('connect_user', user._id);
        });

        socket.on('connect_error', (error) => {
          console.error('Erreur de connexion:', error);
          handleReconnect();
        });

        socket.on('connect_timeout', () => {
          console.error('Délai de connexion dépassé');
          handleReconnect();
        });

        socket.on('connect_confirmed', () => {
          setIsConnected(true);
        });

        socket.on('disconnect', (reason) => {
          setIsConnected(false);
          if (reason === 'io server disconnect' || reason === 'io client disconnect') {
            // Ne pas tenter de se reconnecter si la déconnexion est volontaire
            return;
          }
          handleReconnect();
        });

        socket.on('error', (error: any) => {
          console.error('Erreur WebSocket:', error);
        });

        // Écouter les changements de statut de connexion
        socket.on('connectionStatusChanged', ({ userId, isOnline }) => {
          console.log('Statut de connexion modifié:', { userId, isOnline });
          socket.emit('join_new_channels', user._id);
          // Invalider la requête des utilisateurs pour forcer une mise à jour
          queryClient.invalidateQueries({ queryKey: ['users'] });
        });

        socketRef.current = socket;
      } catch (error) {
        console.error('Error creating socket:', error);
        handleReconnect();
      }
    };

    const handleReconnect = () => {
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Nombre maximal de tentatives de reconnexion atteint');
        return;
      }

      reconnectAttempts.current += 1;

      // Attendre avant de tenter une reconnexion
      reconnectTimer = setTimeout(() => {
        connectSocket();
      }, 1000 * Math.min(reconnectAttempts.current, 5)); // Délai exponentiel plafonné à 5 secondes
    };

    connectSocket();

    // Nettoyage
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (socketRef.current) {
        socketRef.current.off('connectionStatusChanged');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [user, queryClient]);

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
} 