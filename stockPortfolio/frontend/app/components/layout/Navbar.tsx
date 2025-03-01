'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? 'bg-darkerGreen text-white' : 'text-white hover:bg-lightGreen hover:text-white';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // If on authentication pages or home page, don't show the dashboard navbar
  if (pathname === '/' || pathname?.startsWith('/auth')) {
    return null;
  }

  return (
    <nav className="bg-darkGreen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="text-white font-bold text-xl">
                Asset Tracker
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/portfolio"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard/portfolio')}`}
                >
                  Portfolios
                </Link>
                <Link
                  href="/dashboard/stock"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard/stock')}`}
                >
                  Stocks
                </Link>
                <Link
                  href="/dashboard/news"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard/news')}`}
                >
                  News
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user && (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="max-w-xs bg-darkerGreen rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darkGreen focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-lightGreen flex items-center justify-center text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="block px-4 py-2 text-sm text-gray-700 border-b">
                        Signed in as <span className="font-semibold">{user.username}</span>
                      </div>
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-darkerGreen inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darkGreen focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/portfolio"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard/portfolio')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolios
            </Link>
            <Link
              href="/dashboard/stock"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard/stock')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Stocks
            </Link>
            <Link
              href="/dashboard/news"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard/news')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-lightGreen">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-lightGreen flex items-center justify-center text-white text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{user.username}</div>
                  <div className="text-sm font-medium leading-none text-gray-300 mt-1">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-lightGreen"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-lightGreen"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;