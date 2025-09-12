// Simple test to make sure everything works

function App () {

  const [savedActivity, setSavedActivity] = React.useState(null);
// how destructuring works, it is literally just saying that you don't have to create the array then assign the values in it
  // const array = React.usestate(null);
  // const savedActivity = array[0];
  // const setSavedActivity = array[1];
  React.useEffect(function() {
    chrome.storage.local.get(['lastActivity'], 
      function(result) { 
        if (result.lastActivity) 
          {setSavedActivity(result.lastActivity);

    }
    });
  }, []);

  function handleClick() {

    const activity = {
      name: 'Coding',
      time: new Date().toLocaleTimeString(),      
    };

    chrome.storage.local.set ({ lastActivity: activity}),  
      function () {
        console.log('Activity saved!')
      }
  }
    return React.createElement('button', {onClick: handleClick}, 'Coding')

}

ReactDOM.render(React.createElement(App), document.getElementById('root'));


