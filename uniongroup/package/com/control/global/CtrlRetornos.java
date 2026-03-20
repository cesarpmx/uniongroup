/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.CentralRetornos;
import com.entity.global.CentralRetornosDet;
import com.entity.global.CentralRetornosGlobal;
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
@WebServlet(name = "CtrlRetornos", urlPatterns = {"/Retornos"})
public class CtrlRetornos extends HttpServlet {

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
                    out.print(NuevoRetorno(request, response));
                    break;
                    
                     case "4":
                    out.print(ObtenerRetornos(request, response));
                    break;
                    
                    case "5":
                    out.print(ObtenerRetornosDet(request, response));
                    break;
                    case "6":
                    out.print(EnviarReturnConfirm(request, response));
                    break;
                    case "7":
                    out.print(CancelarRetorno(request, response));
                    break;
                     case "8":
                    out.print(ConfirmarRetorno(request, response));
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
                    + props.getValueProp("ServiceRetornosGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // ? Usar OrdenCompraExterna[] para el API externo
            CentralRetornosGlobal[] ordenes = mapper.readValue(respuestaItems, CentralRetornosGlobal[].class);

            // Aplanar la estructura
            List<Map<String, Object>> resultado = new ArrayList<>();
            for (CentralRetornosGlobal orden : ordenes) {
                Map<String, Object> item = new HashMap<>();
                item.put("DocEntry", orden.ReturnRequest.DocEntry);
                item.put("DocNum", orden.ReturnRequest.DocNum);
                item.put("DocDate", orden.ReturnRequest.DocDate);
                item.put("CardCode", orden.ReturnRequest.CardCode);
                item.put("Memo", orden.ReturnRequest.Memo);
                item.put("Warehouse", orden.ReturnRequest.Warehouse);
                item.put("Status", orden.ReturnRequest.Status);
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
                    + props.getValueProp("ServiceRetornosGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CentralRetornosGlobal[] ordenes = mapper.readValue(respuestaItems, CentralRetornosGlobal[].class);

            for (CentralRetornosGlobal orden : ordenes) {
                if (orden.ReturnRequest.DocEntry.equals(docEntry)) {
                    String jsonResult = mapper.writeValueAsString(orden.Lines);
                    System.out.println("? Se encontraron " + orden.Lines.size() + " l?neas para DocEntry: " + docEntry);
                    return jsonResult;
                }
            }

            System.out.println("?? No se encontr? orden con DocEntry: " + docEntry);
            return "[]";

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerLineasOrden:");
            e.printStackTrace();
            return "[]";
        }
    }
    
    public String NuevoRetorno(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            // 1. POST a nuestro backend (ORDS)
            String service = props.getValueProp("Host") + props.getValueProp("ServiceRetornos");
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

                // Solo enviar al cliente si hay ?rdenes exitosas
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
                                + props.getValueProp("ServiceRetornosPostGlobal");

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
                    System.out.println("?? No hay ?rdenes exitosas para confirmar al cliente");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }
    
    public String ObtenerRetornos(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal, idEmpresa;
        HttpSession session = request.getSession(true);
        String estatus = Utilities.obtenParametro(request, "estatus");
        
        String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");
            
            String dias = Utilities.obtenParametro(request, "dias");
            String fecha = Utilities.obtenParametro(request, "fecha");
        try {
            // idEmpresa = Utilities.obtenParametro(request, "idEmpresa");
            String service = props.getValueProp("Host") + props.getValueProp("ServiceRetornos")+ "?estatus="+ estatus + "&diasatras=" +dias + "&fechafin=" + fecha + "&offset=" + offset + "&limit=" + limit;;
            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            // ? IGUAL QUE TU EJEMPLO: deserializar directamente
            CentralRetornos wrapper = mapper.readValue(respuesta, CentralRetornos.class);

            // ? IGUAL QUE TU EJEMPLO: devolver todo el objeto
            return mapper.writeValueAsString(wrapper);
            
            
        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }
    
    public String ObtenerRetornosDet(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal, idEmpresa;
        HttpSession session = request.getSession(true);
        String clave = Utilities.obtenParametro(request, "clave");
        try {
            // idEmpresa = Utilities.obtenParametro(request, "idEmpresa");
            String service = props.getValueProp("Host") + props.getValueProp("ServiceRetornosDet") + "?clave=" + clave;
            String repuesta = requetGet.getGet(service);
            CentralRetornosDet CRetornoDet = new ObjectMapper().readValue(repuesta, CentralRetornosDet.class);
            JSONVal = new ObjectMapper().writeValueAsString(CRetornoDet.items);
        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }
    
    
    public String EnviarReturnConfirm(HttpServletRequest request, HttpServletResponse response) {
    String JSONVal = "";
    String jsonReceipt = Utilities.obtenParametro(request, "valores");
    RequestPostApi requetPost = new RequestPostApi();
    
    // El ObjectMapper se define una sola vez fuera del try para mayor eficiencia
    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    try {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 1. Parsear el JSON recibido del frontend
        Map<String, Object> receiptData = mapper.readValue(jsonReceipt, Map.class);

        // 2. Enviar al API del cliente GLOBAL
        String serviceCliente = props.getValueProp("HostGlobalInsert")
                + props.getValueProp("ServiceReturnConfirm");

        String respuestaCliente = requetPost.getPostGlobal(serviceCliente, jsonReceipt);

        // 3. DOBLE DESERIALIZACIÓN (CORRECCIÓN CRÍTICA AQUÍ)
        // El API devuelve un String que contiene un Array JSON: "[{...}]"
        String jsonLimpio = mapper.readValue(respuestaCliente, String.class);
        
        // Cambiamos Map.class por TypeReference<List<Map<String, Object>>> 
        // para poder recibir el formato [ ] que causaba el error.
        List<Map<String, Object>> listaRespuestas = mapper.readValue(jsonLimpio, 
                new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {});

        Map<String, Object> clienteResponse = new HashMap<>();

        // Validamos que la lista tenga contenido antes de extraer el primer objeto
        if (listaRespuestas != null && !listaRespuestas.isEmpty()) {
            clienteResponse = listaRespuestas.get(0);
        } else {
            throw new Exception("La respuesta del API Global está vacía (Array vacío)");
        }

        // 4. CONSTRUIR JSON PARA GUARDAR EN UG_CONFIRMATION_LOG
        Map<String, Object> confirmationLog = new HashMap<>();
        confirmationLog.put("CLOPROCESS", "ReturnConfirmDEV");

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

        // 5. GUARDAR EN TU API LOCAL (LOG)
        try {
            String serviceLog = "https://seyl.mx/apps/globale/uniongroup/confirmationlog/";
            String resultadoLog = requetPost.getPost(serviceLog, confirmationJson, request);

            Map<String, Object> logResponse = mapper.readValue(resultadoLog, Map.class);
            if (logResponse.get("success") != null && (Boolean) logResponse.get("success")) {
                System.out.println("Log guardado exitosamente con CLOID: " + logResponse.get("CLOID"));
            } else {
                System.out.println("Advertencia al guardar log: " + logResponse.get("message"));
            }
        } catch (Exception logEx) {
            System.out.println("Error al guardar en Confirmation Log (no crítico):");
            logEx.printStackTrace();
        }

        // 6. Construir respuesta final para el Frontend
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("success", true);
        resultado.put("message", "Confirmación de recepción enviada exitosamente");
        resultado.put("clienteResponse", clienteResponse);

        JSONVal = mapper.writeValueAsString(resultado);

    } catch (Exception e) {
        System.out.println("Error en EnviarReceiptConfirm:");
        e.printStackTrace();

        try {
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
    
    public String CancelarRetorno(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        String rutaServicio = Utilities.obtenParametro(request, "servicio");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceRetornos");
            JSONVal = requetPost.setPut(service, jsonLineaNegocio, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }
    
    public String ConfirmarRetorno(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        String rutaServicio = Utilities.obtenParametro(request, "servicio");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceRetornosConfirm");
            JSONVal = requetPost.setPut(service, jsonLineaNegocio, request);

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
