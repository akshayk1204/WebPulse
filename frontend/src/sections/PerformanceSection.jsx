import React from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';
import Gauge from '../components/Gauge';
import SectionHeader from '../components/SectionHeader';
import {
  FaBolt,
  FaMousePointer,
  FaPaintBrush,
  FaDatabase,
  FaNetworkWired,
  FaTachometerAlt,
} from 'react-icons/fa';

// Translation dictionaries
const translations = {
  en: {
    performance: "Performance",
    tagline: "Speed shapes success—a faster site drives higher rankings, happier visitors, more conversions, and bigger revenue.",
    loading: "Loading performance data...",
    testResults: "Test results from",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    metrics: {
      performanceScore: {
        label: "Performance Score",
        message: {
          excellent: "Excellent performance!",
          good: "Good performance",
          needsImprovement: "Needs improvement",
          poor: "Poor performance - needs optimization"
        },
        explanation: "Overall speed score—how quickly and smoothly your site loads and responds. A key factor for user experience."
      },
      firstContentfulPaint: {
        label: "First Contentful Paint (s)",
        message: {
          fast: "Almost instant!",
          moderate: "Looking good!",
          slow: "It's taking a bit too long!"
        },
        explanation: "Measures how fast your content starts to appear. Faster FCP means users see something sooner."
      },
      speedIndex: {
        label: "Speed Index (s)",
        message: {
          fast: "Smooth and fast!",
          moderate: "Slight delay",
          slow: "Feels sluggish, speed it up!"
        },
        explanation: "Shows how quickly your visible content loads. A lower number = faster loading experience."
      },
      timeToInteractive: {
        label: "Time to Interactive (s)",
        message: {
          fast: "You're interactive fast!",
          moderate: "Almost there!",
          slow: "Slow down, it's taking a while!"
        },
        explanation: "Tells how soon users can click, scroll, or type. Slow TTI makes a site feel frozen or laggy."
      },
      pageSize: {
        label: "Page Size (MB)",
        message: {
          small: "You're cruising with a light load!",
          moderate: "Could be lighter!",
          large: "Time to trim some weight!"
        },
        explanation: "Total weight of your page. Smaller size = faster load time and lower data use, especially on mobile."
      },
      requests: {
        label: "Requests",
        message: {
          few: "Nice and tidy calls!",
          moderate: "Moderate, but could be better",
          many: "Way too many requests, slow down!"
        },
        explanation: "Number of individual files (images, scripts, etc.) the browser needs to load. Fewer requests = faster site."
      }
    }
  },
  es: {
    performance: "Rendimiento",
    tagline: "La velocidad moldea el éxito: un sitio más rápido genera mejores clasificaciones, visitantes más felices, más conversiones y mayores ingresos.",
    loading: "Cargando datos de rendimiento...",
    testResults: "Resultados de prueba de",
    excellent: "Excelente",
    good: "Bueno",
    fair: "Regular",
    poor: "Pobre",
    metrics: {
      performanceScore: {
        label: "Puntuación de Rendimiento",
        message: {
          excellent: "¡Rendimiento excelente!",
          good: "Buen rendimiento",
          needsImprovement: "Necesita mejoras",
          poor: "Rendimiento pobre - necesita optimización"
        },
        explanation: "Puntuación general de velocidad: qué tan rápido y fluido carga y responde su sitio. Un factor clave para la experiencia del usuario."
      },
      firstContentfulPaint: {
        label: "Primera Pintura con Contenido (s)",
        message: {
          fast: "¡Casi instantáneo!",
          moderate: "¡Se ve bien!",
          slow: "¡Está tardando un poco demasiado!"
        },
        explanation: "Mide qué tan rápido comienza a aparecer su contenido. Un FCP más rápido significa que los usuarios ven algo antes."
      },
      speedIndex: {
        label: "Índice de Velocidad (s)",
        message: {
          fast: "¡Suave y rápido!",
          moderate: "Ligero retraso",
          slow: "¡Se siente lento, aceléralo!"
        },
        explanation: "Muestra qué tan rápido carga su contenido visible. Un número más bajo = experiencia de carga más rápida."
      },
      timeToInteractive: {
        label: "Tiempo hasta Interactividad (s)",
        message: {
          fast: "¡Eres interactivo rápidamente!",
          moderate: "¡Casi listo!",
          slow: "¡Despacio, está tardando un poco!"
        },
        explanation: "Indica qué tan pronto los usuarios pueden hacer clic, desplazarse o escribir. Un TTI lento hace que un sitio se sienta congelado o lento."
      },
      pageSize: {
        label: "Tamaño de Página (MB)",
        message: {
          small: "¡Estás navegando con una carga ligera!",
          moderate: "¡Podría ser más ligero!",
          large: "¡Es hora de recortar algo de peso!"
        },
        explanation: "Peso total de su página. Tamaño más pequeño = tiempo de carga más rápido y menor uso de datos, especialmente en móviles."
      },
      requests: {
        label: "Solicitudes",
        message: {
          few: "¡Llamadas ordenadas y limpias!",
          moderate: "Moderado, pero podría ser mejor",
          many: "¡Demasiadas solicitudes, disminuye la velocidad!"
        },
        explanation: "Número de archivos individuales (imágenes, scripts, etc.) que el navegador necesita cargar. Menos solicitudes = sitio más rápido."
      }
    }
  }
};

const normalizeScore = (label, value) => {
  if (value === undefined || value === null || isNaN(value)) return 50;

  switch (label) {
    case 'Page Size (MB)':
    case 'Tamaño de Página (MB)':
      if (value <= 2) return 100;
      if (value <= 3.5) return 60;
      return 30;

    case 'Requests':
    case 'Solicitudes':
      if (value <= 50) return 100;
      if (value <= 90) return 60;
      return 30;

    case 'Performance Score':
    case 'Puntuación de Rendimiento':
      return Math.min(100, Math.max(0, value));

    case 'First Contentful Paint (s)':
    case 'Primera Pintura con Contenido (s)':
    case 'Speed Index (s)':
    case 'Índice de Velocidad (s)':
    case 'Time to Interactive (s)':
    case 'Tiempo hasta Interactividad (s)':
      if (value <= 2) return 100;
      if (value <= 4) return 60;
      return 30;

    default:
      return 50;
  }
};

const getGaugeColor = (score) => {
  if (score >= 80) return '#4caf50';
  if (score >= 41) return '#ff9800';
  return '#f44336';
};

const getSeverityBadge = (score, language) => {
  const t = translations[language];
  if (score >= 85) return { label: t.excellent, color: '#4caf50' };
  if (score >= 70) return { label: t.good, color: '#8bc34a' };
  if (score >= 50) return { label: t.fair, color: '#ff9800' };  
  return { label: t.poor, color: '#f44336' };
};

const PerformanceSection = ({ data, language = 'en' }) => {
  const t = translations[language];

  if (!data) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>{t.loading}</Typography>
      </Box>
    );
  }

  if (data.error) {
    return (
      <Alert severity="error" sx={{ my: 3 }}>
        {data.error}
        {data.details && ` (${JSON.stringify(data.details)})`}
      </Alert>
    );
  }

  const metricData = [
    {
      label: t.metrics.performanceScore.label,
      value: data.performanceScore,
      display: `${data.performanceScore}/100`,
      icon: <FaBolt size={28} />,
      messageLine: data.performanceScore >= 90 
        ? t.metrics.performanceScore.message.excellent
        : data.performanceScore >= 75 
          ? t.metrics.performanceScore.message.good
          : data.performanceScore >= 50 
            ? t.metrics.performanceScore.message.needsImprovement
            : t.metrics.performanceScore.message.poor,
      explanation: t.metrics.performanceScore.explanation,
    },
    {
      label: t.metrics.firstContentfulPaint.label,
      value: data.firstContentfulPaint,
      display: `${data.firstContentfulPaint}s`,
      icon: <FaPaintBrush size={28} />,
      messageLine: data.firstContentfulPaint < 2 
        ? t.metrics.firstContentfulPaint.message.fast
        : data.firstContentfulPaint < 3.5 
          ? t.metrics.firstContentfulPaint.message.moderate
          : t.metrics.firstContentfulPaint.message.slow,
      explanation: t.metrics.firstContentfulPaint.explanation,
    },
    {
      label: t.metrics.speedIndex.label,
      value: data.speedIndex,
      display: `${data.speedIndex}s`,
      icon: <FaTachometerAlt size={28} />,
      messageLine: data.speedIndex < 3 
        ? t.metrics.speedIndex.message.fast
        : data.speedIndex < 5 
          ? t.metrics.speedIndex.message.moderate
          : t.metrics.speedIndex.message.slow,
      explanation: t.metrics.speedIndex.explanation,
    },
    {
      label: t.metrics.timeToInteractive.label,
      value: data.timeToInteractive,
      display: `${data.timeToInteractive}s`,
      icon: <FaMousePointer size={28} />,
      messageLine: data.timeToInteractive < 2.5 
        ? t.metrics.timeToInteractive.message.fast
        : data.timeToInteractive < 4 
          ? t.metrics.timeToInteractive.message.moderate
          : t.metrics.timeToInteractive.message.slow,
      explanation: t.metrics.timeToInteractive.explanation,
    },
    {
      label: t.metrics.pageSize.label,
      value: data.pageSize,
      display: `${data.pageSize} MB`,
      icon: <FaDatabase size={28} />,
      messageLine: data.pageSize <= 2 
        ? t.metrics.pageSize.message.small
        : data.pageSize <= 3.5 
          ? t.metrics.pageSize.message.moderate
          : t.metrics.pageSize.message.large,
      explanation: t.metrics.pageSize.explanation,
    },
    {
      label: t.metrics.requests.label,
      value: data.pageRequests,
      display: `${data.pageRequests}`,
      icon: <FaNetworkWired size={28} />,
      messageLine: data.pageRequests <= 50 
        ? t.metrics.requests.message.few
        : data.pageRequests <= 90 
          ? t.metrics.requests.message.moderate
          : t.metrics.requests.message.many,
      explanation: t.metrics.requests.explanation,
    },
  ];

  return (
    <>
      <SectionHeader
        title={t.performance}
        tagline={t.tagline}
      />

      {data.source && data.source !== 'Google PageSpeed' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t.testResults} {data.source}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {metricData.map((metric, index) => {
          const score = normalizeScore(metric.label, metric.value);
          const badge = getSeverityBadge(score, language);
          const gaugeColor = getGaugeColor(score);

          return (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: '#fff',
                position: 'relative',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Severity Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: badge.color,
                  color: '#fff',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {badge.label}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {metric.label}
              </Typography>

              <Box sx={{ my: 2 }}>
                <Gauge
                  value={score}
                  size={100}
                  color={gaugeColor}
                  icon={metric.icon}
                />
              </Box>

              <Typography variant="body1" fontWeight={600} mt={1}>
                {metric.display}
              </Typography>

              <Typography
                variant="body2"
                fontWeight={600}
                color="primary"
                gutterBottom
              >
                {metric.messageLine}
              </Typography>

              <Typography variant="caption" color="textSecondary">
                {metric.explanation}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </>
  );
};

export default PerformanceSection;