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
    //testResults: "Test results from",
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
      largestContentfulPaint: {
        label: "Largest Contentful Paint (s)",
        message: {
          fast: "Fast content rendering!",
          moderate: "Not bad, can improve.",
          slow: "LCP is slow—optimize images or layout!"
        },
        explanation: "LCP measures how fast your main content becomes visible. Critical for perceived performance."
      },
      timeToFirstByte: {
        label: "Time to First Byte (s)",
        message: {
          fast: "Server is snappy!",
          moderate: "Acceptable latency",
          slow: "Slow server response—consider tuning backend."
        },
        explanation: "How long it takes the server to respond. Faster TTFB improves load start."
      },
      cumulativeLayoutShift: {
        label: "Cumulative Layout Shift",
        message: {
          low: "Stable and steady!",
          medium: "Some unexpected shifts",
          high: "Too jumpy! Fix layout shifts."
        },
        explanation: "Measures visual stability—less layout shift means smoother experience."
      },
      interactionToNextPaint: {
        label: "Interaction to Next Paint (s)",
        message: {
          fast: "Responsive interactions!",
          moderate: "Slightly delayed",
          slow: "Laggy interaction—optimize responsiveness"
        },
        explanation: "INP reflects latency of your site's interactions. Crucial for interactivity."
      }      
    }
  },
  es: {
    performance: "Rendimiento",
    tagline: "La velocidad moldea el éxito: un sitio más rápido genera mejores clasificaciones, visitantes más felices, más conversiones y mayores ingresos.",
    loading: "Cargando datos de rendimiento...",
    //testResults: "Resultados de prueba de",
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
      largestContentfulPaint: {
        label: "Pintura con Contenido Principal (s)",
        message: {
          fast: "¡Renderizado rápido de contenido!",
          moderate: "No está mal, pero puede mejorar.",
          slow: "LCP es lento—¡optimiza imágenes o el diseño!"
        },
        explanation: "El LCP mide qué tan rápido se vuelve visible su contenido principal. Es fundamental para el rendimiento percibido."
      },
      timeToFirstByte: {
        label: "Tiempo hasta el Primer Byte (s)",
        message: {
          fast: "¡Servidor rápido!",
          moderate: "Latencia aceptable",
          slow: "Respuesta del servidor lenta—considera optimizar el backend."
        },
        explanation: "Tiempo que tarda el servidor en responder. Un TTFB más rápido mejora el inicio de carga."
      },
      cumulativeLayoutShift: {
        label: "Cambio de Diseño Acumulado",
        message: {
          low: "¡Estable y sólido!",
          medium: "Algunos cambios inesperados",
          high: "¡Demasiado movimiento! Arregla los cambios de diseño."
        },
        explanation: "Mide la estabilidad visual—menos cambio de diseño significa una experiencia más fluida."
      },
      interactionToNextPaint: {
        label: "Interacción hasta la Próxima Pintura (s)",
        message: {
          fast: "¡Interacciones receptivas!",
          moderate: "Ligeramente retrasado",
          slow: "Interacción lenta—optimiza la capacidad de respuesta"
        },
        explanation: "INP refleja la latencia de las interacciones en su sitio. Es crucial para la interactividad."
      }
    }
  }
};

const normalizeScore = (label, value) => {
    if (value === undefined || value === null || isNaN(value)) return 50;
  
    switch (label) {
      case 'Performance Score':
      case 'Puntuación de Rendimiento':
        return Math.min(100, Math.max(0, value));
  
      case 'First Contentful Paint (s)':
      case 'Primera Pintura con Contenido (s)':
      case 'Largest Contentful Paint (s)':
      case 'Pintura con Contenido Principal (s)':
      case 'Time to First Byte (s)':
      case 'Tiempo hasta el Primer Byte (s)':
      case 'Interaction to Next Paint (s)':
      case 'Interacción hasta la Próxima Pintura (s)':
        if (value <= 2) return 100;
        if (value <= 4) return 60;
        return 30;
  
      case 'Cumulative Layout Shift':
      case 'Cambio de Diseño Acumulado':
        if (value <= 0.1) return 100;
        if (value <= 0.25) return 60;
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
      value: parseFloat(data.firstContentfulPaint),
      display: data.firstContentfulPaint,
      icon: <FaPaintBrush size={28} />,
      messageLine: parseFloat(data.firstContentfulPaint) < 2
        ? t.metrics.firstContentfulPaint.message.fast
        : parseFloat(data.firstContentfulPaint) < 3.5
          ? t.metrics.firstContentfulPaint.message.moderate
          : t.metrics.firstContentfulPaint.message.slow,
      explanation: t.metrics.firstContentfulPaint.explanation,
    },
    {
      label: t.metrics.largestContentfulPaint.label,
      value: parseFloat(data.largestContentfulPaint),
      display: data.largestContentfulPaint,
      icon: <FaTachometerAlt size={28} />,
      messageLine: parseFloat(data.largestContentfulPaint) < 2.5
        ? t.metrics.largestContentfulPaint.message.fast
        : parseFloat(data.largestContentfulPaint) < 4
          ? t.metrics.largestContentfulPaint.message.moderate
          : t.metrics.largestContentfulPaint.message.slow,
      explanation: t.metrics.largestContentfulPaint.explanation,
    },
    {
      label: t.metrics.timeToFirstByte.label,
      value: parseFloat(data.timeToFirstByte),
      display: data.timeToFirstByte,
      icon: <FaNetworkWired size={28} />,
      messageLine: parseFloat(data.timeToFirstByte) < 0.5
        ? t.metrics.timeToFirstByte.message.fast
        : parseFloat(data.timeToFirstByte) < 1
          ? t.metrics.timeToFirstByte.message.moderate
          : t.metrics.timeToFirstByte.message.slow,
      explanation: t.metrics.timeToFirstByte.explanation,
    },
    {
      label: t.metrics.cumulativeLayoutShift.label,
      value: parseFloat(data.cumulativeLayoutShift),
      display: data.cumulativeLayoutShift,
      icon: <FaMousePointer size={28} />,
      messageLine: parseFloat(data.cumulativeLayoutShift) <= 0.1
        ? t.metrics.cumulativeLayoutShift.message.low
        : parseFloat(data.cumulativeLayoutShift) <= 0.25
          ? t.metrics.cumulativeLayoutShift.message.medium
          : t.metrics.cumulativeLayoutShift.message.high,
      explanation: t.metrics.cumulativeLayoutShift.explanation,
    },
    {
      label: t.metrics.interactionToNextPaint.label,
      value: parseFloat(data.interactionToNextPaint),
      display: data.interactionToNextPaint,
      icon: <FaMousePointer size={28} />,
      messageLine: parseFloat(data.interactionToNextPaint) < 2
        ? t.metrics.interactionToNextPaint.message.fast
        : parseFloat(data.interactionToNextPaint) < 4
          ? t.metrics.interactionToNextPaint.message.moderate
          : t.metrics.interactionToNextPaint.message.slow,
      explanation: t.metrics.interactionToNextPaint.explanation,
    },
  ];
  
  return (
    <>
      <SectionHeader
        title={t.performance}
        tagline={t.tagline}
      />

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