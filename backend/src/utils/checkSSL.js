const tls = require('tls');

function checkSSLCertificate(hostname, port = 443, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const options = {
      host: hostname,
      port,
      servername: hostname,
      rejectUnauthorized: false // We're just inspecting, not enforcing trust
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate();

      if (!cert || Object.keys(cert).length === 0) {
        reject(new Error('No certificate found'));
      } else {
        const validTo = new Date(cert.valid_to);
        const validFrom = new Date(cert.valid_from);
        const now = new Date();

        resolve({
          valid: now >= validFrom && now <= validTo,
          validFrom,
          validTo,
          subjectCN: cert.subject.CN,
          issuerCN: cert.issuer.CN
        });
      }

      socket.end();
    });

    socket.setTimeout(timeout, () => {
      socket.destroy();
      reject(new Error('SSL check timed out'));
    });

    socket.on('error', reject);
  });
}

module.exports = { checkSSLCertificate };
