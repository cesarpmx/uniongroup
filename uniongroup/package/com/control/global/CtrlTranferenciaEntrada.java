/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.ArrTransferenciaEntradaLine;
import com.entity.global.CentralOrdenCompra;
import com.entity.global.CentralOrdenCompraGlobal;
import com.entity.global.CentralTransferenciaEntrada;
import com.entity.global.CentralTransferenciaEntradaGlobal;
import com.entity.global.LineasOrdenCompraResponseWrapper;
import com.entity.global.LineasTransferenciaEntradaResponseWrapper;
import com.fasterxml.jackson.core.type.TypeReference;
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
@WebServlet(name = "CtrlTranferenciaEntrada", urlPatterns = {"/TransferenciasEntrada"})
public class CtrlTranferenciaEntrada extends HttpServlet {

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
                    out.print(ObtenerTransferenciasGlobal(request, response));
                    break;
                case "2":
                    out.print(ObtenerLineasTransferencia(request, response));
                    break;
                case "3":  // ? NUEVO
                    out.print(NuevaTransferenciaEntrada(request, response));
                    break;
                case "4":  // ? NUEVO: Buscar en BD Local
                    out.print(BuscarTransferenciasLocal(request, response));
                    break;
                case "5":  // ? NUEVO: Ver líneas desde BD Local
                    out.print(ObtenerLineasLocal(request, response));
                    break;
                case "6":  // ? NUEVO
                    out.print(EnviarTransferReceiptConfirm(request, response));
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerTransferenciasGlobal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String serviceTransferencias = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServiceInboundTransferGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceTransferencias);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Deserializar el array de transferencias
            CentralTransferenciaEntradaGlobal[] transferencias = mapper.readValue(
                    respuestaItems,
                    CentralTransferenciaEntradaGlobal[].class
            );

            // Aplanar la estructura para el frontend
            List<Map<String, Object>> resultado = new ArrayList<>();
            for (CentralTransferenciaEntradaGlobal transfer : transferencias) {
                Map<String, Object> item = new HashMap<>();
                item.put("DocEntry", transfer.InboundTransferRequest.DocEntry);
                item.put("DocNum", transfer.InboundTransferRequest.DocNum);
                item.put("NumAtCard", transfer.InboundTransferRequest.NumAtCard);
                item.put("DocDate", transfer.InboundTransferRequest.DocDate);
                item.put("CardCode", transfer.InboundTransferRequest.CardCode);
                item.put("AddressCode", transfer.InboundTransferRequest.AddressCode);
                item.put("Status", transfer.InboundTransferRequest.Status);
                item.put("Memo", transfer.InboundTransferRequest.Memo);
                item.put("OrderTotal", transfer.ControlValues.OrderTotal);
                item.put("TotalLines", transfer.ControlValues.TotalLines);
                resultado.add(item);
            }

            return mapper.writeValueAsString(resultado);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerTransferenciasGlobal:");
            e.printStackTrace();
            return "[]";
        }
    }

    // ========================================
    // ? FUNCIÓN 2: Obtener Líneas de una Transferencia
    // ========================================
    public String ObtenerLineasTransferencia(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String docEntry = Utilities.obtenParametro(request, "docEntry");

            // Primero obtener todas las transferencias
            String serviceTransferencias = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServiceInboundTransferGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceTransferencias);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CentralTransferenciaEntradaGlobal[] transferencias = mapper.readValue(
                    respuestaItems,
                    CentralTransferenciaEntradaGlobal[].class
            );

            // Buscar la transferencia específica
            List<Map<String, Object>> lineas = new ArrayList<>();
            for (CentralTransferenciaEntradaGlobal transfer : transferencias) {
                if (transfer.InboundTransferRequest.DocEntry.equals(docEntry)) {
                    for (ArrTransferenciaEntradaLine line : transfer.Lines) {
                        Map<String, Object> lineaMap = new HashMap<>();
                        lineaMap.put("LineNum", line.LineNum);
                        lineaMap.put("ItemCode", line.ItemCode);
                        lineaMap.put("Barcode", line.Barcode);
                        lineaMap.put("Quantity", line.Quantity);
                        lineas.add(lineaMap);
                    }
                    break;
                }
            }

            return mapper.writeValueAsString(lineas);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerLineasTransferencia:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String NuevaTransferenciaEntrada(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // 1. POST a ORDS (BD Local)
            String service = props.getValueProp("Host")
                    + props.getValueProp("ServiceTransferenciaEntrada");

            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);

            // 2. Parsear respuesta de ORDS
            Map<String, Object> respuesta = mapper.readValue(JSONVal, Map.class);

            // 3. Construir ConfirmData (solo los insertados exitosamente)
            List<Map<String, Object>> results = (List<Map<String, Object>>) respuesta.get("results");
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

            Map<String, Object> confirmDataWrapper = new HashMap<>();
            confirmDataWrapper.put("ConfirmData", confirmDataArray);
            String confirmDataString = mapper.writeValueAsString(confirmDataWrapper);

            // 4. POST al cliente GLOBAL (TransferConfirmDEV)
            String serviceCliente = props.getValueProp("HostGlobalInsert")
                    + props.getValueProp("ServiceTransferConfirmGlobal");

            String respuestaCliente = requetPost.getPostGlobal(serviceCliente, confirmDataString);

            // 5. DOBLE DESERIALIZACIÓN
            String jsonLimpio = mapper.readValue(respuestaCliente, String.class);
            List<Map<String, Object>> clienteResponse = mapper.readValue(
                    jsonLimpio,
                    new TypeReference<List<Map<String, Object>>>() {
            }
            );

            // 6. Agregar clienteResponse a la respuesta final
            respuesta.put("clienteResponse", clienteResponse);

            JSONVal = mapper.writeValueAsString(respuesta);

        } catch (Exception e) {
            System.out.println("? ERROR en NuevaTransferenciaEntrada:");
            e.printStackTrace();

            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Error al guardar transferencias: " + e.getMessage());
                JSONVal = mapper.writeValueAsString(error);
            } catch (Exception ex) {
                JSONVal = "{\"success\":false,\"message\":\"Error fatal\"}";
            }
        }

        return JSONVal;
    }

    public String BuscarTransferenciasLocal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String estatus = Utilities.obtenParametro(request, "idEstatusTransferencias");
            String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");

            if (limit == null || limit.isEmpty()) {
                limit = "25";
            }
            if (offset == null || offset.isEmpty()) {
                offset = "0";
            }

            String service = props.getValueProp("Host")
                    + props.getValueProp("ServiceTransferenciaEntrada")
                    + "?estatus=" + estatus
                    + "&offset=" + offset
                    + "&limit=" + limit;

            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            CentralTransferenciaEntrada CItems = mapper.readValue(respuesta, CentralTransferenciaEntrada.class);


            return mapper.writeValueAsString(CItems);

        } catch (Exception e) {
            System.out.println("? ERROR en BuscarTransferenciasLocal:");
            e.printStackTrace();
            return "{\"items\":[],\"total\":0,\"count\":0}";
        }
    }

    public String ObtenerLineasLocal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String docEntry = Utilities.obtenParametro(request, "docEntry");

            String service = props.getValueProp("Host")
                    + props.getValueProp("ServiceTransferenciaEntradaDet")
                    + docEntry;

            String respuesta = requetGet.getGetPaginacion(service, request);
            respuesta = normalizeJson(respuesta);

            // ? IGUAL QUE EN ÓRDENES DE COMPRA
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            LineasTransferenciaEntradaResponseWrapper wrapper = mapper.readValue(
                    respuesta,
                    LineasTransferenciaEntradaResponseWrapper.class
            );

            return mapper.writeValueAsString(wrapper);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerLineasLocal:");
            e.printStackTrace();
            return "[]";
        }
    }

    // ========================================
// ? FUNCIÓN 6: Enviar TransferReceiptConfirm
// ========================================
//    public String EnviarTransferReceiptConfirm(HttpServletRequest request, HttpServletResponse response) {
//        String JSONVal = "";
//        String jsonReceipt = Utilities.obtenParametro(request, "valores");
//        RequestPostApi requetPost = new RequestPostApi();
//
//        try {
//            response.setContentType("application/json");
//            response.setCharacterEncoding("UTF-8");
//
//            ObjectMapper mapper = new ObjectMapper();
//            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//
//            System.out.println("========================================");
//            System.out.println("? TransferReceiptConfirm recibido:");
//            System.out.println(jsonReceipt);
//            System.out.println("========================================");
//
//            // 1. Enviar al API del cliente GLOBAL
//            String serviceCliente = props.getValueProp("HostGlobalInsert")
//                    + props.getValueProp("ServiceTransferReceiptConfirmGlobal");
//
//            System.out.println("? Enviando TransferReceiptConfirm a: " + serviceCliente);
//
//            String respuestaCliente = requetPost.getPostGlobal(serviceCliente, jsonReceipt);
//
//            System.out.println("========================================");
//            System.out.println("? Respuesta del cliente:");
//            System.out.println(respuestaCliente);
//            System.out.println("========================================");
//
//            // 2. DOBLE DESERIALIZACIÓN
//            String jsonLimpio = mapper.readValue(respuestaCliente, String.class);
//            List<Map<String, Object>> clienteResponseList = mapper.readValue(
//                    jsonLimpio,
//                    new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {
//            }
//            );
//
//            Map<String, Object> clienteResponse = clienteResponseList.get(0);
//
//            System.out.println("? Respuesta parseada:");
//            System.out.println("  ? IdRow: " + clienteResponse.get("IdRow"));
//            System.out.println("  ? TransactionNumber: " + clienteResponse.get("TransactionNumber"));
//            System.out.println("  ? DocNum: " + clienteResponse.get("DocNum"));
//            System.out.println("  ? SystemDate: " + clienteResponse.get("SystemDate"));
//
//            // 3. ? CONSTRUIR JSON PARA GUARDAR EN UG_CONFIRMATION_LOG
//            Map<String, Object> confirmationLog = new HashMap<>();
//            confirmationLog.put("CLOPROCESS", "TE_TransferReceiptConfirmDEV");
//            confirmationLog.put("CLOSTATUS", 200);
//            confirmationLog.put("CLOMENSSAGE", "OK");
//            confirmationLog.put("CLOSYSTEMDATE", clienteResponse.get("SystemDate"));
//            confirmationLog.put("CLOTRANSACTIONNUMBER", clienteResponse.get("TransactionNumber"));
//            confirmationLog.put("CLODOCDATE", clienteResponse.get("DocDate"));
//            confirmationLog.put("CLODOCNUM", clienteResponse.get("DocNum"));
//
//            String confirmationJson = mapper.writeValueAsString(confirmationLog);
//
//            // 4. ? GUARDAR EN TU API LOCAL
//            try {
//                String serviceLog = "https://seyl.mx/apps/globale/uniongroup/confirmationlog/";
//                String resultadoLog = requetPost.getPost(serviceLog, confirmationJson, request);
//
//                Map<String, Object> logResponse = mapper.readValue(resultadoLog, Map.class);
//                if (logResponse.get("success") != null && (Boolean) logResponse.get("success")) {
//                    System.out.println("? Log guardado exitosamente con CLOID: " + logResponse.get("CLOID"));
//                } else {
//                    System.out.println("?? Advertencia al guardar log: " + logResponse.get("message"));
//                }
//
//            } catch (Exception logEx) {
//                System.out.println("? Error al guardar en Confirmation Log (no crítico):");
//                logEx.printStackTrace();
//            }
//
//            // 5. Construir respuesta
//            Map<String, Object> resultado = new HashMap<>();
//            resultado.put("success", true);
//            resultado.put("message", "Confirmación de recepción enviada exitosamente");
//            resultado.put("clienteResponse", clienteResponse);
//
//            JSONVal = mapper.writeValueAsString(resultado);
//
//            System.out.println("========================================");
//            System.out.println("? Respuesta final al frontend:");
//            System.out.println(JSONVal);
//            System.out.println("========================================");
//
//        } catch (Exception e) {
//            System.out.println("? Error en EnviarTransferReceiptConfirm:");
//            e.printStackTrace();
//
//            try {
//                ObjectMapper mapper = new ObjectMapper();
//                Map<String, Object> error = new HashMap<>();
//                error.put("success", false);
//                error.put("message", "Error al procesar TransferReceiptConfirm: " + e.getMessage());
//                JSONVal = mapper.writeValueAsString(error);
//            } catch (Exception ex) {
//                JSONVal = "{\"success\":false,\"message\":\"Error fatal\"}";
//            }
//        }
//
//        return JSONVal;
//    }
    // ========================================
// ? FUNCIÓN 6: Enviar TransferReceiptConfirm
// ========================================
    public String EnviarTransferReceiptConfirm(HttpServletRequest request, HttpServletResponse response) {
        String jsonTransferReceipt = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            String serviceCliente = props.getValueProp("HostGlobalInsert")
                    + props.getValueProp("ServiceTransferReceiptConfirmGlobal");

            String respuestaCliente = requetPost.getPostGlobal(serviceCliente, jsonTransferReceipt);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Verificar si la respuesta está vacía
            if (respuestaCliente == null || respuestaCliente.trim().isEmpty() || respuestaCliente.equals("\"\"")) {

                // Extraer datos del JSON enviado para crear respuesta simulada
                Map<String, Object> datosEnviados = mapper.readValue(jsonTransferReceipt, Map.class);
                Map<String, Object> transferReceipt = (Map<String, Object>) datosEnviados.get("TransferReceiptConfirm");

                Map<String, Object> respuestaSimulada = new HashMap<>();
                respuestaSimulada.put("success", true);
                respuestaSimulada.put("message", "Confirmación de recepción enviada (respuesta vacía del cliente)");
                respuestaSimulada.put("DocNum", transferReceipt.get("DocNum"));
                respuestaSimulada.put("NumAtCard", transferReceipt.get("NumAtCard"));
                respuestaSimulada.put("Status", transferReceipt.get("Status"));

                // Guardar en log de confirmación
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                String fechaActual = sdf.format(new Date());

                String serviceLog = props.getValueProp("Host")
                        + props.getValueProp("ServiceConfirmationLog");

                Map<String, Object> logData = new HashMap<>();
                logData.put("process", "TE_TransferReceiptConfirmDEV");
                logData.put("request", jsonTransferReceipt);
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

            Map<String, Object> clienteResponse = mapper.readValue(
                    jsonLimpio,
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
            }
            );

            // Guardar en log
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            String fechaActual = sdf.format(new Date());

            String serviceLog = props.getValueProp("Host")
                    + props.getValueProp("ServiceConfirmationLog");

            Map<String, Object> logData = new HashMap<>();
            logData.put("process", "TE_TransferReceiptConfirmDEV");
            logData.put("request", jsonTransferReceipt);
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
            System.out.println("? Error en EnviarTransferReceiptConfirm:");
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
