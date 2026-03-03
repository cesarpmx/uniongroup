/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.ArrOrdenesCompraLine;
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
import jakarta.servlet.http.HttpSession;
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
                case "6":  // ? NUEVO CASO
                    out.print(EnviarReceiptConfirm(request, response));
                    break;
                case "7":  // ? NUEVO CASO
                    out.print(EliminarOrdenCompra(request, response));
                    break;
                 case "8":  // ? NUEVO CASO
                    out.print(ConfirmarOrdenCompra(request, response));
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

            String serviceConsignatarios = props.getValueProp("HostGlobalDev")
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

            String serviceConsignatarios = props.getValueProp("HostGlobalDev")
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

                    try {
                        String serviceCliente = props.getValueProp("HostGlobalInsert")
                                + props.getValueProp("ServicePurchaseOrderPostGlobal");

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
                    System.out.println("?? No hay órdenes exitosas para confirmar al cliente");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
                JSONVal = "{\"success\":false, \"message\":\"Error en servlet: " + e.getMessage().replace("\"", "") + "\"}";
            JSONVal = "";
        }
        return JSONVal;
    }
    
    public String ObtenerOrdenesCompra(HttpServletRequest request, HttpServletResponse response) {
        response.setCharacterEncoding("UTF-8");
        String JSONVal;
        try {
            String idEstatusCompras = Utilities.obtenParametro(request, "idEstatusCompras");
            String idCmbFechaCompras = Utilities.obtenParametro(request, "idCmbFechaCompras");
            String idCmbDiasCompras = Utilities.obtenParametro(request, "idCmbDiasCompras");
             
           String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");

            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenCompra")
                    + "?estatus=" + idEstatusCompras
                    + "&fechafin=" + idCmbFechaCompras
                    + "&diasatras=" + idCmbDiasCompras
                    + "&offset=" + offset
                    + "&limit=" + limit;

            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);      // ? Ignora campos desconocidos (links, etc)
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);        // ? Ignora mayúsculas/minúsculas

            CentralOrdenCompra centralOrdenCompra = mapper.readValue(respuesta, CentralOrdenCompra.class);
            JSONVal = mapper.writeValueAsString(centralOrdenCompra);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "{\"error\": \"Ocurrió un error al procesar la solicitud.\"}";
        }
        return JSONVal;
    }

    public String ObtenerPODetLocal(HttpServletRequest request, HttpServletResponse response) {
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
                    + props.getValueProp("ServiceOrdenCompraDet")
                    + docEntry + "&offset=" + offset + "&limit=" + limit;

            // ? IGUAL QUE TU EJEMPLO: usar getGetPaginacion
            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            // ? IGUAL QUE TU EJEMPLO: deserializar directamente
            LineasOrdenCompraResponseWrapper wrapper = mapper.readValue(respuesta, LineasOrdenCompraResponseWrapper.class);

            // ? IGUAL QUE TU EJEMPLO: devolver todo el objeto
            return mapper.writeValueAsString(wrapper);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerPODetLocal:");
            e.printStackTrace();
            return "{\"items\":[],\"total\":0,\"count\":0}";
        }
    }

    public String EnviarReceiptConfirm(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonReceipt = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // 1. Parsear el JSON recibido
            Map<String, Object> receiptData = mapper.readValue(jsonReceipt, Map.class);

            // 2. Enviar al API del cliente GLOBAL
            String serviceCliente = props.getValueProp("HostGlobalInsert")
                    + props.getValueProp("ServiceReceiptConfirmGlobal");

            String respuestaCliente = requetPost.getPostGlobal(serviceCliente, jsonReceipt);

            // 3. DOBLE DESERIALIZACIÓN
            String jsonLimpio = mapper.readValue(respuestaCliente, String.class);
            Map<String, Object> clienteResponse = mapper.readValue(jsonLimpio, Map.class);

            // 4. ? CONSTRUIR JSON PARA GUARDAR EN UG_CONFIRMATION_LOG
            Map<String, Object> confirmationLog = new HashMap<>();
            confirmationLog.put("CLOPROCESS", "OC_ReceiptConfirmDEV");

            // Extraer Status y Mensaje del StatusInfo
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

            // 5. ? GUARDAR EN TU API LOCAL
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
            resultado.put("message", "Confirmación de recepción enviada exitosamente");
            resultado.put("clienteResponse", clienteResponse);

            JSONVal = mapper.writeValueAsString(resultado);

        } catch (Exception e) {
            System.out.println("? Error en EnviarReceiptConfirm:");
            e.printStackTrace();

            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Error al procesar ReceiptConfirm: " + e.getMessage());
                JSONVal = mapper.writeValueAsString(error);
            } catch (Exception ex) {
                JSONVal = "{\"success\":false,\"message\":\"Error fatal\"}";
            }
        }

        return JSONVal;
    }

    public String EliminarOrdenCompra(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";

        String jsonTipoProduct = Utilities.obtenParametro(request, "centralCompra");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenCompra");
            JSONVal = requetPost.setPut(service, jsonTipoProduct, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }
   
    public String ConfirmarOrdenCompra(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";

        String jsonTipoProduct = Utilities.obtenParametro(request, "centralCompra");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenCompraConfirm");
            JSONVal = requetPost.setPut(service, jsonTipoProduct, request);

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
