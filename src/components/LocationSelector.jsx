// LocationSelector component - Client-side map interaction component
import React from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';

const LocationSelector = ({ onLocationSelect, selectedLocation }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });

  return selectedLocation ? (
    <Marker
      position={[selectedLocation.latitude, selectedLocation.longitude]}
      icon={
        new Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      }
    >
      <Popup>
        📍 Ubicación seleccionada
        <br />
        Lat: {selectedLocation.latitude.toFixed(6)}
        <br />
        Lng: {selectedLocation.longitude.toFixed(6)}
      </Popup>
    </Marker>
  ) : null;
};

export default LocationSelector;