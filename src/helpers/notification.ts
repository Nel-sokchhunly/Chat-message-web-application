export function askNotificationPermission() {
  if (!('Notification' in window)) {
    // Check if the browser supports notifications
    alert('This browser does not support desktop notification');
  } else if (Notification.permission !== 'denied') {
    // We need to ask the user for permission
    Notification.requestPermission();
  }
}

export function sendNotification(title: string) {
  if ('Notification' in window) {
    new Notification(title, {
      image: '/icon/chat.png'
    });
  }
}
