import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { FaSearch, FaFileAlt, FaPuzzlePiece, FaLink } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import PropTypes from 'prop-types';

// Translation dictionaries
const translations = {
  en: {
    pass: "PASS",
    fail: "FAIL",
    sectionTitle: "SEO",
    sectionTagline: "Boost discoverability—optimize how your site is found and displayed in search results.",
    motivationalPhrases: {
      pass: [
        "Look at you go!",
        "SEO hero!",
        "Nailed it!",
        "Smooth sailing!",
        "You're on fire!",
        "Top-notch stuff!",
        "You're crushing it!",
        "So clean, so pro!",
        "You're on top of the game!",
        "SEO superstar!",
        "You're killing it!",
        "Great job, keep it up!",
        "Fantastic work, keep the momentum!",
        "SEO champion in the making!",
        "You nailed it, SEO master!",
        "A+ SEO performance!",
        "SEO goals unlocked!",
        "You've got the SEO magic!",
        "Keep soaring with SEO excellence!",
        "SEO success—you're there!",
        "Impressive SEO skills, keep it going!",
        "You're leading the way in SEO!",
        "Nothing can stop you now!",
      ],
      fail: [
        "Keep going, you'll get there!",
        "Almost there, just a little more!",
        "Don't give up, improvements ahead!",
        "One step at a time, you'll win!",
        "A little more work, and it's perfect!",
        "Almost there—keep pushing!",
        "A little tweak, and you're golden!",
        "You're so close, don't stop now!",
        "Improvement is just around the corner!",
        "Keep going, you're almost there!",
        "Small changes for big results!",
        "It's all about the next step!",
        "You can do this, just keep refining!",
        "Almost perfect, keep fine-tuning!",
        "Every step counts, you got this!",
        "Your SEO journey is on track!",
        "Just a little more work, you'll ace it!",
        "Small adjustments, big wins ahead!",
        "Almost perfect—keep optimizing!",
      ]
    },
    tiles: {
      indexable: {
        label: "Permission To Index",
        description: "Search engines must be allowed to index your page to include it in results. No index, no visibility."
      },
      metaDescription: {
        label: "Meta Description",
        description: "Meta descriptions summarize content and boost click-throughs. Missing ones hurt SEO impact."
      },
      cleanContent: {
        label: "Content Plugins",
        description: "Avoiding outdated or blocking plugins keeps content accessible and SEO-friendly across devices."
      },
      descriptiveLinks: {
        label: "Descriptive Link Text",
        description: "Links like 'click here' lack clarity. Descriptive text helps both users and search engines."
      }
    }
  },
  es: {
    pass: "APROBADO",
    fail: "FALLO",
    sectionTitle: "SEO",
    sectionTagline: "Impulsa la descubribilidad—optimiza cómo se encuentra y muestra tu sitio en los resultados de búsqueda.",
    motivationalPhrases: {
      pass: [
        "¡Mira cómo vas!",
        "¡Héroe del SEO!",
        "¡Perfecto!",
        "¡Navegación suave!",
        "¡Estás en racha!",
        "¡Material de primera!",
        "¡Lo estás aplastando!",
        "¡Tan limpio, tan profesional!",
        "¡Estás en la cima del juego!",
        "¡Superestrella del SEO!",
        "¡Lo estás haciendo genial!",
        "¡Buen trabajo, sigue así!",
        "¡Fantástico trabajo, mantén el ritmo!",
        "¡Futuro campeón del SEO!",
        "¡Perfecto, maestro del SEO!",
        "¡Rendimiento SEO A+!",
        "¡Objetivos SEO alcanzados!",
        "¡Tienes la magia del SEO!",
        "¡Sigue volando con excelencia SEO!",
        "¡Éxito SEO—lo has logrado!",
        "¡Habilidades SEO impresionantes, sigue así!",
        "¡Estás liderando el camino en SEO!",
        "¡Nada puede detenerte ahora!"
      ],
      fail: [
        "¡Sigue adelante, lo lograrás!",
        "¡Casi ahí, solo un poco más!",
        "¡No te rindas, mejoras por delante!",
        "¡Paso a paso, ganarás!",
        "¡Un poco más de trabajo y será perfecto!",
        "¡Casi ahí—sigue empujando!",
        "¡Un pequeño ajuste y estarás perfecto!",
        "¡Estás tan cerca, no pares ahora!",
        "¡La mejora está a la vuelta de la esquina!",
        "¡Sigue adelante, casi lo logras!",
        "¡Pequeños cambios para grandes resultados!",
        "¡Todo se trata del próximo paso!",
        "¡Puedes hacerlo, solo sigue refinando!",
        "¡Casi perfecto, sigue ajustando!",
        "¡Cada paso cuenta, tú puedes!",
        "¡Tu viaje SEO está en camino!",
        "¡Solo un poco más de trabajo y lo lograrás!",
        "¡Pequeños ajustes, grandes victorias por venir!",
        "¡Casi perfecto—sigue optimizando!"
      ]
    },
    tiles: {
      indexable: {
        label: "Permiso Para Indexar",
        description: "Los motores de búsqueda deben poder indexar tu página para incluirla en los resultados. Sin indexación, no hay visibilidad."
      },
      metaDescription: {
        label: "Meta Descripción",
        description: "Las meta descripciones resumen el contenido y aumentan los clics. Las que faltan perjudican el impacto SEO."
      },
      cleanContent: {
        label: "Plugins de Contenido",
        description: "Evitar plugins obsoletos o bloqueantes mantiene el contenido accesible y compatible con SEO en todos los dispositivos."
      },
      descriptiveLinks: {
        label: "Texto de Enlace Descriptivo",
        description: "Enlaces como 'haz clic aquí' carecen de claridad. El texto descriptivo ayuda tanto a usuarios como a motores de búsqueda."
      }
    }
  }
};

const getPassFailBadge = (status, language) => {
  const t = translations[language];
  return status
    ? { label: t.pass, color: '#4caf50' } // Green for Pass
    : { label: t.fail, color: '#f44336' }; // Red for Fail
};

const getRandomPhrase = (status, language) => {
  const phrases = translations[language].motivationalPhrases;
  const phraseList = status ? phrases.pass : phrases.fail;
  return phraseList[Math.floor(Math.random() * phraseList.length)];
};

const SEOSection = ({ seoData, language = 'en' }) => {
  const t = translations[language];
  
  const tiles = [
    {
      label: t.tiles.indexable.label,
      status: seoData?.indexable,
      icon: <FaSearch size={32} />,
      description: t.tiles.indexable.description
    },
    {
      label: t.tiles.metaDescription.label,
      status: seoData?.hasMetaDescription,
      icon: <FaFileAlt size={32} />,
      description: t.tiles.metaDescription.description
    },
    {
      label: t.tiles.cleanContent.label,
      status: seoData?.usesCleanContent,
      icon: <FaPuzzlePiece size={32} />,
      description: t.tiles.cleanContent.description
    },
    {
      label: t.tiles.descriptiveLinks.label,
      status: seoData?.hasDescriptiveLinks,
      icon: <FaLink size={32} />,
      description: t.tiles.descriptiveLinks.description
    }
  ];

  return (
    <Box sx={{ mt: 6 }}>
      <SectionHeader
        title={t.sectionTitle}
        tagline={t.sectionTagline}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 3,
          maxWidth: '800px',
          mx: 'auto',
        }}
      >
        {tiles.map((tile, index) => {
          const badge = getPassFailBadge(tile.status, language);
          const phrase = getRandomPhrase(tile.status, language);

          return (
            <Paper
              key={index}
              elevation={3}
              sx={{ p: 3, textAlign: 'center', position: 'relative', backgroundColor: '#fff' }}
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
              <Box sx={{ my: 2 }}>{tile.icon}</Box>
              <Typography variant="body2" fontWeight={600} color="primary" gutterBottom>
                {phrase}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {tile.description}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

SEOSection.propTypes = {
  seoData: PropTypes.shape({
    indexable: PropTypes.bool,
    hasMetaDescription: PropTypes.bool,
    usesCleanContent: PropTypes.bool,
    hasDescriptiveLinks: PropTypes.bool
  }),
  language: PropTypes.oneOf(['en', 'es'])
};

SEOSection.defaultProps = {
  language: 'en'
};

export default SEOSection;