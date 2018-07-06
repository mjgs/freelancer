module.exports = function(options) {
  return {
    to: options.receiverEmail,
    from: options.senderEmail,
    subject: `Error: ${options.err.message}`,
    plaintextBody: `
      Hello,
      
      There was an error on ${options.domain}.
      
      The error was:
      
      ${JSON.stringify(options.err, 0, 2)});
      
      The stack trace is:
      
      ${JSON.stringify(options.err.stack, 0, 2)});
                  
      Warm regards,
      ${options.name}
    `,
    tags: [ 'notification', 'error' ]
  };
};
