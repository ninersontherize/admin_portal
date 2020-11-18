// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set region
AWS.config.update({region: 'us-west-1'});
// Create publish parameters
var params = {
  Message: 'MESSAGE_TEXT', /* required */
  TopicArn: 'TOPIC_ARN'
};

function sendErrorMessage(message) {
  // Create publish parameters
  var params = {
    Message: `${message}`, /* required */
    TopicArn: 'arn:aws:sns:us-west-1:136641431322:casual-notif'
  };

  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  // Handle promise's fulfilled/rejected states
  publishTextPromise.then(
    function(data) {
      console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
      console.log("MessageID is " + data.MessageId);
    }).catch(
      function(err) {
        console.error(err, err.stack);
      }
    );
};

exports.sendErrorMessage = sendErrorMessage;
