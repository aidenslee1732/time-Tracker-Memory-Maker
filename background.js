// This runs when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(function() {
  console.log('Time tracker extension installed');
  
  // Create a repeating alarm that goes off every 15 minutes
  chrome.alarms.create('activityReminder', {
    delayInMinutes: 15,
    periodInMinutes: 15
  });
  
  console.log('15-minute timer started');
});

// This runs every time the alarm goes off
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'activityReminder') {
    console.log('Time to log your activity!');
    
    // Set a badge on the extension icon to get user's attention
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    
    // Show a notification (optional - requires 'notifications' permission)
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Time Tracker',
      message: 'What have you been doing for the last 15 minutes?'
    });
  }
});

// Clear the badge when user opens the popup
chrome.action.onClicked.addListener(function() {
  chrome.action.setBadgeText({ text: '' });
});

console.log('Time tracker background script loaded');