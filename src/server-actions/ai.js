// Server actions for AI operations
import { genAI, GEMINI_MODEL, isGeminiAvailable } from '../lib/gemini.js';

/**
 * Adjust location coordinates using AI image analysis
 * @param {File} imageFile - Image file to analyze
 * @param {Object} currentLocation - Current location coordinates
 * @returns {Promise<Object>} - Adjusted location with confidence
 */
export const adjustLocationWithAI = async (imageFile, currentLocation) => {
  if (!genAI || !currentLocation || !isGeminiAvailable) {
    console.warn('Gemini AI not available. Returning original location.');
    return currentLocation;
  }

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Convert image to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const prompt = `
      Analiza esta imagen de un posible criadero de Aedes aegypti en Posadas, Misiones.

      El usuario marcó esta ubicación en el mapa:
      Latitud: ${currentLocation.latitude}
      Longitud: ${currentLocation.longitude}

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
          mimeType: imageFile.type,
        },
      },
    ]);

    const response = await result.response;
    
    try {
      const adjustedLocation = JSON.parse(response.text().trim());
      
      if (adjustedLocation.latitude && adjustedLocation.longitude) {
        return {
          latitude: adjustedLocation.latitude,
          longitude: adjustedLocation.longitude,
          adjusted: true,
          confidence: adjustedLocation.confidence || 0.8,
        };
      }
    } catch (parseError) {
      console.log('Could not parse AI response, keeping original location');
    }

    return currentLocation;
  } catch (error) {
    console.error('Error adjusting location with AI:', error);
    return currentLocation;
  }
};

/**
 * Analyze image to extract breeding site information
 * @param {File} imageFile - Image file to analyze
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeBreedingSite = async (imageFile) => {
  if (!genAI || !isGeminiAvailable) {
    console.warn('Gemini AI not available. Skipping image analysis.');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const prompt = `
      Analiza esta imagen de un posible criadero de Aedes aegypti.
      
      Identifica:
      1. Tipo de recipiente (balde, neumático, maceta, etc.)
      2. Nivel de criticidad (BAJA, MEDIA, ALTA, CRITICA)
      3. Descripción del contenido
      4. Recomendaciones de eliminación
      
      Responde en formato JSON:
      {
        "type": "tipo_de_recipiente",
        "criticality": "NIVEL",
        "description": "descripción_detallada",
        "recommendations": "recomendaciones_de_eliminación"
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: imageFile.type,
        },
      },
    ]);

    const response = await result.response;
    
    try {
      return JSON.parse(response.text().trim());
    } catch (parseError) {
      console.log('Could not parse AI analysis response');
      return null;
    }
  } catch (error) {
    console.error('Error analyzing breeding site:', error);
    return null;
  }
};