/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.CentralOrdenCompra;
import com.entity.global.CentralOrdenCompraGlobal;
import com.entity.global.CentralOrdenVenta;
import com.entity.global.CentralOrdenVentaGlobal;
import com.entity.global.LineasOrdenVentaResponseWrapper;
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
@WebServlet(name = "CtrlOrdenVenta", urlPatterns = {"/OrdenesVenta"})
public class CtrlOrdenVenta extends HttpServlet {

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
                    out.print(ObtenerOrdenesVenta(request, response));
                    break;
                case "2":
                    out.print(ObtenerPSDetLocal(request, response));
                    break;
                case "3":
                    out.print(ObtenerOrdenesVentaGlobal(request, response));
                    break;
                case "4":
                    out.print(ObtenerLineasOrdenVenta(request, response));
                    break;
                case "5":
                    out.print(NuevoOrdenVenta(request, response));
                    break;
                case "6":
                    out.print(EnviarShipmentConfirm(request, response));
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerOrdenesVenta(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String idEstatusVenta = Utilities.obtenParametro(request, "idEstatusVenta");
            String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");

            if (limit == null || limit.isEmpty()) {
                limit = "25";
            }
            if (offset == null || offset.isEmpty()) {
                offset = "0";
            }

            String serviceConsignatarios = props.getValueProp("Host")
                    + props.getValueProp("ServiceOrdenVenta")
                    + "?estatus=" + idEstatusVenta
                    + "&offset=" + offset
                    + "&limit=" + limit;

            String respuestaItems = requetGet.getGetPaginacion(serviceConsignatarios, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            CentralOrdenVenta CItems = mapper.readValue(respuestaItems, CentralOrdenVenta.class);

            return mapper.writeValueAsString(CItems);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerOrdenesVenta:");
            e.printStackTrace();
            return "{\"items\":[],\"total\":0,\"count\":0}";
        }
    }

    public String ObtenerPSDetLocal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String docEntry = Utilities.obtenParametro(request, "docEntry");
            String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");

            if (limit == null || limit.isEmpty()) {
                limit = "25";
            }
            if (offset == null || offset.isEmpty()) {
                offset = "0";
            }

            String service = props.getValueProp("Host")
                    + props.getValueProp("ServiceOrdenVentaDet")
                    + docEntry + "&offset=" + offset + "&limit=" + limit;

            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            LineasOrdenVentaResponseWrapper wrapper = mapper.readValue(respuesta, LineasOrdenVentaResponseWrapper.class);

            return mapper.writeValueAsString(wrapper);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerLineasVentaLocal:");
            e.printStackTrace();
            return "{\"items\":[],\"total\":0,\"count\":0}";
        }
    }

//    public String ObtenerPSDetLocal(HttpServletRequest request, HttpServletResponse response) {
//        try {
//            response.setContentType("application/json");
//            response.setCharacterEncoding("UTF-8");
//
//            String docEntry = Utilities.obtenParametro(request, "docEntry");
//            String service = props.getValueProp("Host")
//                    + props.getValueProp("ServiceOrdenVentaDet")
//                    + docEntry;
//
//            String respuesta = requetGet.getGetGlobal(service);
//            respuesta = normalizeJson(respuesta);
//
//            ObjectMapper mapper = new ObjectMapper();
//            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
//
//            // ? Reutilizar la clase wrapper de ORDS
//            LineasOrdenVentaResponseWrapper wrapper = mapper.readValue(respuesta, LineasOrdenVentaResponseWrapper.class);
//
//            return mapper.writeValueAsString(wrapper.items);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "[]";
//        }
//    }
    public String ObtenerOrdenesVentaGlobal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String serviceConsignatarios = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServiceSalesOrderGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CentralOrdenVentaGlobal[] ordenes = mapper.readValue(respuestaItems, CentralOrdenVentaGlobal[].class);

            List<Map<String, Object>> resultado = new ArrayList<>();
            for (CentralOrdenVentaGlobal orden : ordenes) {
                Map<String, Object> item = new HashMap<>();
                item.put("DocEntry", orden.SalesOrder.DocEntry);
                item.put("DocNum", orden.SalesOrder.DocNum);
                item.put("NumAtCard", orden.SalesOrder.NumAtCard);
                item.put("DocDate", orden.SalesOrder.DocDate);
                item.put("CardCode", orden.SalesOrder.CardCode);
                item.put("AddressCode", orden.SalesOrder.AddressCode);
                item.put("Status", orden.SalesOrder.Status);
                item.put("Memo", orden.SalesOrder.Memo);
                item.put("OrderTotal", orden.ControlValues.OrderTotal);
                item.put("TotalLines", orden.ControlValues.TotalLines); // ? YA ESTÁ
                resultado.add(item);
            }

            return mapper.writeValueAsString(resultado);
        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerOrdenesVentaGlobal:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String ObtenerLineasOrdenVenta(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String docEntry = Utilities.obtenParametro(request, "docEntry");

            if (docEntry == null || docEntry.isEmpty()) {
                return "[]";
            }

            String serviceConsignatarios = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServiceSalesOrderGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CentralOrdenVentaGlobal[] ordenes = mapper.readValue(respuestaItems, CentralOrdenVentaGlobal[].class);

            for (CentralOrdenVentaGlobal orden : ordenes) {
                if (orden.SalesOrder.DocEntry.equals(docEntry)) {
                    String jsonResult = mapper.writeValueAsString(orden.Lines);
                    return jsonResult;
                }
            }

            return "[]";

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerLineasOrden:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String NuevoOrdenVenta(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            // 1. POST a nuestro backend (ORDS)
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenVenta");
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
                    
                    try {
                        String serviceCliente = props.getValueProp("HostGlobalInsert")
                                + props.getValueProp("ServiceSalesOrderPostGlobal");


                        String respuestaCliente = requetPost.getPostGlobal(serviceCliente, confirmDataString);

                        String jsonLimpio = mapper.readValue(respuestaCliente, String.class);

                        List<Map<String, Object>> clienteResponse = mapper.readValue(
                                jsonLimpio,
                                new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {
                        }
                        );

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
                    System.out.println("?? No hay órdenes de venta exitosas para confirmar al cliente");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

    public String EnviarShipmentConfirm(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonShipment = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // 1. Parsear el JSON recibido
            Map<String, Object> shipmentData = mapper.readValue(jsonShipment, Map.class);

            String serviceCliente = props.getValueProp("HostGlobalInsert")
                    + props.getValueProp("ServiceShipmentConfirmGlobal");

            String respuestaCliente = requetPost.getPostGlobal(serviceCliente, jsonShipment);

            // 3. ? DOBLE DESERIALIZACIÓN - RESPUESTA COMO ARRAY
            String jsonLimpio = mapper.readValue(respuestaCliente, String.class);

            // Deserializar como LISTA y tomar el primer elemento
            List<Map<String, Object>> clienteResponseList = mapper.readValue(
                    jsonLimpio,
                    new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {
            }
            );

            // Tomar el primer elemento del array
            Map<String, Object> clienteResponse = clienteResponseList.get(0);

            // 4. ? CONSTRUIR JSON PARA GUARDAR EN UG_CONFIRMATION_LOG
            Map<String, Object> confirmationLog = new HashMap<>();
            confirmationLog.put("CLOPROCESS", "SO_ShipmentConfirmDEV");
            confirmationLog.put("CLOSTATUS", 200);
            confirmationLog.put("CLOMENSSAGE", "OK");
            confirmationLog.put("CLOSYSTEMDATE", clienteResponse.get("DocDate"));
            confirmationLog.put("CLOTRANSACTIONNUMBER", clienteResponse.get("TransactionNumber"));
            confirmationLog.put("CLODOCDATE", clienteResponse.get("DocDate"));
            confirmationLog.put("CLODOCNUM", clienteResponse.get("DocNum"));

            String confirmationJson = mapper.writeValueAsString(confirmationLog);

            // 5. ? GUARDAR EN API LOCAL
            try {
                String serviceLog = "https://seyl.mx/apps/globale/uniongroup/confirmationlog/";

                String resultadoLog = requetPost.getPost(serviceLog, confirmationJson, request);

                // Parsear respuesta del log (opcional, solo para validar)
                Map<String, Object> logResponse = mapper.readValue(resultadoLog, Map.class);
                if (logResponse.get("success") != null && (Boolean) logResponse.get("success")) {
                    System.out.println("? Log guardado exitosamente con CLOID: " + logResponse.get("CLOID"));
                } else {
                    System.out.println("?? Advertencia al guardar log: " + logResponse.get("message"));
                }

            } catch (Exception logEx) {
                // ?? Si falla el log, solo lo registramos pero NO afectamos la respuesta al usuario
                System.out.println("? Error al guardar en Confirmation Log (no crítico):");
                logEx.printStackTrace();
            }

            // 6. Construir respuesta (sin mencionar el log interno)
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("success", true);
            resultado.put("message", "Confirmación de envío procesada exitosamente");
            resultado.put("clienteResponse", clienteResponse);

            JSONVal = mapper.writeValueAsString(resultado);

        } catch (Exception e) {
            System.out.println("? Error en EnviarShipmentConfirm:");
            e.printStackTrace();

            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Error al procesar ShipmentConfirm: " + e.getMessage());
                JSONVal = mapper.writeValueAsString(error);
            } catch (Exception ex) {
                JSONVal = "{\"success\":false,\"message\":\"Error fatal\"}";
            }
        }

        return JSONVal;
    }

//    public String NuevoOrdenVenta(HttpServletRequest request, HttpServletResponse response) {
//        String JSONVal = "";
//        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
//        RequestPostApi requetPost = new RequestPostApi();
//        try {
//            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenVenta");
//            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            JSONVal = "";
//        }
//        return JSONVal;
//    }
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
