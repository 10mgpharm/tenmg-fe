import Image from "next/image";
import React from "react";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      {/* Footer Section */}
      <footer className="bg-[#1866A7] text-white text-sm">
        <div className="container mx-auto py-8 px-4">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-7">
            {/* Logo Section */}
            <div className="col-span-2 flex flex-col items-start">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/images/footerlogo.png" // Replace with your logo path
                  alt="10mg Health"
                  className="h-10 w-auto"
                  width={500}
                  height={500}
                />
                <span className="ml-2 text-xl font-bold">10mg Health</span>
              </div>
            </div>

            {/* Links Section */}
            <div>
              <h3 className="font-bold mb-2">Our Company</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Founder&apos;s Desk
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Challenges
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Features</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Suppliers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Pharmacies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Vendors
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Developers</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    API Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Resources</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Licenses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Cookie Policies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Terms and Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-white/30 my-6" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2024 10MG Pharmacy. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                aria-label="Twitter"
                className="text-white hover:text-gray-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-white hover:text-gray-300"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-white hover:text-gray-300"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
