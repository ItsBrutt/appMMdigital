# MM Digital - Plataforma de Transformación Digital

Proyecto web profesional para MM Digital, enfocado en guiar a clientes a través de su viaje de identidad digital.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El sitio se abrirá automáticamente en `http://localhost:3000`

## 📦 Scripts Disponibles

### Desarrollo
- `npm run dev` - Inicia servidor de desarrollo con live-reload
- `npm run serve:dist` - Sirve la versión de producción desde /dist

### Build & Optimización
- `npm run build` - Construye versión optimizada para producción
- `npm run minify:css` - Minifica archivos CSS
- `npm run minify:js` - Minifica archivos JavaScript

### Calidad de Código
- `npm test` - Ejecuta todos los tests de linting y validación
- `npm run lint:css` - Verifica CSS con Stylelint
- `npm run lint:js` - Verifica JavaScript con ESLint
- `npm run validate:html` - Valida estructura HTML
- `npm run format` - Formatea código con Prettier

### Deployment
- `npm run deploy:prep` - Prepara proyecto para deployment (test + build)

## 🏗️ Estructura del Proyecto

```
appMMdigital/
├── css/
│   └── style.css          # Estilos principales
├── js/
│   └── main.js            # JavaScript principal
├── dist/                  # Build de producción (generado)
├── index.html             # Página principal
├── demo.html              # Demo del Pre-Plan
├── package.json           # Configuración del proyecto
└── README.md              # Este archivo
```

## 🎯 Filosofía del Proyecto

MM Digital se enfoca en ser el **puente** en la transformación digital de sus clientes, construyendo **identidades digitales** sólidas como cimiento de toda presencia online.

### Etapas del Viaje Digital
1. **Semilla (Intención)** - Validación de ideas
2. **Identidad (Claridad)** - Definición de marca
3. **Pyme (Estructura)** - Escalabilidad
4. **Imperio (Legado)** - Ecosistema completo

## 🛠️ Tecnologías

- HTML5 semántico
- CSS3 con Glassmorphism
- JavaScript Vanilla (ES6+)
- Node.js para tooling
- Live Server para desarrollo
- Prettier, ESLint, Stylelint para calidad

## 📝 Convenciones de Código

- Indentación: 4 espacios
- Comillas: simples para JS, dobles para HTML
- Semicolons: obligatorios en JS
- Naming: kebab-case para CSS, camelCase para JS

## 🚢 Deployment

1. Ejecutar tests: `npm test`
2. Construir producción: `npm run build`
3. Archivos optimizados estarán en `/dist`
4. Subir contenido de `/dist` al servidor

## 📄 Licencia

ISC © MM Digital
