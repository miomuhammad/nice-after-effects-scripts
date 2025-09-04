{
    // Make sure there is an active composition
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition first.");
    } else {
        app.beginUndoGroup("Remove Duplicate Keyframes");

        // Get selected properties
        var selectedProps = comp.selectedProperties;

        if (selectedProps.length === 0) {
            alert("Please select one or more properties with keyframes.");
        } else {
            var totalInitial = 0;
            var totalAfter = 0;

            for (var i = 0; i < selectedProps.length; i++) {
                var prop = selectedProps[i];
                if (prop.numKeys > 1) {
                    var initialKeys = prop.numKeys;
                    totalInitial += initialKeys;

                    // Loop from last keyframe to first to safely remove duplicates
                    for (var k = prop.numKeys; k > 1; k--) {
                        var valCurrent = prop.keyValue(k);
                        var valPrev = prop.keyValue(k - 1);

                        if (valCurrent === valPrev) {
                            prop.removeKey(k);
                        }
                    }

                    totalAfter += prop.numKeys;
                } else if (prop.numKeys === 1) {
                    totalInitial += 1;
                    totalAfter += 1;
                }
            }

            alert("Duplicate keyframes removed!\nInitial total keyframes: " + totalInitial + "\nTotal after deletion: " + totalAfter);
        }

        app.endUndoGroup();
    }
}
