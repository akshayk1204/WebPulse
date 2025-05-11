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
  category,
  performanceData,
  seoData,
  mobileData,
  securityData,
  language = 'en'
}) => {
  const t = translations[language];
  const rows = [];

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
      { dataKey: 'responsive', translationKey: 'isResponsive', condition: value => value === false },
      { dataKey: 'viewportMeta', translationKey: 'hasViewportMeta', condition: value => value === false },
      { dataKey: 'tapTargets', translationKey: 'hasTapTargets', condition: value => value === false },
      { dataKey: 'mobileSpeed', translationKey: 'mobileSpeed', condition: value => value === false },
      { dataKey: 'fontSizes', translationKey: 'fontSizes', condition: value => value === false },
      { dataKey: 'contentFitting', translationKey: 'contentFitting', condition: value => value === false }
    ],
    security: [
      {
        dataKey: 'sslStatus',
        translationKey: 'hasSSL',
        condition: status => !status || status !== 'Valid',
        formatValue: value => !value ? '✗ Not Available' : value === 'Valid' ? '✓ Valid' : `✗ ${value}`
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
        formatValue: value => !value ? '✗ Not Available' : value === 'Enabled' ? '✓ Enabled' : `✗ ${value}`
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
        formatValue: value => !value ? '✗ Not Available' : value === 'Restricted' ? '✓ Restricted' : value === 'Public' ? '⚠ Public' : `✗ ${value}`
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
        formatValue: value => !value ? '✗ Not Available' : value === 'Not configured' ? '✗ Not Configured' : `✓ ${value}`
      },
      {
        dataKey: 'contentSecurityPolicy',
        translationKey: 'contentSecurity',
        condition: value => !value || value === 'Not configured' || value === 'Error',
        formatValue: value => !value ? '✗ Not Available' : value === 'Configured' ? '✓ Configured' : `✗ ${value}`
      }
    ]
  };

  const categoryMetrics = trackedMetrics[category] || [];
  const dataMap = {
    performance: performanceData,
    seo: seoData,
    mobile: mobileData,
    security: securityData
  };

  const data = dataMap[category];

  categoryMetrics.forEach(({ dataKey, translationKey, condition, formatValue }) => {
    const value = data?.[dataKey];
    const rule = t[category]?.[translationKey];

    const include = condition
      ? condition(value)
      : value === false || value === null || value === undefined;

    if (include && rule) {
      rows.push({
        category: t.categories[category],
        label: rule.label,
        current: formatValue ? formatValue(value, data) : String(value),
        recommendation: rule.recommendation,
        notes: rule.notes
      });
    }
  });

  if (!rows.length) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        {t.categories[category]} Recommendations
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
  category: PropTypes.string.isRequired,
  performanceData: PropTypes.object,
  seoData: PropTypes.object,
  mobileData: PropTypes.object,
  securityData: PropTypes.object,
  language: PropTypes.string
};

export default RecommendationSection;
