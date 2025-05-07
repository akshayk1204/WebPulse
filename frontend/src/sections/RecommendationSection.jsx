import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';
import PropTypes from 'prop-types';

// Translation dictionaries
const translations = {
  en: {
    title: "What Should I Do Next?",
    description: "Based on your test results, we've identified some opportunities to improve your site's performance, SEO, mobile usability, and security.",
    categories: {
      performance: "Performance",
      seo: "SEO",
      mobile: "Mobile",
      security: "Security"
    },
    performance: {
      requests: {
        label: 'Page Requests',
        recommendation: '< 50',
        notes: 'Reduce HTTP requests by removing unnecessary scripts, images, or lazy-loading content.'
      },
      pageSize: {
        label: 'Page Size (MB)',
        recommendation: '< 3 MB',
        notes: 'Compress images, minify CSS/JS, and use modern image formats to reduce size.'
      },
      pageSpeed: {
        label: 'Page Speed (s)',
        recommendation: '< 2s',
        notes: 'Optimize server response, defer non-critical JS, and improve caching strategies.'
      },
      firstContentfulPaint: {
        label: 'First Contentful Paint (s)',
        recommendation: '< 1.8s',
        notes: 'Reduce render-blocking resources and prioritize visible content.'
      },
      speedIndex: {
        label: 'Speed Index (s)',
        recommendation: '< 2s',
        notes: 'Prioritize above-the-fold content and use efficient CSS/JS delivery.'
      },
      timeToInteractive: {
        label: 'Time to Interactive (s)',
        recommendation: '< 3.8s',
        notes: 'Reduce main-thread work and minimize third-party scripts.'
      }
    },
    seo: {
      indexable: {
        label: 'Permission To Index',
        recommendation: 'Yes',
        notes: 'Ensure your robots.txt and meta tags allow search engine indexing.'
      },
      hasMetaDescription: {
        label: 'Meta Description',
        recommendation: 'Present',
        notes: 'Include concise meta descriptions (50-160 chars) on all important pages.'
      },
      usesCleanContent: {
        label: 'Clean Content',
        recommendation: 'No bad plugins',
        notes: 'Avoid problematic plugins that generate bloated HTML.'
      },
      hasDescriptiveLinks: {
        label: 'Descriptive Link Text',
        recommendation: 'Use descriptive text',
        notes: 'Avoid generic terms like "click here" in links.'
      }
    },
    mobile: {
      responsive: {
        label: 'Responsive Design',
        recommendation: 'Yes',
        notes: 'Use responsive design techniques like fluid grids and media queries.'
      },
      viewport: {
        label: 'Viewport Meta Tag',
        recommendation: 'Present',
        notes: 'Ensure viewport meta tag is correctly configured.'
      },
      tapTargets: {
        label: 'Tap Targets',
        recommendation: 'Adequate',
        notes: 'Ensure tap targets are large and spaced properly.'
      }
    },
    security: {
      ssl: {
        label: 'SSL Certificate',
        recommendation: 'Valid',
        notes: 'Install a valid SSL certificate to secure communications.'
      },
      https: {
        label: 'HTTPS',
        recommendation: 'Enabled',
        notes: 'Redirect all traffic to HTTPS and avoid mixed content.'
      },
      headers: {
        label: 'Security Headers',
        recommendation: 'Enabled',
        notes: 'Add HTTP security headers like CSP, HSTS, and X-Frame-Options.'
      },
      firewall: {
        label: 'Firewall Detected',
        recommendation: 'Present',
        notes: 'Deploy a WAF like Edgecast to block malicious traffic and OWASP threats.'
      },
      cors: {
        label: 'CORS Policy',
        recommendation: 'Configured',
        notes: 'Define appropriate CORS policies to control cross-origin access.'
      },
      cookie: {
        label: 'Cookie Security',
        recommendation: 'Secure/HttpOnly',
        notes: 'Use Secure and HttpOnly flags on cookies to protect session data.'
      },
      xss: {
        label: 'XSS Protection',
        recommendation: 'Enabled',
        notes: 'Sanitize user input and enable browser-based XSS protection.'
      },
      csp: {
        label: 'Content Security',
        recommendation: 'CSP Applied',
        notes: 'Use CSP headers to restrict code sources.'
      }
    },
    tableHeaders: {
      metric: "Metric",
      current: "Current",
      recommended: "Recommended",
      notes: "Notes"
    },
    status: {
      fail: "Fail",
      slightDelay: "Slight delay",
      sluggish: "Feels sluggish, speed it up!"
    }
  },
  es: {
    title: "¿Qué Debo Hacer Ahora?",
    description: "Basándonos en los resultados de tus pruebas, hemos identificado oportunidades para mejorar el rendimiento, SEO, usabilidad móvil y seguridad de tu sitio.",
    categories: {
      performance: "Rendimiento",
      seo: "SEO",
      mobile: "Móvil",
      security: "Seguridad"
    },
    performance: {
      requests: {
        label: 'Solicitudes de Página',
        recommendation: '< 50',
        notes: 'Reduce solicitudes HTTP eliminando scripts innecesarios, imágenes o cargando contenido de forma diferida.'
      },
      pageSize: {
        label: 'Tamaño de Página (MB)',
        recommendation: '< 3 MB',
        notes: 'Comprime imágenes, minifica CSS/JS y usa formatos de imagen modernos para reducir tamaño.'
      },
      pageSpeed: {
        label: 'Velocidad de Página (s)',
        recommendation: '< 2s',
        notes: 'Optimiza la respuesta del servidor, difiere JS no crítico y mejora estrategias de caché.'
      },
      firstContentfulPaint: {
        label: 'Primera Pintura con Contenido (s)',
        recommendation: '< 1.8s',
        notes: 'Reduce recursos que bloquean el renderizado y prioriza contenido visible.'
      },
      speedIndex: {
        label: 'Índice de Velocidad (s)',
        recommendation: '< 2s',
        notes: 'Prioriza contenido arriba del pliegue y usa entrega eficiente de CSS/JS.'
      },
      timeToInteractive: {
        label: 'Tiempo para Interactividad (s)',
        recommendation: '< 3.8s',
        notes: 'Reduce trabajo en el hilo principal y minimiza scripts de terceros.'
      }
    },
    seo: {
      indexable: {
        label: 'Permiso para Indexar',
        recommendation: 'Sí',
        notes: 'Asegúrate que tu robots.txt y meta tags permitan indexación por motores de búsqueda.'
      },
      hasMetaDescription: {
        label: 'Meta Descripción',
        recommendation: 'Presente',
        notes: 'Incluye meta descripciones concisas (50-160 caracteres) en páginas importantes.'
      },
      usesCleanContent: {
        label: 'Contenido Limpio',
        recommendation: 'Sin plugins problemáticos',
        notes: 'Evita plugins que generen HTML inflado.'
      },
      hasDescriptiveLinks: {
        label: 'Texto Descriptivo en Enlaces',
        recommendation: 'Usa texto descriptivo',
        notes: 'Evita términos genéricos como "haz clic aquí" en enlaces.'
      }
    },
    mobile: {
      responsive: {
        label: 'Diseño Responsivo',
        recommendation: 'Sí',
        notes: 'Usa técnicas de diseño responsivo como grids fluidos y media queries.'
      },
      viewport: {
        label: 'Meta Tag Viewport',
        recommendation: 'Presente',
        notes: 'Asegúrate que la etiqueta meta viewport esté configurada correctamente.'
      },
      tapTargets: {
        label: 'Objetivos Táctiles',
        recommendation: 'Adecuados',
        notes: 'Asegúrate que los objetivos táctiles sean grandes y estén bien espaciados.'
      }
    },
    security: {
      ssl: {
        label: 'Certificado SSL',
        recommendation: 'Válido',
        notes: 'Instala un certificado SSL válido para asegurar comunicaciones.'
      },
      https: {
        label: 'HTTPS',
        recommendation: 'Habilitado',
        notes: 'Redirige todo el tráfico a HTTPS y evita contenido mixto.'
      },
      headers: {
        label: 'Encabezados de Seguridad',
        recommendation: 'Habilitados',
        notes: 'Añade encabezados HTTP de seguridad como CSP, HSTS y X-Frame-Options.'
      },
      firewall: {
        label: 'Firewall Detectado',
        recommendation: 'Presente',
        notes: 'Implementa un WAF como Edgecast para bloquear tráfico malicioso y amenazas OWASP.'
      },
      cors: {
        label: 'Política CORS',
        recommendation: 'Configurada',
        notes: 'Define políticas CORS apropiadas para controlar acceso entre orígenes.'
      },
      cookie: {
        label: 'Seguridad de Cookies',
        recommendation: 'Secure/HttpOnly',
        notes: 'Usa flags Secure y HttpOnly en cookies para proteger datos de sesión.'
      },
      xss: {
        label: 'Protección XSS',
        recommendation: 'Habilitada',
        notes: 'Sanitiza entrada de usuario y habilita protección XSS del navegador.'
      },
      csp: {
        label: 'Seguridad de Contenido',
        recommendation: 'CSP Aplicado',
        notes: 'Usa encabezados CSP para restringir fuentes de código.'
      }
    },
    tableHeaders: {
      metric: "Métrica",
      current: "Actual",
      recommended: "Recomendado",
      notes: "Notas"
    },
    status: {
      fail: "Fallido",
      slightDelay: "Ligero retraso",
      sluggish: "¡Se siente lento, aceléralo!"
    }
  }
};

const RecommendationSection = ({ 
  performanceData, 
  seoData, 
  mobileData, 
  securityData,
  language = 'en'
}) => {
  const t = translations[language];
  const rows = [];
  const seen = new Set();

  // Performance checks
  const perf = performanceData || {};
  const perfCheck = [
    { key: 'requests', value: perf.requests },
    { key: 'pageSize', value: perf.pageSize },
    { key: 'pageSpeed', value: perf.pageLoadTime },
    { key: 'firstContentfulPaint', value: perf.firstContentfulPaint },
    { key: 'speedIndex', value: perf.speedIndex },
    { key: 'timeToInteractive', value: perf.timeToInteractive }
  ];

  perfCheck.forEach(({ key, value }) => {
    const rule = t.performance[key];
    if (!rule || seen.has(key) || typeof value !== 'number') return;

    if (key === 'pageSpeed') {
      const performanceMessage = value < 5 ? t.status.slightDelay : t.status.sluggish;
      if (value > rule.threshold) {
        rows.push({
          category: t.categories.performance,
          label: rule.label,
          current: performanceMessage,
          recommendation: rule.recommendation,
          notes: rule.notes
        });
        seen.add(key);
      }
      return;
    }

    if (value > rule.threshold) {
      rows.push({
        category: t.categories.performance,
        label: rule.label,
        current: value.toFixed(2),
        recommendation: rule.recommendation,
        notes: rule.notes
      });
      seen.add(key);
    }
  });

  // SEO checks
  const seo = seoData || {};
  Object.entries(t.seo).forEach(([key, rule]) => {
    if (seo[key] === false) {
      rows.push({
        category: t.categories.seo,
        label: rule.label,
        current: t.status.fail,
        recommendation: rule.recommendation,
        notes: rule.notes
      });
    }
  });

  // Mobile checks
  const mobile = mobileData || {};
  Object.entries(t.mobile).forEach(([key, rule]) => {
    if (mobile[key] === false) {
      rows.push({
        category: t.categories.mobile,
        label: rule.label,
        current: t.status.fail,
        recommendation: rule.recommendation,
        notes: rule.notes
      });
    }
  });
  
  // Security checks - properly mapped to backend structure
  const sec = securityData || {};
  const securityChecks = {
    ssl: sec.sslStatus !== 'Valid',
    https: !sec.https,
    headers: sec.securityHeaders === 'Disabled',
    firewall: !sec.firewallDetected,
    cors: sec.corsPolicy === 'Not configured',
    xss: sec.xssProtection === 'Not configured',
    csp: sec.contentSecurityPolicy === 'Not configured',
    cookie: !(sec.cookieSecurity?.secure && sec.cookieSecurity?.httpOnly)
  };

  Object.entries(securityChecks).forEach(([key, isFailed]) => {
    if (isFailed && t.security[key]) {
      rows.push({
        category: t.categories.security,
        label: t.security[key].label,
        current: t.status.fail,
        recommendation: t.security[key].recommendation,
        notes: t.security[key].notes
      });
    }
  });

  if (!rows.length) return null;

  const categories = [
    t.categories.performance,
    t.categories.seo,
    t.categories.mobile,
    t.categories.security
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        {t.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        {t.description}
      </Typography>
      {categories.map((category) => {
        const categoryRows = rows.filter((row) => row.category === category);
        if (categoryRows.length === 0) return null;
        return (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              {category}
            </Typography>
            <Paper elevation={2} sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>{t.tableHeaders.metric}</strong></TableCell>
                    <TableCell><strong>{t.tableHeaders.current}</strong></TableCell>
                    <TableCell><strong>{t.tableHeaders.recommended}</strong></TableCell>
                    <TableCell><strong>{t.tableHeaders.notes}</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.label}</TableCell>
                      <TableCell>{row.current}</TableCell>
                      <TableCell>{row.recommendation}</TableCell>
                      <TableCell>{row.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

RecommendationSection.propTypes = {
  performanceData: PropTypes.object,
  seoData: PropTypes.object,
  mobileData: PropTypes.object,
  securityData: PropTypes.object,
  language: PropTypes.oneOf(['en', 'es'])
};

RecommendationSection.defaultProps = {
  language: 'en'
};

export default React.memo(RecommendationSection);