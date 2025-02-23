import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { User, Settings, History } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="p-4 text-white" style={{ backgroundColor: '#C3C079' }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center mb-2">
            <Image
              src="/logo-actual.png" // Replace with your logo path
              alt="Noshly Logo"
              width={100}
              height={100}
              className="object-contain"
            />
            <Image
              src="/logo-actual1.png" // Replace with your logo path
              alt="Noshly Logo"
              width={210}
              height={210}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Navigation Links */}
            <nav>
          <ul className="flex space-x-4 items-center text-m text-black mr-10">
          <li className="mx-2">
              <Link href="/" className="hover:underline">
                Rewards
              </Link>
            </li>
            <li className="mx-2">
              <Link href="#footer" className="hover:underline">Contact Us</Link>
            </li>
            <li className="mx-2">
              <Link href="https://forms.gle/YkyaFLeZzA2BQCTi6" className="hover:underline">Help</Link>
            </li>
            {user ? (
              <li
                className="relative mx-2"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => {
                  setTimeout(() => setIsOpen(false), 1000);
                }}
                
              >
                <button className="text-black font-medium hover:underline">Profile</button>

                {isOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg p-2 space-y-1 transition-opacity duration-200 ease-in-out">
                    <li>
                      <Link href="/profile" className="flex items-center space-x-2 hover:bg-gray-100 rounded p-2">
                        <User className="w-4 h-4" /> <span>Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/previous-orders" className="flex items-center space-x-2 hover:bg-gray-100 rounded p-2">
                        <History className="w-4 h-4" /> <span>Previous Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="flex items-center space-x-2 hover:bg-gray-100 rounded p-2">
                        <Settings className="w-4 h-4" /> <span>Settings</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                          href="/"
                          onClick={logout}
                          className="flex items-center space-x-2 text-red-600 hover:bg-gray-100 rounded p-2 cursor-pointer"
                        >
                          <span>Logout</span>
                        </Link>
                      </li>
                  </ul>
                )}
              </li>
            ) : (
              <li className="mx-2">
                <Link href="/login" className="hover:underline">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}