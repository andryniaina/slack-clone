import { Outlet } from 'react-router-dom';
import { NavigationSidebar } from '../components/Layout/NavigationSidebar';
import { Header } from '../components/Layout/Header';

export default function AuthenticatedLayout() {
    return (
        <div className="h-screen flex">
            {/* Left Navigation Sidebar */}
            <NavigationSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header />

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden bg-[#F8F8F8]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
