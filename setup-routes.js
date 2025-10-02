#!/usr/bin/env node

/**
 * Setup script for Vigilantes del Aedes routing configuration
 * This script helps configure the development and production routing
 */

const fs = require('fs');
const path = require('path');

console.log('🦟 Configurando rutas para Vigilantes del Aedes...\n');

// Create _redirects file for Netlify
const netlifyRedirects = `# Netlify redirects for Vigilantes del Aedes
/  /landing/index.html  200
/landing  /landing/index.html  200
/app  /index.html  200
/reportar  /index.html  200
/*  /index.html  200
`;

// Write _redirects file
fs.writeFileSync(path.join(__dirname, 'public', '_redirects'), netlifyRedirects);
console.log('✅ Archivo _redirects creado para Netlify');

// Create vercel.json configuration
const vercelConfig = {
  "rewrites": [
    {
      "source": "/",
      "destination": "/landing/index.html"
    },
    {
      "source": "/landing",
      "destination": "/landing/index.html"
    },
    {
      "source": "/app",
      "destination": "/index.html"
    },
    {
      "source": "/reportar", 
      "destination": "/index.html"
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|ico|svg))",
      "dest": "/$1"
    }
  ]
};

fs.writeFileSync(path.join(__dirname, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
console.log('✅ Archivo vercel.json configurado');

console.log('\n🎯 Configuración de rutas completada:');
console.log('   📊 Página principal: / → Landing page');
console.log('   🐛 Reportar criadero: /app → React app');
console.log('   🔄 Alias: /reportar → React app');
console.log('\n🚀 Para desarrollo local:');
console.log('   npm start → Inicia React app en localhost:3000');
console.log('   Landing page: localhost:3000/landing/');
console.log('\n📦 Para producción:');
console.log('   npm run build → Genera build optimizado');
console.log('   vercel --prod → Deploy a Vercel');
console.log('   netlify deploy --prod → Deploy a Netlify');

console.log('\n✨ ¡Listo para proteger Posadas del Aedes aegypti!');