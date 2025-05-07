const axios = require('axios');
const sslChecker = require('ssl-checker');

const wafSignatures = {
  'Akamai': {
    headers: ['x-akamai', 'x-akamai-request-id', 'x-akamai-security-test', 'akamai-origin-hop', 'x-cache', 'x-true-cache-key'],
    serverIncludes: ['AkamaiGHost'],
    viaIncludes: ['Akamai']
  },
  'Cloudflare': {
    headers: ['cf-ray', 'cf-cache-status', 'cf-request-id'],
    serverIncludes: ['cloudflare']
  },
  'Fastly': {
    headers: ['x-fastly-request-id', 'fastly-debug'],
    serverIncludes: ['Fastly']
  },
  'Radware': {
    headers: ['x-radware', 'x-waf-flag'],
    serverIncludes: ['Radware']
  },
  'Imperva': {
    headers: ['x-iinfo', 'incap-sid'],
    serverIncludes: ['incapsula']
  },
  'F5 BIG-IP': {
    headers: ['x-wa-info', 'f5-node', 'x-cdn'],
    serverIncludes: ['BigIP']
  },
  'Edgecast': {
    headers: ['x-edgecast', 'x-cache', 'x-edgecache'],
    serverIncludes: ['Edgecast', 'ECAcc']
  },
  'Edgio': {
    headers: ['x-edgio-request-id', 'x-edgio-cache-status'],
    serverIncludes: ['Edgio']
  },
  'AWS WAF': {
    headers: ['x-amzn-requestid', 'x-amz-cf-id', 'x-amz-security-token'],
    serverIncludes: ['AmazonS3', 'AWS']
  },
  'Barracuda': {
    headers: ['x-barracuda', 'barracuda-waf'],
    serverIncludes: ['Barracuda']
  },
  'Palo Alto Networks Prisma Cloud': {
    headers: ['x-prisma', 'x-paloalto'],
    serverIncludes: ['Prisma']
  },
  'Sucuri': {
    headers: ['x-sucuri-id', 'x-sucuri-cache'],
    serverIncludes: ['Sucuri']
  }
};

const detectWAF = (headers, body = '') => {
  const normalizedHeaders = Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
  );

  for (const [wafName, signature] of Object.entries(wafSignatures)) {
    const headerMatch = signature.headers?.some(sig =>
      Object.keys(normalizedHeaders).some(h => h.includes(sig.toLowerCase()))
    );

    const serverHeader = normalizedHeaders['server'] || '';
    const serverMatch = signature.serverIncludes?.some(val =>
      serverHeader.toLowerCase().includes(val.toLowerCase())
    );

    const viaHeader = normalizedHeaders['via'] || '';
    const viaMatch = signature.viaIncludes?.some(val =>
      viaHeader.toLowerCase().includes(val.toLowerCase())
    );

    if (headerMatch || serverMatch || viaMatch) {
      return { firewallDetected: true, firewallName: wafName };
    }
  }

  return { firewallDetected: false, firewallName: null };
};

const checkCookieSecurity = (cookies) => {
  if (!cookies) return { secure: false, httpOnly: false, sameSite: 'None' };

  const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
  return cookieArray.reduce((acc, cookie) => ({
    secure: acc.secure || cookie.includes('Secure'),
    httpOnly: acc.httpOnly || cookie.includes('HttpOnly'),
    sameSite: cookie.includes('SameSite=None') ? 'None' :
              cookie.includes('SameSite=Strict') ? 'Strict' :
              cookie.includes('SameSite=Lax') ? 'Lax' : acc.sameSite
  }), { secure: false, httpOnly: false, sameSite: 'None' });
};

const getSSLStatus = async (domain) => {
  const { checkSSLCertificate } = require('../utils/checkSSL');

  try {
    const sslInfo = await checkSSLCertificate(domain);
    return sslInfo.valid ? 'Valid' : 'Invalid';
  } catch (e) {
    console.warn('SSL check failed:', e.message);
    return 'Invalid';
  }
};

const getSecurity = async (domain) => {
  try {
    let httpsAvailable = false;
    let response;

    try {
      response = await axios.get(`https://${domain}`, {
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true,
        transformResponse: res => res
      });
      httpsAvailable = true;
    } catch {
      try {
        response = await axios.get(`http://${domain}`, {
          timeout: 5000,
          maxRedirects: 5,
          validateStatus: () => true,
          transformResponse: res => res
        });
      } catch {
        throw new Error('Both HTTP and HTTPS connections failed');
      }
    }

    const headers = response.headers;
    const body = response.data || '';
    const sslStatus = httpsAvailable ? await getSSLStatus(domain) : 'Not applicable';

    const firewallInfo = detectWAF(headers, body);
    const cookieSecurity = checkCookieSecurity(headers['set-cookie']);

    console.log('Security metrics for domain:', domain);
    console.dir({
    sslStatus,
    https: httpsAvailable,
    securityHeaders: headers['strict-transport-security'] ? 'Enabled' : 'Disabled',
    firewallDetected: firewallInfo.firewallDetected,  
    firewallName: firewallInfo.firewallName,
    corsPolicy: headers['access-control-allow-origin']
        ? (headers['access-control-allow-origin'] === '*' ? 'Public' : 'Restricted')
        : 'Not configured',
    xssProtection: headers['x-xss-protection'] || 'Not configured',
    contentSecurityPolicy: headers['content-security-policy'] ? 'Configured' : 'Not configured',
    cookieSecurity,
    lastChecked: new Date().toISOString()
    }, { depth: null });
    return {
      sslStatus,
      https: httpsAvailable,
      securityHeaders: headers['strict-transport-security'] ? 'Enabled' : 'Disabled',
      firewallDetected: firewallInfo.firewallDetected,  
      firewallName: firewallInfo.firewallName,
      corsPolicy: headers['access-control-allow-origin']
        ? (headers['access-control-allow-origin'] === '*' ? 'Public' : 'Restricted')
        : 'Not configured',
      xssProtection: headers['x-xss-protection'] || 'Not configured',
      contentSecurityPolicy: headers['content-security-policy'] ? 'Configured' : 'Not configured',
      cookieSecurity,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    console.error('Security check failed:', error.message);
    return {
      error: 'Security check failed',
      details: error.message,
      sslStatus: 'Error',
      https: false,
      securityHeaders: 'Error',
      firewallDetected: false,
      firewallName: null,
      corsPolicy: 'Error',
      xssProtection: 'Error',
      contentSecurityPolicy: 'Error',
      cookieSecurity: {
        secure: false,
        httpOnly: false,
        sameSite: 'None'
      },
      lastChecked: new Date().toISOString()
    };
  }
};

module.exports = { getSecurity };
