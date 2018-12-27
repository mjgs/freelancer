module.exports = function(options) {
  return {
    to: options.receiverEmail,
    from: options.senderEmail,
    subject: `Purchase confirmation: ${options.service} ${options.package}`,
    plaintextBody: `
      Hello,
      
      Thank you for your purchase!
      
      You have purchased:
      
      Service: ${options.service} 
      Package: ${options.package}
      Price: $${options.amount}  
      
      Your purchase ref: ${options.stripeChargeId}  
      
      I will contact you to arrange scheduling delivery of the service shortly.
                  
      Warm regards,
      ${options.name}
    `,
    tags: [ 'purchase', 'confirmation', options.service, options.package ]
  };
};
