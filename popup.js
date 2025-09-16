function App() {
  const [savedActivity, setSavedActivity] = React.useState(null);
  const [activityHistory, setActivityHistory] = React.useState([]);
  
  React.useEffect(function() {
    chrome.storage.local.get(['lastActivity'], function(result) {
      if (result.lastActivity) {
        setSavedActivity(result.lastActivity);
      }
    });
    
    chrome.storage.local.get(['activityHistory'], function(result) {
      if (result.activityHistory) {
        setActivityHistory(result.activityHistory);
      }
    });
  }, []);
  
  function calculateSummary(activityHistory) {
    if (activityHistory.length === 0) return [];  // Fixed: acitivityHistory → activityHistory

    const counts = {};
    activityHistory.forEach(function(activity) {  // Fixed: foreach → forEach
      if (counts[activity.name]) {
        counts[activity.name] = counts[activity.name] + 1;
      } else { 
        counts[activity.name] = 1; 
      }
    });

    const total = activityHistory.length;
    const summary = [];

    for (const activityName in counts) {
      const count = counts[activityName];
      const percentage = Math.round((count / total) * 100);
      const hours = (count * 15) / 60;
      
      summary.push({
        name: activityName,
        count: count,
        percentage: percentage,
        hours: hours.toFixed(1)
      });
    }

    return summary;
  }

  function handleActivityClick(activityName) {
    const activity = {
      name: activityName,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      timestamp: new Date().getTime()
    };

    chrome.storage.local.set({ lastActivity: activity }, function() {
      console.log('Last activity saved:', activityName);
      setSavedActivity(activity);
    });

    const updatedHistory = [...activityHistory, activity];
    chrome.storage.local.set({ activityHistory: updatedHistory }, function() {
      console.log('Activity history updated');
      setActivityHistory(updatedHistory);
    });
  }
  
  function clearHistory() {
    chrome.storage.local.set({ activityHistory: [] }, function() {
      console.log('History cleared');
      setActivityHistory([]);
    });
  }
  
  // Calculate summary inside the component
  const summary = calculateSummary(activityHistory);
  
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
      null,  // Fixed: Added missing comma

    // Summary Section  
    summary.length > 0 ?
      React.createElement('div', { 
        style: { marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }
      },
        React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Today\'s Summary:'),
        React.createElement('div', null,
          summary.map(function(item, index) {
            return React.createElement('div', { 
              key: index,
              style: { fontSize: '13px', margin: '5px 0', display: 'flex', justifyContent: 'space-between' }
            },
              React.createElement('span', null, item.name + ':'),
              React.createElement('span', null, item.percentage + '% (' + item.hours + ' hours)')
            );
          })
        )
      ) :
      null
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));