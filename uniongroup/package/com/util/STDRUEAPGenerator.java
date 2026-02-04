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
import java.util.ArrayList;
import java.util.List;

public class STDRUEAPGenerator {

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

            String qty = FixedWidthUtils.padLeftZeros(lineDet.quantity, 11);

            String line =
                FixedWidthUtils.padRight(header.holding, 3) +
                FixedWidthUtils.padRight(header.customer, 3) +
                FixedWidthUtils.padRight(header.neutralcustomer, 3) +
                FixedWidthUtils.padRight(header.ordernumber, 10) +
                FixedWidthUtils.padRight("xx", 23) +
                FixedWidthUtils.padRight(lineDet.orderline, 6) +
                FixedWidthUtils.padRight(lineDet.itemnumber, 18) +
                FixedWidthUtils.padRight("", 2) +
                FixedWidthUtils.padRight(lineDet.customerreference, 18) +
                FixedWidthUtils.padRight("", 2) +
                FixedWidthUtils.padRight(lineDet.unit, 2) +
                FixedWidthUtils.padRight("", 1) +
                qty +
                FixedWidthUtils.padRight("", 3) +
                FixedWidthUtils.padRight("", 10) +
                FixedWidthUtils.padRight("", 9) +
                FixedWidthUtils.padRight("", 9) +
                FixedWidthUtils.padRight("", 8) +
                FixedWidthUtils.padRight("", 60) +
                FixedWidthUtils.padRight("", 50) +
                FixedWidthUtils.padRight("", 20) +
                FixedWidthUtils.padRight("", 2) +
                FixedWidthUtils.padRight(lineDet.ean, 13) +
                FixedWidthUtils.padRight("", 59);

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
