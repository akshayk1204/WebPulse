import { jsPDF } from 'jspdf';
import EC_LOGO from '../assets/EC-logo.png';
import translations from '../translations/recommendations';

const getScoreColor = (score) => {
  if (score >= 90) return '#00C49F'; // Excellent
  if (score >= 75) return '#4A6FDC'; // Good
  if (score >= 50) return '#FFB347'; // Fair
  return '#FF6F59'; // Poor
};

const generatePdf = async (domain, scores, performanceData, seoData, mobileData, securityData, language = 'en') => {
  const t = translations[language];
  const loader = document.createElement('div');
  loader.style.position = 'fixed';
  loader.style.top = '0';
  loader.style.left = '0';
  loader.style.width = '100%';
  loader.style.height = '100%';
  loader.style.backgroundColor = 'rgba(0,0,0,0.7)';
  loader.style.display = 'flex';
  loader.style.flexDirection = 'column';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.zIndex = '9999';
  loader.innerHTML = `
    <div style="color: white; font-size: 1.5rem; margin-bottom: 20px;">
      Generating PDF Report...
    </div>
    <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; 
                border-top: 5px solid #FF6F59; border-radius: 50%; 
                animation: spin 1s linear infinite;"></div>
  `;
  document.body.appendChild(loader);

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const textColor = '#00112F';
    const accentColor = '#4A6FDC';

    const centerText = (text, y, size = 12, color = textColor) => {
      doc.setFontSize(size);
      doc.setTextColor(color);
      doc.text(text, pageWidth / 2, y, { align: 'center' });
    };

    const drawRecommendationTable = (rows, startY) => {
      const colWidths = [50, 30, 40, 65];
      const headers = [t.tableHeaders.metric, t.tableHeaders.current, t.tableHeaders.recommended, t.tableHeaders.notes];
      let y = startY;
      doc.setFontSize(10);
      doc.setTextColor('#000');

      // Headers
      headers.forEach((header, i) => {
        doc.text(header, 15 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
      });
      y += 6;

      rows.forEach(row => {
        const cells = [row.label, row.current, row.recommendation, row.notes];
        cells.forEach((text, i) => {
          doc.setFontSize(9);
          doc.text(doc.splitTextToSize(text, colWidths[i]), 15 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
        });
        y += 10;
      });
    };

    const trackedMetrics = {
      performance: [
        { dataKey: 'performanceScore', translationKey: 'performanceScore', condition: v => v < 75 },
        { dataKey: 'firstContentfulPaint', translationKey: 'firstContentfulPaint', condition: v => v > 3.5 },
        { dataKey: 'largestContentfulPaint', translationKey: 'largestContentfulPaint', condition: v => v > 2.5 },
        { dataKey: 'timeToFirstByte', translationKey: 'timeToFirstByte', condition: v => v > 1.5 },
        { dataKey: 'cumulativeLayoutShift', translationKey: 'cumulativeLayoutShift', condition: v => v > 0.1 },
        { dataKey: 'interactionToNextPaint', translationKey: 'interactionToNextPaint', condition: v => v > 1.0 }
      ],
      seo: [
        { dataKey: 'indexable', translationKey: 'permissionToIndex' },
        { dataKey: 'hasMetaDescription', translationKey: 'hasMetaDescription' },
        { dataKey: 'usesCleanContent', translationKey: 'contentPlugins' },
        { dataKey: 'hasDescriptiveLinks', translationKey: 'descriptiveLinkText' }
      ],
      mobile: [
        { dataKey: 'responsive', translationKey: 'isResponsive', condition: v => v === false },
        { dataKey: 'viewportMeta', translationKey: 'hasViewportMeta', condition: v => v === false },
        { dataKey: 'tapTargets', translationKey: 'hasTapTargets', condition: v => v === false },
        { dataKey: 'mobileSpeed', translationKey: 'mobileSpeed', condition: v => v === false },
        { dataKey: 'fontSizes', translationKey: 'fontSizes', condition: v => v === false },
        { dataKey: 'contentFitting', translationKey: 'contentFitting', condition: v => v === false }
      ],
      security: [
        {
          dataKey: 'sslStatus', translationKey: 'hasSSL', condition: v => !v || v !== 'Valid',
          formatValue: v => !v ? '✗ Not Available' : (v === 'Valid' ? '✓ Valid' : `✗ ${v}`)
        },
        {
          dataKey: 'https', translationKey: 'usesHTTPS', condition: v => !v,
          formatValue: v => v ? '✓ Enabled' : '✗ Disabled'
        },
        {
          dataKey: 'securityHeaders', translationKey: 'usesSecurityHeaders', condition: v => !v || v === 'Disabled' || v === 'Error',
          formatValue: v => !v ? '✗ Not Available' : (v === 'Enabled' ? '✓ Enabled' : `✗ ${v}`)
        }
      ]
    };

    const dataMap = { performance: performanceData, seo: seoData, mobile: mobileData, security: securityData };

    const generateRows = (category) => {
      const rows = [];
      const metrics = trackedMetrics[category] || [];
      const data = dataMap[category];
      metrics.forEach(({ dataKey, translationKey, condition, formatValue }) => {
        const value = data?.[dataKey];
        const rule = t[category]?.[translationKey];
        const shouldInclude = condition ? condition(value) : value === false || value === null || value === undefined;
        if (shouldInclude && rule) {
          rows.push({
            label: rule.label,
            current: formatValue ? formatValue(value, data) : String(value),
            recommendation: rule.recommendation,
            notes: rule.notes
          });
        }
      });
      return rows;
    };

    // COVER PAGE
    const logoImg = new Image();
    logoImg.src = EC_LOGO;
    await new Promise((res, rej) => {
      logoImg.onload = res;
      logoImg.onerror = rej;
    });
    doc.addImage(logoImg, 'PNG', pageWidth / 2 - 30, 30, 60, 20);
    centerText('WebPulse Analysis', 70, 28);
    centerText(domain, 90, 36, accentColor);
    centerText('Powered by Edgecast', 105, 14, '#555');
    centerText(`Generated on ${new Date().toLocaleDateString()}`, 115, 12, '#888');

    // EXECUTIVE SUMMARY PAGE
    doc.addPage();
    doc.setFontSize(20);
    doc.setTextColor(accentColor);
    doc.text('Executive Summary', 20, 30);

    const drawCircleGauge = (x, y, score) => {
      const radius = 25;
      const color = getScoreColor(score);
      doc.setDrawColor('#ccc');
      doc.setLineWidth(3);
      doc.circle(x, y, radius);
      doc.setDrawColor(color);
      doc.circle(x, y, radius);
      doc.setTextColor(textColor);
      doc.setFontSize(18);
      doc.text(`${score}`, x, y + 5, { align: 'center' });
    };

    drawCircleGauge(pageWidth / 2, 70, scores.overall);
    centerText('Overall Score', 105);

    let y = 130;
    const barWidth = 100;
    doc.setFontSize(12);
    [
      { label: 'Performance', score: scores.performance },
      { label: 'SEO', score: scores.seo },
      { label: 'Mobile', score: scores.mobile },
      { label: 'Security', score: scores.security }
    ].forEach(metric => {
      const fill = (metric.score / 100) * barWidth;
      doc.setFillColor(getScoreColor(metric.score));
      doc.rect(40, y, fill, 6, 'F');
      doc.setDrawColor('#ccc');
      doc.rect(40, y, barWidth, 6);
      doc.setTextColor('#000');
      doc.setFontSize(10);
      doc.text(metric.label, 30, y + 5);
      doc.text(`${metric.score}/100`, 145, y + 5);
      y += 12;
    });

    // Section Pages with Recommendations
    ['performance', 'seo', 'mobile', 'security'].forEach(category => {
      const rows = generateRows(category);
      if (!rows.length) return;

      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(accentColor);
      doc.text(`${t.categories[category]} Analysis`, 20, 30);
      doc.setFontSize(12);
      doc.setTextColor('#444');
      doc.text(`Recommendations for ${t.categories[category]}:`, 20, 40);
      drawRecommendationTable(rows, 50);
    });

    // Edgecast Help Page
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(accentColor);
    doc.text('How Edgecast Can Help', 20, 30);

    doc.setFontSize(12);
    doc.setTextColor('#000');
    doc.text('We provide:', 20, 45);
    doc.text([
      '• Global CDN with 50+ PoPs worldwide',
      '• Real-time DDoS and WAF protection',
      '• Mobile optimizations for better UX',
      '• SEO tools for better crawlability'
    ], 25, 52);

    centerText('Need help implementing improvements?', 180);
    centerText('Contact Edgecast at:', 188);
    doc.setTextColor(accentColor);
    doc.textWithLink('https://www.edgecast.com/contact', pageWidth / 2, 196, { align: 'center', url: 'https://www.edgecast.com/contact' });

    const count = doc.internal.getNumberOfPages();
    for (let i = 1; i <= count; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor('#aaa');
      doc.text(`Page ${i} of ${count}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save(`WebPulse_${domain.replace(/[^a-z0-9]/gi, '_')}_Report.pdf`);
  } catch (err) {
    console.error('PDF generation failed:', err);
    alert(`PDF generation failed: ${err.message}`);
  } finally {
    if (document.body.contains(loader)) {
      document.body.removeChild(loader);
    }
  }
};

export default generatePdf;
