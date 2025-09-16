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
    
    // Create notification (with ID for tracking)
    chrome.notifications.create('activity-reminder', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Time Tracker',
      message: 'What have you been doing for the last 15 minutes?'
    });
    
    // Set badge
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
  }
});

// SEPARATE listener - registered ONCE, handles ALL notification clicks
chrome.notifications.onClicked.addListener(function(notificationID) {
  console.log('Notification clicked:', notificationID);
  
  // Clear the notification
  chrome.notifications.clear(notificationID);
  
  // Open extension in new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html')
  });
});

// Clear badge when user clicks extension icon
chrome.action.onClicked.addListener(function() {
  chrome.action.setBadgeText({ text: '' });
});

console.log('Time tracker background script loaded');