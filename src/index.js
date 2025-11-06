import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './Root';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);

// Register service worker for PWA and subscribe to push notifications
if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js');
			console.log('Service Worker registered with scope:', registration.scope);

			// Request notification permission
			if ('Notification' in window && Notification.permission !== 'granted') {
				await Notification.requestPermission();
			}

			// Subscribe to push notifications
			if ('PushManager' in window && Notification.permission === 'granted') {
				const subscribeOptions = {
					userVisibleOnly: true,
					applicationServerKey: urlBase64ToUint8Array('<YOUR_PUBLIC_VAPID_KEY_HERE>')
				};
				const subscription = await registration.pushManager.subscribe(subscribeOptions);
				console.log('Push subscription:', JSON.stringify(subscription));
				// TODO: Send subscription to your backend server for later push
			}
		} catch (err) {
			console.error('Service Worker registration or push subscription failed:', err);
		}
	});
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
