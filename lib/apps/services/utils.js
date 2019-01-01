function getService(services, serviceName, packageName) {
  let price = undefined;
  services.every(function(element, index) {
    if (element.name === serviceName) {
      price = services[index].packages[packageName];
      return false // break out of the loop
    }
    else {
      return true; // Next item
    }
  });

  return price;
}

function safeLoggingReplacer(key, value) {
  const keysToRedact = [
    'stripeSecretKey',
    'mailgunApiKey'
  ];

  if ((keysToRedact.indexOf(key) !== -1) && (value !== '')) {
    return `object key redacted for debug printing - key name: ${key}`;
  }
  return value;
};

module.exports = {
  getService: getService,
  safeLoggingReplacer: safeLoggingReplacer
};
