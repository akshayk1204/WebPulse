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

    addDarkBackground();

    try {
      const logoImg = new Image();
      logoImg.src = EC_LOGO;
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
      });
      pdf.addImage(logoImg, 'SVG', pageWidth/2 - 30, 30, 60, 20);
    } catch (e) {
      console.warn('Failed to load logo, proceeding without it');
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(textColor);
    pdf.setFontSize(28);
    pdf.text('WebPulse Analysis', pageWidth/2, 70, { align: 'center' });

    pdf.setFontSize(36);
    pdf.setTextColor(accentColor);
    pdf.text(domain, pageWidth/2, 90, { align: 'center' });

    pdf.setFontSize(16);
    pdf.setTextColor(secondaryText);
    pdf.text('Powered by Edgecast', pageWidth/2, 100, { align: 'center' });
    pdf.text(`Analysis generated on ${new Date().toLocaleDateString()}`, pageWidth/2, 110, { align: 'center' });

    pdf.addPage();
    addDarkBackground();

    pdf.setFontSize(22);
    pdf.setTextColor(accentColor);
    pdf.text('Executive Summary', 20, 30);

    // Draw Overall Score gauge
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
      pageWidth / 2, 130, { align: 'center' }
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

    // Add additional sections (to be inserted in part 2)

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
