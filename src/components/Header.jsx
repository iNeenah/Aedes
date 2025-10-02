// Header component - Client-side UI component
import React from 'react';

const Header = () => {
  const goToLanding = () => {
    // Simple navigation to landing page
    window.location.href = './landing/index.html';
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #00A859 0%, #007A3D 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-lg shadow-md flex items-center justify-center text-2xl cursor-pointer"
              style={{ background: '#E6007E' }}
              onClick={goToLanding}
            >
              🦟
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Vigilantes del Aedes
              </h1>
              <p className="text-sm text-white opacity-90 font-medium">
                Sistema de Reportes Web
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={goToLanding}
              className="text-white hover:text-gray-200 transition-colors duration-200 flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              <span>←</span>
              <span className="hidden md:inline">Volver al Inicio</span>
            </button>
            <div className="text-white text-sm opacity-75 hidden md:block">
              📍 Reportar Criadero
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;