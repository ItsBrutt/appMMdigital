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
- `npm run format:check` - Verifica formato (para CI/CD)

### Deployment

- `npm run deploy:prep` - Prepara proyecto para deployment (test + build)

## 🏗️ Estructura del Proyecto

```
appMMdigital/
├── css/
│   └── style.css          # Estilos principales
├── js/
│   └── main.js            # JavaScript principal
├── docs/
│   └── CSS_ARCHITECTURE.md # Guía de arquitectura CSS
├── dist/                  # Build de producción (generado)
├── index.html             # Página principal
├── demo.html              # Demo del Pre-Plan
├── package.json           # Configuración del proyecto
├── eslint.config.js       # Configuración ESLint (flat config)
├── .prettierrc            # Configuración Prettier
├── .stylelintrc.json      # Configuración Stylelint
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

- **HTML5** semántico con landmarks (nav, main, footer)
- **CSS3** con Glassmorphism y CSS Variables
- **JavaScript** Vanilla (ES6+)
- **Node.js** para tooling de desarrollo
- **ESLint 9+** (flat config) para calidad de código
- **Prettier** para formateo consistente
- **Stylelint** para CSS limpio

## 🎨 Arquitectura CSS

El proyecto usa un enfoque híbrido:

- **CSS Variables** para design tokens
- **Utility classes** para patrones comunes
- **BEM methodology** para nuevos componentes

Ver [docs/CSS_ARCHITECTURE.md](docs/CSS_ARCHITECTURE.md) para guía completa.

## 📝 Convenciones de Código

### HTML

- Usar elementos semánticos (nav, main, article, section)
- Un único `<h1>` por página
- Jerarquía lógica de encabezados (h1 > h2 > h3)
- Atributos ARIA para accesibilidad

### CSS

- Indentación: 4 espacios
- Usar CSS Variables para valores reutilizables
- BEM para nuevos componentes (`.block__element--modifier`)
- Mobile-first responsive design

### JavaScript

- Indentación: 4 espacios
- Comillas simples
- Semicolons obligatorios
- `const` por defecto, `let` cuando sea necesario
- Arrow functions para callbacks
- Naming: camelCase

## ♿ Accesibilidad

- Navegación por teclado completa
- Skip-to-content link
- ARIA labels y landmarks
- Contraste de color WCAG AA
- Texto alternativo para imágenes

## 🚢 Deployment

1. Ejecutar tests: `npm test`
2. Construir producción: `npm run build`
3. Archivos optimizados estarán en `/dist`
4. Subir contenido de `/dist` al servidor

## 📄 Licencia

ISC © MM Digital

## 🤝 Contribución

Para contribuir al proyecto:

1. Seguir las convenciones de código
2. Ejecutar `npm test` antes de commit
3. Usar `npm run format` para formatear código
4. Consultar `docs/CSS_ARCHITECTURE.md` para CSS
