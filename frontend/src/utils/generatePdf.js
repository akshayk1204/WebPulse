import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import EC_LOGO from '../assets/EC-logo.svg';

const getScoreColor = (score) => {
  if (score >= 90) return '#00C49F';     // Excellent - green
  if (score >= 75) return '#4A6FDC';     // Good - blue
  if (score >= 50) return '#FFB347';     // Fair - orange
  return '#FF6F59';                      // Poor - red
};

const generatePdf = async (domain, scores) => {
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
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', filters: ['ASCIIHexEncode'] });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const primaryColor = '#00112F';
    const textColor = '#FFFFFF';
    const accentColor = '#4A6FDC';
    const secondaryText = '#E0E7F7';

    const addDarkBackground = () => {
      pdf.setFillColor(0, 17, 47);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    };

    // ===== COVER PAGE =====
    addDarkBackground();

    try {
      const logoImg = new Image();
      logoImg.src = EC_LOGO;
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
      });
      pdf.addImage(logoImg, 'SVG', pageWidth / 2 - 30, 30, 60, 20);
    } catch (e) {
      console.warn('Failed to load logo, proceeding without it');
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(textColor);
    pdf.setFontSize(28);
    pdf.text('WebPulse Analysis', pageWidth / 2, 70, { align: 'center' });

    pdf.setFontSize(36);
    pdf.setTextColor(accentColor);
    pdf.text(domain, pageWidth / 2, 90, { align: 'center' });

    pdf.setFontSize(16);
    pdf.setTextColor(secondaryText);
    pdf.text('Powered by Edgecast', pageWidth / 2, 100, { align: 'center' });
    pdf.text(`Analysis generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 110, { align: 'center' });

    // ===== EXECUTIVE SUMMARY PAGE =====
    pdf.addPage();
    addDarkBackground();

    pdf.setFontSize(22);
    pdf.setTextColor(accentColor);
    pdf.text('Executive Summary', 20, 30);

    const drawCircleGauge = (x, y, label, score) => {
      const radius = 25;
      const color = getScoreColor(score);

      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(4);
      pdf.circle(x, y, radius, 'D');

      pdf.setDrawColor(color);
      pdf.circle(x, y, radius, 'D');

      pdf.setFontSize(18);
      pdf.setTextColor(textColor);
      pdf.text(`${score}`, x, y + 2, { align: 'center' });

      pdf.setFontSize(12);
      pdf.text(label, x, y + radius + 8, { align: 'center' });
    };

    drawCircleGauge(pageWidth / 2, 85, 'Overall Score', scores.overall);

    pdf.setFontSize(12);
    pdf.setTextColor(secondaryText);
    pdf.text(
      'Focus your efforts on the weakest scoring area while maintaining strength in top-performing categories.',
      pageWidth / 2,
      130,
      { align: 'center' }
    );

    const barStartX = 40;
    const barStartY = 150;
    const barWidth = 120;
    const barHeight = 6;
    const gap = 15;
    const barMetrics = [
      { label: 'Performance', score: scores.performance },
      { label: 'SEO', score: scores.seo },
      { label: 'Mobile', score: scores.mobile },
      { label: 'Security', score: scores.security }
    ];

    barMetrics.forEach((item, index) => {
      const y = barStartY + index * gap;
      const fillWidth = (item.score / 100) * barWidth;

      pdf.setFillColor(getScoreColor(item.score));
      pdf.rect(barStartX, y, fillWidth, barHeight, 'F');
      pdf.setDrawColor(180);
      pdf.rect(barStartX, y, barWidth, barHeight);

      pdf.setTextColor(secondaryText);
      pdf.setFontSize(10);
      pdf.text(item.label, barStartX - 5, y + 4, { align: 'right' });
      pdf.text(`${item.score}/100`, barStartX + barWidth + 5, y + 4);
    });

    // ===== SECTION PAGES =====
    const sections = [
      { id: 'performance-section', title: 'Performance Analysis' },
      { id: 'seo-section', title: 'SEO Analysis' },
      { id: 'mobile-section', title: 'Mobile Analysis' },
      { id: 'security-section', title: 'Security Analysis' }
    ];

    for (const section of sections) {
      try {
        const element = document.getElementById(section.id);
        if (!element) {
          console.warn(`Element not found: ${section.id}`);
          continue;
        }

        pdf.addPage();
        addDarkBackground();
        pdf.setFontSize(22);
        pdf.setTextColor(accentColor);
        pdf.text(section.title, 20, 30);

        const canvas = await html2canvas(element, {
          scale: 1.5,
          backgroundColor: primaryColor,
          logging: false,
          useCORS: true
        });

        const imgHeight = (pageWidth - 20) * (canvas.height / canvas.width);
        pdf.addImage(canvas, 'PNG', 10, 40, pageWidth - 20, imgHeight);
      } catch (e) {
        console.error(`Error processing ${section.id}:`, e);
      }
    }

    // ===== EDGECAST SOLUTIONS PAGE =====
    pdf.addPage();
    addDarkBackground();

    pdf.setFontSize(22);
    pdf.setTextColor(accentColor);
    pdf.text('How Edgecast Can Help', 20, 30);

    const solutions = [
      { title: 'Performance Solutions', text: [
        '• Global CDN with 50+ PoPs worldwide',
        '• Advanced caching and image optimization',
        '• Real-time performance monitoring'] },
      { title: 'Security Solutions', text: [
        '• Web Application Firewall (WAF)',
        '• DDoS protection and bot mitigation',
        '• API security and threat intelligence'] },
      { title: 'Mobile Optimization', text: [
        '• Adaptive media delivery',
        '• Device-specific optimizations',
        '• Accelerated mobile pages'] },
      { title: 'SEO Improvements', text: [
        '• Faster page loads for better rankings',
        '• Improved crawlability',
        '• Structured data support'] }
    ];

    const colWidth = 80;
    solutions.forEach((sol, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 20 + col * colWidth;
      const y = 50 + row * 50;

      pdf.setFontSize(14);
      pdf.setTextColor(accentColor);
      pdf.text(sol.title, x, y);

      pdf.setFontSize(10);
      pdf.setTextColor(textColor);
      pdf.text(sol.text, x, y + 7);
    });

    pdf.setFontSize(14);
    pdf.setTextColor(accentColor);
    pdf.text('Ready to implement these improvements?', pageWidth / 2, 180, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setTextColor(textColor);
    pdf.text('Our team can help optimize your website based on these findings.', pageWidth / 2, 188, { align: 'center' });

    pdf.setTextColor(accentColor);
    pdf.textWithLink('Contact Edgecast Solutions', pageWidth / 2, 200, {
      align: 'center',
      url: 'https://www.edgecast.com/contact'
    });

    // ===== Page Numbers =====
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(secondaryText);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // ===== Save PDF =====
    pdf.save(`WebPulse_${domain.replace(/[^a-z0-9]/gi, '_')}_Report.pdf`);

  } catch (error) {
    console.error('PDF generation failed:', error);
    alert(`PDF generation failed: ${error.message}`);
  } finally {
    if (document.body.contains(loader)) {
      document.body.removeChild(loader);
    }
  }
};

export default generatePdf;
