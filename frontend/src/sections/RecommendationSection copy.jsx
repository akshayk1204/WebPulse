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
import translations from '../translations/recommendations';

const RecommendationSection = ({ 
  performanceData, 
  seoData, 
  mobileData, 
  securityData,
  language = 'en'
}) => {
  const t = translations[language];
  const rows = [];

  // Define which metrics we actually track and their corresponding translation keys
  const trackedMetrics = {
    performance: [
      { dataKey: 'performanceScore', translationKey: 'performanceScore', condition: value => value < 75 },
      { dataKey: 'firstContentfulPaint', translationKey: 'firstContentfulPaint', condition: value => value > 3.5 },
      { dataKey: 'largestContentfulPaint', translationKey: 'largestContentfulPaint', condition: value => value > 2.5 },
      { dataKey: 'timeToFirstByte', translationKey: 'timeToFirstByte', condition: value => value > 1.5 },
      { dataKey: 'cumulativeLayoutShift', translationKey: 'cumulativeLayoutShift', condition: value => value > 0.1 },
      { dataKey: 'interactionToNextPaint', translationKey: 'interactionToNextPaint', condition: value => value > 1.0 }
    ],
    seo: [
      { dataKey: 'indexable', translationKey: 'permissionToIndex' },
      { dataKey: 'hasMetaDescription', translationKey: 'hasMetaDescription' },
      { dataKey: 'usesCleanContent', translationKey: 'contentPlugins' },
      { dataKey: 'hasDescriptiveLinks', translationKey: 'descriptiveLinkText' }
    ],
    mobile: [
      { 
        dataKey: 'responsive', 
        translationKey: 'isResponsive',
        condition: value => value === false 
      },
      { 
        dataKey: 'viewportMeta', 
        translationKey: 'hasViewportMeta',
        condition: value => value === false
      },
      { 
        dataKey: 'tapTargets', 
        translationKey: 'hasTapTargets',
        condition: value => value === false
      },
      { 
        dataKey: 'mobileSpeed', 
        translationKey: 'mobileSpeed',
        condition: value => value === false 
      },
      { 
        dataKey: 'fontSizes', 
        translationKey: 'fontSizes',
        condition: value => value === false
      },
      { 
        dataKey: 'contentFitting', 
        translationKey: 'contentFitting',
        condition: value => value === false
      }
    ],
    security: [
      { 
        dataKey: 'sslStatus', 
        translationKey: 'hasSSL',
        condition: status => !status || status !== 'Valid',
        formatValue: value => {
          if (!value) return '✗ Not Available';
          return value === 'Valid' ? '✓ Valid' : `✗ ${value}`;
        }
      },
      { 
        dataKey: 'https', 
        translationKey: 'usesHTTPS',
        condition: value => !value,
        formatValue: value => value ? '✓ Enabled' : '✗ Disabled'
      },
      { 
        dataKey: 'securityHeaders', 
        translationKey: 'usesSecurityHeaders',
        condition: value => !value || value === 'Disabled' || value === 'Error',
        formatValue: value => {
          if (!value) return '✗ Not Available';
          return value === 'Enabled' ? '✓ Enabled' : `✗ ${value}`;
        }
      },
      { 
        dataKey: 'firewallDetected', 
        translationKey: 'hasWAF',
        condition: value => !value,
        formatValue: (value, data) => value ? `✓ ${data.firewallName || 'Detected'}` : '✗ Not Detected'
      },
      { 
        dataKey: 'corsPolicy', 
        translationKey: 'corsPolicy',
        condition: value => !value || value === 'Not configured' || value === 'Public' || value === 'Error',
        formatValue: value => {
          if (!value) return '✗ Not Available';
          if (value === 'Restricted') return '✓ Restricted';
          if (value === 'Public') return '⚠ Public';
          return `✗ ${value}`;
        }
      },
      { 
        dataKey: 'cookieSecurity', 
        translationKey: 'cookieSecurity',
        condition: value => !value || !value.secure || !value.httpOnly || value.sameSite === 'None',
        formatValue: value => {
          if (!value) return '✗ Not Available';
          return [
            `Secure: ${value.secure ? '✓' : '✗'}`,
            `HttpOnly: ${value.httpOnly ? '✓' : '✗'}`,
            `SameSite: ${value.sameSite}`
          ].join(', ');
        }
      },
      { 
        dataKey: 'xssProtection', 
        translationKey: 'xssProtection',
        condition: value => !value || value === 'Not configured' || value === 'Error',
        formatValue: value => {
          if (!value) return '✗ Not Available';
          return value === 'Not configured' ? '✗ Not Configured' : `✓ ${value}`;
        }
      },
      { 
        dataKey: 'contentSecurityPolicy',  // Match backend property name exactly
        translationKey: 'contentSecurity',  // Translation key remains the same
        condition: value => !value || value === 'Not configured' || value === 'Error',
        formatValue: value => {
          if (!value) return '✗ Not Available';
          return value === 'Configured' ? '✓ Configured' : `✗ ${value}`;
        }
      }
    ]
  };
  


// Performance checks
trackedMetrics.performance.forEach(({ dataKey, translationKey, condition }) => {
    const value = performanceData?.[dataKey];
    const rule = t.performance[translationKey];
  
    if (value !== undefined && value !== null && condition(value) && rule) {
      const displayValue = dataKey === 'performanceScore' 
        ? `${value}/100`
        : `${value}s`; // Adjusted for the remaining metrics
  
      rows.push({
        category: t.categories.performance,
        label: rule.label,
        current: displayValue,
        recommendation: rule.recommendation,
        notes: rule.notes
      });
    }
  });
  
  

  // SEO checks
  trackedMetrics.seo.forEach(({ dataKey, translationKey }) => {
    const value = seoData?.[dataKey];
    const rule = t.seo[translationKey];
    
    if (rule && (value === false || value === null || value === undefined)) {
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
  trackedMetrics.mobile.forEach(({ dataKey, translationKey, condition }) => {
    const value = mobileData?.[dataKey];
    const rule = t.mobile[translationKey];
    
    if (rule) {
      if (condition) {
        // For numeric metrics like mobileSpeed
        if (value !== undefined && value !== null && condition(value)) {
          rows.push({
            category: t.categories.mobile,
            label: rule.label,
            current: `${value}${dataKey === 'mobileSpeed' ? '/100' : ''}`,
            recommendation: rule.recommendation,
            notes: rule.notes
          });
        }
      } else {
        // For boolean metrics
        if (value === false || value === null || value === undefined) {
          rows.push({
            category: t.categories.mobile,
            label: rule.label,
            current: t.status.fail,
            recommendation: rule.recommendation,
            notes: rule.notes
          });
        }
      }
    }
  });

  // Security checks
  trackedMetrics.security.forEach(({ dataKey, translationKey, condition, formatValue }) => {
    const value = securityData?.[dataKey];
    const rule = t.security[translationKey];
    
    if (rule && value !== undefined && value !== null && condition(value)) {
      rows.push({
        category: t.categories.security,
        label: rule.label,
        current: formatValue ? formatValue(value, securityData) : String(value),
        recommendation: rule.recommendation,
        notes: rule.notes
      });
    }
  });

  if (!rows.length) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        {t.title}
      </Typography>
      <Typography variant="body1" mb={2}>
        {t.description}
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t.tableHeaders.metric}</TableCell>
              <TableCell>{t.tableHeaders.current}</TableCell>
              <TableCell>{t.tableHeaders.recommended}</TableCell>
              <TableCell>{t.tableHeaders.notes}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell><strong>{row.category}</strong>: {row.label}</TableCell>
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
};

RecommendationSection.propTypes = {
  performanceData: PropTypes.object,
  seoData: PropTypes.object,
  mobileData: PropTypes.object,
  securityData: PropTypes.object,
  language: PropTypes.string
};

export default RecommendationSection;