importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);
// importScripts("./assets/jsfile/myjsFile.js");
firebase.initializeApp({
  // apiKey: "AIzaSyCDl0c57XoWrqOApt-GDjGbV-L1iD58lco",
  // authDomain: "hrms-uvtechsoft.firebaseapp.com",
  // projectId: "hrms-uvtechsoft",
  // storageBucket: "hrms-uvtechsoft.appspot.com",
  // messagingSenderId: "525311089274",
  // appId: "1:525311089274:web:209ed23c37f61cdcbcb9c3",
  // measurementId: "G-P8EET3NV79"
  apiKey: "AIzaSyDD0ZQoXS9TNo_dcCad6RI7nC2AvrSJRAg",
  authDomain: "mithra-ff136.firebaseapp.com",
  projectId: "mithra-ff136",
  storageBucket: "mithra-ff136.appspot.com",
  messagingSenderId: "159093094713",
  appId: "1:159093094713:web:05a0afccc79ad559c2d0e8",
  measurementId: "G-F79XY2WN0E"
});

const messaging = firebase.messaging();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("firebase-messaging-sw.js").then(function (registration) { }).catch(function (err) { console.log("error", err); });
}

messaging.onBackgroundMessage((payload) => {
  self.clients.matchAll({
    type: "window", includeUncontrolled: true
  }).then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(payload);
    });
  });
});

self.addEventListener("push", (event) => {
  const promiseChain = isClientFocused(event).then((clientIsFocused) => {
    var data = event.data.json().data;
    var title = data.title || "No tiltle";
    var message = JSON.parse(data.body)
    self.registration.showNotification(title, {
      body: body,
      icon: './assets/logo1.png',
      tag: 'Mithara',
    })
    return;
  });
  event.waitUntil(promiseChain);
});

function isClientFocused(event) {

  var data = event.data.json().data;
  var message1 = undefined;
  message1 = JSON.parse(data.data1);
  return clients.matchAll({ type: "window", includeUncontrolled: true, }).then((windowClients) => {
    let clientIsFocused = false;
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.focused) {
        clientIsFocused = false;
        break;
      }
    }
    return false;
  });
}