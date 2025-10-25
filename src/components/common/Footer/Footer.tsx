import React, { useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import { useCompanySettings } from "../../../hooks/useCompanySettings";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const { company, phone, email: companyEmail, address, city, facebook, instagram, logo } = useCompanySettings();

  return (
    <footer className="py-16" style={{ backgroundColor: '#1F655E' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Grievance Form */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:space-x-16 space-y-6 md:space-y-0">
            {/* Left Title */}
            <div>
              <h3 className="font-montserrat font-bold text-[18px] leading-[20px] text-white">
                Grievance/Feedback
              </h3>
              <p className="font-montserrat font-medium text-[14px] leading-[20px] text-white">
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
                src={logo || "/logo_big.png"}
                alt={company}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">COMPANY</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#legal" className="hover:text-white transition-colors">
                  Legal Information
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#blogs" className="hover:text-white transition-colors">
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h4 className="font-semibold text-white mb-4">HELP CENTER</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#find-room" className="hover:text-white transition-colors">
                  Find a Room
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  Why Us?
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#rental-guides" className="hover:text-white transition-colors">
                  Rental Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info + Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">CONTACT INFO</h4>
            <div className="space-y-2 text-sm text-gray-300">
              {phone && <p>Phone: <a href={`tel:${phone}`}>{phone}</a></p>}
              {companyEmail && <p>Email: <a href={`mailto:${companyEmail}`}>{companyEmail}</a></p>}
              {city && <p>Location: {city}{address ? `, ${address}` : ''}</p>}
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400 transition"
                >
                  <Facebook size={16} />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400 transition"
                >
                  <Instagram size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
