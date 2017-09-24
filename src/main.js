if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function (registration) {
      registration.onupdatefound = function () {
        if (navigator.serviceWorker.controller) {
          const installingWorker = registration.installing;

          installingWorker.onstatechange = function () {
            switch (installingWorker.state) {
              case 'installed':
                console.log('updated');
                break;
              case 'redundant':
                throw new Error('The installing service worker became redundant.');
            }
          };
        }
      };
    }).catch(function (e) {
      console.error('Error during service worker registration:', e);
    });
}


