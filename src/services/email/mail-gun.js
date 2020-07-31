const Mailgun = require('mailgun-js');
const config = require('../../config');

const apiKey = config.email.getMailGunAPIKey();
const domain = config.email.getMailGunDomain();
const emailFrom = config.email.getEmailFrom();
const mailgun = new Mailgun({ apiKey, domain });

const sendEmail = (data, userConfig) => {

  const mailgunInstance = userConfig ? new Mailgun({ apiKey: userConfig.apiKey, domain: userConfig.domain }) : mailgun;

  return new Promise((resolve, reject) => {
    mailgunInstance.messages().send({ ...data, from: emailFrom }, function (error, body) {
      if (error) {
        reject(error);
      }
      resolve(body);
    });
  });

};

module.exports = {
  sendEmail
};