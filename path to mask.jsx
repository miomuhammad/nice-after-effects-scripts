(function copySelectedPathsToMasks() {
    app.beginUndoGroup("Copy Selected Paths to Masks");

    function getActiveComp() {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("🚫 Tidak ada komposisi aktif.");
            return null;
        }
        return comp;
    }

    function isPathProperty(prop) {
        return prop && (
            prop.matchName === "ADBE Vector Shape" || // shape path
            prop.matchName === "ADBE Mask Shape"
        );
    }

    function extractPathFromGroup(prop) {
        if (
            prop &&
            prop.canSetExpression === false && // biasanya group
            prop.property("Path") &&
            prop.property("Path").matchName === "ADBE Vector Shape"
        ) {
            return prop.property("Path");
        }
        return null;
    }

    function collectUniquePaths() {
        var comp = getActiveComp();
        if (!comp) return [];

        var uniquePaths = [];

        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("🚫 Pilih layer yang berisi path.");
            return [];
        }

        for (var l = 0; l < selectedLayers.length; l++) {
            var layer = selectedLayers[l];
            var selectedProps = layer.selectedProperties;

            for (var p = 0; p < selectedProps.length; p++) {
                var prop = selectedProps[p];

                var validPath = null;

                if (isPathProperty(prop)) {
                    validPath = prop;
                } else {
                    var extracted = extractPathFromGroup(prop);
                    if (extracted) {
                        validPath = extracted;
                    }
                }

                if (validPath && uniquePaths.indexOf(validPath) === -1) {
                    uniquePaths.push({ layer: layer, pathProp: validPath });
                }
            }
        }

        return uniquePaths;
    }

    var paths = collectUniquePaths();

    if (paths.length === 0) {
        alert("🚫 Tidak ada path yang valid dipilih.");
        app.endUndoGroup();
        return;
    }

    // Buat mask untuk setiap path
    for (var i = 0; i < paths.length; i++) {
        var pathData = paths[i];
        var shape = pathData.pathProp.value;
        var newMask = pathData.layer.Masks.addProperty("ADBE Mask Atom");
        newMask.maskMode = MaskMode.ADD;
        newMask.property("ADBE Mask Shape").setValue(shape);
    }

    app.endUndoGroup();
})();
