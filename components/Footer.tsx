import React from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xs text-gray-400">
          Not affiliated with the Puerto Rican Government or LUMA Energy. / No
          esta afiliado con el Gobierno de Puerto Rico o LUMA Energy.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          &copy; {currentYear} | Designed & Built by Brito
        </p>
      </div>
    </footer>
  );
};
