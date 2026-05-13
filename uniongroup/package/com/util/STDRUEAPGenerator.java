/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.util;

import com.entity.global.ArrEcommerce;
import com.entity.global.ArrEcommerceDet;
import com.util.FixedWidthUtils;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class STDRUEAPGenerator {
    
    private static String formatearCantidadSalida(String cantidad) {
    if (cantidad == null || cantidad.trim().isEmpty()) {
        return "00000000000";
    }

    try {
        long valor = Long.parseLong(cantidad.trim()); // ej: 1, 10, 100
        long valorFormateado = valor * 1000;          // agrega 3 ceros a la derecha
        return String.format("%011d", valorFormateado); // 11 dígitos con ceros a la izquierda
    } catch (NumberFormatException e) {
        return "00000000000";
    }
}


    public static void generate(
            ArrEcommerce header,
            List<ArrEcommerceDet> lines,
            Path outputFile
    ) throws Exception {

        if (header == null) {
            throw new IllegalArgumentException("Header ArrEcommerce es null");
        }
        if (lines == null || lines.isEmpty()) {
            throw new IllegalArgumentException("No hay líneas ArrEcommerceDet para generar STDRUEAP");
        }

        List<String> out = new ArrayList<>();

        for (ArrEcommerceDet lineDet : lines) {

            String qty = formatearCantidadSalida(lineDet.quantity);

            
             Date todayDate = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            SimpleDateFormat hf = new SimpleDateFormat("HHmmss");
            String fechaActual = sdf.format(todayDate);
            
           String horaActual=hf.format(todayDate);
            
            

            String line =
                FixedWidthUtils.padRight(header.holding, 3) +//holding
                FixedWidthUtils.padRight(header.customer, 3) +//customer
                FixedWidthUtils.padRight(header.neutralcustomer, 3) +//neutralcustomer
                FixedWidthUtils.padRight(header.ordernumber, 10) +//ordernumber
                FixedWidthUtils.padRight(lineDet.orderline, 6) +//line number
                FixedWidthUtils.padRight(lineDet.deliverynote, 16) +//Relleno/deliveryNote
                FixedWidthUtils.padRight(lineDet.deliveryline, 5) +//deliveryLine
                FixedWidthUtils.padRight(lineDet.itemnumber, 18) +
                FixedWidthUtils.padRight(fechaActual, 8)+//Date
                FixedWidthUtils.padRight(String.valueOf(header.preid), 32)+//shipping number
                FixedWidthUtils.padRight(lineDet.unit, 3) +
                qty +//quantity    
                FixedWidthUtils.padRight(header.receivername1, 4) +//carrier
                FixedWidthUtils.padRight("", 4) +//tour
                FixedWidthUtils.padRight("", 10) +//freight load number
                FixedWidthUtils.padRight(String.valueOf(header.preid), 9)+//TrackingNumber
                FixedWidthUtils.padRight("", 5) +//storage location
                FixedWidthUtils.padRight("", 15) +//batch / lot number
                FixedWidthUtils.padRight("", 15) +//variant
                FixedWidthUtils.padRight(fechaActual, 8)+//Date
                FixedWidthUtils.padRight("", 25) +//variant
                FixedWidthUtils.padRight("", 1) +//
                FixedWidthUtils.padRight("", 2) +//
                FixedWidthUtils.padRight("", 20) +//
                FixedWidthUtils.padRight("000000000000000000000000000000000000000000000000000", 51) +//
                FixedWidthUtils.padRight("", 20) +//
                FixedWidthUtils.padRight("", 1) +//
                FixedWidthUtils.padRight(fechaActual, 8)+//Date
                FixedWidthUtils.padRight(horaActual, 6)+//time
                FixedWidthUtils.padRight(lineDet.user, 10)+//user
                FixedWidthUtils.padRight(lineDet.ean, 13);//EAN/Barcode
                    
                    
                    
                    
                 

            out.add(line);
        }

        // Crear carpeta si no existe
        if (outputFile.getParent() != null) {
            Files.createDirectories(outputFile.getParent());
        }

        // Escribir archivo en ISO-8859-1
        Files.write(outputFile, out, StandardCharsets.ISO_8859_1);
    }
}
