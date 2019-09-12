module.exports = function(options) {
  return {
    to: options.clientEmail,
    from: options.senderEmail,
    subject: `Purchase confirmation: ${options.serviceName} ${options.packageName}`,
    plaintextBody: `
      Hello,

      Thank you for your purchase!

      You have purchased:

      Service: ${options.serviceName}
      Package: ${options.packageName}
      Price: $${options.amount}
      
      Your purchase ref: ${options.transactionReference}

      I will contact you to arrange scheduling delivery of the service shortly.

      Warm regards,
      ${options.name}
    `,
    tags: [ 'purchase', 'confirmation', options.serviceName, options.packageName ]
  };
};
