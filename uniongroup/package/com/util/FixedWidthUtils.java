/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.util;

/**
 *
 * @author ray_w
 */
public class FixedWidthUtils {

    public static String get(String line, int start, int length) {
        int from = start - 1;
        int to = Math.min(from + length, line.length());
        if (from >= line.length()) return "";
        return line.substring(from, to).trim();
    }

    public static String padRight(String value, int length) {
        value = value == null ? "" : value;
        if (value.length() > length) {
            return value.substring(0, length);
        }
        return String.format("%-" + length + "s", value);
    }

    public static String padLeftZeros(String value, int length) {
        value = value == null ? "" : value;
        if (value.length() > length) {
            return value.substring(0, length);
        }
        return String.format("%" + length + "s", value).replace(' ', '0');
    }
}