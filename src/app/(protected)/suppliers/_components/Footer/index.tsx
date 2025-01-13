import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="bg-white p-4">
      <p className="text-gray-500 text-center">
        &copy; {currentYear} 10MG Pharmacy. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
