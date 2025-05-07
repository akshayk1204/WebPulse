import React from 'react';
import { Box, Typography, Paper, Chip, Alert } from '@mui/material';
import { 
  FaLock, 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaFire,
  FaGlobe,
  FaCookie,
  FaShieldVirus,
  FaCode
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { getScoreColor } from '../utils/scoreUtils';

// Translation dictionaries
const translations = {
  en: {
    loading: "Loading security data...",
    pass: "Pass",
    fail: "Fail",
    motivationalPhrases: [
      "Safety first!",
      "Guardians at work!",
      "No breaches here!",
      "Security's solid!",
      "All locked up!",
      "Shield's up!",
      "Protected & proud!",
      "Cyber strong!",
    ],
    failPhrases: [
      "Lock the gates!",
      "Patch up the holes!",
      "Security needs love.",
      "Don't leave doors open!",
      "Let's fix that shield!",
      "Vulnerable... for now.",
      "Protection pending.",
      "Get your armor on!",
      "Time to fortify!",
      "Risk alert – let's act!"
    ],
    tiles: {
      ssl: {
        label: "SSL Certificate",
        description: "Verifies the website's identity and keeps data private between you and the site."
      },
      https: {
        label: "HTTPS",
        description: "Ensures information (like passwords or credit cards) is securely sent to the site."
      },
      headers: {
        label: "Security Headers",
        description: "Helps protect the site from attacks like clickjacking, code injection, and more."
      },
      firewall: {
        label: "Firewall Detected",
        description: "Firewalls block suspicious traffic and help prevent hacking attempts."
      },
      cors: {
        label: "CORS Policy",
        description: "Controls who can access the website's resources, reducing the risk of data leaks."
      },
      cookies: {
        label: "Cookie Security",
        description: "Ensures cookies can't be stolen or misused by hackers."
      },
      xss: {
        label: "XSS Protection",
        description: "Blocks malicious scripts that try to hijack user input or steal information."
      },
      csp: {
        label: "Content Security",
        description: "Prevents unauthorized content like rogue scripts from running on the site."
      }
    }
  },
  es: {
    loading: "Cargando datos de seguridad...",
    pass: "Aprobado",
    fail: "Fallido",
    motivationalPhrases: [
      "¡Seguridad primero!",
      "¡Guardianes trabajando!",
      "¡Sin brechas aquí!",
      "¡Seguridad sólida!",
      "¡Todo bloqueado!",
      "¡Escudo activado!",
      "¡Protegido y orgulloso!",
      "¡Ciber-fuerte!"
    ],
    failPhrases: [
      "¡Cierra las puertas!",
      "¡Repara los agujeros!",
      "La seguridad necesita atención.",
      "No dejes puertas abiertas.",
      "¡Arreglemos ese escudo!",
      "Vulnerable... por ahora.",
      "Protección pendiente.",
      "¡Ponte tu armadura!",
      "¡Hora de fortificar!",
      "¡Alerta de riesgo - actuemos!"
    ],
    tiles: {
      ssl: {
        label: "Certificado SSL",
        description: "Verifica la identidad del sitio web y mantiene los datos privados entre usted y el sitio."
      },
      https: {
        label: "HTTPS",
        description: "Asegura que la información (como contraseñas o tarjetas) se envíe de forma segura al sitio."
      },
      headers: {
        label: "Encabezados de Seguridad",
        description: "Ayuda a proteger el sitio de ataques como clickjacking, inyección de código y más."
      },
      firewall: {
        label: "Firewall Detectado",
        description: "Los firewalls bloquean tráfico sospechoso y ayudan a prevenir intentos de hacking."
      },
      cors: {
        label: "Política CORS",
        description: "Controla quién puede acceder a los recursos del sitio, reduciendo el riesgo de fugas de datos."
      },
      cookies: {
        label: "Seguridad de Cookies",
        description: "Asegura que las cookies no puedan ser robadas o mal utilizadas por hackers."
      },
      xss: {
        label: "Protección XSS",
        description: "Bloquea scripts maliciosos que intentan secuestrar entradas de usuario o robar información."
      },
      csp: {
        label: "Seguridad de Contenido",
        description: "Previene contenido no autorizado como scripts maliciosos que se ejecuten en el sitio."
      }
    }
  }
};

const SecuritySection = ({ security, language = 'en' }) => {
  const t = translations[language];

  if (!security) return <Alert severity="info">{t.loading}</Alert>;

  const safeSecurity = {
    sslStatus: security.sslStatus || 'Unknown',
    https: security.https || false,
    securityHeaders: security.securityHeaders || 'Disabled',
    firewallDetected: security.firewallDetected || false,
    firewallName: security.firewallName || null,
    corsPolicy: security.corsPolicy || 'Not configured',
    xssProtection: security.xssProtection || 'Not configured',
    contentSecurityPolicy: security.contentSecurityPolicy || 'Not configured',
    cookieSecurity: security.cookieSecurity || {
      secure: false,
      httpOnly: false,
      sameSite: 'None'
    },
    ...security
  };

  const basicTiles = [
    {
      label: t.tiles.ssl.label,
      status: safeSecurity.sslStatus === 'Valid',
      icon: <FaLock size={32} />,
      description: t.tiles.ssl.description
    },
    {
      label: t.tiles.https.label,
      status: safeSecurity.https,
      icon: <FaShieldAlt size={32} />,
      description: t.tiles.https.description
    },
    {
      label: t.tiles.headers.label,
      status: safeSecurity.securityHeaders === 'Enabled',
      icon: <FaExclamationTriangle size={32} />,
      description: t.tiles.headers.description
    },
    {
      label: t.tiles.firewall.label,
      status: safeSecurity.firewallDetected,
      icon: <FaFire size={32} />,
      description: t.tiles.firewall.description
    }
  ];

  const advancedTiles = [
    {
      label: t.tiles.cors.label,
      status: safeSecurity.corsPolicy !== 'Not configured',
      icon: <FaGlobe size={32} />,
      description: t.tiles.cors.description
    },
    {
      label: t.tiles.cookies.label,
      status: safeSecurity.cookieSecurity.secure && safeSecurity.cookieSecurity.httpOnly,
      icon: <FaCookie size={32} />,
      description: t.tiles.cookies.description
    },
    {
      label: t.tiles.xss.label,
      status: safeSecurity.xssProtection !== 'Not configured',
      icon: <FaShieldVirus size={32} />,
      description: t.tiles.xss.description
    },
    {
      label: t.tiles.csp.label,
      status: safeSecurity.contentSecurityPolicy === 'Configured',
      icon: <FaCode size={32} />,
      description: t.tiles.csp.description
    }
  ];

  const renderTiles = (tiles) => {
    return tiles.map((tile, index) => {
      const badge = {
        label: tile.status ? t.pass : t.fail,
        color: tile.status ? '#4caf50' : '#f44336'
      };
      
      const phrases = tile.status ? t.motivationalPhrases : t.failPhrases;
      const phrase = phrases[index % phrases.length];

      return (
        <Paper
          key={index}
          elevation={3}
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            position: 'relative', 
            backgroundColor: '#fff',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Chip
            label={badge.label}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
              backgroundColor: badge.color,
              color: '#fff',
            }}
          />
          <Typography variant="h6" gutterBottom>
            {tile.label}
          </Typography>
          <Box sx={{ my: 2, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {tile.icon}
          </Box>
          <Typography variant="body2" fontWeight={600} color="primary" gutterBottom>
            {phrase}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {tile.description}
          </Typography>
        </Paper>
      );
    });
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          maxWidth: '1200px',
          mx: 'auto',
          mb: 4
        }}
      >
        {renderTiles(basicTiles)}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {renderTiles(advancedTiles)}
      </Box>
    </>
  );
};

SecuritySection.propTypes = {
  security: PropTypes.object,
  language: PropTypes.oneOf(['en', 'es'])
};

SecuritySection.defaultProps = {
  language: 'en'
};

export default React.memo(SecuritySection);