// In utils/scoreUtils.js
export const calculateSeoScore = (seoData) => {
    // Define the number of tiles that passed
    const totalTiles = 4;  // Since you only have 4 tiles
    let passedTiles = 0;
  
    // Check the status of each tile (true = pass, false = fail)
    const tiles = [
        seoData.indexable !== false,       // 1. Permission to Index
        seoData.hasMetaDescription,        // 2. Meta Description
        seoData.usesCleanContent,          // 3. Clean Content (plugins/structure)
        seoData.hasDescriptiveLinks,       // 4. Descriptive Links
    ];
  
    // Count passed tiles
    passedTiles = tiles.filter(status => status).length;
  
    // Calculate score as a percentage
    const score = Math.round((passedTiles / totalTiles) * 100);
    return score;
  };
  
  
  export const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';  // Green
    if (score >= 60) return '#ff9800';  // Orange
    if (score >= 40) return '#ff5722';  // Red
    return '#d32f2f';  // Dark Red for scores below 40
  };

  export const calculateMobileScore = (mobileData) => {
    if (!mobileData || typeof mobileData !== 'object') {
      return 0;
    }
  
    const checks = [
      mobileData.responsive,        // Responsive design
      mobileData.viewportMeta,      // Viewport meta tag
      mobileData.tapTargets,        // Proper tap targets
      mobileData.mobileSpeed,       // Page size/speed
      mobileData.fontSizes,         // Minimum font size
      mobileData.contentFitting     // Content fits viewport
    ];
  
    const passed = checks.filter(Boolean).length;
    const totalChecks = checks.length;
  
    return Math.round((passed / totalChecks) * 100);
  };
  
  export const calculateSecurityScore = (securityData) => {
    console.log('Security Data:', securityData); // Debug log
    
    const checks = [
      securityData.sslStatus === 'Valid',
      securityData.https,
      securityData.securityHeaders === 'Enabled',
      securityData.firewallDetected,
      securityData.corsPolicy !== 'Not configured',
      securityData.xssProtection !== 'Not configured',
      securityData.contentSecurityPolicy === 'Configured',
      securityData.cookieSecurity?.secure && 
      securityData.cookieSecurity?.httpOnly
    ];
  
    console.log('Check results:', checks); // Debug log
    
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  };