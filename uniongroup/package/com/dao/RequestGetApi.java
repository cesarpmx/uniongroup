/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dao;
//import com.util.ContextPathServer;

import com.util.ReadProps;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
//import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
//import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
//import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.json.JSONArray;
import org.json.JSONObject;
//import java.util.Properties;
//import org.json.*;

/**
 *
 * @author SISTEMAS
 */
public class RequestGetApi {

    public String getGet(String service) throws IOException {
        String request;
        String strKey;
        ReadProps prop = new ReadProps();
        URL url = new URL(service);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("GET");
        strKey = prop.getValueProp("key");
        String encoder = Base64.getEncoder().encodeToString(strKey.getBytes());
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Accept", "application/json");
        if (http.getResponseCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : "
                    + http.getResponseCode());
        }
        BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream(), "UTF-8"));
        String inputLine;
        StringBuilder contentz = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            contentz.append(inputLine);
        }
        request = contentz.toString();
        http.disconnect();

        return request;

    }

    public String getGetGlobal(String service) throws IOException {
        String request;
        String strKey;
        ReadProps prop = new ReadProps();
        URL url = new URL(service);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("GET");
        String usuario = prop.getValueProp("UsuarioGlobal").trim();
        String password = prop.getValueProp("ClaveAccesoGlobal").trim();

        strKey = usuario + ":" + password;
        String encoder = Base64.getEncoder().encodeToString(strKey.getBytes());
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Accept", "application/json");
        if (http.getResponseCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : "
                    + http.getResponseCode());
        }
        BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream(), "UTF-8"));
        String inputLine;
        StringBuilder contentz = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            contentz.append(inputLine);
        }
        request = contentz.toString();
        http.disconnect();

        return request;

    }

    public String getGetUsuario(String service, HttpServletRequest newRequest) throws IOException {
        HttpSession session = newRequest.getSession(true);
        String idUsuario = session.getAttribute("usuario").toString();;

        String request;
        String strKey;

        ReadProps prop = new ReadProps();
        URL url = new URL(service + "&idUsuario=" + idUsuario);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("GET");
        strKey = prop.getValueProp("key");
        String encoder = Base64.getEncoder().encodeToString(strKey.getBytes());
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Accept", "application/json");
        if (http.getResponseCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : "
                    + http.getResponseCode());
        }
        BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream(), "UTF-8"));
        String inputLine;
        StringBuilder contentz = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            contentz.append(inputLine);
        }
        request = contentz.toString();
        http.disconnect();

        return request;
    }

    private Integer totalRecs = null;

    public String getGetPaginacion(String service, HttpServletRequest newRequest) throws IOException {
        HttpSession session = newRequest.getSession(true);
        String idUsuario = session.getAttribute("usuario").toString();
        ReadProps prop = new ReadProps();
        URL url = new URL(service + "&idUsuario=" + idUsuario);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("GET");
        String strKey = prop.getValueProp("key");
        String encoder = Base64.getEncoder().encodeToString(strKey.getBytes());
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Accept", "application/json");
        if (http.getResponseCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : " + http.getResponseCode());
        }
        BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream(), "UTF-8"));
        StringBuilder contentz = new StringBuilder();
        String inputLine;
        while ((inputLine = in.readLine()) != null) {
            contentz.append(inputLine);
        }
        in.close();
        http.disconnect();
        JSONObject jsonResponse = new JSONObject(contentz.toString());
        JSONArray itemsArray = jsonResponse.getJSONArray("items");
        Integer currentTotal = null;

        // ? Verificar si la primera fila tiene totalrecs con VALOR (no null)
        if (!jsonResponse.isNull("items") && itemsArray.length() > 0) {
            JSONObject firstItem = itemsArray.getJSONObject(0);
            if (!firstItem.isNull("totalrecs")) {
                // Esta es la fila del contador - extraer el total y eliminarla
                currentTotal = firstItem.getInt("totalrecs");
                totalRecs = currentTotal;
                itemsArray.remove(0);

                // ??? AGREGAR ESTA LÍNEA - Actualizar el count después de eliminar
                jsonResponse.put("count", itemsArray.length());

            } else {
                // Esta NO es la fila del contador, usar el total guardado previamente
                currentTotal = totalRecs;
            }
        }

        // ? SIEMPRE incluir el total en la respuesta
        if (currentTotal != null) {
            jsonResponse.put("total", currentTotal);
        } else {
            jsonResponse.put("total", 0);
        }

        return jsonResponse.toString();
    }

}
