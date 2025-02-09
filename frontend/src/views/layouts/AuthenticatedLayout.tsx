import { Outlet } from 'react-router-dom';
import { NavigationSidebar } from '../components/Layout/NavigationSidebar';
import { Header } from '../components/Layout/Header';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';

export default function AuthenticatedLayout() {
    return (
        <ErrorBoundary>
            <div className="h-screen flex">
                {/* Left Navigation Sidebar */}
                <ErrorBoundary>
                    <NavigationSidebar />
                </ErrorBoundary>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <ErrorBoundary>
                        <Header />
                    </ErrorBoundary>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-hidden bg-[#F8F8F8]">
                        <ErrorBoundary>
                            <Outlet />
                        </ErrorBoundary>
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
}
