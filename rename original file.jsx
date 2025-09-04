if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
    var comp = app.project.activeItem;
    var selectedLayers = comp.selectedLayers;

    if (selectedLayers.length > 0) {
        var layer = selectedLayers[0]; // Take the first selected layer
        var source = layer.source;

        if (source instanceof FootageItem && source.file) {
            // Prompt the user for a new name
            var newName = prompt("Enter a new name for the file:", source.name);

            if (newName) {
                // Rename the asset in After Effects
                source.name = newName;

                // Rename the file on disk
                var originalPath = source.file.fsName;
                var newPath = source.file.parent.fsName + "/" + newName;

                try {
                    var file = new File(originalPath);
                    if (file.rename(newName)) {
                        var newFile = new File(newPath);

                        // Update all references to the renamed footage
                        app.beginUndoGroup("Rename and Update Footage");
                        for (var i = 1; i <= app.project.numItems; i++) {
                            var item = app.project.item(i);
                            if (item instanceof FootageItem && item.file && item.file.fsName === originalPath) {
                                item.replace(newFile);
                            }
                        }
                        app.endUndoGroup();

                        alert("File renamed and references updated successfully!");
                    } else {
                        alert("Failed to rename the file on disk.");
                    }
                } catch (e) {
                    alert("Error renaming file: " + e.toString());
                }
            }
        } else {
            alert("Selected layer does not reference a footage file.");
        }
    } else {
        alert("Please select a layer in the composition.");
    }
} else {
    alert("No active composition found.");
}
