// ReportForm component - Client-side form component
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationSelector from './LocationSelector';
import InfoModal from './InfoModal';
import { POSADAS_ZONES, POSADAS_COORDS } from '../constants/zones';
import { uploadImageToStorage, createReport, getCriticalityWeight } from '../server-actions/reports';
import { adjustLocationWithAI } from '../server-actions/ai';

const ReportForm = ({ onReportSubmitted }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [criaderoType, setCriaderoType] = useState("");
  const [proximity, setProximity] = useState("");
  const [accessInfo, setAccessInfo] = useState("");
  const [criticality, setCriticality] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const fileInputRef = useRef(null);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setModal({
          isOpen: true,
          type: "error",
          title: "Archivo muy grande",
          message:
            "La imagen debe pesar menos de 10MB. Por favor, selecciona una imagen más pequeña.",
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
      if (selectedLocation) {
        await handleAILocationAdjustment(file);
      }
    }
  };

  const handleAILocationAdjustment = async (file) => {
    if (!selectedLocation) return;

    setIsAdjusting(true);
    try {
      const adjustedLocation = await adjustLocationWithAI(file, selectedLocation);
      setSelectedLocation(adjustedLocation);
    } catch (error) {
      console.error('Error adjusting location:', error);
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation({
      ...location,
      adjusted: false,
    });
  };

  const getSelectedZoneCoordinates = () => {
    if (selectedLocation) return selectedLocation;
    if (!selectedZone) return POSADAS_COORDS;

    const zone = POSADAS_ZONES.find((z) => z.id === parseInt(selectedZone));
    return zone ? { latitude: zone.lat, longitude: zone.lng } : POSADAS_COORDS;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedImage) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Foto requerida",
        message: "Por favor, selecciona una imagen antes de enviar el reporte.",
      });
      return;
    }

    if (!selectedZone) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Zona requerida",
        message: "Por favor, selecciona la zona donde se encuentra el criadero.",
      });
      return;
    }

    if (!streetAddress.trim()) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Dirección requerida",
        message: "Por favor, ingresa la dirección específica donde se encuentra el criadero.",
      });
      return;
    }

    if (!criticality) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Criticidad requerida",
        message: "Por favor, selecciona el nivel de criticidad del criadero según tu evaluación.",
      });
      return;
    }

    if (selectedZone === "99" && !selectedLocation) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Ubicación en el mapa requerida",
        message: 'Como seleccionaste "Otros", por favor marca la ubicación exacta en el mapa haciendo clic donde se encuentra el criadero.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image
      const photoUrl = await uploadImageToStorage(selectedImage);

      // Get coordinates and zone data
      const location = getSelectedZoneCoordinates();
      const selectedZoneData = POSADAS_ZONES.find(
        (z) => z.id === parseInt(selectedZone),
      );

      // Build comprehensive description
      let fullDescription = `${streetAddress.trim()} - ${selectedZoneData.name}`;
      if (criaderoType) fullDescription += ` | Tipo: ${criaderoType}`;
      if (proximity) fullDescription += ` | Cerca de: ${proximity}`;
      if (accessInfo) fullDescription += ` | Acceso: ${accessInfo}`;
      if (description.trim()) fullDescription += ` | Obs: ${description.trim()}`;
      if (location.adjusted) {
        fullDescription += ` | Ubicación ajustada por IA (${Math.round(location.confidence * 100)}% confianza)`;
      }

      // Create report
      const reportData = {
        description: fullDescription,
        photo_url: photoUrl,
        latitude: location.latitude,
        longitude: location.longitude,
        initial_criticality: criticality,
        criticality_weight: getCriticalityWeight(criticality),
      };

      await createReport(reportData);

      // Show success modal
      setModal({
        isOpen: true,
        type: "success",
        title: "¡Reporte enviado!",
        message: `¡Excelente! Tu reporte en ${selectedZoneData.name} ha sido enviado correctamente. Los equipos de control sabrán exactamente dónde ir. Has sumado 10 puntos por proteger Posadas del Aedes aegypti.`,
      });

      // Reset form
      resetForm();

      // Notify parent component
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Error al enviar",
        message: error.message || "Ocurrió un error al enviar tu reporte. Por favor, verifica tu conexión e inténtalo nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription("");
    setSelectedZone("");
    setStreetAddress("");
    setSelectedLocation(null);
    setCriaderoType("");
    setProximity("");
    setAccessInfo("");
    setCriticality("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
              className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              style={{
                background: isAdjusting ? '#64748B' : 'linear-gradient(135deg, #E6007E 0%, #c4006c 100%)',
                boxShadow: '0 4px 15px rgba(230, 0, 126, 0.3)'
              }}
              disabled={isSubmitting || isAdjusting}
            >
              <span className="text-2xl">📸</span>
              <span>
                {isAdjusting
                  ? "Ajustando ubicación con IA..."
                  : "Tomar o Subir Foto"}
              </span>
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
                    🤖 Ubicación ajustada por IA (
                    {Math.round(selectedLocation.confidence * 100)}%)
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
                  {selectedLocation.adjusted
                    ? " | 🤖 Ajustado por IA"
                    : " | 📍 Marcado manualmente"}
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
              {POSADAS_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} - {zone.description}
                </option>
              ))}
            </select>
            {selectedZone === "99" && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Has seleccionado "Otros". Por favor marca la ubicación exacta en el mapa de arriba.
              </p>
            )}
          </div>

          {/* Street Address */}
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

          {/* Criticidad */}
          <div>
            <label htmlFor="criticality" className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de criticidad del criadero *
            </label>
            <select
              id="criticality"
              value={criticality}
              onChange={(e) => setCriticality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
              disabled={isSubmitting}
              required
            >
              <option value="">Seleccionar nivel de criticidad</option>
              <option value="BAJA">🟢 BAJA - Criadero pequeño o controlable</option>
              <option value="MEDIA">🟡 MEDIA - Criadero de tamaño medio</option>
              <option value="ALTA">🟠 ALTA - Criadero grande o múltiple</option>
              <option value="CRITICA">🔴 CRÍTICA - Situación de emergencia</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Evalúa el nivel de riesgo según el tamaño del criadero, cantidad de agua, accesibilidad para mosquitos, etc.
            </p>
          </div>

          {/* Additional Description */}
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
            disabled={isSubmitting || isAdjusting}
            className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isSubmitting ? '#64748B' : 'linear-gradient(135deg, #00A859 0%, #007A3D 100%)',
              boxShadow: '0 4px 15px rgba(0, 168, 89, 0.3)'
            }}
          >
            {isSubmitting ? "Enviando reporte..." : "📤 Enviar Reporte"}
          </button>
        </form>
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

export default ReportForm;