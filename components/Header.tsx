import React from 'react';

const brandInfo = {
  logoTitle: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png",
  organizationShortName: "HERE AND NOW AI"
};

export const Header: React.FC = () => {
  return (
    <header className="bg-[var(--brand-secondary-hover)]/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-[var(--brand-primary)]">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <img 
          src={brandInfo.logoTitle} 
          alt={`${brandInfo.organizationShortName} Logo`} 
          className="h-10 md:h-12" // Adjusted height for better fit
        />
      </div>
    </header>
  );
};