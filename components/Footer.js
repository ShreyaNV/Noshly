import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="footer" className="text-white py-12" style={{ backgroundColor: 'black' }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Image
                src="/logo-actual.png" // Replace with your logo path
                alt="Noshly Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <Image
                src="/logo-actual1.png" // Replace with your logo path
                alt="Noshly Logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-300">
              We are dedicated to reducing food waste and connecting surplus food with those in need. Join us in making a difference!
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm text-gray-300">
              <li className="mb-2">
                <a href="#" className="hover:underline">How It Works</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Get Involved</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Partners</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="text-sm text-gray-300">
              <li className="mb-2">
                <a href="mailto:noshlyhelp@gmail.com" className="hover:underline">noshlyhelp@gmail.com</a>
              </li>
              <li className="mb-2">
                <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a>
              </li>
              <li className="mb-2">
                <p>123 Food Rescue St, City, Country</p>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates and tips on reducing food waste.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-2 rounded-l text-gray-800"
                required
              />
              <button
                type="submit"
                className="bg-blue-800 text-white px-4 rounded-r hover:bg-blue-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white">
              {/* Twitter Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M22.23 5.924c-.736.326-1.527.547-2.357.646.847-.508 1.498-1.312 1.804-2.27-.793.47-1.67.812-2.606.996-.75-.8-1.817-1.296-2.997-1.296-2.267 0-4.103 1.837-4.103 4.103 0 .322.036.635.106.935-3.41-.17-6.433-1.804-8.457-4.287-.353.606-.555 1.31-.555 2.062 0 1.424.724 2.68 1.825 3.415-.673-.02-1.305-.206-1.86-.512v.052c0 1.988 1.415 3.647 3.293 4.023-.344.094-.707.144-1.082.144-.265 0-.522-.026-.773-.074.522 1.63 2.038 2.817 3.833 2.85-1.404 1.1-3.174 1.757-5.096 1.757-.332 0-.66-.02-.98-.057 1.816 1.164 3.973 1.843 6.29 1.843 7.547 0 11.675-6.253 11.675-11.675 0-.178-.004-.355-.012-.531.802-.58 1.497-1.304 2.047-2.128z" />
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              {/* Instagram Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              {/* LinkedIn Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-300">
            &copy; 2023 Noshly. All rights reserved.
          </p>
          <div className="mt-2">
            <a href="#" className="text-sm text-gray-300 hover:underline mx-2">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-300 hover:underline mx-2">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}