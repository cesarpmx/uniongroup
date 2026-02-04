/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.CentralConsignatario;
import com.fasterxml.jackson.databind.DeserializationFeature;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author ray_w
 */
@WebServlet(name = "CtrlConsignatarios", urlPatterns = {"/Consignatarios"})
public class CtrlConsignatarios extends HttpServlet {

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
                    out.print(ObtenerConsignatarios(request, response));
                    break;
                case "2":
                    out.print(NuevoConsignatario(request, response));
                    break;
                case "3":
                    out.print(ConfirmarConsignatariosGlobal(request, response));
                    break;    
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerConsignatarios(HttpServletRequest request, HttpServletResponse response) {
    try {
        // 1. Obtener parámetros de paginación de ExtJS
        // ExtJS envía 'page' (1, 2, 3...) y 'limit' (registros por página)
        String page = Utilities.obtenParametro(request, "page");
        String limit = Utilities.obtenParametro(request, "limit");
        
        if (page == null) page = "1";
        if (limit == null) limit = "5";

        // 2. Construir la URL dinámica con los parámetros de la página
        // Asumiendo que ServiceAdressGlobal termina en .../AddressGLOBAL/
        String serviceConsignatarios = props.getValueProp("HostGlobal")
                + props.getValueProp("ServiceAdressGlobal") 
                + "PageNum/" + page + "/Records/" + limit;

        String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
        respuestaItems = normalizeJson(respuestaItems);

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // 3. Mapear el objeto completo
        CentralConsignatario CItems = mapper.readValue(respuestaItems, CentralConsignatario.class);

        // 4. RETORNAR EL OBJETO COMPLETO, NO SOLO DATA
        // Esto devolverá {"Meta": {...}, "Data": [...]}
        return mapper.writeValueAsString(CItems);

    } catch (Exception e) {
        e.printStackTrace();
        return "{\"Data\": [], \"Meta\": {\"TotalRecords\": 0}}";
    }
}
    
    
   public String ConfirmarConsignatariosGlobal(HttpServletRequest request, HttpServletResponse response) {

    String JSONVal = "";
    String jsonReceipt = Utilities.obtenParametro(request, "confirmData");
    RequestPostApi requetPost = new RequestPostApi();

    // ? Variable para retornar al frontend
    String resultadoLog = null;

    try {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        /* =========================================================
           1. VALIDAR JSON DE ENTRADA
        ========================================================= */
        Map<String, Object> requestData =
                mapper.readValue(jsonReceipt, Map.class);

        if (!requestData.containsKey("ConfirmData")) {
            throw new Exception("El JSON no contiene el nodo ConfirmData");
        }

        /* =========================================================
           2. ENVIAR A GLOBAL (TAL CUAL)
        ========================================================= */
        String serviceCliente = props.getValueProp("HostGlobalInsert")
                + props.getValueProp("ServiceConsignatariosGlobalConfirm");

        String respuestaCliente =
                requetPost.getPostGlobal(serviceCliente, jsonReceipt);

        /* =========================================================
           3. LIMPIAR Y PARSEAR RESPUESTA DE GLOBAL (ARRAY)
        ========================================================= */
        String jsonLimpio =
                mapper.readValue(respuestaCliente, String.class);

        List<Map<String, Object>> globalResponse =
                mapper.readValue(jsonLimpio, List.class);

        /* =========================================================
           4. CONSTRUIR ARREGLO DE LOGS PARA UG_CONFIRMATION_LOG
        ========================================================= */
        List<Map<String, Object>> logs = new ArrayList<>();

        for (Map<String, Object> item : globalResponse) {

            Map<String, Object> log = new HashMap<>();

            log.put("CLOPROCESS", "items");
            log.put("CLOSTATUS", item.get("Status"));
            log.put("CLOMENSSAGE", "Producto confirmado correctamente");
            log.put("CLOSYSTEMDATE", item.get("SystemDate"));
            log.put("CLOTRANSACTIONNUMBER", item.get("Folio"));
            log.put("CLODOCDATE", item.get("SystemDate"));
            log.put("CLODOCNUM", item.get("DocEntry"));

            logs.add(log);
        }

        Map<String, Object> confirmationLogRequest = new HashMap<>();
        confirmationLogRequest.put("logs", logs);

        String confirmationLogJson =
                mapper.writeValueAsString(confirmationLogRequest);

        /* =========================================================
           5. GUARDAR LOG MASIVO (NO CRÍTICO)
        ========================================================= */
        try {
            String serviceLog =
                    "https://seyl.mx/apps/globale/uniongroup/confirmationlog/";

            // ? aquí se asigna a la variable externa
            resultadoLog =
                    requetPost.getPost(serviceLog, confirmationLogJson, request);

            Map<String, Object> logResponse =
                    mapper.readValue(resultadoLog, Map.class);

            if (logResponse.get("success") != null
                    && (Boolean) logResponse.get("success")) {
                System.out.println("? Logs guardados correctamente");
            } else {
                System.out.println("? Advertencia al guardar logs: "
                        + logResponse.get("message"));
            }

        } catch (Exception logEx) {
            System.out.println("? Error al guardar Confirmation Log (no crítico)");
            logEx.printStackTrace();
        }

        /* =========================================================
           6. RESPUESTA AL FRONTEND
        ========================================================= */
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("success", true);
        resultado.put("message", "Confirmación de recepción enviada exitosamente");

        // ? retornar resultadoLog en lugar de globalResponse
        if (resultadoLog != null) {
            resultado.put("logResult",
                    mapper.readValue(resultadoLog, Map.class));
        } else {
            resultado.put("logResult", null);
        }

        JSONVal = mapper.writeValueAsString(resultado);

    } catch (Exception e) {
        System.out.println("? Error en EnviarReceiptConfirmMasivo");
        e.printStackTrace();

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            JSONVal = mapper.writeValueAsString(error);
        } catch (Exception ex) {
            JSONVal = "{\"success\":false,\"message\":\"Error fatal\"}";
        }
    }

    return JSONVal;
}
    
    
    public String NuevoConsignatario(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceAddAdressGlobal");
            JSONVal = requetPost.getPostNuevo(service, jsonLineaNegocio, request);

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
