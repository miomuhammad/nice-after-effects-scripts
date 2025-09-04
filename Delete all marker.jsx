var comp = app.project.activeItem;
if (comp != null && (comp instanceof CompItem)){
    var selectedLayers = comp.selectedLayers;
    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        while (layer.marker.numKeys > 0) {
            layer.marker.removeKey(1);
        }
    }
}
