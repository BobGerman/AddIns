var config;
var btnEvent;

// The initialize function must be run each time a new page is loaded
Office.initialize = function (reason) {
};

// Add any ui-less function here
function showError(error) {
  Office.context.mailbox.item.notificationMessages.replaceAsync('github-error', {
    type: 'errorMessage',
    message: error
  }, function(result){
  });
}

var settingsDialog;

function toggleGap(event) {

  var gapMinutes = 10;               // Time gap in minutes
  var gapMsec = gapMinutes * 60000;  // Time gap in milliseconds

  // Get the existing end time
  Office.context.mailbox.item.end.getAsync({
    asyncContent: {verb: "Get"}
  }, function(result) {
    if (result.error) {
      console.debug(result.error);
    } else {

      // Adjust the end time
      var endTime = result.value;
      message = "No time adjustment made";
      if (!(endTime.getMinutes() % 15)) {
        endTime = new Date (endTime.getTime() - gapMsec);
        message = "Added a " + gapMinutes + " minute gap";
      } else if (!((endTime.getMinutes()+gapMinutes) % 15)) {
        endTime = new Date (endTime.getTime() + gapMsec);
        message = "Removed " + gapMinutes + " minute gap";
      }

      Office.context.mailbox.item.end.setAsync(endTime, {
        asyncContext: {verb:"Set"}
      }, function(result) {
        if (result.error) {
          console.debug(result.error);
        } else {
          Office.context.mailbox.item.body.setSelectedDataAsync(
            message + "!<br />",
            {coercionType: Office.CoercionType.Html}, function(result) {
              event.completed();
          });
          console.debug("TestCal succeeded: " + message);
        }
      });
    }
  });

}
