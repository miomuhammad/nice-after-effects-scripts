{
    function expressionEditor() {
        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Pilih dulu composition dan property yang punya expression.");
            return;
        }

        var sel = comp.selectedProperties;
        if (sel.length === 0) {
            alert("Pilih minimal satu property yang bisa punya expression.");
            return;
        }

        // Window
        var win = new Window("palette", "Expression Editor", undefined, {resizeable:true});
        win.orientation = "column";

        // Textarea
        var txt = win.add("edittext", undefined, sel[0].expression, 
            {multiline:true, scrolling:true});
        txt.minimumSize.width = 600;
        txt.minimumSize.height = 400;

        // Buttons
        var btnGroup = win.add("group");
        btnGroup.orientation = "row";
        var applyBtn = btnGroup.add("button", undefined, "Apply");
        var loadBtn  = btnGroup.add("button", undefined, "Load");
        var saveBtn  = btnGroup.add("button", undefined, "Save");
        var closeBtn = btnGroup.add("button", undefined, "Close");

        // Apply ke semua property terpilih
        applyBtn.onClick = function() {
            app.beginUndoGroup("Apply Expression");
            for (var i=0; i<sel.length; i++) {
                try {
                    sel[i].expression = txt.text;
                } catch(e) {
                    alert("Gagal apply ke property: " + sel[i].name);
                }
            }
            app.endUndoGroup();
        };

        // Load dari file
        loadBtn.onClick = function() {
            var f = File.openDialog("Load Expression", "*.txt");
            if (f) {
                f.open("r");
                txt.text = f.read();
                f.close();
            }
        };

        // Save ke file
        saveBtn.onClick = function() {
            var f = File.saveDialog("Save Expression As", "*.txt");
            if (f) {
                f.open("w");
                f.write(txt.text);
                f.close();
            }
        };

        // Close
        closeBtn.onClick = function() {
            win.close();
        };

        win.center();
        win.show();
    }

    expressionEditor();
}
