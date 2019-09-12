module.exports = function(options) {
  return {
    to: options.receiverEmail,
    from: options.senderEmail,
    subject: `New Purchase: ${options.serviceName} ${options.packageName} from ${options.clientEmail}`,
    plaintextBody: `
      Hello,
      
      Somebody purchased some of your freelancer services!
      
      Client with email ${options.clientEmail} purchased:
      
      Service: ${options.serviceName}
      Package: ${options.packageName}
      Price: $${options.amount}
      
      Charge id: ${options.transactionReference}
                  
      Warm regards,
      ${options.name}
    `,
    tags: [ 'purchase', 'notification', options.serviceName, options.packageName ]
  };
};
