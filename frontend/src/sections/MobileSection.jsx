import React, { useMemo } from 'react';
import { Box, Typography, Paper, Alert, Skeleton } from '@mui/material';
import {
  PhoneIphone as MobileIcon,
  TabletMac as TabletIcon,
  Visibility as ViewportIcon,
  TouchApp as TapIcon,
  Speed as SpeedIcon,
  TextFields as FontIcon
} from '@mui/icons-material';
import Gauge from '../components/Gauge';
import PropTypes from 'prop-types';

// Translation dictionaries
const translations = {
  en: {
    mobileTitle: "Mobile Optimization",
    tagline: "More searches happen on phones than desktops. Mobile-optimized sites perform better.",
    loading: "Loading mobile data...",
    noData: "No mobile optimization data available",
    pass: "Pass",
    fail: "Fail",
    passPhrases: [
      "Mobile-first champion!",
      "Responsive rockstar!",
      "Touch-friendly pro!",
      "Small screen optimized!",
      "Thumb-zone approved!",
      "On-the-go ready!",
      "Fluid layout master!",
      "Device-agnostic design!",
      "Mobile experience is flawless!",
      "Users will love this on mobile!"
    ],
    failPhrases: [
      "Needs some mobile love!",
      "Responsive redesign suggested.",
      "Small screens deserve better.",
      "Touch targets are tricky here.",
      "Layout could use adjustments.",
      "Viewport misconfiguration found.",
      "There's room to enhance the mobile flow.",
      "Optimization is overdue.",
      "Small text is hard to read.",
      "Let's improve the mobile UX!"
    ],
    tiles: {
      responsive: {
        label: "Responsive Design",
        description: "Ensures your site looks good and functions properly on any screen size — from phones to tablets to desktops."
      },
      viewportMeta: {
        label: "Viewport Meta Tag",
        description: "The viewport meta tag ensures proper scaling on mobile devices. It should be present and properly configured."
      },
      tapTargets: {
        label: "Tap Targets",
        description: "Checks that buttons and links are big enough (minimum 48x48px) and spaced out so people can tap them easily on touchscreens."
      },
      mobileSpeed: {
        label: "Mobile Speed",
        description: "Measures if the page is lightweight enough for mobile networks. Pages should be under 500KB for optimal performance."
      },
      fontSizes: {
        label: "Font Sizes",
        description: "Verifies that text is at least 14px (or equivalent) for comfortable reading on mobile screens without zooming."
      },
      contentFitting: {
        label: "Content Fitting",
        description: "Checks that content fits within the viewport width without horizontal scrolling or zooming."
      }
    }
  },
  es: {
    mobileTitle: "Optimización Móvil",
    tagline: "Más búsquedas ocurren en teléfonos que en computadoras. Los sitios optimizados para móviles funcionan mejor.",
    loading: "Cargando datos móviles...",
    noData: "No hay datos de optimización móvil disponibles",
    pass: "Aprobado",
    fail: "Fallido",
    passPhrases: [
      "¡Campeón del diseño mobile-first!",
      "¡Experto en diseño responsivo!",
      "¡Profesional en interfaces táctiles!",
      "¡Optimizado para pantallas pequeñas!",
      "¡Zona de pulgar aprobada!",
      "¡Listo para usar en movimiento!",
      "¡Maestro de diseños fluidos!",
      "¡Diseño independiente del dispositivo!",
      "¡La experiencia móvil es perfecta!",
      "¡Los usuarios amarán esto en móvil!"
    ],
    failPhrases: [
      "¡Necesita algo de amor móvil!",
      "Se sugiere rediseño responsivo.",
      "Las pantallas pequeñas merecen mejor.",
      "Los objetivos táctiles son difíciles aquí.",
      "El diseño podría usar ajustes.",
      "Configuración de viewport incorrecta.",
      "Hay espacio para mejorar el flujo móvil.",
      "La optimización está atrasada.",
      "El texto pequeño es difícil de leer.",
      "¡Mejoremos la experiencia móvil!"
    ],
    tiles: {
      responsive: {
        label: "Diseño Responsivo",
        description: "Asegura que tu sitio se vea y funcione bien en cualquier tamaño de pantalla, desde teléfonos hasta tablets y computadoras."
      },
      viewportMeta: {
        label: "Meta Tag Viewport",
        description: "La etiqueta meta viewport asegura un escalado adecuado en dispositivos móviles. Debe estar presente y configurada correctamente."
      },
      tapTargets: {
        label: "Objetivos Táctiles",
        description: "Verifica que los botones y enlaces sean lo suficientemente grandes (mínimo 48x48px) y espaciados para un fácil uso en pantallas táctiles."
      },
      mobileSpeed: {
        label: "Velocidad Móvil",
        description: "Mide si la página es lo suficientemente liviana para redes móviles. Las páginas deben pesar menos de 500KB para un rendimiento óptimo."
      },
      fontSizes: {
        label: "Tamaños de Fuente",
        description: "Verifica que el texto tenga al menos 14px (o equivalente) para una lectura cómoda en pantallas móviles sin necesidad de zoom."
      },
      contentFitting: {
        label: "Ajuste de Contenido",
        description: "Comprueba que el contenido encaje dentro del ancho del viewport sin desplazamiento horizontal ni zoom."
      }
    }
  }
};

const MobileSection = ({ mobile, language = 'en', isLoading = false }) => {
  const t = translations[language];

  const getRandomPhrase = (status) => {
    const phrases = status ? t.passPhrases : t.failPhrases;
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const tiles = useMemo(() => {
    if (!mobile || isLoading) return [];
    
    return [
      {
        label: t.tiles.responsive.label,
        value: mobile.responsive,
        icon: <MobileIcon fontSize="large" />,
        description: t.tiles.responsive.description
      },
      {
        label: t.tiles.viewportMeta.label,
        value: mobile.viewportMeta,
        icon: <ViewportIcon fontSize="large" />,
        description: t.tiles.viewportMeta.description
      },
      {
        label: t.tiles.tapTargets.label,
        value: mobile.tapTargets,
        icon: <TapIcon fontSize="large" />,
        description: t.tiles.tapTargets.description
      },
      {
        label: t.tiles.mobileSpeed.label,
        value: mobile.mobileSpeed,
        icon: <SpeedIcon fontSize="large" />,
        description: t.tiles.mobileSpeed.description
      },
      {
        label: t.tiles.fontSizes.label,
        value: mobile.fontSizes,
        icon: <FontIcon fontSize="large" />,
        description: t.tiles.fontSizes.description
      },
      {
        label: t.tiles.contentFitting.label,
        value: mobile.contentFitting,
        icon: <TabletIcon fontSize="large" />,
        description: t.tiles.contentFitting.description
      }
    ];
  }, [mobile, isLoading, language]);

  const mobileScore = useMemo(() => {
    if (!mobile || tiles.length === 0) return 0;
    return Math.round((tiles.filter(t => t.value).length / tiles.length) * 100);
  }, [mobile, tiles]);

  if (isLoading) {
    return (
      <Box sx={{ mt: 8, mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Skeleton variant="text" width="40%" height={60} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto' }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array(6).fill(0).map((_, i) => (
            <Box key={i} sx={{ flex: '1 1 300px', maxWidth: '350px' }}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="80%" height={40} sx={{ mx: 'auto' }} />
                <Skeleton variant="text" width="90%" height={60} sx={{ mx: 'auto', mt: 1 }} />
                <Skeleton variant="text" width="70%" height={30} sx={{ mx: 'auto', mt: 2 }} />
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (!mobile) {
    return (
      <Box sx={{ mt: 8, mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t.mobile}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t.tagline}
          </Typography>
        </Box>
        <Alert severity="info" sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {t.noData}
        </Alert>
      </Box>
    );
  }

  if (mobile.error) {
    return (
      <Box sx={{ mt: 8, mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {t.mobile}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t.tagline}
          </Typography>
        </Box>
        <Alert severity="error" sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {mobile.error}
          {mobile.details && ` (Details: ${mobile.details})`}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, mb: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {t.mobile}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t.tagline}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3,
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {tiles.map((tile, index) => (
          <Paper
            key={`mobile-tile-${index}`}
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              position: 'relative',
              backgroundColor: '#fff',
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: tile.value ? '#4CAF50' : '#F44336',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {tile.value ? t.pass : t.fail}
            </Box>

            <Box 
              sx={{ 
                my: 2, 
                flexGrow: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: tile.value ? '#4CAF50' : '#F44336'
              }}
            >
              {tile.icon}
            </Box>

            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {tile.label}
            </Typography>

            <Typography 
              variant="body2" 
              fontWeight={600} 
              color="primary" 
              gutterBottom
            >
              {getRandomPhrase(tile.value)}
            </Typography>
            
            <Typography 
              variant="caption" 
              color="textSecondary"
              sx={{ fontSize: '0.8rem' }}
            >
              {tile.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

MobileSection.propTypes = {
  mobile: PropTypes.shape({
    responsive: PropTypes.bool,
    viewportMeta: PropTypes.bool,
    tapTargets: PropTypes.bool,
    mobileSpeed: PropTypes.bool,
    fontSizes: PropTypes.bool,
    contentFitting: PropTypes.bool,
    error: PropTypes.string,
    details: PropTypes.string
  }),
  language: PropTypes.oneOf(['en', 'es']),
  isLoading: PropTypes.bool
};

MobileSection.defaultProps = {
  language: 'en',
  isLoading: false
};

export default React.memo(MobileSection);