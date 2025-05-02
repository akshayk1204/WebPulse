const timeout = (promise, ms, message = 'Timeout exceeded') => {
    const timer = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    );
    return Promise.race([promise, timer]);
  };
  
  module.exports = timeout;
  