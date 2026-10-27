/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.ArrTransferenciaEntradaLine;
import com.entity.global.CentralTransferenciaEntrada;
import com.entity.global.CentralTransferenciaEntradaGlobal;
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
                case "7":  // ? NUEVO
                    out.print(EliminarOrdenEntrada(request, response));
                    break;
                case "8":  // ? NUEVO
                    out.print(ConfirmarTransferenciaEntrada(request, response));
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

            String serviceTransferencias = props.getValueProp("HostGlobalDev")
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
            String serviceTransferencias = props.getValueProp("HostGlobalDev")
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
        response.setCharacterEncoding("UTF-8");
        String JSONVal;
        try {
            String estatus = Utilities.obtenParametro(request, "idEstatusTransferencias");
            String idCmbFechaInbound = Utilities.obtenParametro(request, "idCmbFechaInbound");
            String idCmbDiasInbound = Utilities.obtenParametro(request, "idCmbDiasInbound");

            String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");

            String service = props.getValueProp("Host") + props.getValueProp("ServiceTransferenciaEntrada")
                    + "?estatus=" + estatus
                    + "&fechafin=" + idCmbFechaInbound
                    + "&diasatras=" + idCmbDiasInbound
                    + "&offset=" + offset
                    + "&limit=" + limit;

            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            CentralTransferenciaEntrada centralTransferenciaEntrada = mapper.readValue(respuesta, CentralTransferenciaEntrada.class);
            JSONVal = mapper.writeValueAsString(centralTransferenciaEntrada);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "{\"error\": \"Ocurrió un error al procesar la solicitud.\"}";
        }
        return JSONVal;
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
    
   public String EnviarTransferReceiptConfirm(HttpServletRequest request, HttpServletResponse response) {
    String JSONVal = "";
    String jsonTransferReceipt = Utilities.obtenParametro(request, "valores");
    String teid = Utilities.obtenParametro(request, "teid");
    String esCompleta = Utilities.obtenParametro(request, "esCompleta"); // "S" o "N"

    RequestPostApi requetPost = new RequestPostApi();

    try {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // 1. Extraer los datos enviados para armar el acuse si no devuelven body
        Map<String, Object> datosEnviados = mapper.readValue(jsonTransferReceipt, Map.class);
        Map<String, Object> transferReceipt = (Map<String, Object>) datosEnviados.get("TransferReceiptConfirm");

        // 2. Enviar confirmación a Vector Delta
        String serviceCliente = props.getValueProp("HostGlobalInsert")
                + props.getValueProp("ServiceTransferReceiptConfirmGlobal");

        String respuestaCliente = requetPost.getPostGlobal(serviceCliente, jsonTransferReceipt);

        // 3. Manejo condicional de la respuesta
        Map<String, Object> clienteResponse = new HashMap<>();

        if (respuestaCliente == null || respuestaCliente.trim().isEmpty() || respuestaCliente.trim().equals("\"\"")) {
            // =========================================================================
            // CASO A: Vector Delta respondió 200 OK pero dejó el cuerpo vacío
            // =========================================================================
            clienteResponse.put("DocNum", transferReceipt.get("DocNum"));
            clienteResponse.put("TransactionNumber", transferReceipt.get("TransactionNumber"));
            clienteResponse.put("DocDate", transferReceipt.get("DocDate"));
            clienteResponse.put("SystemDate", transferReceipt.get("DocDate"));

            Map<String, Object> statusInfo = new HashMap<>();
            statusInfo.put("Status", 200);
            statusInfo.put("Mensaje", "200 OK: Enviado correctamente, Vector Delta no devolvió respuesta");
            clienteResponse.put("StatusInfo", statusInfo);

        } else {
            // =========================================================================
            // CASO B: Vector Delta sí devolvió contenido (se extrae su mensaje real)
            // =========================================================================
            try {
                String jsonLimpio = mapper.readValue(respuestaCliente, String.class);
                clienteResponse = mapper.readValue(jsonLimpio, Map.class);
            } catch (Exception ex) {
                // Si devuelven el GUID o texto plano según la documentación de SAP B1
                clienteResponse.put("DocNum", transferReceipt.get("DocNum"));
                clienteResponse.put("TransactionNumber", transferReceipt.get("TransactionNumber"));
                clienteResponse.put("DocDate", transferReceipt.get("DocDate"));
                clienteResponse.put("SystemDate", transferReceipt.get("DocDate"));

                Map<String, Object> statusInfo = new HashMap<>();
                statusInfo.put("Status", 200);
                statusInfo.put("Mensaje", respuestaCliente.trim());
                clienteResponse.put("StatusInfo", statusInfo);
            }
        }

        // 4. Bitácora de confirmación en UG_CONFIRMATION_LOG
        Map<String, Object> confirmationLog = new HashMap<>();
        confirmationLog.put("CLOPROCESS", "TE_TransferReceiptConfirmDEV");

        if (clienteResponse.get("StatusInfo") != null) {
            Map<String, Object> statusInfo = (Map<String, Object>) clienteResponse.get("StatusInfo");
            confirmationLog.put("CLOSTATUS", statusInfo.get("Status"));
            confirmationLog.put("CLOMENSSAGE", statusInfo.get("Mensaje"));
        } else {
            confirmationLog.put("CLOSTATUS", 200);
            confirmationLog.put("CLOMENSSAGE", "OK");
        }

        confirmationLog.put("CLOSYSTEMDATE", clienteResponse.get("SystemDate"));
        confirmationLog.put("CLOTRANSACTIONNUMBER", clienteResponse.get("TransactionNumber"));
        confirmationLog.put("CLODOCDATE", clienteResponse.get("DocDate"));
        confirmationLog.put("CLODOCNUM", clienteResponse.get("DocNum"));

        String confirmationJson = mapper.writeValueAsString(confirmationLog);

        try {
            String serviceLog = props.getValueProp("Host") + props.getValueProp("ServiceConfirmationLog");
            requetPost.getPost(serviceLog, confirmationJson, request);
        } catch (Exception logEx) {
            System.out.println("Error al guardar log de confirmación (no crítico): " + logEx.getMessage());
        }

        // 5. Asentar cantidades en BD local (CONFIRMEDQUANTITY, CONFIRMCOUNT y estatus)
        if (teid != null && !teid.isEmpty()) {
            try {
                Map<String, Object> payloadConfirm = new HashMap<>();
                payloadConfirm.put("TEID", Integer.parseInt(teid));
                payloadConfirm.put("esCompleta", esCompleta);

                String jsonConfirm = mapper.writeValueAsString(payloadConfirm);

                String serviceConfirmLocal = props.getValueProp("Host")
                        + props.getValueProp("ServiceTransferenciaEntradaConfirm");

                String resLocal = requetPost.setPut(serviceConfirmLocal, jsonConfirm, request);
                System.out.println("Confirmación local ejecutada: " + resLocal);

            } catch (Exception exLocal) {
                System.out.println("Error al actualizar remanente en BD local:");
                exLocal.printStackTrace();
            }
        }

        // 6. Respuesta hacia ExtJS
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("success", true);
        resultado.put("message", "Confirmación de recepción procesada exitosamente");
        resultado.put("clienteResponse", clienteResponse);

        JSONVal = mapper.writeValueAsString(resultado);

    } catch (Exception e) {
        System.out.println("Error en EnviarTransferReceiptConfirm:");
        e.printStackTrace();

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al procesar transferencia: " + e.getMessage());
            JSONVal = mapper.writeValueAsString(error);
        } catch (Exception ex) {
            JSONVal = "{\"success\":false,\"message\":\"Error fatal\"}";
        }
    }

    return JSONVal;
}

    public String EliminarOrdenEntrada(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";

        String jsonTipoProduct = Utilities.obtenParametro(request, "centralEntrada");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceTransferenciaEntrada");
            JSONVal = requetPost.setPut(service, jsonTipoProduct, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

    public String ConfirmarTransferenciaEntrada(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonTransferencia = Utilities.obtenParametro(request, "centralTransferenciaEntrada");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceTransferenciaEntradaConfirm");
            JSONVal = requetPost.setPut(service, jsonTransferencia, request);
        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
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
