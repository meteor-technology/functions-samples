'use strict';

const functions = require('firebase-functions');
const rp = require('request-promise');

// Helper function that posts to Slack about the new issue
function notifySlack(slackMessage) {
  // See https://api.slack.com/docs/message-formatting on how
  // to customize the message payload
  return rp({
    method: 'POST',
    uri: functions.config().slack.webhook_url,
    body: {
      slackMessage,
    }
  });
}

// [START on_new_issue]
exports.postOnNewIssue = functions.crashlytics.issue().onNew(async (issue) => {
  const issueId = issue.issueId;
  const issueTitle = issue.issueTitle;
  const appName = issue.appInfo.appName;
  const appPlatform = issue.appInfo.appPlatform;
  const latestAppVersion = issue.appInfo.latestAppVersion;


  const messageBody = {
    "username": "Firebase Crashlytics", // This will appear as user name who posts the message
    "text": "新しい問題が発生しました",
    "icon_emoji": ":firebase:", // User icon, you can also use custom icons here
    "attachments": [{ // this defines the attachment block, allows for better layout usage
      "color": "#ff8c00", // color of the attachments sidebar.
      "fields": [ // actual fields
        {
          "title": "Issue Title", // Custom field
          "text": issueTitle
        },
        {
          "title": "Issue Number",
          "text": issueId
        },
        {
          "title": "App Name",
          "text": appName
        },
        {
          "title": "App Version",
          "text": `${latestAppVersion} on ${appPlatform}`
        }
      ]
    }]
  };

  await notifySlack(messageBody);
  console.log(`Posted new issue ${issueId} successfully to Slack`);
});
// [END on_new_issue]

exports.postOnRegressedIssue = functions.crashlytics.issue().onRegressed(async (issue) => {
  const issueId = issue.issueId;
  const issueTitle = issue.issueTitle;
  const appName = issue.appInfo.appName;
  const appPlatform = issue.appInfo.appPlatform;
  const latestAppVersion = issue.appInfo.latestAppVersion;
  const resolvedTime = issue.resolvedTime;

  const messageBody = {
    "username": "Firebase Crashlytics", // This will appear as user name who posts the message
    "text": `${new Date(resolvedTime).toString()} 以来、再び問題が発生しました`,
    "icon_emoji": ":firebase:", // User icon, you can also use custom icons here
    "attachments": [{ // this defines the attachment block, allows for better layout usage
      "color": "#ff8c00", // color of the attachments sidebar.
      "fields": [ // actual fields
        {
          "title": "Issue Title", // Custom field
          "text": issueTitle
        },
        {
          "title": "Issue Number",
          "text": issueId
        },
        {
          "title": "App Name",
          "text": appName
        },
        {
          "title": "App Version",
          "text": `${latestAppVersion} on ${appPlatform}`
        }
      ]
    }]
  };


  await notifySlack(messageBody);
  console.log(`Posted regressed issue ${issueId} successfully to Slack`);
});

exports.postOnVelocityAlert = functions.crashlytics.issue().onVelocityAlert(async (issue) => {
  const issueId = issue.issueId;
  const issueTitle = issue.issueTitle;
  const appName = issue.appInfo.appName;
  const appPlatform = issue.appInfo.appPlatform;
  const latestAppVersion = issue.appInfo.latestAppVersion;
  const crashPercentage = issue.velocityAlert.crashPercentage;

  const messageBody = {
    "username": "Firebase Crashlytics", // This will appear as user name who posts the message
    "text": `この問題は ${parseFloat(crashPercentage).toFixed(2)} % のユーザーに発生しています`,
    "icon_emoji": ":firebase:", // User icon, you can also use custom icons here
    "attachments": [{ // this defines the attachment block, allows for better layout usage
      "color": "#e2222e", // color of the attachments sidebar.
      "fields": [ // actual fields
        {
          "title": "Issue Title", // Custom field
          "text": issueTitle
        },
        {
          "title": "Issue Number",
          "text": issueId
        },
        {
          "title": "App Name",
          "text": appName
        },
        {
          "title": "App Version",
          "text": `${latestAppVersion} on ${appPlatform}`
        }
      ]
    }]
  };

  await notifySlack(messageBody);
  console.log(`Posted velocity alert ${issueId} successfully to Slack`);
});
