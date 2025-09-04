function buatTextLayerMataUangSliderRibuanUrut() {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Buka comp tujuan dulu sebelum menjalankan script ini.");
        return;
    }

    app.beginUndoGroup("Text Layer Mata Uang Slider Ribuan Urut");

    // Buat Text Layer
    var textLayer = comp.layers.addText("Tulisan default");
    textLayer.name = "decodetext";

    // 1. Slider Amount
    var amountSlider = textLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
    amountSlider.name = "Amount";
    amountSlider.property("ADBE Slider Control-0001").setValue(0);

    // 2. Slider Currency
    var currencySlider = textLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
    currencySlider.name = "CurrencyIndex";
    currencySlider.property("ADBE Slider Control-0001").setValue(1);

    // Daftar mata uang: pertama kosong, kedua $, ketiga €, dst
    var currencies = ["","$","€","£","¥","₹","₩","₽","₺","R$","₴","₪","฿","₫","₦","₱","kr","CHF","C$","A$","NZ$","SG$",
        "AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BMD",
        "BND","BOB","BRL","BSD","BTN","BWP","BYN","BZD","CAD","CDF","CHF","CLP","CNY","COP","CRC","CUP",
        "CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","FJD","FKP","GBP","GEL","GHS","GIP","GMD",
        "GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JPY",
        "KES","KGS","KHR","KMF","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LYD","MAD","MDL",
        "MKD","MMK","MNT","MOP","MRU","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR",
        "NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD",
        "SCR","SDG","SEK","SGD","SHP","SLL","SOS","SRD","STN","SVC","SZL","THB","TJS","TMT","TND","TOP",
        "TRY","TTD","TWD","TZS","UAH","UGX","USD","UYU","UZS","VES","VND","VUV","WST","XAF","XCD","XOF",
        "XPF","YER","ZAR","ZMW","ZWL"
    ];

    // 3. Dropdown ThousandsSeparator
    var thousandDropdown = textLayer.property("ADBE Effect Parade").addProperty("ADBE Dropdown Control");
    thousandDropdown.name = "ThousandsSeparator";

    // 4. Slider DecimalPlaces
    var decimalSlider = textLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
    decimalSlider.name = "DecimalPlaces";
    decimalSlider.property("ADBE Slider Control-0001").setValue(2);

    // 5. Dropdown DecimalSeparator
    var decimalDropdown = textLayer.property("ADBE Effect Parade").addProperty("ADBE Dropdown Control");
    decimalDropdown.name = "DecimalSeparator";

    // 6. Dropdown Suffix
    var suffixDropdown = textLayer.property("ADBE Effect Parade").addProperty("ADBE Dropdown Control");
    suffixDropdown.name = "Suffix";

    // Ekspresi Source Text
    var expr = 
        'var curIndex = Math.round(effect("CurrencyIndex")("Slider").value);\n' +
        'var currencies = ' + JSON.stringify(currencies) + ';\n' +
        'curIndex = Math.max(1, Math.min(curIndex, currencies.length));\n' +

        'var amount = effect("Amount")("Slider").value;\n' +
        'var decimalPlaces = Math.round(effect("DecimalPlaces")("Slider").value);\n' +
        'decimalPlaces = Math.max(0, decimalPlaces);\n' +

        'var sepIndex = effect("DecimalSeparator")("Menu").value;\n' +
        'var decimalSeparators = ["." , ","];\n' +
        'sepIndex = Math.max(1, Math.min(sepIndex, decimalSeparators.length));\n' +
        'var sepDecimal = decimalSeparators[sepIndex-1];\n' +

        'var thouIndex = effect("ThousandsSeparator")("Menu").value;\n' +
        'var thousandSeparators = ["", ".", ","];\n' +
        'thouIndex = Math.max(1, Math.min(thouIndex, thousandSeparators.length));\n' +
        'var sepThousand = thousandSeparators[thouIndex-1];\n' +

        'amount = (function(num){\n' +
        '    var parts = num.toFixed(decimalPlaces).split(".");\n' +
        '    var intPart = parts[0];\n' +
        '    var decPart = parts[1] || "";\n' +
        '    if(sepThousand!="") intPart = intPart.replace(/\\B(?=(\\d{3})+(?!\\d))/g, sepThousand);\n' +
        '    return decimalPlaces>0 ? intPart+sepDecimal+decPart : intPart;\n' +
        '})(amount);\n' +

        'var suffixIndex = effect("Suffix")("Menu").value;\n' +
        'var suffixOptions = ["","%"];\n' +
        'suffixIndex = Math.max(1, Math.min(suffixIndex, suffixOptions.length));\n' +
        'var suffix = suffixOptions[suffixIndex-1];\n' +

        'var currencyText = currencies[curIndex-1];\n' +
        'if(currencyText=="") currencyText="";\n' +
        'var suffixText = suffix!="" ? " " + suffix : "";\n' +
        'currencyText + (currencyText!=""?" ":"") + amount + suffixText;';

    textLayer.property("ADBE Text Properties")
             .property("ADBE Text Document")
             .expression = expr;

    app.endUndoGroup();
}

// Jalankan
buatTextLayerMataUangSliderRibuanUrut();
