/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dao;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.util.ContextPathServer;
import com.util.ReadProps;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Properties;
import org.json.*;

/**
 *
 * @author mandrade
 */
public class RequestPostApi {

    public String getPostGlobal(String service, String content) throws IOException {
        String request = "";
        ReadProps prop = new ReadProps();

        URL url = new URL(service);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("POST");
        http.setDoOutput(true);

        // ? Usar credenciales del cliente (NO "key")
        String usuario = prop.getValueProp("UsuarioGlobal");
        String clave = prop.getValueProp("ClaveAccesoGlobal");
        String credenciales = usuario + ":" + clave;

        String encoder = Base64.getEncoder().encodeToString(credenciales.getBytes(StandardCharsets.UTF_8));
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Content-Type", "application/json");
        http.setRequestProperty("Accept", "application/json");

        // Enviar el JSON
        byte[] out = content.getBytes(StandardCharsets.UTF_8);
        OutputStream stream = http.getOutputStream();
        stream.write(out);
        stream.flush();
        stream.close();

        // Leer respuesta
        int status = http.getResponseCode();
        System.out.println("? Status HTTP: " + status);

        if (status != 200 && status != 201) {
            // Leer el error del servidor
            BufferedReader errorReader = new BufferedReader(
                    new InputStreamReader(http.getErrorStream(), StandardCharsets.UTF_8)
            );
            StringBuilder errorMsg = new StringBuilder();
            String line;
            while ((line = errorReader.readLine()) != null) {
                errorMsg.append(line);
            }
            errorReader.close();

            System.out.println("? Error del servidor: " + errorMsg.toString());
            throw new IOException("Server returned HTTP response code: " + status
                    + " for URL: " + service
                    + " | Error: " + errorMsg.toString());
        }

        BufferedReader in = new BufferedReader(new InputStreamReader(http.getInputStream(), StandardCharsets.UTF_8));
        String inputLine;
        StringBuilder contentz = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            contentz.append(inputLine);
        }
        request = contentz.toString();
        http.disconnect();

        return request;
    }

    public String getPost(String service, String content, HttpServletRequest newRequest) throws IOException {
        HttpSession session = newRequest.getSession(true);
        String usuId = "";
        String request = "", strKey = "";
        ReadProps prop = new ReadProps();
        URL url = new URL(service);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("POST");
        http.setDoOutput(true);
        strKey = prop.getValueProp("key");
        String encoder = Base64.getEncoder().encodeToString(strKey.getBytes());
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Content-Type", "application/json");
        String data = content;
        OutputStream stream = http.getOutputStream();
        byte[] out;
        if (session.getAttribute("usuario") == null || session.getAttribute("usuario") == "") {
            usuId = "";
            out = data.getBytes(StandardCharsets.UTF_8);
        } else {
            System.out.print(session.getAttribute("usuario"));
            usuId = session.getAttribute("usuario").toString();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode newData = mapper.readTree(data);
            ((ObjectNode) newData).put("idUsuario", usuId);
            String jsonNuevo = mapper.writeValueAsString(newData);
            System.out.println("jsonNuevo: " + jsonNuevo);
            out = jsonNuevo.getBytes(StandardCharsets.UTF_8);
        }
        stream.write(out);
        stream.flush();
        stream.close();
        int status = http.getResponseCode();
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

    public String getPostNuevo(String service, String content, HttpServletRequest newRequest) throws IOException {
        HttpSession session = newRequest.getSession(true);
        String request = "";
        ReadProps prop = new ReadProps();
        URL url = new URL(service);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();

        http.setRequestMethod("POST");
        http.setDoOutput(true);
        http.setConnectTimeout(30000);
        http.setReadTimeout(60000);

        String strKey = prop.getValueProp("key");
        String encoder = Base64.getEncoder().encodeToString(strKey.getBytes());
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

        // Lógica de Usuario y Payload
        String data = content;
        String usuId = (session.getAttribute("usuario") != null) ? session.getAttribute("usuario").toString() : "";

        if (!usuId.isEmpty()) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode newData = mapper.readTree(data);
            // Si el JSON viene con la raíz "addresses"
            if (newData.has("addresses") && newData.get("addresses").isArray()) {
                ArrayNode arrayNode = (ArrayNode) newData.get("addresses");
                for (JsonNode node : arrayNode) {
                    ((ObjectNode) node).put("idUsuario", usuId);
                }
            }
            data = mapper.writeValueAsString(newData);
        }

        // Escribir en el Stream
        try ( OutputStream stream = http.getOutputStream()) {
            byte[] out = data.getBytes(StandardCharsets.UTF_8);
            stream.write(out);
            stream.flush();
        }

        // LEER RESPUESTA (Mejorado para manejar errores)
        int status = http.getResponseCode();
        InputStream is = (status >= 200 && status < 300) ? http.getInputStream() : http.getErrorStream();

        if (is != null) {
            try ( BufferedReader in = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
                StringBuilder responseContent = new StringBuilder();
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    responseContent.append(inputLine);
                }
                request = responseContent.toString();
            }
        } else {
            request = "{\"success\": false, \"message\": \"Sin respuesta del servidor remoto\"}";
        }

        http.disconnect();
        return request;
    }

    public String setPostDelete(String service, String content, HttpServletRequest newRequest) throws IOException {
        HttpSession session = newRequest.getSession(true);
        String usuId = "";
        String request = "", strKey = "";
        ReadProps prop = new ReadProps();
        URL url = new URL(service);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("DELETE");
        http.setDoOutput(true);
        strKey = prop.getValueProp("key");
        String encoder = Base64.getEncoder().encodeToString(strKey.getBytes());
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Content-Type", "application/json");
        String data = content;
        OutputStream stream = http.getOutputStream();
        byte[] out;
        if (session.getAttribute("usuario") == null || session.getAttribute("usuario") == "") {
            usuId = "";
            out = data.getBytes(StandardCharsets.UTF_8);
        } else {
            System.out.print(session.getAttribute("usuario"));
            usuId = session.getAttribute("usuario").toString();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode newData = mapper.readTree(data);
            ((ObjectNode) newData).put("idUsuario", usuId);
            String jsonNuevo = mapper.writeValueAsString(newData);
            System.out.println("jsonNuevo: " + jsonNuevo);
            out = jsonNuevo.getBytes(StandardCharsets.UTF_8);
        }
        stream.write(out);
        stream.flush();
        stream.close();
        int status = http.getResponseCode();
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

    public String setPut(String service, String content, HttpServletRequest newRequest) throws IOException {
        HttpSession session = newRequest.getSession(true);
        String usuId = "";
        String request = "", strKey = "";
        ReadProps prop = new ReadProps();
        URL url = new URL(service);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestMethod("PUT");
        http.setDoOutput(true);
        strKey = prop.getValueProp("key");
        String encoder = Base64.getEncoder().encodeToString(strKey.getBytes());
        http.setRequestProperty("Authorization", "Basic " + encoder);
        http.setRequestProperty("Content-Type", "application/json");
        String data = content;
        OutputStream stream = http.getOutputStream();
        byte[] out;
        if (session.getAttribute("usuario") == null || session.getAttribute("usuario") == "") {
            usuId = "";
            out = data.getBytes(StandardCharsets.UTF_8);
        } else {
            System.out.print(session.getAttribute("usuario"));
            usuId = session.getAttribute("usuario").toString();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode newData = mapper.readTree(data);
            ((ObjectNode) newData).put("idUsuario", usuId);
            String jsonNuevo = mapper.writeValueAsString(newData);
            System.out.println("jsonNuevo: " + jsonNuevo);
            out = jsonNuevo.getBytes(StandardCharsets.UTF_8);
        }
        stream.write(out);
        stream.flush();
        stream.close();
        int status = http.getResponseCode();
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
}
