import React from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center justify-center h-24 w-full mb-10 text-md">
      <div className="text-center text-xs text-red-400">
        <p>Not affiliated with the Puerto Rican Government or LUMA Energy.</p>
        <p>No está afiliado con el Gobierno de Puerto Rico o LUMA Energy.</p>
      </div>
      <div className="my-3 text-center text-xs text-blue-500">
        <p>© {currentYear} | Designed & Built by Brito</p>
        <p className="mt-1">Made with ❤️ using Nextjs</p>
      </div>
    </footer>
  );
};
