# 📁 Estructura de Estilos CSS

Esta carpeta contiene todos los archivos CSS organizados por componente y funcionalidad.

## 📋 Archivos y su propósito:

### Archivos Base
- **variables.css** - Variables CSS globales (colores, sombras, bordes)
- **base.css** - Estilos base y utilidades generales

### Componentes
- **header.css** - Estilos del header/navbar
- **footer.css** - Estilos del footer
- **landing.css** - Estilos de la página de inicio
- **contacto.css** - Estilos de la página de contacto
- **productos.css** - Estilos de productos y experiencias
- **detalles.css** - Estilos de la página de detalles del destino
- **pagos.css** - Estilos de la página de pagos
- **cart.css** - Estilos del carrito de compras

## 🔧 Cómo usar:

Cada componente debe importar solo los archivos CSS que necesita:

```jsx
// Ejemplo en un componente:
import '../styles/header.css';
```

En App.jsx solo se importan los archivos base:

```jsx
import './styles/variables.css';
import './styles/base.css';
```

