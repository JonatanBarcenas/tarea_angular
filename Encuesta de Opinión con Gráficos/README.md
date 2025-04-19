# Encuesta de Opinión con Gráficos

Una aplicación completa que permite a los usuarios responder una encuesta y visualizar los resultados en gráficos.

## Tecnologías Utilizadas

### Backend
- Node.js
- Express
- MongoDB

### Frontend
- Angular 19
- Chart.js para visualización de datos

## Estructura del Proyecto

```
.
├── backend/
│   ├── models/         # Modelos de MongoDB
│   ├── routes/         # Rutas de la API
│   ├── server.js       # Punto de entrada del servidor
│   └── frontend/       # Aplicación Angular (frontend)
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/
│       │   │   │   ├── survey-form/      # Componente del formulario
│       │   │   │   └── survey-results/   # Componente de resultados
│       │   │   └── services/             # Servicios
│       │   └── ...
│       └── ...
└── package.json        # Dependencias del backend
```

## Requisitos Previos

- Node.js (v18 o superior)
- MongoDB instalado y en ejecución
- Angular CLI instalado globalmente

## Instalación

1. Clona el repositorio:
```
git clone <url-del-repositorio>
cd encuesta-opinion-graficos
```

2. Instala las dependencias del backend:
```
npm install
```

3. Instala las dependencias del frontend:
```
cd backend/frontend
npm install
```

## Ejecución

1. Inicia MongoDB:
```
mongod
```

2. Inicia el servidor backend (desde la raíz del proyecto):
```
npm start
```

3. Inicia el frontend (desde la carpeta backend/frontend):
```
ng serve
```

4. Abre tu navegador y accede a `http://localhost:4200`

## Uso de la Aplicación

1. Accede a la página principal para completar la encuesta
2. Responde todas las preguntas y haz clic en "Enviar Respuestas"
3. Serás redirigido a la página de resultados donde podrás ver gráficos con las estadísticas

## Capturas de Pantalla

[Incluir capturas de pantalla aquí]

## Licencia

[Tipo de licencia]

## Contacto

[Tu información de contacto] 