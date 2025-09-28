import React, { useState } from "react";
import { Facebook, Instagram } from "lucide-react"; // you can swap for real icons

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grievance Form */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:space-x-16 space-y-6 md:space-y-0">
            {/* Left Title */}
            <div>
              <h3 className="font-montserrat font-bold text-[18px] leading-[20px] text-[#484848]">
                Grievance/Feedback
              </h3>
              <p className="font-montserrat font-medium text-[14px] leading-[20px] text-[#484848]">
                Stay Upto Date
              </p>
            </div>

            {/* Input Field */}
            <div className="flex-1 max-w-3xl w-full">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] pl-6 pr-16 rounded-full border border-[#E8EAEC] bg-white font-montserrat font-medium text-[14px] text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
                <button className="absolute right-0 top-0 w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#9A9A9A] hover:bg-gray-700 transition">
                  <img src="/ph_paper-plane.svg" alt="Send" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="col-span-1">
            <div className="w-40 h-40 flex items-center justify-center">
              <img
                src="/logo_big.png"
                alt="Quorium Consulting"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">COMPANY</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#about" className="hover:text-gray-900 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#legal" className="hover:text-gray-900 transition-colors">
                  Legal Information
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gray-900 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#blogs" className="hover:text-gray-900 transition-colors">
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">HELP CENTER</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#find-room" className="hover:text-gray-900 transition-colors">
                  Find a Room
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-gray-900 transition-colors">
                  Why Us?
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-gray-900 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#rental-guides" className="hover:text-gray-900 transition-colors">
                  Rental Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info + Social */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">CONTACT INFO</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Phone: 1234567890</p>
              <p>Email: company@email.com</p>
              <p>Location: somewhere</p>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#facebook"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400 transition"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#instagram"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400 transition"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
