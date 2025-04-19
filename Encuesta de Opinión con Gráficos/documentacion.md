# Documentación: Sistema de Encuesta de Opinión con Gráficos

## Introducción

Este sistema es una aplicación web de encuestas de opinión que permite recopilar datos de usuarios y mostrar los resultados utilizando gráficos interactivos. La aplicación está construida utilizando el stack MEAN:

- **MongoDB**: Base de datos NoSQL para almacenar las encuestas y respuestas
- **Express.js**: Framework de servidor para manejar las peticiones HTTP
- **Angular**: Framework frontend para la interfaz de usuario
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor

## Arquitectura del Sistema

El proyecto sigue una arquitectura cliente-servidor con separación clara entre el frontend y el backend:

### Backend (Node.js + Express + MongoDB)

- **server.js**: Punto de entrada de la aplicación que configura el servidor Express
- **config/db.js**: Gestiona la conexión a la base de datos MongoDB
- **routes/**: Define las rutas API para las encuestas
- **controllers/**: Contiene la lógica de negocio para manejar encuestas
- **models/**: Define los esquemas de datos para MongoDB

### Frontend (Angular)

- **src/app/components/**: Componentes de la interfaz de usuario
  - **survey-form/**: Formulario para recopilar datos de encuesta
  - **survey-results/**: Visualización de resultados con gráficos
- **src/app/services/**: Servicios para comunicación con la API
- **src/app/models/**: Interfaces y clases para los tipos de datos

## Flujo de Trabajo

1. El usuario completa un formulario de encuesta en la interfaz de Angular
2. Los datos se envían al backend a través de un servicio Angular
3. El backend procesa y almacena la información en MongoDB
4. La página de resultados recupera los datos acumulados del backend
5. Los resultados se visualizan usando Chart.js para crear gráficos interactivos

## Base de Datos

La aplicación utiliza MongoDB como base de datos NoSQL. La conexión está configurada para usar MongoDB Atlas, un servicio en la nube, aunque también puede configurarse para usar MongoDB local.

```javascript
// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://[credenciales]';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Componentes Principales

### API Backend

El backend proporciona endpoints RESTful para:
- Crear nuevas encuestas
- Enviar respuestas a encuestas
- Obtener resultados agregados

### Componente de Resultados (Frontend)

El componente `SurveyResultsComponent` es responsable de mostrar visualmente los resultados de las encuestas usando gráficos circulares.

```typescript
// frontend/src/app/components/survey-results/survey-results.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { Chart, registerables, ChartTypeRegistry } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-survey-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './survey-results.component.html',
  styleUrls: ['./survey-results.component.css']
})
export class SurveyResultsComponent implements OnInit {
  results: any = {};
  isLoading = true;
  charts: Chart<keyof ChartTypeRegistry, number[], unknown>[] = [];

  constructor(private surveyService: SurveyService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  // Carga los resultados desde el servicio
  loadResults(): void {
    this.surveyService.getResults().subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
        setTimeout(() => {
          this.createCharts();
        }, 0);
      },
      error: (error) => {
        console.error('Error loading results:', error);
        this.isLoading = false;
      }
    });
  }

  // Crea gráficos interactivos para cada pregunta
  createCharts(): void {
    // Limpia gráficos existentes
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    // Crea un gráfico para cada pregunta
    Object.keys(this.results).forEach((question, index) => {
      const canvasId = `chart-${index}`;
      const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!ctx) return;

      const questionData = this.results[question];
      const labels = Object.keys(questionData);
      const data = Object.values(questionData) as number[];

      // Genera colores aleatorios para el gráfico
      const backgroundColors = this.generateColors(labels.length);

      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: this.truncateText(question, 60),
              font: {
                size: 16
              }
            }
          }
        }
      });

      this.charts.push(chart as Chart<keyof ChartTypeRegistry, number[], unknown>);
    });
  }

  // Función auxiliar para generar colores
  generateColors(count: number): string[] {
    const colors = [];
    const baseColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(83, 102, 255, 0.7)',
      'rgba(40, 159, 64, 0.7)',
      'rgba(210, 199, 199, 0.7)'
    ];

    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }

    return colors;
  }

  // Función auxiliar para truncar texto largo
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
```

El componente utiliza Chart.js para renderizar gráficos circulares para cada pregunta de la encuesta, mostrando la distribución de respuestas.

## Estilo y Diseño

La aplicación utiliza CSS moderno para crear una interfaz atractiva y responsive:

```css
/* frontend/src/app/components/survey-results/survey-results.component.css */
.results-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 2rem;
}

.chart-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

/* Diseño responsive */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .results-container {
    padding: 1rem;
  }
}
```

## Configuración del Entorno

La aplicación utiliza variables de entorno para configurar aspectos como la conexión a la base de datos:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://[usuario]:[contraseña]@[cluster].mongodb.net/...
```

## Seguridad

- Las credenciales de la base de datos se almacenan en variables de entorno
- El archivo `.env` está incluido en `.gitignore` para evitar exponer información sensible
- La conexión a MongoDB Atlas utiliza autenticación segura

## Conclusión

Este sistema proporciona una plataforma completa para crear encuestas, recopilar respuestas y visualizar resultados. La arquitectura MEAN permite una solución escalable y moderna, mientras que Chart.js ofrece visualizaciones atractivas para una mejor comprensión de los datos recopilados.

La separación clara entre frontend y backend facilita el mantenimiento y la extensión del sistema para añadir nuevas funcionalidades en el futuro. 