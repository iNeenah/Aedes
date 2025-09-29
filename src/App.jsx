import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Fix Leaflet default markers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Gemini AI configuration
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Custom marker icon for Aedes reports
const aedesIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/32/2913/2913095.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Coordenadas predeterminadas de Posadas, Misiones
const POSADAS_COORDS = {
  latitude: -27.3671,
  longitude: -55.8961
};

// Zonas de Posadas - Lista completa para selección del usuario
const POSADAS_ZONES = [
  { id: 1, name: "Centro", lat: -27.3671, lng: -55.8961, description: "Centro histórico y comercial" },
  { id: 2, name: "Villa Cabello", lat: -27.3580, lng: -55.9020, description: "Zona residencial norte" },
  { id: 3, name: "Itaembé Miní", lat: -27.3450, lng: -55.8850, description: "Barrio costero" },
  { id: 4, name: "Villa Urquiza", lat: -27.3750, lng: -55.8700, description: "Zona sur residencial" },
  { id: 5, name: "San José", lat: -27.3900, lng: -55.8900, description: "Barrio obrero" },
  { id: 6, name: "Nemesio Parma", lat: -27.3800, lng: -55.9100, description: "Zona oeste" },
  { id: 7, name: "Villa Sarita", lat: -27.3600, lng: -55.8800, description: "Barrio residencial" },
  { id: 8, name: "Bajada Vieja", lat: -27.3650, lng: -55.8950, description: "Zona histórica portuaria" },
  { id: 9, name: "Villa Blosset", lat: -27.3520, lng: -55.8750, description: "Barrio residencial norte" },
  { id: 10, name: "San Roque", lat: -27.3820, lng: -55.8650, description: "Zona sur-este" },
  { id: 11, name: "Villa Lanús", lat: -27.3480, lng: -55.9150, description: "Barrio periférico" },
  { id: 12, name: "El Porvenir", lat: -27.3950, lng: -55.8750, description: "Zona industrial" },
  { id: 13, name: "Villa Lourdes", lat: -27.3350, lng: -55.8900, description: "Barrio norte" },
  { id: 14, name: "Yacyretá", lat: -27.4000, lng: -55.8800, description: "Zona de la represa" },
  { id: 15, name: "Villa Alberti", lat: -27.3700, lng: -55.9200, description: "Barrio oeste" },
  { id: 99, name: "Otros", lat: -27.3671, lng: -55.8961, description: "Otra ubicación - marcar en el mapa" }
];

// Component for handling map clicks
const LocationSelector = ({ onLocationSelect, selectedLocation }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    }
  });

  return selectedLocation ? (
    <Marker
      position={[selectedLocation.latitude, selectedLocation.longitude]}
      icon={new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })}
    >
      <Popup>
        📍 Ubicación seleccionada<br/>
        Lat: {selectedLocation.latitude.toFixed(6)}<br/>
        Lng: {selectedLocation.longitude.toFixed(6)}
      </Popup>
    </Marker>
  ) : null;
};

// Header Component
const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-teal-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-4">
          <img
            src="https://i.imgur.com/ODp3hZo.png"
            alt="Logo Vigilantes del Aedes"
            className="w-12 h-12 rounded-lg shadow-md"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzE0YjhhNiIvPgo8cGF0aCBkPSJNMjQgMTJjNi42MjcgMCAxMiA1LjM3MyAxMiAxMnMtNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTIgNS4zNzMtMTIgMTItMTJ6bTAtMmMtNy43MzIgMC0xNCA2LjI2OC0xNCAxNHM2LjI2OCAxNCAxNCAxNCAxNC02LjI2OCAxNC0xNC02LjI2OC0xNC0xNC0xNHoiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjQiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
            }}
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-teal-800">Vigilantes del Aedes</h1>
            <p className="text-sm text-gray-600 font-medium">La red ciudadana que protege a Posadas</p>
          </div>
        </div>
      </div>
    </header>
  );
};

// InfoModal Component
const InfoModal = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const iconClass = isSuccess ? 'text-green-500' : 'text-red-500';
  const bgClass = isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 ${bgClass} border`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center mb-4">
          <div className={`text-4xl ${iconClass}`}>
            {isSuccess ? '✅' : '❌'}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-8 rounded-lg transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// ReportForm Component
const ReportForm = ({ onReportSubmitted }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [criaderoType, setCriaderoType] = useState('');
  const [proximity, setProximity] = useState('');
  const [accessInfo, setAccessInfo] = useState('');
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '' });
  const fileInputRef = useRef(null);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Archivo muy grande',
          message: 'La imagen debe pesar menos de 10MB. Por favor, selecciona una imagen más pequeña.'
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Auto-adjust location with AI if user selected a location
      if (selectedLocation && GEMINI_API_KEY) {
        await adjustLocationWithAI(file);
      }
    }
  };

  const adjustLocationWithAI = async (file) => {
    if (!selectedLocation || !GEMINI_API_KEY) return;

    setIsAdjusting(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result.split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      });

      const prompt = `
        Analiza esta imagen de un posible criadero de Aedes aegypti en Posadas, Misiones.

        El usuario marcó esta ubicación en el mapa:
        Latitud: ${selectedLocation.latitude}
        Longitud: ${selectedLocation.longitude}

        Basándote en la imagen, ajusta estas coordenadas con máxima precisión (hasta 6 decimales).
        Considera elementos como:
        - Ubicación específica del recipiente/criadero
        - Posición relativa a edificios, calles, árboles
        - Punto exacto donde están los recipientes con agua

        Responde SOLO en este formato JSON:
        {"latitude": -27.123456, "longitude": -55.123456, "confidence": 0.95}

        Si no puedes mejorar la precisión, mantén las coordenadas originales.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        },
      ]);

      const response = await result.response;
      try {
        const adjustedLocation = JSON.parse(response.text().trim());
        if (adjustedLocation.latitude && adjustedLocation.longitude) {
          setSelectedLocation({
            latitude: adjustedLocation.latitude,
            longitude: adjustedLocation.longitude,
            adjusted: true,
            confidence: adjustedLocation.confidence || 0.8
          });
        }
      } catch (e) {
        console.log('Could not parse AI response, keeping original location');
      }
    } catch (error) {
      console.error('Error adjusting location:', error);
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation({
      ...location,
      adjusted: false
    });
  };

  const getSelectedZoneCoordinates = () => {
    if (selectedLocation) return selectedLocation;
    if (!selectedZone) return POSADAS_COORDS;

    const zone = POSADAS_ZONES.find(z => z.id === parseInt(selectedZone));
    return zone ? { latitude: zone.lat, longitude: zone.lng } : POSADAS_COORDS;
  };

  const uploadImageToSupabase = async (file) => {
    const fileName = `public/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('Reports')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error('Error al subir la imagen: ' + uploadError.message);
    }

    const { data } = supabase.storage
      .from('Reports')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Foto requerida',
        message: 'Por favor, selecciona una imagen antes de enviar el reporte.'
      });
      return;
    }

    if (!selectedZone) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Zona requerida',
        message: 'Por favor, selecciona la zona donde se encuentra el criadero.'
      });
      return;
    }

    if (!streetAddress.trim()) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Dirección requerida',
        message: 'Por favor, ingresa la dirección específica donde se encuentra el criadero.'
      });
      return;
    }

    if (selectedZone === '99' && !selectedLocation) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Ubicación en el mapa requerida',
        message: 'Como seleccionaste "Otros", por favor marca la ubicación exacta en el mapa haciendo clic donde se encuentra el criadero.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Supabase Storage
      const photoUrl = await uploadImageToSupabase(selectedImage);

      // Get coordinates from selected zone or map selection
      const location = getSelectedZoneCoordinates();
      const selectedZoneData = POSADAS_ZONES.find(z => z.id === parseInt(selectedZone));

      // Build comprehensive description
      let fullDescription = `${streetAddress.trim()} - ${selectedZoneData.name}`;
      if (criaderoType) fullDescription += ` | Tipo: ${criaderoType}`;
      if (proximity) fullDescription += ` | Cerca de: ${proximity}`;
      if (accessInfo) fullDescription += ` | Acceso: ${accessInfo}`;
      if (description.trim()) fullDescription += ` | Obs: ${description.trim()}`;
      if (location.adjusted) fullDescription += ` | Ubicación ajustada por IA (${Math.round(location.confidence * 100)}% confianza)`;

      // Insert report into Supabase database
      const { error } = await supabase
        .from('reports')
        .insert({
          description: fullDescription,
          photo_url: photoUrl,
          latitude: location.latitude,
          longitude: location.longitude
        });

      if (error) {
        throw new Error('Error al guardar el reporte: ' + error.message);
      }

      // Show success modal
      setModal({
        isOpen: true,
        type: 'success',
        title: '¡Reporte enviado!',
        message: `¡Excelente! Tu reporte en ${selectedZoneData.name} ha sido enviado correctamente. Los equipos de control sabrán exactamente dónde ir. Has sumado 10 puntos por proteger Posadas del Aedes aegypti.`
      });

      // Reset form
      setSelectedImage(null);
      setImagePreview(null);
      setDescription('');
      setSelectedZone('');
      setStreetAddress('');
      setSelectedLocation(null);
      setCriaderoType('');
      setProximity('');
      setAccessInfo('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component
      if (onReportSubmitted) {
        onReportSubmitted();
      }

    } catch (error) {
      console.error('Error submitting report:', error);
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error al enviar',
        message: error.message || 'Ocurrió un error al enviar tu reporte. Por favor, verifica tu conexión e inténtalo nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription('');
    setSelectedZone('');
    setStreetAddress('');
    setSelectedLocation(null);
    setCriaderoType('');
    setProximity('');
    setAccessInfo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Reportar Posible Criadero
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotografía del criadero *
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
              id="photo-upload"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={isSubmitting || isAdjusting}
            >
              <span className="text-2xl">📸</span>
              <span>{isAdjusting ? 'Ajustando ubicación con IA...' : 'Tomar o Subir Foto'}</span>
            </button>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={resetForm}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors"
                  disabled={isSubmitting}
                >
                  ×
                </button>

                {isAdjusting && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">IA ajustando ubicación...</span>
                    </div>
                  </div>
                )}

                {selectedLocation?.adjusted && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    🤖 Ubicación ajustada por IA ({Math.round(selectedLocation.confidence * 100)}%)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Location Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación exacta del criadero *
            </label>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <div className="h-64 w-full">
                <MapContainer
                  center={[-27.3671, -55.8961]}
                  zoom={14}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationSelector
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                  />
                </MapContainer>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Haz clic en el mapa para marcar la ubicación exacta del criadero
              {selectedLocation && (
                <span className="text-green-600 font-medium">
                  {selectedLocation.adjusted ? ' | 🤖 Ajustado por IA' : ' | 📍 Marcado manualmente'}
                </span>
              )}
            </p>
          </div>

          {/* Zone Selection */}
          <div>
            <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-2">
              Zona donde se encuentra el criadero *
            </label>
            <select
              id="zone"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              disabled={isSubmitting}
              required
            >
              <option value="">Seleccionar zona de Posadas</option>
              {POSADAS_ZONES.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} - {zone.description}
                </option>
              ))}
            </select>
            {selectedZone === '99' && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Has seleccionado "Otros". Por favor marca la ubicación exacta en el mapa de arriba.
              </p>
            )}
          </div>

          {/* Street Address Section */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Dirección específica *
            </label>
            <input
              type="text"
              id="address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Ej: Av. Mitre 1234, casa con puerta azul"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Tipo de Criadero */}
          <div>
            <label htmlFor="criaderoType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de criadero
            </label>
            <select
              id="criaderoType"
              value={criaderoType}
              onChange={(e) => setCriaderoType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              disabled={isSubmitting}
            >
              <option value="">Seleccionar tipo</option>
              <option value="Balde/Recipiente">Balde o recipiente de agua</option>
              <option value="Neumático">Neumático abandonado</option>
              <option value="Maceta">Maceta o jardinera</option>
              <option value="Canaleta">Canaleta obstruida</option>
              <option value="Bebedero">Bebedero de animales</option>
              <option value="Tanque">Tanque de agua</option>
              <option value="Piscina">Piscina abandonada/sucia</option>
              <option value="Otros">Otros recipientes</option>
            </select>
          </div>

          {/* Proximidad */}
          <div>
            <label htmlFor="proximity" className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cerca de qué está ubicado?
            </label>
            <input
              type="text"
              id="proximity"
              value={proximity}
              onChange={(e) => setProximity(e.target.value)}
              placeholder="Ej: Al lado de la escuela, frente al kiosco, detrás de la casa verde"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              disabled={isSubmitting}
            />
          </div>

          {/* Información de acceso */}
          <div>
            <label htmlFor="accessInfo" className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo acceder al lugar?
            </label>
            <select
              id="accessInfo"
              value={accessInfo}
              onChange={(e) => setAccessInfo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              disabled={isSubmitting}
            >
              <option value="">Seleccionar acceso</option>
              <option value="Acceso libre">Acceso libre desde la calle</option>
              <option value="Patio privado">En patio privado - pedir permiso</option>
              <option value="Terreno baldío">En terreno baldío</option>
              <option value="Zona comercial">En zona comercial</option>
              <option value="Escuela/Institución">En escuela o institución</option>
              <option value="Difícil acceso">Difícil acceso - requiere coordinación</option>
            </select>
          </div>

          {/* Additional Description Section */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del criadero (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Balde de plástico verde lleno de agua de lluvia, neumático abandonado, etc."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none h-20"
              maxLength={200}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/200 caracteres
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedImage || !selectedZone || !streetAddress.trim() || isSubmitting || isAdjusting || (selectedZone === '99' && !selectedLocation)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg py-4"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>🏆</span>
                <span>Enviar Reporte y Sumar Puntos</span>
              </>
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-sm text-teal-700">
            <strong>💡 Instrucciones:</strong><br/>
            1. Sube una foto clara del criadero<br/>
            2. Selecciona la zona o marca "Otros" para ubicación personalizada<br/>
            3. Haz clic en el mapa para marcar la ubicación exacta<br/>
            4. La IA ajustará automáticamente la ubicación para máxima precisión
          </p>
        </div>
      </div>

      <InfoModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </>
  );
};

// MapComponent
const MapComponent = ({ reports }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';

    const date = new Date(timestamp);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Mapa de Reportes en Tiempo Real
      </h2>

      <div className="h-[600px] w-full rounded-lg overflow-hidden border-2 border-gray-300">
        <MapContainer
          center={[-27.3671, -55.8961]} // Posadas, Misiones coordinates
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={aedesIcon}
            >
              <Popup maxWidth={250}>
                <div className="text-center">
                  <img
                    src={report.photo_url}
                    alt="Reporte de criadero"
                    className="w-full h-32 object-cover rounded mb-2"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im04MCA2NGMwLTguODM3IDcuMTYzLTE2IDE2LTE2czE2IDcuMTYzIDE2IDE2LTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2em0zMi00djE2aDEydjRoLTQ0di00aDEydi0xNmg0djEyaDEydi04aDR6IiBmaWxsPSIjOWNhM2FmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iOTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />

                  {report.description && (
                    <p className="text-sm text-gray-700 mb-2">
                      {report.description}
                    </p>
                  )}

                  <p className="text-xs text-gray-500">
                    📅 {formatDate(report.created_at)}
                  </p>

                  <div className="mt-2 p-2 bg-orange-100 rounded text-xs text-orange-800">
                    <strong>⚠️ Zona de Alerta</strong>
                    <br />
                    Posible criadero de Aedes aegypti
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Reports Counter */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 flex justify-between items-center text-sm text-gray-700">
        <span className="flex items-center space-x-2">
          <span>📍</span>
          <span><strong>{reports.length}</strong> reportes activos</span>
        </span>
        <span className="flex items-center space-x-2">
          <span>🏆</span>
          <span><strong>{reports.length * 10}</strong> puntos generados por la comunidad</span>
        </span>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial reports from Supabase
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setReports(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Error al cargar los reportes. Verifica que la tabla "reports" esté creada en Supabase.');
        setLoading(false);
      }
    };

    fetchReports();

    // Set up real-time subscription for new reports
    const channel = supabase
      .channel('public:reports')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('New report received:', payload.new);
          setReports(currentReports => [payload.new, ...currentReports]);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleReportSubmitted = () => {
    // The real-time subscription will automatically update the reports
    console.log('Report submitted successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-700 font-medium">Cargando Vigilantes del Aedes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6 p-4 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg">
          <p className="font-medium">
            📍 <strong>Sistema de Ubicación Precisa</strong>
          </p>
          <p className="text-sm mt-1">
            Selecciona la zona exacta de Posadas donde se encuentra el criadero.
            Los equipos de control recibirán la ubicación precisa para una respuesta rápida y efectiva.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <p className="font-medium">⚠️ {error}</p>
            <p className="text-sm mt-1">
              Asegúrate de haber ejecutado el script setup_supabase.sql en tu proyecto Supabase.
              <br />
              Tabla requerida: 'reports' con columnas: id, created_at, description, photo_url, latitude, longitude
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Report Form Column */}
          <div className="xl:col-span-1">
            <ReportForm onReportSubmitted={handleReportSubmitted} />
          </div>

          {/* Map Column */}
          <div className="xl:col-span-2">
            <MapComponent reports={reports} />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
            <div className="text-3xl text-blue-600 mb-2">🖥️</div>
            <h3 className="text-lg font-semibold text-gray-800">
              Aplicación Web
            </h3>
            <p className="text-sm text-gray-600">
              Accesible desde cualquier navegador web moderno
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
            <div className="text-3xl text-orange-500 mb-2">⚡</div>
            <h3 className="text-lg font-semibold text-gray-800">Tiempo Real</h3>
            <p className="text-sm text-gray-600">
              Los reportes aparecen instantáneamente en el mapa
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
            <div className="text-3xl text-green-500 mb-2">📍</div>
            <h3 className="text-lg font-semibold text-gray-800">
              Ubicación Precisa
            </h3>
            <p className="text-sm text-gray-600">
              Selección manual de zona para máxima precisión
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100">
            <div className="text-3xl text-purple-500 mb-2">📊</div>
            <h3 className="text-lg font-semibold text-gray-800">
              Supabase Backend
            </h3>
            <p className="text-sm text-gray-600">
              Base de datos en tiempo real y almacenamiento seguro
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Sistema de Vigilancia Epidemiológica Preciso
            </h3>
            <p className="text-sm text-gray-600">
              Aplicación web para el control y prevención del Aedes aegypti
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Vigilantes del Aedes © 2024 | Protegiendo Posadas del dengue, zika y chikungunya
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Desarrollado con Supabase para la salud pública de Misiones, Argentina
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
