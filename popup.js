function App() {
//We are going to run the function App that contains no parameters

  const [savedActivity, setSavedActivity] = React.useState(null);
  const [activityHistory, setActivityHistory] = React.useState([]);
  //First we set up two state variables for use effect, the first for making the buttons that have a default state of nul 
  //and second for creating an activity history
  //Both have a state variable and a changer 

  React.useEffect(function() {
    // then we need to load this in. this will run on mount but will not have result so it will not actually run the function. 
    //Once the useState array get's it's first item through this string literal array. (['lastActivity'] (I assume this is making a new item, the function will check for The parameter 'results', then if the lastActivity exists use setSavedActivity to put the acitivty into the array)
    chrome.storage.local.get(['lastActivity'], function(result) {
      if (result.lastActivity) {
        setSavedActivity(result.lastActivity);
      }
    });
    
    // Load the full activity history, this is going to get the activity from the activity history array. Using the .get method that chrome provides
    chrome.storage.local.get(['activityHistory'], function(result) {
      if (result.activityHistory) {
        setActivityHistory(result.activityHistory);
      }
    });
  }, []);
  

  function handleActivityClick(activityName) {
    const activity = {
      name: activityName,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      timestamp: new Date().getTime()
    };
    //Create a func handleActivityClick that rquires activityName
    // for the variable activity save the data in this particilar set of key value pairs
    // Save as last activity
    chrome.storage.local.set({ lastActivity: activity }, function() {
      console.log('Last activity saved:', activityName);
      setSavedActivity(activity);
    });
    // set the last activity to activity then log last activity saved as activity name
    //then use setsavedactivity to set actvitiy 
    // Add to history array
    const updatedHistory = [...activityHistory, activity];
    chrome.storage.local.set({ activityHistory: updatedHistory }, function() {
      console.log('Activity history updated');
      setActivityHistory(updatedHistory);
    });
  }
  //spreads activity history, into multiple entries, then sets 
  
  function clearHistory() {
    chrome.storage.local.set({ activityHistory: [] }, function() {
      console.log('History cleared');
      setActivityHistory([]);
    });
  }
  
  return React.createElement('div', null,
    React.createElement('h2', null, 'Time Tracker'),
    React.createElement('p', null, 'What were you doing?'),
    
    React.createElement('button', {
      onClick: function() { handleActivityClick('Coding'); },
      style: { display: 'block', width: '100%', padding: '10px', margin: '5px 0', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }
    }, 'Coding'),
    
    React.createElement('button', {
      onClick: function() { handleActivityClick('Driving'); },
      style: { display: 'block', width: '100%', padding: '10px', margin: '5px 0', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px' }
    }, 'Driving'),
    
    React.createElement('button', {
      onClick: function() { handleActivityClick('Focused Planning'); },
      style: { display: 'block', width: '100%', padding: '10px', margin: '5px 0', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '5px' }
    }, 'Focused Planning'),
    
    React.createElement('button', {
      onClick: function() { handleActivityClick('Unfocused Work'); },
      style: { display: 'block', width: '100%', padding: '10px', margin: '5px 0', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }
    }, 'Unfocused Work'),
    
    React.createElement('button', {
      onClick: function() { handleActivityClick('Gym'); },
      style: { display: 'block', width: '100%', padding: '10px', margin: '5px 0', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '5px' }
    }, 'Gym'),
    
    savedActivity ? 
      React.createElement('div', { 
        style: { marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }
      },
        React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Last Activity:'),
        React.createElement('p', { style: { margin: '0', fontSize: '14px' } }, 
          savedActivity.name + ' at ' + savedActivity.time
        )
      ) : 
      React.createElement('p', { 
        style: { marginTop: '20px', fontStyle: 'italic', color: '#666' }
      }, 'No activity logged yet'),
    
    // Activity History Section
    activityHistory.length > 0 ?
      React.createElement('div', { 
        style: { marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px' }
      },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
          React.createElement('h3', { style: { margin: '0' } }, 'Today\'s History:'),
          React.createElement('button', {
            onClick: clearHistory,
            style: { padding: '5px 10px', fontSize: '12px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px' }
          }, 'Clear')
        ),
        React.createElement('div', { style: { maxHeight: '200px', overflowY: 'auto' } },
          activityHistory.map(function(activity, index) {
            return React.createElement('div', { 
              key: index, 
              style: { fontSize: '12px', margin: '5px 0', padding: '8px', backgroundColor: 'white', borderRadius: '3px' } 
            },
              activity.time + ' - ' + activity.name
            );
          })
        )
      ) :
      null
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));