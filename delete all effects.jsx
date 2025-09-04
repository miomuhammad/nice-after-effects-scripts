// Delete all effects from selected layers
var activeComp = app.project.activeItem;
if (activeComp && activeComp instanceof CompItem) {
    var selectedLayers = activeComp.selectedLayers;
    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        while (layer.property("ADBE Effect Parade").numProperties > 0) {
            layer.property("ADBE Effect Parade").property(1).remove();
        }
    }
}
