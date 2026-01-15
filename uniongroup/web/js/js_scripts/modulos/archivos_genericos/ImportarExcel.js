/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

Ext.ns("com.cia");


com.cia.ImportarExcel = function addFormImportarExcel(argumentos) {

    //Recibir los valores del excel y parametros del controlador
    this.encabezadoExcel = argumentos.encabezado == null ? "" : argumentos.encabezado;
    this.urlControl = argumentos.urlC == null ? "" : argumentos.urlC;
    this.bndera = argumentos.bandera == null ? "" : argumentos.bandera;
    this.title = argumentos.titulo == null ? "" : argumentos.titulo;
    this.nombrePlantillaExcel = argumentos.nombrePlantilla == null ? "" : argumentos.nombrePlantilla;
    this.window = argumentos.windowN == null ? "" : argumentos.windowN;

    var plantillaExcel = this.nombrePlantillaExcel;
    var titulo = this.title;
    var ventana = this.window;
    var headerMapping = this.encabezadoExcel;
    var urlCtrl = this.urlControl;
    var bnd = this.bndera;
    var msgBoxCargando;


    function guardarExcel(prm) {

        Ext.Ajax.request({
            url: contexto + urlCtrl,
            timeout: 60000,
            params: {
                bnd: bnd,
                valores: prm
            },
            success: function (response) {
                msgBoxCargando.hide();
                Ext.MessageBox.show({
                    title: titulo,
                    msg: Ext.JSON.decode(response.responseText).message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function (btn) {
                        // Aquí puedes agregar la lógica que deseas ejecutar
                        // 'btn' es el identificador del botón que fue presionado
                        if (btn === 'ok') {
                            var w = Ext.getCmp(ventana);
                            w.close();
                        }
                    }
                });
                
            },
            failure: function (response, opts) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: Ext.JSON.decode(response.responseText).message,
                    buttons: Ext.MessageBox.CANCEL,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }

    var formSubirExcel = new Ext.create('Ext.form.Panel', {
        renderTo: Ext.getBody(),
        width: 400,
        bodyPadding: 10,
        title: this.title,
        id: 'formSubirExcel',
        items: [{
                xtype: 'filefield',
                name: 'excelFile',
                fieldLabel: 'Archivo Excel',
                labelWidth: 100,
                msgTarget: 'side',
                allowBlank: false,
                anchor: '100%',
                buttonText: 'Seleccionar Archivo...',
                accept: '.xls, .xlsx'
            }],
        buttons: [
//            {text: 'Descargar Plantilla', handler: function () {
//                    // URL del archivo de plantilla en el servidor
//                    var plantillaUrl = 'archivos/plantillasExcel/' + plantillaExcel; // Reemplaza con la ruta correcta a tu archivo de plantilla
//
//                    // Crear un enlace y simular un clic para descargar el archivo
//                    var link = document.createElement('a');
//                    link.href = plantillaUrl;
//                    link.download = titulo + '.xlsx';
//                    document.body.appendChild(link);
//                    link.click();
//                    document.body.removeChild(link);
//                }}
            , {
                text: 'Subir',
                handler: function () {
                    msgBoxCargando = Ext.MessageBox.show({
                        msg: 'Procesando su solicitud, por favor espere...',
                        progressText: 'Procesando...',
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200},
                        icon: Ext.MessageBox.INFO
                    });
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        var fileField = form.findField('excelFile');
                        var file = fileField.fileInputEl.dom.files[0];
                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                var workbook = XLSX.read(data, {type: 'binary'});
                                // Convertir el archivo Excel a JSON
                                var json = to_json(workbook);
                                // Si json es null, significa que falta una columna
                                if (json === null) {
                                    //  Ext.Msg.alert('Error', 'Falta una o más columnas obligatorias en el archivo.');
                                } else {
                                    var valores = Ext.JSON.encode(json);
                                    guardarExcel(valores);
                                }
                            };
                            reader.readAsBinaryString(file);
                        }
                    }
                }
            }]
    });


function to_json(workbook) {
    var result = [];
    var headersPresent = true;
    var missingHeaders = [];
    var repeatedHeaders = [];
    var headersSet = new Set();
    var validationErrors = [];

    workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        if (roa.length) {
            // Buscar encabezados en la primera fila
            var headers = roa[0].map(header => header.toString()); // Convertir encabezados a cadenas
            var isHeadersInFirstRow = headers.some(header => {
                let normalizedHeader = header.trim().toLowerCase();
                return Object.keys(headerMapping).some(key => key.trim().toLowerCase() === normalizedHeader);
            });

            // Si no se encuentran los encabezados en la primera fila, buscar en la sexta fila
            if (!isHeadersInFirstRow && roa.length > 5) {
                headers = roa[5].map(header => header.toString());
            }

            console.log('Encabezados del archivo:', headers);

            headers.forEach(header => {
                let normalizedHeader = header.trim().toLowerCase();
                if (headersSet.has(normalizedHeader)) {
                    repeatedHeaders.push(header);
                } else {
                    headersSet.add(normalizedHeader);
                }
            });

            for (let key in headerMapping) {
                let normalizedKey = key.trim().toLowerCase();
                if (headerMapping[key].required && !headers.map(h => h.trim().toLowerCase()).includes(normalizedKey) && headerMapping[key].value === undefined) {
                    headersPresent = false;
                    missingHeaders.push(key);
                }
            }

            if (headersPresent && repeatedHeaders.length === 0) {
                // Procesar los datos desde la fila 2 si los encabezados están en la primera fila,
                // o desde la fila 7 si los encabezados están en la sexta fila
                var startRow = isHeadersInFirstRow ? 1 : 6;
                for (let i = startRow; i < roa.length; i++) {
                    let row = roa[i];
                    let obj = {};
                    let rowValid = true;

                    headers.forEach((header, index) => {
                        let normalizedHeader = header.trim().toLowerCase();
                        let headerMappingEntry = headerMapping[header] || Object.values(headerMapping).find(hm => hm.key === normalizedHeader);

                        if (headerMappingEntry) {
                            let value = row[index];

                            if (headerMappingEntry.convert) {
                                value = headerMappingEntry.convert(value);
                            }

                            obj[headerMappingEntry.key] = value;

                            if (headerMappingEntry.required && (value === undefined || value === null) && !headerMappingEntry.isNull) {
                                rowValid = false;
                                validationErrors.push(`Error en fila ${i + 1}: ${headerMappingEntry.errorMessage || 'El campo ' + header + ' es requerido y no puede ser nulo'}`);
                            }

                            if (headerMappingEntry.validate && !headerMappingEntry.validate(value)) {
                                rowValid = false;
                                validationErrors.push(`Error en fila ${i + 1}: ${headerMappingEntry.errorMessage}`);
                            }
                        } else {
                            for (let originalHeader in headerMapping) {
                                let normalizedOriginalHeader = originalHeader.trim().toLowerCase();
                                if (normalizedOriginalHeader === normalizedHeader) {
                                    let value = row[index];

                                    if (headerMapping[originalHeader].convert) {
                                        value = headerMapping[originalHeader].convert(value);
                                    }

                                    obj[headerMapping[originalHeader].key] = value;

                                    if (headerMapping[originalHeader].required && (value === undefined || value === null) && !headerMapping[originalHeader].isNull) {
                                        rowValid = false;
                                        validationErrors.push(`Error en fila ${i + 1}: ${headerMapping[originalHeader].errorMessage || 'El campo ' + originalHeader + ' es requerido y no puede ser nulo'}`);
                                    }

                                    if (headerMapping[originalHeader].validate && !headerMapping[originalHeader].validate(value)) {
                                        rowValid = false;
                                        validationErrors.push(`Error en fila ${i + 1}: ${headerMapping[originalHeader].errorMessage}`);
                                    }
                                    break;
                                }
                            }
                        }
                    });

                    for (let key in headerMapping) {
                        if (headerMapping[key].value !== undefined) {
                            obj[headerMapping[key].key] = headerMapping[key].value;
                        }
                    }

                    if (rowValid) {
                        result.push(obj);
                    }
                }
            }
        }
    });

    if (!headersPresent || repeatedHeaders.length > 0 || validationErrors.length > 0) {
        if (!headersPresent) {
            console.log('Faltan las siguientes columnas obligatorias:', missingHeaders.join(', '));
            Ext.Msg.alert('Error', 'Faltan las siguientes columnas obligatorias: ' + missingHeaders.join(', '));
        }

        if (repeatedHeaders.length > 0) {
            console.log('Las siguientes columnas están repetidas:', repeatedHeaders.join(', '));
            Ext.Msg.alert('Error', 'Las siguientes columnas están repetidas: ' + repeatedHeaders.join(', '));
        }

        if (validationErrors.length > 0) {
            console.log('Errores de validación:', validationErrors.join('\n'));
            if (validationErrors.length > 6) {
                Ext.Msg.confirm('Errores de validación', 'Hay más de 6 errores de validación. ¿Desea ver todos los errores?', function (choice) {
                    if (choice === 'yes') {
                        Ext.Msg.alert('Errores de validación', validationErrors.join('\n'));
                    }
                });
            } else {
                Ext.Msg.alert('Errores de validación', validationErrors.join('\n'));
            }
        }

        return null;
    }

    return result;
}




//function to_json(workbook) { 
//    var result = [];
//    var headersPresent = true;
//    var missingHeaders = [];
//    var repeatedHeaders = [];
//    var headersSet = new Set();
//    var validationErrors = [];
//
//    workbook.SheetNames.forEach(function (sheetName) {
//        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
//
//        if (roa.length) {
//            // Ajusta la búsqueda de encabezados a la fila 6 (índice 5)
//            const headers = roa[5].map(header => header.toString()); // Convertir encabezados a cadenas
//
//            console.log('Encabezados del archivo:', headers);
//
//            headers.forEach(header => {
//                let normalizedHeader = header.trim().toLowerCase();
//                if (headersSet.has(normalizedHeader)) {
//                    repeatedHeaders.push(header);
//                } else {
//                    headersSet.add(normalizedHeader);
//                }
//            });
//
//            for (let key in headerMapping) {
//                let normalizedKey = key.trim().toLowerCase();
//                if (headerMapping[key].required && !headers.map(h => h.trim().toLowerCase()).includes(normalizedKey) && headerMapping[key].value === undefined) {
//                    headersPresent = false;
//                    missingHeaders.push(key);
//                }
//            }
//
//            if (headersPresent && repeatedHeaders.length === 0) {
//                // Procesar los datos desde la fila 7 en adelante
//                for (let i = 6; i < roa.length; i++) {
//                    let row = roa[i];
//                    let obj = {};
//                    let rowValid = true;
//
//                    headers.forEach((header, index) => {
//                        let normalizedHeader = header.trim().toLowerCase();
//                        let headerMappingEntry = headerMapping[header] || Object.values(headerMapping).find(hm => hm.key === normalizedHeader);
//
//                        if (headerMappingEntry) {
//                            let value = row[index];
//
//                            if (headerMappingEntry.convert) {
//                                value = headerMappingEntry.convert(value);
//                            }
//
//                            obj[headerMappingEntry.key] = value;
//
//                            if (headerMappingEntry.required && (value === undefined || value === null) && !headerMappingEntry.isNull) {
//                                rowValid = false;
//                                validationErrors.push(`Error en fila ${i + 1}: ${headerMappingEntry.errorMessage || 'El campo ' + header + ' es requerido y no puede ser nulo'}`);
//                            }
//
//                            if (headerMappingEntry.validate && !headerMappingEntry.validate(value)) {
//                                rowValid = false;
//                                validationErrors.push(`Error en fila ${i + 1}: ${headerMappingEntry.errorMessage}`);
//                            }
//                        } else {
//                            for (let originalHeader in headerMapping) {
//                                let normalizedOriginalHeader = originalHeader.trim().toLowerCase();
//                                if (normalizedOriginalHeader === normalizedHeader) {
//                                    let value = row[index];
//
//                                    if (headerMapping[originalHeader].convert) {
//                                        value = headerMapping[originalHeader].convert(value);
//                                    }
//
//                                    obj[headerMapping[originalHeader].key] = value;
//
//                                    if (headerMapping[originalHeader].required && (value === undefined || value === null) && !headerMapping[originalHeader].isNull) {
//                                        rowValid = false;
//                                        validationErrors.push(`Error en fila ${i + 1}: ${headerMapping[originalHeader].errorMessage || 'El campo ' + originalHeader + ' es requerido y no puede ser nulo'}`);
//                                    }
//
//                                    if (headerMapping[originalHeader].validate && !headerMapping[originalHeader].validate(value)) {
//                                        rowValid = false;
//                                        validationErrors.push(`Error en fila ${i + 1}: ${headerMapping[originalHeader].errorMessage}`);
//                                    }
//                                    break;
//                                }
//                            }
//                        }
//                    });
//
//                    for (let key in headerMapping) {
//                        if (headerMapping[key].value !== undefined) {
//                            obj[headerMapping[key].key] = headerMapping[key].value;
//                        }
//                    }
//
//                    if (rowValid) {
//                        result.push(obj);
//                    }
//                }
//            }
//        }
//    });
//
//    if (!headersPresent || repeatedHeaders.length > 0 || validationErrors.length > 0) {
//        if (!headersPresent) {
//            console.log('Faltan las siguientes columnas obligatorias:', missingHeaders.join(', '));
//            Ext.Msg.alert('Error', 'Faltan las siguientes columnas obligatorias: ' + missingHeaders.join(', '));
//        }
//
//        if (repeatedHeaders.length > 0) {
//            console.log('Las siguientes columnas están repetidas:', repeatedHeaders.join(', '));
//            Ext.Msg.alert('Error', 'Las siguientes columnas están repetidas: ' + repeatedHeaders.join(', '));
//        }
//
//        if (validationErrors.length > 0) {
//            console.log('Errores de validación:', validationErrors.join('\n'));
//            if (validationErrors.length > 6) {
//                Ext.Msg.confirm('Errores de validación', 'Hay más de 6 errores de validación. ¿Desea ver todos los errores?', function (choice) {
//                    if (choice === 'yes') {
//                        Ext.Msg.alert('Errores de validación', validationErrors.join('\n'));
//                    }
//                });
//            } else {
//                Ext.Msg.alert('Errores de validación', validationErrors.join('\n'));
//            }
//        }
//
//        return null;
//    }
//
//    return result;
//}




//    function to_json(workbook) {//v1
//        var result = [];
//        var headersPresent = true;
//        var missingHeaders = [];
//        var repeatedHeaders = [];
//        var headersSet = new Set();
//        var validationErrors = [];
//
//        workbook.SheetNames.forEach(function (sheetName) {
//            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
//
//            if (roa.length) {
//                const headers = roa[0].map(header => header.toString()); // Convertir encabezados a cadenas
//
//                console.log('Encabezados del archivo:', headers);
//
//                headers.forEach(header => {
//                    let normalizedHeader = header.trim().toLowerCase();
//                    if (headersSet.has(normalizedHeader)) {
//                        repeatedHeaders.push(header);
//                    } else {
//                        headersSet.add(normalizedHeader);
//                    }
//                });
//
//                for (let key in headerMapping) {
//                    let normalizedKey = key.trim().toLowerCase();
//                    if (headerMapping[key].required && !headers.map(h => h.trim().toLowerCase()).includes(normalizedKey) && headerMapping[key].value === undefined) {
//                        headersPresent = false;
//                        missingHeaders.push(key);
//                    }
//                }
//
//                if (headersPresent && repeatedHeaders.length === 0) {
//                    for (let i = 1; i < roa.length; i++) {
//                        let row = roa[i];
//                        let obj = {};
//                        let rowValid = true;
//
//                        headers.forEach((header, index) => {
//                            let normalizedHeader = header.trim().toLowerCase();
//                            let headerMappingEntry = headerMapping[header] || Object.values(headerMapping).find(hm => hm.key === normalizedHeader);
//
//                            if (headerMappingEntry) {
//                                let value = row[index];
//
//                                if (headerMappingEntry.convert) {
//                                    value = headerMappingEntry.convert(value);
//                                }
//
//                                obj[headerMappingEntry.key] = value;
//
//                                if (headerMappingEntry.required && (value === undefined || value === null) && !headerMappingEntry.isNull) {
//                                    rowValid = false;
//                                    validationErrors.push(`Error en fila ${i + 1}: ${headerMappingEntry.errorMessage || 'El campo ' + header + ' es requerido y no puede ser nulo'}`);
//                                }
//
//                                if (headerMappingEntry.validate && !headerMappingEntry.validate(value)) {
//                                    rowValid = false;
//                                    validationErrors.push(`Error en fila ${i + 1}: ${headerMappingEntry.errorMessage}`);
//                                }
//                            } else {
//                                for (let originalHeader in headerMapping) {
//                                    let normalizedOriginalHeader = originalHeader.trim().toLowerCase();
//                                    if (normalizedOriginalHeader === normalizedHeader) {
//                                        let value = row[index];
//
//                                        if (headerMapping[originalHeader].convert) {
//                                            value = headerMapping[originalHeader].convert(value);
//                                        }
//
//                                        obj[headerMapping[originalHeader].key] = value;
//
//                                        if (headerMapping[originalHeader].required && (value === undefined || value === null) && !headerMapping[originalHeader].isNull) {
//                                            rowValid = false;
//                                            validationErrors.push(`Error en fila ${i + 1}: ${headerMapping[originalHeader].errorMessage || 'El campo ' + originalHeader + ' es requerido y no puede ser nulo'}`);
//                                        }
//
//                                        if (headerMapping[originalHeader].validate && !headerMapping[originalHeader].validate(value)) {
//                                            rowValid = false;
//                                            validationErrors.push(`Error en fila ${i + 1}: ${headerMapping[originalHeader].errorMessage}`);
//                                        }
//                                        break;
//                                    }
//                                }
//                            }
//                        });
//
//                        for (let key in headerMapping) {
//                            if (headerMapping[key].value !== undefined) {
//                                obj[headerMapping[key].key] = headerMapping[key].value;
//                            }
//                        }
//
//                        if (rowValid) {
//                            result.push(obj);
//                        }
//                    }
//                }
//            }
//        });
//
//        if (!headersPresent || repeatedHeaders.length > 0 || validationErrors.length > 0) {
//            if (!headersPresent) {
//                console.log('Faltan las siguientes columnas obligatorias:', missingHeaders.join(', '));
//                Ext.Msg.alert('Error', 'Faltan las siguientes columnas obligatorias: ' + missingHeaders.join(', '));
//            }
//
//            if (repeatedHeaders.length > 0) {
//                console.log('Las siguientes columnas están repetidas:', repeatedHeaders.join(', '));
//                Ext.Msg.alert('Error', 'Las siguientes columnas están repetidas: ' + repeatedHeaders.join(', '));
//            }
//
//            if (validationErrors.length > 0) {
//                console.log('Errores de validación:', validationErrors.join('\n'));
//                if (validationErrors.length > 6) {
//                    Ext.Msg.confirm('Errores de validación', 'Hay más de 6 errores de validación. ¿Desea ver todos los errores?', function (choice) {
//                        if (choice === 'yes') {
//                            Ext.Msg.alert('Errores de validación', validationErrors.join('\n'));
//                        }
//                    });
//                } else {
//                    Ext.Msg.alert('Errores de validación', validationErrors.join('\n'));
//                }
//            }
//
//            return null;
//        }
//
//        return result;
//    }













    var container = new Ext.container.Container({
        layout: {
            type: "vbox",
            align: "stretch"
        },
        items: [formSubirExcel/*, grid*/]
    });






    return container;





}