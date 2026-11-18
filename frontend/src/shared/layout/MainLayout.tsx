import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const MainLayout = () => (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
        </main>
        <footer className="bg-white border-t border-gray-200 py-5 text-center text-sm text-gray-500">
            Food Store — Trabajo Práctico Integrador Programación IV
        </footer>
    </div>
);