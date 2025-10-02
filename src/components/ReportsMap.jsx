// ReportsMap component - Client-side map visualization component
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { aedesIcon } from '../constants/leaflet';
import { fetchReports, subscribeToReports } from '../server-actions/reports';
import 'leaflet.heat';

const ReportsMap = ({ refreshTrigger }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);

  useEffect(() => {
    loadReports();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToReports((newReport) => {
      setReports(prev => {
        const updatedReports = [newReport, ...prev];
        updateHeatmap(updatedReports);
        return updatedReports;
      });
    });

    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (refreshTrigger) {
      loadReports();
    }
  }, [refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateHeatmap(reports);
  }, [reports, showHeatmap]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await fetchReports();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Error al cargar los reportes. Verifica que la tabla "reports" esté creada en Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const updateHeatmap = (reportsData) => {
    if (!mapRef.current || !window.L || !window.L.heatLayer) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    if (showHeatmap && reportsData.length > 0) {
      // Prepare heat data with temporal evolution
      const heatData = reportsData.map(report => {
        const createdAt = new Date(report.created_at);
        const now = new Date();
        const daysElapsed = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
        
        // Evolve criticality over time
        let evolvedWeight = report.criticality_weight + (daysElapsed * 0.05);
        evolvedWeight = Math.min(evolvedWeight, 1.0); // Cap at 1.0

        return [
          report.latitude,
          report.longitude,
          evolvedWeight
        ];
      });

      // Create and add heat layer
      heatLayerRef.current = window.L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: '#00ff00',
          0.3: '#ffff00', 
          0.6: '#ff8000',
          0.9: '#ff0000',
          1.0: '#800080'
        }
      });

      mapRef.current.addLayer(heatLayerRef.current);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCriticalityColor = (level) => {
    switch (level) {
      case 'BAJA': return 'text-green-600';
      case 'MEDIA': return 'text-yellow-600';
      case 'ALTA': return 'text-orange-600';
      case 'CRITICA': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCriticalityIcon = (level) => {
    switch (level) {
      case 'BAJA': return '🟢';
      case 'MEDIA': return '🟡';
      case 'ALTA': return '🟠';
      case 'CRITICA': return '🔴';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reportes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error de Conexión</h3>
          <p className="font-medium">⚠️ {error}</p>
          <p className="text-sm mt-1">
            Asegúrate de haber ejecutado el script setup_supabase.sql en tu proyecto Supabase.
            <br />
            Tabla requerida: 'reports' con columnas: id, created_at, description, photo_url, latitude, longitude, initial_criticality, criticality_weight
          </p>
          <button
            onClick={loadReports}
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Map Controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Mapa de Reportes - Posadas
            </h3>
            <p className="text-sm text-gray-600">
              {reports.length} reportes registrados
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showHeatmap
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showHeatmap ? '🔥 Ocultar Mapa de Calor' : '🔥 Mostrar Mapa de Calor'}
            </button>
            
            <button
              onClick={() => setShowMarkers(!showMarkers)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showMarkers
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showMarkers ? '📍 Ocultar Marcadores' : '📍 Mostrar Marcadores'}
            </button>
          </div>
        </div>

        {/* Legend */}
        {showHeatmap && (
          <div className="mt-3 p-3 bg-white rounded-lg border">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Leyenda del Mapa de Calor</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span>Baja criticidad</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>Media criticidad</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span>Alta criticidad</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Crítica</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-600 rounded"></div>
                <span>Emergencia</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              * La criticidad evoluciona automáticamente con el tiempo transcurrido
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-96">
        <MapContainer
          center={[-27.3671, -55.8961]}
          zoom={13}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {showMarkers && reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={aedesIcon}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {getCriticalityIcon(report.initial_criticality)}
                    </span>
                    <span className={`font-semibold ${getCriticalityColor(report.initial_criticality)}`}>
                      {report.initial_criticality}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {report.description}
                  </p>
                  
                  {report.photo_url && (
                    <img
                      src={report.photo_url}
                      alt="Criadero reportado"
                      className="w-full h-32 object-cover rounded mb-2"
                      loading="lazy"
                    />
                  )}
                  
                  <p className="text-xs text-gray-500">
                    📅 {formatDate(report.created_at)}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    📍 {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Statistics */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-teal-600">{reports.length}</div>
            <div className="text-xs text-gray-600">Total Reportes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {reports.filter(r => r.initial_criticality === 'CRITICA').length}
            </div>
            <div className="text-xs text-gray-600">Críticos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {reports.filter(r => r.initial_criticality === 'ALTA').length}
            </div>
            <div className="text-xs text-gray-600">Alta Prioridad</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => ['BAJA', 'MEDIA'].includes(r.initial_criticality)).length}
            </div>
            <div className="text-xs text-gray-600">Controlables</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsMap;