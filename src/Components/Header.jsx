import React from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);


    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo và Brand */}
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-blue-600">
                            <i className="fas fa-microchip mr-2"></i>
                            IoT Dashboard
                        </div>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex space-x-4">
                        <a href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                            Dashboard
                        </a>
                        <a href="/devices" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                            Devices
                        </a>
                        <a href="/history" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                            History
                        </a>
                        <a href="/settings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                            Settings
                        </a>
                    </nav>



                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                            Dashboard
                        </a>
                        <a href="/devices" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                            Devices
                        </a>
                        <a href="/analytics" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                            Analytics
                        </a>
                        <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                            Settings
                        </a>
                        <hr className="my-2" />
                        <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                            Profile
                        </a>
                        <a href="/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">
                            Logout
                        </a>
                    </div>
                )}
            </div>
        </header>
    );
}