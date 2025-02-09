import React from 'react';
import { MessageSquare } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChatErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chat error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 w-full h-full flex items-center justify-center bg-[#F8F8F8]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="flex justify-center mb-4">
              <MessageSquare className="h-12 w-12 text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Problème de chargement du chat
            </h2>
            <p className="text-gray-600 mb-4">
              Nous ne pouvons pas charger la conversation pour le moment. 
              Cela peut être dû à un problème de connexion.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Rafraîchir la page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 w-full h-full">
        {this.props.children}
      </div>
    );
  }
} 