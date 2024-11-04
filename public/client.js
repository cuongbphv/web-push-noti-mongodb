const publicVapidKey = 'publicVapidKey';

if ('serviceWorker' in navigator) {
  run().catch(error => console.error(error));
}

async function run() {
  const registration = await navigator.serviceWorker.
    register('/worker.js', { scope: '/' });
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
}

function deleteTask(id) {
  fetch('/' + id, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}