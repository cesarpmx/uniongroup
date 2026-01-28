/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.CentralOrdenCompra;
import com.entity.global.CentralOrdenCompraGlobal;
import com.entity.global.LineasOrdenCompraResponseWrapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.util.ReadProps;
import com.util.Utilities;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author ray_w
 */
@WebServlet(name = "CtrlOrdenesCompra", urlPatterns = {"/OrdenesCompra"})
public class CtrlOrdenesCompra extends HttpServlet {

    RequestGetApi requetGet = new RequestGetApi();
    ReadProps props = new ReadProps();

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json; charset=ISO-8859-1");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
        response.setHeader("Pragma", "no-cache"); //HTTP 1.0
        response.setDateHeader("Expires", 0);
        PrintWriter out = response.getWriter();
        String bnd = Utilities.obtenParametro(request, "busqBnd");
        String idEmpresa = Utilities.obtenParametro(request, "idEmpresa");
        try {
            switch (bnd) {
                case "1":
                    out.print(ObtenerOrdenesCompraGlobal(request, response));
                    break;
                case "2":
                    out.print(ObtenerLineasOrden(request, response));
                    break;
                case "3":
                    out.print(NuevoOrdenCompra(request, response));
                    break;
                case "4":
                    out.print(ObtenerOrdenesCompra(request, response));
                    break;
                case "5":
                    out.print(ObtenerPODetLocal(request, response));
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerOrdenesCompraGlobal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String serviceConsignatarios = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServicePurchaseOrderGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // ? Usar OrdenCompraExterna[] para el API externo
            CentralOrdenCompraGlobal[] ordenes = mapper.readValue(respuestaItems, CentralOrdenCompraGlobal[].class);

            // Aplanar la estructura
            List<Map<String, Object>> resultado = new ArrayList<>();
            for (CentralOrdenCompraGlobal orden : ordenes) {
                Map<String, Object> item = new HashMap<>();
                item.put("DocEntry", orden.PurchaseOrder.DocEntry);
                item.put("DocNum", orden.PurchaseOrder.DocNum);
                item.put("NumAtCard", orden.PurchaseOrder.NumAtCard);
                item.put("DocDate", orden.PurchaseOrder.DocDate);
                item.put("CardCode", orden.PurchaseOrder.CardCode);
                item.put("Memo", orden.PurchaseOrder.Memo);
                item.put("OrderTotal", orden.ControlValues.OrderTotal);
                item.put("TotalLines", orden.ControlValues.TotalLines);
                resultado.add(item);
            }

            return mapper.writeValueAsString(resultado);
        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerOrdenesCompraGlobal:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String ObtenerLineasOrden(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String docEntry = Utilities.obtenParametro(request, "docEntry");

            if (docEntry == null || docEntry.isEmpty()) {
                return "[]";
            }

            String serviceConsignatarios = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServicePurchaseOrderGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CentralOrdenCompraGlobal[] ordenes = mapper.readValue(respuestaItems, CentralOrdenCompraGlobal[].class);

            for (CentralOrdenCompraGlobal orden : ordenes) {
                if (orden.PurchaseOrder.DocEntry.equals(docEntry)) {
                    String jsonResult = mapper.writeValueAsString(orden.Lines);
                    System.out.println("? Se encontraron " + orden.Lines.size() + " líneas para DocEntry: " + docEntry);
                    return jsonResult;
                }
            }

            System.out.println("?? No se encontró orden con DocEntry: " + docEntry);
            return "[]";

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerLineasOrden:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String NuevoOrdenCompra(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            // 1. POST a nuestro backend (ORDS)
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenCompra");
            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);

            // 2. Parsear respuesta
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            Map<String, Object> respuesta = mapper.readValue(JSONVal, Map.class);

            if (respuesta.get("success") != null && (Boolean) respuesta.get("success")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) respuesta.get("results");

                // 3. Construir ConfirmData REAL solo con los exitosos
                List<Map<String, Object>> confirmDataArray = new ArrayList<>();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                String fechaActual = sdf.format(new Date());

                for (Map<String, Object> item : results) {
                    if ("inserted".equals(item.get("status"))) {
                        Map<String, Object> confirmItem = new HashMap<>();
                        confirmItem.put("DocEntry", item.get("DocEntry"));
                        confirmItem.put("ObjectCode", item.get("DocNum"));
                        confirmItem.put("RecordDate", fechaActual);
                        confirmDataArray.add(confirmItem);
                    }
                }

                // Solo enviar al cliente si hay órdenes exitosas
                if (!confirmDataArray.isEmpty()) {
                    Map<String, Object> confirmDataJSON = new HashMap<>();
                    confirmDataJSON.put("ConfirmData", confirmDataArray);

                    String confirmDataString = mapper.writeValueAsString(confirmDataJSON);

                    System.out.println("========================================");
                    System.out.println("? ConfirmData REAL para el cliente:");
                    System.out.println(confirmDataString);
                    System.out.println("========================================");

                    // 4. POST al cliente GLOBAL
                    try {
                        String serviceCliente = props.getValueProp("HostGlobalInsert")
                                + props.getValueProp("ServicePurchaseOrderPostGlobal");

                        System.out.println("? Enviando POST a: " + serviceCliente);

                        String respuestaCliente = requetPost.getPostGlobal(serviceCliente, confirmDataString);

                        System.out.println("========================================");
                        System.out.println("? Respuesta del cliente:");
                        System.out.println(respuestaCliente);
                        System.out.println("========================================");

                        // 5. Parsear la respuesta del cliente (viene como JSON escapado)
                        String jsonLimpio = mapper.readValue(respuestaCliente, String.class);

                        List<Map<String, Object>> clienteResponse = mapper.readValue(
                                jsonLimpio,
                                new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {
                        }
                        );

                        // Imprimir detalles
                        for (Map<String, Object> item : clienteResponse) {
                            System.out.println("  ? Folio: " + item.get("Folio"));
                            System.out.println("  ? DocEntry: " + item.get("DocEntry"));
                            System.out.println("  ? ObjType: " + item.get("ObjType"));
                            System.out.println("  ? SystemDate: " + item.get("SystemDate"));
                        }

                        // 6. Agregar respuesta del cliente al JSON de retorno
                        respuesta.put("clienteResponse", clienteResponse);
                        JSONVal = mapper.writeValueAsString(respuesta);

                    } catch (Exception ex) {
                        System.out.println("? Error al enviar al cliente:");
                        ex.printStackTrace();
                        // Agregar error al response
                        respuesta.put("clienteError", ex.getMessage());
                        JSONVal = mapper.writeValueAsString(respuesta);
                    }
                } else {
                    System.out.println("?? No hay órdenes exitosas para confirmar al cliente");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

//    public String NuevoOrdenCompra(HttpServletRequest request, HttpServletResponse response) {
//        String JSONVal = "";
//        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
//        RequestPostApi requetPost = new RequestPostApi();
//        try {
//            // 1. POST a nuestro backend (ORDS)
//            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenCompra");
//            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);
//
//            // 2. Parsear respuesta para construir ConfirmData
//            ObjectMapper mapper = new ObjectMapper();
//            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//
//            Map<String, Object> respuesta = mapper.readValue(JSONVal, Map.class);
//
//            if (respuesta.get("success") != null && (Boolean) respuesta.get("success")) {
//                List<Map<String, Object>> results = (List<Map<String, Object>>) respuesta.get("results");
//
//                // 3. Construir ConfirmData solo con los exitosos
//                List<Map<String, Object>> confirmDataArray = new ArrayList<>();
//                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
//                String fechaActual = sdf.format(new Date());
//
//                for (Map<String, Object> item : results) {
//                    if ("inserted".equals(item.get("status"))) {
//                        Map<String, Object> confirmItem = new HashMap<>();
//                        confirmItem.put("DocEntry", item.get("DocEntry"));
//                        confirmItem.put("ObjectCode", item.get("DocNum"));
//                        confirmItem.put("RecordDate", fechaActual);
//                        confirmDataArray.add(confirmItem);
//                    }
//                }
//
//                // 4. Crear el objeto final
//                Map<String, Object> confirmDataJSON = new HashMap<>();
//                confirmDataJSON.put("ConfirmData", confirmDataArray);
//
//                String confirmDataString = mapper.writeValueAsString(confirmDataJSON);
//
//                // 5. Imprimir en consola
//                System.out.println("========================================");
//                System.out.println("? ConfirmData para el cliente:");
//                System.out.println(confirmDataString);
//                System.out.println("========================================");
//
//                // 6. MÁS ADELANTE: Aquí iría el POST real al cliente
//                /*
//            String serviceCliente = props.getValueProp("HostCliente") + props.getValueProp("ServiceConfirm");
//            String respuestaCliente = requetPost.getPost(serviceCliente, confirmDataString, request);
//            System.out.println("? Respuesta del cliente: " + respuestaCliente);
//                 */
//            }
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            JSONVal = "";
//        }
//        return JSONVal;
//    }
//    public String NuevoOrdenCompra(HttpServletRequest request, HttpServletResponse response) {
//        String JSONVal = "";
//        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
//        RequestPostApi requetPost = new RequestPostApi();
//        try {
//            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenCompra");
//            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            JSONVal = "";
//        }
//        return JSONVal;
//    }
    public String ObtenerOrdenesCompra(HttpServletRequest request, HttpServletResponse response) {
        String idEstatusCompras;
        idEstatusCompras = Utilities.obtenParametro(request, "idEstatusCompras");

        try {

            idEstatusCompras = Utilities.obtenParametro(request, "idEstatusCompras");

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String serviceConsignatarios = props.getValueProp("Host")
                    + props.getValueProp("ServiceOrdenCompra") + "?estatus=" + idEstatusCompras;

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true); // ? AGREGAR ESTO

            CentralOrdenCompra CItems = mapper.readValue(respuestaItems, CentralOrdenCompra.class);
            String jsonResult = mapper.writeValueAsString(CItems.items);
            System.out.println(jsonResult);
            return jsonResult;
        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerOrdenesCompra:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String ObtenerPODetLocal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String docEntry = Utilities.obtenParametro(request, "docEntry");
            String service = props.getValueProp("Host")
                    + props.getValueProp("ServiceOrdenCompraDet")
                    + docEntry;

            String respuesta = requetGet.getGetGlobal(service);
            respuesta = normalizeJson(respuesta);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            // ? Reutilizar la clase wrapper de ORDS
            LineasOrdenCompraResponseWrapper wrapper = mapper.readValue(respuesta, LineasOrdenCompraResponseWrapper.class);

            return mapper.writeValueAsString(wrapper);
        } catch (Exception e) {
            e.printStackTrace();
            return "[]";
        }
    }

    private String normalizeJson(String json) {
        json = json.trim();

        if (json.startsWith("\"")) {
            json = json.substring(1, json.length() - 1);
            json = json.replace("\\\"", "\"");
            json = json.replace("\\n", "");
            json = json.replace("\\r", "");
            json = json.replace("\\t", "");
        }
        return json;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
