{
    // Pastikan ada komposisi aktif
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Pilih sebuah composition terlebih dahulu.");
    } else {
        app.beginUndoGroup("Hapus Keyframe Duplikat");

        // Ambil properti yang dipilih
        var selectedProps = comp.selectedProperties;

        if (selectedProps.length === 0) {
            alert("Pilih properti keyframe terlebih dahulu.");
        } else {
            for (var i = 0; i < selectedProps.length; i++) {
                var prop = selectedProps[i];
                if (prop.numKeys > 1) {
                    // Loop dari akhir ke awal untuk menghapus keyframe
                    for (var k = prop.numKeys; k > 1; k--) {
                        var valCurrent = prop.keyValue(k);
                        var valPrev = prop.keyValue(k - 1);

                        // Jika nilainya sama, hapus keyframe saat ini
                        if (valCurrent === valPrev) {
                            prop.removeKey(k);
                        }
                    }
                }
            }
            alert("Selesai menghapus keyframe duplikat.");
        }

        app.endUndoGroup();
    }
}
