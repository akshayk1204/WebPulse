const translations = {
    en: {
      title: 'Recommendations for Improvement',
      description: 'Based on our analysis, here are some suggestions to improve your website’s performance, SEO, mobile optimization, and security.',
      tableHeaders: {
        metric: 'Metric',
        current: 'Current Value',
        recommended: 'Recommended',
        notes: 'Notes',
      },
      categories: {
        performance: 'Performance',
        seo: 'SEO',
        mobile: 'Mobile Optimization',
        security: 'Security',
      },
      performance: {
        pageSpeed: {
          label: 'Page Load Speed',
          recommendation: 'Load under 5s',
          notes: 'Improve load times with caching and optimized assets.',
        },
        requests: {
          label: 'Page Requests',
          recommendation: '< 80 requests',
          notes: 'Reduce the number of HTTP requests by bundling files.',
        },
        pageSize: {
          label: 'Page Size',
          recommendation: '< 3.5 MB',
          notes: 'Compress images and remove unused resources.',
        },
        firstContentfulPaint: {
          label: 'First Contentful Paint',
          recommendation: '< 3.5s',
          notes: 'Speed up server response and prioritize visible content.',
        },
        timeToInteractive: {
          label: 'Time to Interactive',
          recommendation: '< 5s',
          notes: 'Optimize JavaScript execution and reduce third-party scripts.',
        },
        speedIndex: {
          label: 'Speed Index',
          recommendation: '< 2',
          notes: 'Improve visible loading speed for better UX.',
        },
      },
      seo: {
        permissionToIndex: {
            label: 'Page Indexing',
            recommendation: 'Ensure your page is indexable by search engines',
            notes: 'Check robots meta tag and X-Robots-Tag header'
          },
          hasMetaDescription: {
            label: 'Meta Description',
            recommendation: 'Add a meta description between 50-160 characters',
            notes: 'Important for search results snippets'
          },
          contentPlugins: {
            label: 'Clean Content',
            recommendation: 'Avoid outdated content technologies (Flash, Silverlight)',
            notes: 'Modern websites should use HTML5 standards'
          },
          descriptiveLinkText: {
            label: 'Descriptive Links',
            recommendation: 'Use meaningful link text instead of "click here"',
            notes: 'Helps users and search engines understand link purpose'
          } 
        },
      mobile: {
        isResponsive: {
            label: 'Responsive Design',
            recommendation: 'Implement responsive design techniques',
            notes: 'Use media queries and flexible layouts'
          },
          hasViewportMeta: {
            label: 'Viewport Meta Tag',
            recommendation: 'Add viewport meta tag',
            notes: '<meta name="viewport" content="width=device-width, initial-scale=1">'
          },
          hasTapTargets: {
            label: 'Tap Target Size',
            recommendation: 'Ensure tap targets are at least 48x48px',
            notes: 'Buttons/links should be easily tappable'
          },
          mobileSpeed: {
            label: 'Mobile Page Speed',
            recommendation: 'Optimize for mobile networks',
            notes: 'Keep page size under 500KB for 3G connections'
          },
          fontSizes: {
            label: 'Readable Font Sizes',
            recommendation: 'Use minimum 14px font size',
            notes: 'Smaller text is hard to read on mobile'
          },
          contentFitting: {
            label: 'Content Layout',
            recommendation: 'Prevent horizontal scrolling',
            notes: 'Content should fit viewport width'
          }
      },
      security: {
        hasSSL: {
          label: 'SSL Certificate',
          recommendation: 'Use HTTPS',
          notes: 'Secures communication and improves trust.',
        },
        usesHTTPS: {
          label: 'HTTPS Usage',
          recommendation: 'Redirect all traffic to HTTPS',
          notes: 'Ensures secure communication for all users.',
        },
        usesSecurityHeaders: {
          label: 'Security Headers',
          recommendation: 'Add headers like CSP, HSTS, X-Frame-Options',
          notes: 'Mitigates common web vulnerabilities.',
        },
        hasWAF: {
          label: 'Web Application Firewall',
          recommendation: 'Enable WAF (e.g., Edgecast WAF)',
          notes: 'Protects against malicious traffic and attacks.',
        },
        corsPolicy: {
          label: 'CORS Policy',
          recommendation: 'Define strict CORS policies',
          notes: 'Restricts resource sharing to trusted origins.',
        },
        cookieSecurity: {
          label: 'Secure Cookies',
          recommendation: 'Set HttpOnly and Secure flags',
          notes: 'Protects against XSS and session hijacking.',
        },
        xssProtection: {
          label: 'XSS Protection',
          recommendation: 'Implement proper escaping and CSP',
          notes: 'Defends against Cross-Site Scripting attacks.',
        },
        contentSecurity: {
          label: 'Content Security Policy (CSP)',
          recommendation: 'Define a strong CSP',
          notes: 'Prevents unauthorized scripts and data injection.',
        }
      },
      status: {
        fail: '❌ Failed',
        slightDelay: '⚠️ Slight Delay',
        sluggish: '🐢 Feels Sluggish',
      },
    },
  
    es: {
      title: 'Recomendaciones para Mejorar',
      description: 'Según nuestro análisis, aquí tienes algunas sugerencias para mejorar el rendimiento, SEO, optimización móvil y seguridad de tu sitio web.',
      tableHeaders: {
        metric: 'Métrica',
        current: 'Valor Actual',
        recommended: 'Recomendado',
        notes: 'Notas',
      },
      categories: {
        performance: 'Rendimiento',
        seo: 'SEO',
        mobile: 'Optimización Móvil',
        security: 'Seguridad',
      },
      performance: {
        pageSpeed: {
          label: 'Velocidad de Carga',
          recommendation: 'Menos de 5s',
          notes: 'Mejora los tiempos de carga con caché y recursos optimizados.',
        },
        requests: {
          label: 'Solicitudes de Página',
          recommendation: '< 80 solicitudes',
          notes: 'Reduce la cantidad de solicitudes HTTP combinando archivos.',
        },
        pageSize: {
          label: 'Tamaño de Página',
          recommendation: '< 3.5 MB',
          notes: 'Comprime imágenes y elimina recursos innecesarios.',
        },
        firstContentfulPaint: {
          label: 'First Contentful Paint',
          recommendation: '< 3.5s',
          notes: 'Acelera la respuesta del servidor y prioriza el contenido visible.',
        },
        timeToInteractive: {
          label: 'Tiempo para Interactividad',
          recommendation: '< 5s',
          notes: 'Optimiza la ejecución de JavaScript y reduce scripts de terceros.',
        },
        speedIndex: {
          label: 'Índice de Velocidad',
          recommendation: '< 2',
          notes: 'Mejora la velocidad de carga visible para una mejor experiencia.',
        },
      },
      seo: {
        permissionToIndex: {
            label: 'Indexación de Página',
            recommendation: 'Asegúrate de que tu página sea indexable por los motores de búsqueda',
            notes: 'Verifica la etiqueta meta robots y el encabezado X-Robots-Tag'
          },
          hasMetaDescription: {
            label: 'Meta Descripción',
            recommendation: 'Añade una meta descripción de 50-160 caracteres',
            notes: 'Importante para los fragmentos en los resultados de búsqueda'
          },
          contentPlugins: {
            label: 'Contenido Limpio',
            recommendation: 'Evita tecnologías de contenido obsoletas (Flash, Silverlight)',
            notes: 'Los sitios modernos deben usar estándares HTML5'
          },
          descriptiveLinkText: {
            label: 'Enlaces Descriptivos',
            recommendation: 'Usa texto de enlace significativo en lugar de "haz clic aquí"',
            notes: 'Ayuda a usuarios y motores de búsqueda a entender el propósito del enlace'
          }
        },
      mobile: {
        isResponsive: {
            label: 'Diseño Responsivo',
            recommendation: 'Implementa técnicas de diseño responsivo',
            notes: 'Usa media queries y diseños flexibles'
          },
          hasViewportMeta: {
            label: 'Etiqueta Meta de Viewport',
            recommendation: 'Agrega una etiqueta meta de viewport',
            notes: '<meta name="viewport" content="width=device-width, initial-scale=1">'
          },
          hasTapTargets: {
            label: 'Tamaño de Objetivos Táctiles',
            recommendation: 'Asegura que los objetivos táctiles tengan al menos 48x48px',
            notes: 'Los botones/enlaces deben ser fácilmente pulsables'
          },
          mobileSpeed: {
            label: 'Velocidad de Carga en Móvil',
            recommendation: 'Optimiza para redes móviles',
            notes: 'Mantén el tamaño de la página por debajo de 500KB para conexiones 3G'
          },
          fontSizes: {
            label: 'Tamaños de Fuente Legibles',
            recommendation: 'Usa un tamaño de fuente mínimo de 14px',
            notes: 'El texto pequeño es difícil de leer en dispositivos móviles'
          },
          contentFitting: {
            label: 'Diseño del Contenido',
            recommendation: 'Evita el desplazamiento horizontal',
            notes: 'El contenido debe ajustarse al ancho del viewport'
          }
          ,
      },
      security: {
        hasSSL: {
          label: 'Certificado SSL',
          recommendation: 'Usa HTTPS',
          notes: 'Asegura la comunicación y mejora la confianza.',
        },
        usesHTTPS: {
          label: 'Uso de HTTPS',
          recommendation: 'Redirige todo el tráfico a HTTPS',
          notes: 'Garantiza una comunicación segura para todos los usuarios.',
        },
        usesSecurityHeaders: {
          label: 'Encabezados de Seguridad',
          recommendation: 'Agrega encabezados como CSP, HSTS, X-Frame-Options',
          notes: 'Mitiga vulnerabilidades comunes en la web.',
        },
        hasWAF: {
          label: 'Firewall de Aplicaciones Web',
          recommendation: 'Activa un WAF (por ejemplo, Edgecast WAF)',
          notes: 'Protege contra tráfico malicioso y ataques.',
        },
        corsPolicy: {
          label: 'Política CORS',
          recommendation: 'Define políticas CORS estrictas',
          notes: 'Restringe el intercambio de recursos a orígenes confiables.',
        },
        cookieSecurity: {
          label: 'Cookies Seguras',
          recommendation: 'Configura los flags HttpOnly y Secure',
          notes: 'Protege contra XSS y secuestro de sesiones.',
        },
        xssProtection: {
          label: 'Protección contra XSS',
          recommendation: 'Implementa escape adecuado y CSP',
          notes: 'Defiende contra ataques de Cross-Site Scripting.',
        },
        contentSecurity: {
          label: 'Política de Seguridad de Contenido (CSP)',
          recommendation: 'Define una CSP robusta',
          notes: 'Previene scripts no autorizados e inyecciones de datos.',
        }
      },
      status: {
        fail: '❌ Falló',
        slightDelay: '⚠️ Leve Retraso',
        sluggish: '🐢 Se Siente Lento',
      },
    },
  };
  
  export default translations;
  