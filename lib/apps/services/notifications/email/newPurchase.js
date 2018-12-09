module.exports = function(options) {
  return {
    to: options.receiverEmail,
    from: options.senderEmail,
    subject: `New Purchase: ${options.service} ${options.package} from ${options.clientEmail}`,
    plaintextBody: `
      Hello,
      
      Somebody purchased some of your freelancer services!
      
      Client with email ${options.clientEmail} purchased:
      
      Service: ${options.service} 
      Package: ${options.package}
      Price: $${options.amount}  
      
      Charge id: ${options.stripeChargeId}  
                  
      Warm regards,
      ${options.name}
    `,
    tags: [ 'purchase', 'notification', options.service, options.package ]
  };
};
