self.addEventListener("push", function (event) {
    const options = {
        body: event.data ? event.data.text() : "Reminder Alert!",
        icon: "reminder_icon.png",
        badge: "badge_icon.png",
        sound: "reminder.mp3",
        vibrate: [500, 200, 500, 200, 500],
        actions: [
            { action: "dismiss", title: "Dismiss" }
        ]
    };

    event.waitUntil(
        self.registration.showNotification("Reminder Alert", options)
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    if (event.action === "dismiss") {
        self.registration.getNotifications().then(notifications => {
            notifications.forEach(notification => notification.close());
        });
    }
});
