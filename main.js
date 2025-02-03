// Register the Service Worker for Push Notifications
if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker.register("sw.js").then(reg => {
        console.log("Service Worker Registered");
    });
}

// Ask for Notification Permission
function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
        }
    });
}

document.addEventListener("DOMContentLoaded", requestNotificationPermission);

document.getElementById("setReminderBtn").addEventListener("click", function () {
    let reminderText = document.getElementById("reminderText").value;
    let reminderTime = new Date(document.getElementById("reminderTime").value).getTime();
    
    if (!reminderText || isNaN(reminderTime)) {
        alert("Please enter a valid reminder and time!");
        return;
    }

    let currentTime = new Date().getTime();
    let timeDifference = reminderTime - currentTime;

    if (timeDifference <= 0) {
        alert("Please select a future time!");
        return;
    }

    setTimeout(() => {
        showReminder(reminderText);
        sendPushNotification(reminderText);
    }, timeDifference);
    
    alert("Reminder set successfully!");
});

function showReminder(text) {
    let popup = document.getElementById("reminderPopup");
    let message = document.getElementById("reminderMessage");
    let sound = document.getElementById("reminderSound");

    message.textContent = text;
    popup.classList.remove("hidden");

    // Play Sound (like ringtone)
    sound.loop = true;
    sound.play();

    // Vibrate (Only works on mobile)
    if ("vibrate" in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
    }

    // Keep screen awake (Wake Lock API)
    if ("wakeLock" in navigator) {
        navigator.wakeLock.request("screen").catch(err => console.log("Wake Lock error:", err));
    }

    // Stop Reminder After 30s if Not Dismissed
    setTimeout(() => {
        if (!popup.classList.contains("hidden")) {
            dismissReminder();
        }
    }, 30000);

    // Dismiss button functionality
    document.getElementById("dismissReminder").addEventListener("click", dismissReminder);
}

function dismissReminder() {
    let popup = document.getElementById("reminderPopup");
    let sound = document.getElementById("reminderSound");

    popup.classList.add("hidden");
    sound.pause();
    sound.currentTime = 0;

    // Stop vibration
    navigator.vibrate(0);
}

function sendPushNotification(message) {
    navigator.serviceWorker.ready.then(reg => {
        reg.showNotification("Reminder Alert", {
            body: message,
            icon: "reminder_icon.png",
            badge: "badge_icon.png",
            vibrate: [500, 200, 500],
            actions: [{ action: "dismiss", title: "Dismiss" }]
        });
    });
}
