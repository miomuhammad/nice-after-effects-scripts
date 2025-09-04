function showThresholdPopup() {
    var win = new Window("dialog", "Keyframe Cleanup Settings");

    win.orientation = "column";
    win.alignChildren = "left";

    // Removal Threshold Group
    var removalGroup = win.add("group");
    removalGroup.add("statictext", undefined, "Removal Threshold:");
    var removalInput = removalGroup.add("edittext", undefined, "0"); // Default value set to 0
    removalInput.characters = 5;

    var removalHelp = removalGroup.add("statictext", undefined, "?");
    removalHelp.graphics.font = ScriptUI.newFont("Arial", "Bold", 12);
    removalHelp.helpTip = "Set a threshold for removing keyframes with similar values. A smaller number makes the script more sensitive to value changes.";

    // Reinforcement Threshold Group
    var reinforceGroup = win.add("group");
    reinforceGroup.add("statictext", undefined, "Reinforcement Threshold:");
    var reinforceInput = reinforceGroup.add("edittext", undefined, "0"); // Default value set to 0
    reinforceInput.characters = 5;

    var reinforceHelp = reinforceGroup.add("statictext", undefined, "?");
    reinforceHelp.graphics.font = ScriptUI.newFont("Arial", "Bold", 12);
    reinforceHelp.helpTip = "Set a threshold for reinforcement. This value can be used for future extensions, like avoiding removing keyframes if there's reinforcement over a threshold.";

    // Apply Button
    var buttonGroup = win.add("group");
    var applyButton = buttonGroup.add("button", undefined, "Apply");

    applyButton.onClick = function() {
        win.close(1);
    };

    var result = win.show();

    if (result == 1) {
        return {
            removalThreshold: parseFloat(removalInput.text),
            reinforceThreshold: parseFloat(reinforceInput.text)
        };
    } else {
        return null;
    }
}

function compareValues(val1, val2, threshold) {
    if (Array.isArray(val1) && Array.isArray(val2)) {
        for (var i = 0; i < val1.length; i++) {
            if (Math.abs(val1[i] - val2[i]) > threshold) {
                return false;
            }
        }
        return true;
    } else {
        return Math.abs(val1 - val2) <= threshold;
    }
}

function deleteUnnecessaryKeyframes(thresholds) {
    var comp = app.project.activeItem;

    if (!(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select at least one layer.");
        return;
    }

    app.beginUndoGroup("Delete Unnecessary Keyframes");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var selectedProperties = layer.selectedProperties;

        if (selectedProperties.length === 0) {
            alert("Please select at least one property.");
            continue;
        }

        for (var j = 0; j < selectedProperties.length; j++) {
            var property = selectedProperties[j];

            if (!(property instanceof Property) || !property.isTimeVarying) {
                continue;
            }

            var numKeyframes = property.numKeys;

            for (var k = numKeyframes; k > 1; k--) {
                var keyValue = property.keyValue(k);
                var prevKeyValue = property.keyValue(k - 1);

                // Compare keyframe values using the specified threshold
                if (compareValues(keyValue, prevKeyValue, thresholds.removalThreshold)) {
                    property.removeKey(k);
                }
            }
        }
    }

    app.endUndoGroup();
}

var thresholds = showThresholdPopup();

if (thresholds !== null) {
    deleteUnnecessaryKeyframes(thresholds);
}
