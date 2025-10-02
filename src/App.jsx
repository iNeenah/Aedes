// Main App component - Client-side application entry point
import React, { useState } from 'react';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import ReportsMap from './components/ReportsMap';
import './constants/leaflet'; // Initialize Leaflet icons
import "leaflet.heat";

const App = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReportSubmitted = () => {
    // Trigger refresh of the map
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Form */}
          <div>
            <ReportForm onReportSubmitted={handleReportSubmitted} />
          </div>

          {/* Reports Map */}
          <div>
            <ReportsMap refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl text-teal-500 mb-2">🗺️</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Mapeo Inteligente
                </h3>
                <p className="text-sm text-gray-600">
                  Visualización en tiempo real con mapa de calor que evoluciona
                  según criticidad temporal
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-green-500 mb-2">🤖</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  IA Gemini 2.0
                </h3>
                <p className="text-sm text-gray-600">
                  Ajuste automático de ubicaciones y análisis inteligente de
                  imágenes
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-purple-500 mb-2">📊</div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Supabase Backend
                </h3>
                <p className="text-sm text-gray-600">
                  Base de datos en tiempo real con almacenamiento seguro de
                  imágenes
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                <strong>Vigilantes del Aedes</strong> - Sistema de Vigilancia
                Epidemiológica Web
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Desarrollado para combatir el dengue mediante participación
                ciudadana y tecnología avanzada
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Desarrollado con Supabase para la salud pública de Misiones,
                Argentina
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;