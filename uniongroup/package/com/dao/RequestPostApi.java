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
        if(session.getAttribute("usuario") == null || session.getAttribute("usuario") == ""){
            usuId="";
            out = data.getBytes(StandardCharsets.UTF_8);
        }else{
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
    if(session.getAttribute("usuario") == null || session.getAttribute("usuario") == ""){
        usuId="";
        out = data.getBytes(StandardCharsets.UTF_8);
    } else {
        System.out.print(session.getAttribute("usuario"));
        usuId = session.getAttribute("usuario").toString();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode newData = mapper.readTree(data);

        if (newData.isArray()) {
            ArrayNode arrayNode = (ArrayNode) newData;
            for (JsonNode node : arrayNode) {
                ((ObjectNode) node).put("idUsuario", usuId);
            }
        }

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
        if(session.getAttribute("usuario") == null || session.getAttribute("usuario") == ""){
            usuId="";
            out = data.getBytes(StandardCharsets.UTF_8);
        }else{
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
        if(session.getAttribute("usuario") == null || session.getAttribute("usuario") == ""){
            usuId="";
            out = data.getBytes(StandardCharsets.UTF_8);
        }else{
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
