var ctd = 0;
var tileDescs = ["GN"];
function setTile(text) {
    var Notifications = Windows.UI.Notifications;
    var currentTime = new Date();
    var seconds = 5;
    var dueTime = new Date(currentTime.getTime() + seconds);
    var idNumber = Math.floor(Math.random() * 100000000);  // Generates a unique ID number for the notification.
    var tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileWide310x150Text09);
    var tileTextAttributes = tileXml.getElementsByTagName("text");
    tileTextAttributes[0].appendChild(tileXml.createTextNode(text));
    tileTextAttributes[1].appendChild(tileXml.createTextNode("New Story as of: " + dueTime.toLocaleTimeString()));
    var squareTileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileSquare150x150Text04);
    var squareTileTextAttributes = squareTileXml.getElementsByTagName("text");
    squareTileTextAttributes[0].appendChild(squareTileXml.createTextNode(text));
    var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
    tileXml.getElementsByTagName("visual").item(0).appendChild(node);
    var futureTile = new Notifications.ScheduledTileNotification(tileXml, dueTime);
    futureTile.id = "Tile" + idNumber;
    Notifications.TileUpdateManager.createTileUpdaterForApplication().addToSchedule(futureTile);
}
function cycleTiles() {
    if (ctd >= length(tileDescs)) {
        setTile(tileDescs[ctd]);
        ctd = 0;
    }
    else {
        setTile(tileDescs[ctd]);
        ctd++;
    }
}
(function () {
    "use strict";

    var cancel = false,
        progress = 0,
        backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current,
        cancelReason = "";

    function onCanceled(cancelEventArg) {
        cancel = true;
        cancelReason = cancelEventArg.type;
    }
    backgroundTaskInstance.addEventListener("canceled", onCanceled);

    function onTimer() {
        var key = null,
            settings = Windows.Storage.ApplicationData.current.localSettings,
            value = null;
        tileDescs = settings["tiledescs"];
        if ((!cancel) && (progress < 100)) {
            setTimeout(onTimer, 1000);
            progress == 100;
            cycleTiles();
            backgroundTaskInstance.progress = progress;
        } else {
            backgroundTaskInstance.succeeded = (progress === 100);
            value = backgroundTaskInstance.succeeded ? "Completed" : "Canceled with reason:" + cancelReason;

            key = backgroundTaskInstance.task.name;
            settings.values[key] = value;

            close();
        }
    }
    setTimeout(onTimer, 1000);
})();