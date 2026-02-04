/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.CentralTransferenciaSalida;
import com.entity.global.CentralTransferenciaSalidaGlobal;
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
@WebServlet(name = "CtrlTranferenciaSalida", urlPatterns = {"/TransferenciasSalida"})
public class CtrlTranferenciaSalida extends HttpServlet {

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
                    out.print(ObtenerTransferenciasSalidaGlobal(request, response));
                    break;
                case "2":  // ? NUEVO
                    out.print(ObtenerLineasTransferencia(request, response));
                    break;
                case "3":  // ? NUEVO
                    out.print(NuevaTransferenciaSalida(request, response));
                    break;
                case "4":  // ? ESTE
                    out.print(BuscarTransferenciasSalidaLocal(request, response));
                    break;
                case "5":
                    out.print(ObtenerLineasLocal(request, response));
                    break;
                case "6":  // ? NUEVO
                    out.print(EnviarTransferShipConfirm(request, response));
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerTransferenciasSalidaGlobal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String serviceTransferencias = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServiceOutboundTransferGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceTransferencias);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Deserializar array de transferencias
            CentralTransferenciaSalidaGlobal[] transferencias = mapper.readValue(
                    respuestaItems,
                    CentralTransferenciaSalidaGlobal[].class
            );

            // Aplanar la estructura para el frontend
            List<Map<String, Object>> resultado = new ArrayList<>();
            for (CentralTransferenciaSalidaGlobal transferencia : transferencias) {
                Map<String, Object> item = new HashMap<>();
                item.put("DocEntry", transferencia.OutboundTransferRequest.DocEntry);
                item.put("DocNum", transferencia.OutboundTransferRequest.DocNum);
                item.put("NumAtCard", transferencia.OutboundTransferRequest.NumAtCard);
                item.put("DocDate", transferencia.OutboundTransferRequest.DocDate);
                item.put("CardCode", transferencia.OutboundTransferRequest.CardCode);
                item.put("Status", transferencia.OutboundTransferRequest.Status);
                item.put("Memo", transferencia.OutboundTransferRequest.Memo);
                item.put("AddressCode", transferencia.OutboundTransferRequest.AddressCode);
                item.put("OrderTotal", transferencia.ControlValues.OrderTotal);
                item.put("TotalLines", transferencia.ControlValues.TotalLines);
                resultado.add(item);
            }

            return mapper.writeValueAsString(resultado);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerTransferenciasSalidaGlobal:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String ObtenerLineasTransferencia(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String docEntry = Utilities.obtenParametro(request, "docEntry");

            if (docEntry == null || docEntry.isEmpty()) {
                return "[]";
            }

            String serviceTransferencias = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServiceOutboundTransferGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceTransferencias);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CentralTransferenciaSalidaGlobal[] transferencias = mapper.readValue(
                    respuestaItems,
                    CentralTransferenciaSalidaGlobal[].class
            );

            for (CentralTransferenciaSalidaGlobal transferencia : transferencias) {
                if (transferencia.OutboundTransferRequest.DocEntry.equals(docEntry)) {
                    String jsonResult = mapper.writeValueAsString(transferencia.Lines);
                    System.out.println("? Se encontraron " + transferencia.Lines.size()
                            + " líneas para DocEntry: " + docEntry);
                    return jsonResult;
                }
            }

            System.out.println("?? No se encontró transferencia con DocEntry: " + docEntry);
            return "[]";

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerLineasTransferencia:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String NuevaTransferenciaSalida(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonTransferencias = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            // 1. POST a nuestro backend (ORDS)
            String service = props.getValueProp("Host")
                    + props.getValueProp("ServiceTransferenciaSalida");

            JSONVal = requetPost.getPost(service, jsonTransferencias, request);

            // 2. Parsear respuesta
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            Map<String, Object> respuesta = mapper.readValue(JSONVal, Map.class);

            if (respuesta.get("success") != null && (Boolean) respuesta.get("success")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) respuesta.get("results");

                // 3. Construir ConfirmData para el cliente
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

                // 4. Enviar confirmación al cliente si hay transferencias exitosas
                if (!confirmDataArray.isEmpty()) {
                    Map<String, Object> confirmDataJSON = new HashMap<>();
                    confirmDataJSON.put("ConfirmData", confirmDataArray);

                    String confirmDataString = mapper.writeValueAsString(confirmDataJSON);

                    try {
                        String serviceCliente = props.getValueProp("HostGlobalInsert")
                                + props.getValueProp("ServiceTransferConfirmGlobal");

                        String respuestaCliente = requetPost.getPostGlobal(serviceCliente, confirmDataString);

                        // 5. Parsear respuesta del cliente (doble deserialización)
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
                        respuesta.put("clienteError", ex.getMessage());
                        JSONVal = mapper.writeValueAsString(respuesta);
                    }
                } else {
                    System.out.println("?? No hay transferencias exitosas para confirmar al cliente");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

    public String BuscarTransferenciasSalidaLocal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String estatus = Utilities.obtenParametro(request, "idEstatusTransferenciasSalida");
            String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");

            if (limit == null || limit.isEmpty()) {
                limit = "25";
            }
            if (offset == null || offset.isEmpty()) {
                offset = "0";
            }

            String service = props.getValueProp("Host")
                    + props.getValueProp("ServiceTransferenciaSalida")
                    + "?estatus=" + estatus
                    + "&offset=" + offset
                    + "&limit=" + limit;

            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            CentralTransferenciaSalida CItems = mapper.readValue(respuesta, CentralTransferenciaSalida.class);

            return mapper.writeValueAsString(CItems);

        } catch (Exception e) {
            System.out.println("? ERROR en BuscarTransferenciasSalidaLocal:");
            e.printStackTrace();
            return "{\"items\":[],\"total\":0,\"count\":0}";
        }
    }

    public String ObtenerLineasLocal(HttpServletRequest request, HttpServletResponse response) {
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
                    + props.getValueProp("ServiceTransferenciaSalidaDet")
                    + docEntry + "&offset=" + offset + "&limit=" + limit;

            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            LineasTransferenciaSalidaResponseWrapper wrapper = mapper.readValue(
                    respuesta,
                    LineasTransferenciaSalidaResponseWrapper.class
            );

            return mapper.writeValueAsString(wrapper);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerLineasLocal:");
            e.printStackTrace();
            return "{\"items\":[],\"total\":0,\"count\":0}";
        }
    }

    public String EnviarTransferShipConfirm(HttpServletRequest request, HttpServletResponse response) {
        String jsonTransferShip = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();

        try {

            String serviceCliente = props.getValueProp("HostGlobalInsert")
                    + props.getValueProp("ServiceTransferShipConfirmGlobal");

            String respuestaCliente = requetPost.getPostGlobal(serviceCliente, jsonTransferShip);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Verificar si la respuesta está vacía
            if (respuestaCliente == null || respuestaCliente.trim().isEmpty() || respuestaCliente.equals("\"\"")) {

                // Extraer datos del JSON enviado para crear respuesta simulada
                Map<String, Object> datosEnviados = mapper.readValue(jsonTransferShip, Map.class);
                Map<String, Object> transferShip = (Map<String, Object>) datosEnviados.get("TransferShipmentConfirm");

                Map<String, Object> respuestaSimulada = new HashMap<>();
                respuestaSimulada.put("success", true);
                respuestaSimulada.put("message", "Confirmación de embarque enviada (respuesta vacía del cliente)");
                respuestaSimulada.put("DocNum", transferShip.get("DocNum"));
                respuestaSimulada.put("NumAtCard", transferShip.get("NumAtCard"));
                respuestaSimulada.put("Status", transferShip.get("Status"));

                // Guardar en log de confirmación
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                String fechaActual = sdf.format(new Date());

                String serviceLog = props.getValueProp("Host")
                        + props.getValueProp("ServiceConfirmationLog");

                Map<String, Object> logData = new HashMap<>();
                logData.put("process", "TS_TransferShipConfirmDEV");
                logData.put("request", jsonTransferShip);
                logData.put("response", "");
                logData.put("status", "success");
                logData.put("timestamp", fechaActual);

                String logJson = mapper.writeValueAsString(logData);

                try {
                    requetPost.getPost(serviceLog, logJson, request);
                    System.out.println("? Log guardado en UG_CONFIRMATION_LOG");
                } catch (Exception e) {
                    System.out.println("?? No se pudo guardar en log: " + e.getMessage());
                }

                return mapper.writeValueAsString(respuestaSimulada);
            }

            // Si hay respuesta, parsearla normalmente (doble deserialización)
            String jsonLimpio = mapper.readValue(respuestaCliente, String.class);

            List<Map<String, Object>> clienteResponse = mapper.readValue(
                    jsonLimpio,
                    new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {
            }
            );

            // Guardar en log
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            String fechaActual = sdf.format(new Date());

            String serviceLog = props.getValueProp("Host")
                    + props.getValueProp("ServiceConfirmationLog");

            Map<String, Object> logData = new HashMap<>();
            logData.put("process", "TS_TransferShipConfirmDEV");
            logData.put("request", jsonTransferShip);
            logData.put("response", respuestaCliente);
            logData.put("status", "success");
            logData.put("timestamp", fechaActual);

            String logJson = mapper.writeValueAsString(logData);

            try {
                requetPost.getPost(serviceLog, logJson, request);
                System.out.println("? Log guardado en UG_CONFIRMATION_LOG");
            } catch (Exception e) {
                System.out.println("?? No se pudo guardar en log: " + e.getMessage());
            }

            Map<String, Object> resultado = new HashMap<>();
            resultado.put("success", true);
            resultado.put("clienteResponse", clienteResponse);

            return mapper.writeValueAsString(resultado);

        } catch (Exception e) {
            System.out.println("? ERROR en EnviarTransferShipConfirm:");
            e.printStackTrace();

            try {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", e.getMessage());
                return new ObjectMapper().writeValueAsString(error);
            } catch (Exception ex) {
                return "{\"success\":false,\"error\":\"Error desconocido\"}";
            }
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
