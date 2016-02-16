notifications.factory('notificationService', function() {
  var obj={};
  var hidden, visibilityChange;
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10, Firefox >=18, Chrome >=31, IE11
    hidden = 'hidden';
    visibilityChangeEvent = 'visibilitychange';
  } else if (typeof document.mozHidden !== 'undefined') {
    // Older firefox
    hidden = 'mozHidden';
    visibilityChangeEvent = 'mozvisibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    // IE10
    hidden = 'msHidden';
    visibilityChangeEvent = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    // Chrome <31 and Android browser (4.4+ !)
    hidden = 'webkitHidden';
    visibilityChangeEvent = 'webkitvisibilitychange';
  }

  function visibleChangeHandler() {
    if (document[hidden]) {
      obj.userAway = true;
    } else {
      obj.userAway = false;
      if(obj.instance)
      {
        obj.instance.close();
      }
    }
  }
  if (typeof document.addEventListener === 'undefined' ||
    typeof document[hidden] === 'undefined') {
    console.log('Visibility not supported!');
  } else {
    document.addEventListener(visibilityChangeEvent, visibleChangeHandler, false);
  }
  obj.show = function(title, msg) {
    if (!this.userAway) return;
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.');
      return;
    }
    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
      if(this.instance) this.instance.close();
      this.instance= new Notification(title, {
        icon:'/assets/TBlogo.png',
        body: msg
      });
      this.instance.onclick = function() {
        window.focus();
      };
    }
  }
  return obj;
});
