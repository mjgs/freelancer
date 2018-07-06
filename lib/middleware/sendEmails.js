const debug = require('debug')('freelancer:middleware:sendEmails');
const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const async = require('async');

const env = require('../environment');
const notifications = require('../notifications');
const profile = require('../data').profile;

module.exports = function sendEmails(options) {
  const smtpOptions = {
    auth: {
      api_key: options.mailgunApiKey,
      domain: options.mailgunDomain
    }
  };

  let smtpTransport;

  if (env.mailgunEnabled) {
     smtpTransport = mailgunTransport(smtpOptions);
  }

  return function sendEmails(req, res, next) {
    function sendListOfEmails(optionsList, cb) {
      function sendEmail(options, callback) {
        const mailOptions = {
          from: options.from,
          to: options.to,
          subject: options.subject,
          text: options.plaintextBody,
          html: options.htmlBody,
          'o:tag': options.tags
        };

        debug(`smtpOptions: ${JSON.stringify(smtpOptions)}`);

        if (env.mailgunEnabled) {
          debug(`Mailgun Live Mode - Sending email with mailOptions: ${JSON.stringify(mailOptions)}`);

          const nodemailerMailgun = nodemailer.createTransport(smtpTransport);
          nodemailerMailgun.sendMail(mailOptions, function(err, response) {
            if (err) {
              return callback(err);
            }

            const responseInfo = {
              id: response.id,
              subject: response.subject,
              message: response.message
            };

            debug(`Mailgun Live Mode ${JSON.stringify(responseInfo, 0, 2)}`);

            return callback();
          });
        }
        else {
          debug(`Mailgun Test Mode - Sending email with mailOptions: ${JSON.stringify(mailOptions, 0, 2)}`);
          return callback();
        }
      }

      async.map(optionsList, sendEmail, function(err) {
        if (err) {
          return cb(err);
        }
        return cb();
      });
    }

    function sendErrorNotificationEmail(err) {
      if (err.status !== 404) {
        const emailOptionsMe =
          notifications.email.errorNotification({
          domain: profile.domain,
          senderEmail: profile.email.sender,
          receiverEmail: profile.email.receiver,
          name: profile.name,
          err: err
        });

        // Send emails and don't wait for response (don't call a callback)
        sendListOfEmails([ emailOptionsMe ], function(err) {});
      }
    }

    res.sendEmails = sendListOfEmails;
    res.sendErrorNotificationEmail = sendErrorNotificationEmail;

    return next();
  };
};
