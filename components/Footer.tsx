import React from 'react';

export const Footer = () => {
    return (
        <footer className="flex text-md mt-20 mb-10 flex-col h-24 w-full items-center justify-center">
            <div className="text-red-400 text-xs text-center">
                <p>
                    Not affiliated with the Puerto Rican Government or LUMA
                    Energy.
                </p>
                <p>
                    No está afiliado con el Gobierno de Puerto Rico o LUMA
                    Energy.
                </p>
            </div>
            <div className="my-3 text-center text-xs">
                <div className="text-blue-500 mb-2">
                    <p>© {new Date().getFullYear()} | Designed & built by Brito</p>
                    <p>Made with ❤️ with Next.js,TypeScript, & Tailwind</p>
                </div>
            </div>
        </footer>
    );
};
