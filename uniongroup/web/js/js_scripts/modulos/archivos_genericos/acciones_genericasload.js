/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


function submitFormularioload(formPanel, parametros) {
    var prm = (parametros == null ? {} : parametros);
    var url = (prm.url == null ? '' : parametros.url);
    var bnd = (prm.bnd == null ? '' : parametros.bnd);
    var parametro = (parametros.parametro == null ? '' : parametros.parametro);
    var parametro1 = (parametros.parametro1 == null ? '' : parametros.parametro1);
    var parametro2 = (parametros.parametro2 == null ? '' : parametros.parametro2);
    var parametro3 = (parametros.parametro3 == null ? '' : parametros.parametro3);
    var namewindow = (parametros.namewindow == null ? '' : parametros.namewindow);
    var msg = (prm.msg == null ? 'Espere un segundo, estamos procesando la información' : prm.msg);
    var form = formPanel.getForm();
    var idForm = parametros.formPanel;
    var param = {
        valores: parametros.valores,
        busqBnd: bnd,
        parametro: parametro,
        parametro1: parametro1,
        parametro2: parametro2
    };

    if (form.isValid()) {
        form.submit({
            waitMsg: msg,
            url: url,
            clientValidation: true,
            params: param,
            timeout: 150000,
            success: function (form, action) {

//Producto032023
                if (action.result.accion == null) {
                    var m = (action.result.message == null ? 'Se realizó la operación con éxito' : action.result.message);
                    Ext.Msg.alert("Éxito", m);

                    if (namewindow != '') {
                        var w = Ext.getCmp(namewindow);
                        w.close();
                        /*
                         * Aqui va el codigo para hacer el reload despues del form
                         **/
                    } else {
                        var w = Ext.getCmp(namewindow);
                        w.close();



                    }
                }
                if (action.result.wnd != null) {
                    var w = Ext.getCmp(namewindow);
                    w.close();
                }

                //Descomentar para mostrar el msj excepto en el formEmpresas
                // if (action.result.accion == null) {
                //  var m = (action.result.message == null ? 'Se realizÃƒÂ³ la operaciÃƒÂ³n con ÃƒÂ©xito' : action.result.message);
                //var m=(form);
                //  Ext.Msg.alert("Ãƒ?xito"/*, m*/);
                //var w = Ext.getCmp(idForm);
                //    w.close();
                // }
                // if (action.result.wnd != null) {
                //  var w = Ext.getCmp(action.result.wnd);
                // w.close();
                //}

            },
            failure: function (form, action) {
                var m = action.result.msg || 'Hubo un error en el servidor';
                Ext.Msg.alert("Error", m);
                if (action.result.sesion != null) {
                    getSession();
                }
            }

        });
    } else {
        Ext.MessageBox.show({
            title: 'Datos Incompletos',
            msg: 'Debe completar los datos obligatorios para continuar.(Campos marcados con rojo)',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}

function cargarImagen(formPanel, parametros) {
    var prm = (parametros == null ? {} : parametros);
    var url = (prm.url == null ? '' : prm.url);
    var msg = (prm.msg == null ? 'Cargando Imagen, Espere por favor' : prm.msg);
    var form = formPanel.getForm();
    var param = {
        parametro: parametros.clave,
        parametro1: parametros.parametro1,
        parametro2: parametros.parametro2,
        busqBnd: parametros.bnd
    };
    form.load({
        url: url,
        params: param,
        waitTitle: 'Espere un momento por favor...',
        timeout: 150000,
        waitMsg: msg,
        success: function (form, action) {
            if (action.result.tieneRadChk == true) {
                doSeleccionRadioChecks(action.result.funciones);
            } else {
            }
        },
        failure: function (form, action) {
            if (action.result.sesion != null) {
                getSession();
            }
        }
    });
}

function loadFormularioload(formPanel, parametros) {
    var prm = (parametros == null ? {} : parametros);
    var url = (prm.url == null ? '' : prm.url);
    var msg = (prm.msg == null ? 'Cargando, Espere por favor' : prm.msg);
    var form = formPanel.getForm();
    var param = {
        parametro: parametros.clave,
        parametro1: parametros.parametro1,
        parametro2: parametros.parametro2,
        busqBnd: parametros.bnd
    };
    form.load({
        url: url,
        params: param,
        waitTitle: 'Espere un momento por favor...',
        timeout: 150000,
//        rootProperty:'items',
        waitMsg: msg,
        success: function (form, action) {
            if (action.result.tieneRadChk == true) {
                doSeleccionRadioChecks(action.result.funciones);
            } else {
            }
        },

        /*
         Producto032023
         failure: function (form, action) {
         
         var w = Ext.getCmp(parametros.window);
         w.close();
         Ext.MessageBox.show({
         title: 'InformaciÃƒÂ³n',
         msg: 'No existe la Informacion Solicitada.',
         buttons: Ext.MessageBox.OK,
         icon: Ext.MessageBox.WARNING
         });
         
         if (action.result.sesion != null) {
         */
        failure: function (form, action) {

            var w = Ext.getCmp('winPanelProducto');
            //        w.close();
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'No existe la Informacion Solicitada.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });

            if (action.result.sesion != null) {
                getSession();
            }
        }
    });
}


function submitSubirArchivos(formPanel, parametros) {
    var prm = (parametros == null ? {} : parametros);
    var url = (prm.url == null ? '' : parametros.url);
    var bnd = (prm.bnd == null ? '' : parametros.bnd);

    var rutaServicio = (parametros.rutaServicio == null ? '' : parametros.rutaServicio);
    var msg = (prm.msg == null ? 'Espere un segundo, estamos procesando la informaciÃ³n' : prm.msg);
    var form = formPanel.getForm();
    var idForm = parametros.formPanel;
    var param = {
        valores: parametros.valores,
        busqBnd: bnd,
        rutaServicio: rutaServicio
    };

    if (form.isValid()) {
        console.log("formulario valido");
        console.log(param)
        form.submit({
            waitMsg: msg,
            url: url,
            clientValidation: true,
            params: param,
            timeout: 150000,
            success: function (form1, action) {
                //Descomentar para mostrar el msj excepto en el formEmpresas
                // if (action.result.accion == null) {
                //  var m = (action.result.message == null ? 'Se realizÃ³ la operaciÃ³n con Ã©xito' : action.result.message);
                var m = (form);
                Ext.Msg.alert("Ã‰xito"/*, m*/);
                var w = Ext.getCmp(idForm);
                w.close();
                // }
                // if (action.result.wnd != null) {
                //  var w = Ext.getCmp(action.result.wnd);
                // w.close();
                //}
            },
            failure: function (form, action) {
                var m = (action.result.msg == null ? 'Hubo un error en el servidor' : action.result.msg);
                var mns = Ext.Msg.alert("Error", m);
                if (action.result.sesion != null) {
                    mns.hide();
                    getSession();
                }
            }
        });
    } else {
        Ext.MessageBox.show({
            title: 'Datos Incompletos',
            msg: 'Debe completar los datos obligatorios para continuar.(Campos marcados con rojo)',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}



var evidencia64;

function loadFiles(urlContexto, bnd, idEvidencia, idRegistro, fileTag) {
    Ext.Ajax.request({
        url: contexto + urlContexto,
        params: {
            bnd: bnd,
            idEvidencia: idEvidencia,
            idRegistro: idRegistro
        },
        success: function (response) {
            var jsonResponse = Ext.decode(response.responseText);
            if (jsonResponse && jsonResponse.length > 0) {
                var archivoValue = jsonResponse[0][fileTag];
                if (archivoValue === null) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: 'No se encontró ningún archivo...',
                        buttons: Ext.MessageBox.CANCEL,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    if (archivoValue && archivoValue.startsWith('data:')) {
                        var img = new Image();
                        img.onload = function () {
                            var width = img.width;
                            var height = img.height;

                            var tituloVentana = idRegistro + ' - ' + idEvidencia;
                            var mostrarEvidencia = new Ext.create('Ext.window.Window', {
                                title: tituloVentana,
                                modal: true,
                                width: width + 20, // Añadir un poco de margen
                                height: height + 60, // Añadir un poco de margen
                                layout: 'fit',
                                closeAction: 'destroy',
                                items: [{
                                        xtype: 'panel',
                                        layout: {
                                            type: 'vbox',
                                            align: 'center',
                                            pack: 'center'
                                        },
                                        items: [{
                                                xtype: 'image',
                                                src: archivoValue,
                                                width: width,
                                                height: height,
                                                style: {
                                                    display: 'block',
                                                    margin: 'auto'
                                                }
                                            }]
                                    }]
                            });
                            mostrarEvidencia.show();
                        };

                        img.src = archivoValue;
                    } else {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: 'El archivo no es válido.',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            } else {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'No se encontraron datos en la respuesta.',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        },
        failure: function () {
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Error al Consultar el archivo...',
                buttons: Ext.MessageBox.CANCEL,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
}

var evidencia64;

function loadPdf(urlContexto, bnd, idEvidencia, idRegistro, fileTag) {
    Ext.Ajax.request({
        url: contexto + urlContexto,
        params: {
            bnd: bnd,
            idEvidencia: idEvidencia,
            idRegistro: idRegistro
        },
        success: function (response) {
            var jsonResponse = Ext.decode(response.responseText);
            if (jsonResponse && jsonResponse.success) {
                var archivoValue = jsonResponse.fileData;
                if (archivoValue === null) {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: 'No se encontró ningún archivo ...',
                        buttons: Ext.MessageBox.CANCEL,
                        icon: Ext.MessageBox.ERROR
                    });
                } else {
                    // Validar si evidencia64 es un archivo base64 válido
                    if (archivoValue && archivoValue.startsWith('data:application/pdf;base64,')) {
                        // Crear una ventana modal
                        var tituloVentana = 'ID: ' + idRegistro;
                        var mostrarEvidencia = new Ext.create('Ext.window.Window', {
                            title: tituloVentana,
                            modal: true,
                            width: 900,
                            height: 600,
                            layout: 'fit',
                            closeAction: 'destroy',
                            items: [{
                                    xtype: 'panel',
                                    items: [{
                                            xtype: 'component',
                                            autoEl: {
                                                tag: 'iframe',
                                                src: archivoValue,
                                                style: 'width:99%;height:99%;'
                                            }
                                        }]
                                }]
                        });
                        mostrarEvidencia.show();
                    } else {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: 'El archivo no es válido.',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            } else {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'No se encontraron datos en la respuesta.',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        },
        failure: function () {
            Ext.MessageBox.show({
                title: 'Error',
                msg: 'Error al Consultar el archivo ...',
                buttons: Ext.MessageBox.CANCEL,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
}




function validarArchivoSize(value, maxSize) {
    var fileInput = this.fileInputEl ? this.fileInputEl.dom : undefined;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        return (fileInput.files[0].size <= maxSize) || 'El tamaño del archivo no puede superar ' + (maxSize / 1024) + ' KB';
    } else {
        return true;  // No hay archivo seleccionado, asumimos que es válido
    }
}




function generarExcel2(idGrid) {
    var grid = Ext.getCmp(idGrid);

    if (grid && grid.getStore()) {
        grid.getStore().load({
            callback: function (records, operation, success) {
                if (success) {
                    var gridData = [];
                    var columns = grid.getColumns();

                    var filteredColumns = columns.filter(function (column) {
                        return !column.isRowNumberer && column.xtype !== 'actioncolumn';
                    });

                    var columnNames = filteredColumns.map(function (column) {
                        return column.text || column.dataIndex;
                    });
                    gridData.push(columnNames);

                    records.forEach(function (record) {
                        var rowData = [];
                        filteredColumns.forEach(function (column) {
                            rowData.push(record.get(column.dataIndex));
                        });
                        gridData.push(rowData);
                    });

                    var workbook = XLSX.utils.book_new();
                    var worksheet = XLSX.utils.aoa_to_sheet(gridData);
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cuentas Bancarias');
                    var excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
                    var blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'Cuentas_Bancarias.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                } else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: 'No se pudo cargar los datos de la cuadrícula',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        });
    } else {
        Ext.MessageBox.show({
            title: 'Error',
            msg: 'No se pudo encontrar la cuadrícula con el ID especificado o la cuadrícula no tiene un store definido',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}




function generarExcel(idGrid, archivoName, parametros) {
    if (store && store.getCount() > 0) {
        var grid = Ext.getCmp(idGrid); // Obtener referencia a la cuadrícula por ID
        var confidencialidad = "El presente documento y toda la información contenida en él son de carácter estrictamente confidencial y propiedad exclusiva de Argo Logistica. Su uso está limitado únicamente a los fines específicos para los cuales ha sido proporcionado. " +
                "Queda expresamente prohibida la reproducción, distribución, divulgación o cualquier otro uso no autorizado de la información contenida en este documento, total o parcialmente, sin el consentimiento previo y por escrito de Argo Logistica. Cualquier uso indebido de este documento podrá derivar en las acciones legales correspondientes conforme a la normativa vigente.";

        if (grid) { // Verificar si la referencia existe
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet(archivoName);

            // Cargar la imagen desde la URL
            var imgPath = contexto + '/img/newLogoLogin.png'; // Ruta de la imagen

            // Crear una función para cargar la imagen
            fetch(imgPath)
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => {
                        var imageId = workbook.addImage({
                            buffer: arrayBuffer,
                            extension: 'png'
                        });

                        // Insertar la imagen en la celda B2
                        worksheet.addImage(imageId, {
                            tl: {col: 0, row: 0}, // B2 (col: 1, row: 1 en índice 0)
                            ext: {width: 110, height: 90}
                        });

                        // Agregar el título de parámetros y aplicar formato
                        var paramKeys = Object.keys(parametros);
                        var maxParamsPerColumn = 3; // Número máximo de pares de parámetros por columna
                        var startColumn = 2; // Comenzar en la primera columna
                        var startRow = 2; // Comenzar en la segunda fila (después del título)

                        // Establecer el título de parámetros de consulta
                        worksheet.getCell('B1').value = parametros.titulo;
                        worksheet.getCell('B1').alignment = {horizontal: 'center', vertical: 'middle'};
                        worksheet.getCell('B1').font = {bold: true}; // Negritas para el título

                        worksheet.mergeCells('D1:O1'); // Unir las celdas de D1 a O1
                        worksheet.getRow(1).height = 50;
                        var cell = worksheet.getCell('D1');
                        cell.value = confidencialidad;
                        cell.alignment = {horizontal: 'left', vertical: 'middle', wrapText: true};
                        cell.font = {size: 8, color: {argb: 'FFFF0000'}}; // Rojo
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'FFFFFF99'} // Amarillo claro
                        };


                        // Filtrar las claves para excluir 'titulo'
                        var filteredParamKeys = paramKeys.filter(function (key) {
                            return key !== 'titulo';
                        });

// Agregar los parámetros de consulta organizados en filas verticales
                        filteredParamKeys.forEach(function (key, index) {
                            var row = startRow + (index % maxParamsPerColumn); // Comienza en la tercera fila (B3)
                            var col = startColumn + Math.floor(index / maxParamsPerColumn) * 2; // Determina la columna
                            var value = parametros[key];

                            // Agregar la clave y el valor a las celdas correspondientes
                            var keyCell = worksheet.getCell(row, col);
                            var valueCell = worksheet.getCell(row, col + 1);

                            keyCell.value = key + ':';
                            keyCell.alignment = {horizontal: 'center', vertical: 'middle'};
                            keyCell.font = {bold: true}; // Negritas para las claves de los parámetros

                            valueCell.value = value;
                        });



                        // Agregar una fila vacía para separación antes de los datos del grid
                        worksheet.addRow([]);

                        // Ajustar la posición de los encabezados
                        var headerRowIndex = worksheet.lastRow.number + 1; // Determinar la fila para los encabezados

                        var columns = grid.getColumns();

                        // Filtrar columnas para omitir rownumber y actioncolumn
                        var filteredColumns = columns.filter(function (column) {
                            return !column.isRowNumberer && column.xtype !== 'actioncolumn';
                        });

                        // Configurar encabezados
                        var headers = filteredColumns.map(function (column) {
                            return column.text || column.dataIndex;
                        });

                        // Agregar los encabezados
                        var headerRow = worksheet.addRow(headers);

                        // Aplicar estilos a los encabezados
                        headerRow.eachCell(function (cell) {
                            cell.font = {bold: true, color: {argb: 'FFFFFFFF'}};
                            cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF4F81BD'}};
                            cell.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
                        });

                        // Establecer el ancho de las columnas
                        filteredColumns.forEach(function (column, index) {
                            worksheet.getColumn(index + 1).width = 18; // Asigna el ancho a 22 para cada columna
                        });

                        // Agregar datos del grid
                        grid.getStore().each(function (record) {
                            var rowData = [];
                            filteredColumns.forEach(function (column) {
                                rowData.push(record.get(column.dataIndex));
                            });
                            worksheet.addRow(rowData);
                        });

                        // Aplicar estilos a todas las celdas de datos
                        worksheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
                            if (rowNumber > headerRowIndex) { // Solo para las filas de datos del grid
                                row.eachCell({includeEmpty: true}, function (cell) {
                                    cell.alignment = {wrapText: true, horizontal: 'center', vertical: 'middle'}; // Ajuste de texto, centrado horizontal y vertical
                                });
                            }
                        });

                        // Guardar el archivo Excel
                        workbook.xlsx.writeBuffer().then(function (buffer) {
                            var blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                            var url = URL.createObjectURL(blob);
                            var a = document.createElement('a');
                            a.href = url;
                            a.download = archivoName + '.xlsx';
                            document.body.appendChild(a);
                            a.click();
                            URL.revokeObjectURL(url);
                        });
                    })
                    .catch(error => console.error('Error al cargar la imagen:', error));

        } else {
            console.error('No se pudo encontrar la cuadrícula con el ID especificado.');
        }
    } else {
        Ext.MessageBox.show({
            title: 'Error',
            msg: 'No se encontró ningún dato en la tabla',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
}
























function generarExcelOcultarColumna(idGrid, archivoName) {

    if (store && store.getCount() > 0) {
        var grid = Ext.getCmp(idGrid); // Obtener referencia a la cuadrícula por ID

        if (grid) { // Verificar si la referencia existe
            var gridData = [];
            var columns = grid.getColumns();

            // Filtrar las columnas para omitir rownumber y actioncolumn
            var filteredColumns = columns.filter(function (column) {
                return !column.isRowNumberer && column.xtype !== 'actioncolumn' && column.dataIndex !== 'categoria';
            });

            // Agregar los nombres de las columnas filtradas a la matriz
            var columnNames = filteredColumns.map(function (column) {
                return column.text || column.dataIndex;
            });
            gridData.push(columnNames);

            grid.getStore().each(function (record) {
                var rowData = [];
                filteredColumns.forEach(function (column) {
                    rowData.push(record.get(column.dataIndex));
                });
                gridData.push(rowData);
            });

            var workbook = XLSX.utils.book_new();
            var worksheet = XLSX.utils.aoa_to_sheet(gridData);
            XLSX.utils.book_append_sheet(workbook, worksheet, archivoName);
            var excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
            var blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = archivoName + '.xlsx';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
        } else {
            console.error('No se pudo encontrar la cuadrícula con el ID especificado.');
        }

    } else {

        Ext.MessageBox.show({
            title: 'Error',
            msg: 'No se encontró ningun dato en la tabla',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });

    }

}



function importarExcel(encabezados, funcionBuscar, datos, nombrePlantillaExcel) {


    Ext.define("MyApp.PanelSubirExcel", {
        extend: "Ext.Window",
        id: "winPanelImportarExcel",
        title: "Imporar Excel",
        scrollable: 'vertical',
        closable: true, // Permite cerrar la ventana
        closeAction: 'destroy',
        height: 180,
        width: 500,
        modal: true,
        constrain: true,
        layout: "fit",
        resizable: true,
        listeners: {
            destroy: function () {
                // Usar el evento 'destroy' en lugar de 'close'
                funcionBuscar();

            }
        },
        //autoScroll:true,
        initComponent: function () {

            (this.items = [
                new com.cia.ImportarExcel({
                    encabezado: encabezados,
                    urlC: datos.urlContexto,
                    bandera: datos.bandera,
                    titulo: datos.titulo,
                    nombrePlantilla: nombrePlantillaExcel,
                    windowN: 'winPanelImportarExcel'

                })
            ]),
                    this.callParent(arguments);
        }
    });
    var winBuscProduct = Ext.create("MyApp.PanelSubirExcel");
    winBuscProduct.show();



}


function mesANumero(mes) {
    const meses = {
        'ENERO': 1,
        'FEBRERO': 2,
        'MARZO': 3,
        'ABRIL': 4,
        'MAYO': 5,
        'JUNIO': 6,
        'JULIO': 7,
        'AGOSTO': 8,
        'SEPTIEMBRE': 9,
        'OCTUBRE': 10,
        'NOVIEMBRE': 11,
        'DICIEMBRE': 12
    };
    return meses[mes.toUpperCase()] || null; // Manejo de error si el mes no es válido
}

function numeroAMes(num) {
    const meses = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return meses[num - 1] || 'DESCONOCIDO'; // Manejo de error si el número no está en el rango 1-12
}

function adjuntarEvidencia(cveEvidencia, empresa, fechaEmbarque, documento) {

    Ext.define("MyApp.FormAdjuntarEvidencia", {
        extend: "Ext.Window",
        id: "winAdjuntarEvidenciaEnvio",
        title: "Adjunto",
        scrollable: 'vertical',
        closable: false,
        closeAction: "destroy",
        height: 315,
        width: 500,
        maxWidth: 500,
        maxHeight: 315,
        modal: true,
        constrain: true,
        layout: "fit",
        resizable: true,
        initComponent: function () {
            (this.items = [
                new com.cia.FormAdjuntarEvidenciaEnvio({
                    cveDocEvi: cveEvidencia,
                    idEmpresa: empresa,
                    fechaEmbarque: fechaEmbarque,
                    documento: documento,
                    titulo: "Evidencia",
                    id: "pnlAdjuntarEvidenciaEnvio",
                    height: 405,
                    anchor: "100%",
                    window: "winFolioEntregaEvidencia",
                })
            ]),
                    this.callParent(arguments);
        }
    });
    var winBuscProduct = Ext.create("MyApp.FormAdjuntarEvidencia");
    winBuscProduct.show();
}

function verPDFLocal(empresa, idRegistro) {
    var url = contexto + '/EstatusEnvio?bnd=4&idEvidencia=' + empresa + '&idRegistro=' + idRegistro;
    Ext.create('Ext.window.Window', {
        title: "Evidencias",
        modal: true,
        width: 900,
        height: 600,
        layout: 'fit',
        closeAction: 'destroy',
        items: [{
                xtype: 'component',
                autoEl: {
                    tag: 'iframe',
                    src: url,
                    style: 'width:100%;height:100%;border:none;'
                }
            }]
    }).show();
}

function formatearFecha(value) {
    if (value) {
        let date = new Date(value);
        return Ext.Date.format(date, 'd/m/Y');
    } else {
        return value;
    }
}

function llenarFormulario(formPanel, parametros) {
    var prm = (parametros == null ? {} : parametros);
    var url = (prm.url == null ? '' : prm.url);
    var msg = (prm.msg == null ? 'Cargando, Espere por favor' : prm.msg);
    var form = formPanel.getForm();
    var param = {
        clave: parametros.clave,
        parametro1: parametros.parametro1,
        parametro2: parametros.parametro2,
        bnd: parametros.bnd
    };
    form.load({
        url: url,
        params: param,
        waitTitle: 'Espere un momento por favor...',
        timeout: 150000,
//        rootProperty:'items',
        waitMsg: msg,
        success: function (form, action) {
            if (action.result.tieneRadChk == true) {
                doSeleccionRadioChecks(action.result.funciones);
            } else {
            }
        },

        /*
         Producto032023
         failure: function (form, action) {
         
         var w = Ext.getCmp(parametros.window);
         w.close();
         Ext.MessageBox.show({
         title: 'InformaciÃ³n',
         msg: 'No existe la Informacion Solicitada.',
         buttons: Ext.MessageBox.OK,
         icon: Ext.MessageBox.WARNING
         });
         
         if (action.result.sesion != null) {
         */
        failure: function (form, action) {

            var w = Ext.getCmp('winPanelProducto');
            //        w.close();
            Ext.MessageBox.show({
                title: 'Informaci?n',
                msg: 'No existe la Informacion Solicitada.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.WARNING
            });

            if (action.result.sesion != null) {
                getSession();
            }
        }
    });
}


function addTooltip(button, text) {
    if (!button || !text) return;

    var tip = Ext.create('Ext.tip.ToolTip', {
        target: button.getEl(),
        html: text,
        trackMouse: true
    });

    button.on('destroy', function () {
        if (tip) {
            tip.destroy();
            tip = null;
        }
    });
}

