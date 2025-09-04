{
    app.beginUndoGroup("Link Layer to Null in Chosen Comp");

    var proj = app.project;

    if (proj && proj.items.length > 0) {

        // Buat UI Window
        var win = new Window("dialog", "Pilih Comp Target");
        win.orientation = "column";
        win.alignChildren = ["fill","top"];

        var compList = [];
        var dd = win.add("dropdownlist", undefined, []);

        // Masukkan semua comp ke dropdown
        for (var i = 1; i <= proj.items.length; i++) {
            if (proj.items[i] instanceof CompItem) {
                dd.add("item", proj.items[i].name);
                compList.push(proj.items[i]);
            }
        }

        dd.selection = 0; // default ke comp pertama

        var btnGroup = win.add("group");
        btnGroup.alignment = "right";
        var okBtn = btnGroup.add("button", undefined, "OK");
        var cancelBtn = btnGroup.add("button", undefined, "Cancel");

        if (win.show() == 1) { // OK diklik
            var targetComp = compList[dd.selection.index];

            var activeItem = proj.activeItem;
            if (activeItem instanceof CompItem && activeItem.selectedLayers.length > 0) {
                for (var j = 0; j < activeItem.selectedLayers.length; j++) {
                    var lyr = activeItem.selectedLayers[j];

                    // Simpan posisi awal layer
                    var initPos = lyr.property("Position").value;

                    // Buat Null di comp target
                    var nullLayer = targetComp.layers.addNull();
                    nullLayer.name = lyr.name + "_CTRL";  
                    nullLayer.property("Opacity").setValue(100);

                    // Taruh null di posisi awal layer
                    nullLayer.transform.position.setValue(initPos);

                    // ====== Link langsung ======
                    lyr.property("Position").expression =
                        'comp("' + targetComp.name + '").layer("' + nullLayer.name + '").transform.position';

                    lyr.property("Scale").expression =
                        'comp("' + targetComp.name + '").layer("' + nullLayer.name + '").transform.scale';

                    lyr.property("Rotation").expression =
                        'comp("' + targetComp.name + '").layer("' + nullLayer.name + '").transform.rotation';

                    lyr.property("Opacity").expression =
                        'comp("' + targetComp.name + '").layer("' + nullLayer.name + '").transform.opacity';
                }
            } else {
                alert("Pilih dulu layer di dalam precomp sebelum jalanin script.");
            }
        }
    }

    app.endUndoGroup();
}
