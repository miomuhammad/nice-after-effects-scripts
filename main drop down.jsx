function buatNullDropdown() {
    var targetComp = app.project.activeItem;
    if (!(targetComp && targetComp instanceof CompItem)) {
        alert("Buka comp tujuan dulu sebelum menjalankan script ini.");
        return;
    }

    var nullName = prompt("Masukkan nama null:", "CTRL_NULL");
    if (!nullName) return;

    app.beginUndoGroup("Buat Null + Dropdown");

    var ctrlNull = targetComp.layers.addNull();
    ctrlNull.name = nullName;

    var dropdown = ctrlNull.property("ADBE Effect Parade").addProperty("ADBE Dropdown Control");
    dropdown.name = "Dropdown";

    app.endUndoGroup();
}

// Jalankan function
buatNullDropdown();
