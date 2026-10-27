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
                case "7":
                    out.print(EliminarOrdenVenta(request, response));
                    break;
                case "8":
                    out.print(GenerarListaEmpaque(request, response));
                    break;
                case "9":
                    out.print(ObtenerProductoSurtido(request, response));
                    break;
                case "10":
                    out.print(ConfirmarOrdenVenta(request, response));
                    break;
                case "11":
                    out.print(EliminarListaEmpaque(request, response));
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerOrdenesVenta(HttpServletRequest request, HttpServletResponse response) {
        response.setCharacterEncoding("UTF-8");
        String JSONVal;
        try {
            String idEstatusVenta = Utilities.obtenParametro(request, "idEstatusVenta");
            String idCmbFechaVenta = Utilities.obtenParametro(request, "idCmbFechaVenta");
            String idCmbDiasVenta = Utilities.obtenParametro(request, "idCmbDiasVenta");

            String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");

            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenVenta")
                    + "?estatus=" + idEstatusVenta
                    + "&fechafin=" + idCmbFechaVenta
                    + "&diasatras=" + idCmbDiasVenta
                    + "&offset=" + offset
                    + "&limit=" + limit;

            String respuesta = requetGet.getGetPaginacion(service, request);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            CentralOrdenVenta centralOrdenVenta = mapper.readValue(respuesta, CentralOrdenVenta.class);
            JSONVal = mapper.writeValueAsString(centralOrdenVenta);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "{\"error\": \"Ocurrió un error al procesar la solicitud.\"}";
        }
        return JSONVal;
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

    public String ObtenerOrdenesVentaGlobal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String serviceConsignatarios = props.getValueProp("HostGlobalDev")
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
                item.put("Warehouse", orden.SalesOrder.Warehouse);
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

            String serviceConsignatarios = props.getValueProp("HostGlobalDev")
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
        String ovid = Utilities.obtenParametro(request, "ovid");
        String esCompleta = Utilities.obtenParametro(request, "esCompleta");

        RequestPostApi requetPost = new RequestPostApi();
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> datosEnviados = mapper.readValue(jsonShipment, Map.class);
            Map<String, Object> shipmentConfirm = (Map<String, Object>) datosEnviados.get("ShipmentConfirm");

            String serviceCliente = props.getValueProp("HostGlobalInsert").trim()
                    + props.getValueProp("ServiceShipmentConfirmGlobal").trim();
            String respuestaCliente = requetPost.getPostGlobal(serviceCliente, jsonShipment);

            Map<String, Object> clienteResponse = new HashMap<>();

            if (respuestaCliente == null || respuestaCliente.trim().isEmpty() || respuestaCliente.trim().equals("\"\"")) {
                // Respuesta vacía de Vector Delta
                clienteResponse.put("DocNum", shipmentConfirm.get("DocNum"));
                clienteResponse.put("TransactionNumber", shipmentConfirm.get("TransactionNumber"));
                clienteResponse.put("DocDate", shipmentConfirm.get("DocDate"));
                clienteResponse.put("SystemDate", shipmentConfirm.get("DocDate"));

                Map<String, Object> statusInfo = new HashMap<>();
                statusInfo.put("Status", 200);
                statusInfo.put("Mensaje", "200 OK: Enviado correctamente, Vector Delta no devolvió respuesta");
                clienteResponse.put("StatusInfo", statusInfo);
            } else {
                try {
                    String jsonLimpio = mapper.readValue(respuestaCliente, String.class);
                    if (jsonLimpio.trim().startsWith("[")) {
                        List<Map<String, Object>> lista = mapper.readValue(jsonLimpio, new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {
                        });
                        if (!lista.isEmpty()) {
                            clienteResponse = lista.get(0);
                        }
                    } else if (jsonLimpio.trim().startsWith("{")) {
                        clienteResponse = mapper.readValue(jsonLimpio, Map.class);
                    } else {
                        clienteResponse.put("DocNum", shipmentConfirm.get("DocNum"));
                        clienteResponse.put("TransactionNumber", shipmentConfirm.get("TransactionNumber"));
                        clienteResponse.put("DocDate", shipmentConfirm.get("DocDate"));
                        clienteResponse.put("SystemDate", shipmentConfirm.get("DocDate"));

                        Map<String, Object> statusInfo = new HashMap<>();
                        statusInfo.put("Status", 200);
                        statusInfo.put("Mensaje", jsonLimpio.trim());
                        clienteResponse.put("StatusInfo", statusInfo);
                    }
                } catch (Exception ex) {
                    clienteResponse.put("DocNum", shipmentConfirm.get("DocNum"));
                    clienteResponse.put("TransactionNumber", shipmentConfirm.get("TransactionNumber"));
                    clienteResponse.put("DocDate", shipmentConfirm.get("DocDate"));
                    clienteResponse.put("SystemDate", shipmentConfirm.get("DocDate"));

                    Map<String, Object> statusInfo = new HashMap<>();
                    statusInfo.put("Status", 200);
                    statusInfo.put("Mensaje", "OK - Acuse: " + respuestaCliente.trim());
                    clienteResponse.put("StatusInfo", statusInfo);
                }
            }

            // Bitácora UG_CONFIRMATION_LOG
            Map<String, Object> confirmationLog = new HashMap<>();
            confirmationLog.put("CLOPROCESS", "SO_ShipmentConfirmDEV");
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

            try {
                String serviceLog = props.getValueProp("Host").trim() + props.getValueProp("ServiceConfirmationLog").trim();
                requetPost.getPost(serviceLog, mapper.writeValueAsString(confirmationLog), request);
            } catch (Exception logEx) {
            }

            // Asentar localmente
            if (ovid != null && !ovid.isEmpty()) {
                try {
                    Map<String, Object> payloadConfirm = new HashMap<>();
                    payloadConfirm.put("OVID", Integer.parseInt(ovid));
                    payloadConfirm.put("esCompleta", esCompleta);

                    String serviceConfirmLocal = props.getValueProp("Host").trim() + props.getValueProp("ServiceOrdenVentaConfirm").trim();
                    requetPost.setPut(serviceConfirmLocal, mapper.writeValueAsString(payloadConfirm), request);
                } catch (Exception exLocal) {
                }
            }

            Map<String, Object> resultado = new HashMap<>();
            resultado.put("success", true);
            resultado.put("message", "Confirmación de envío procesada exitosamente");
            resultado.put("clienteResponse", clienteResponse);

            JSONVal = mapper.writeValueAsString(resultado);

        } catch (Exception e) {
            try {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Error al procesar ShipmentConfirm: " + e.getMessage());
                JSONVal = mapper.writeValueAsString(error);
            } catch (Exception ex) {
            }
        }
        return JSONVal;
    }

    public String EliminarOrdenVenta(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";

        String jsonTipoProduct = Utilities.obtenParametro(request, "centralVenta");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenVenta");
            JSONVal = requetPost.setPut(service, jsonTipoProduct, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

    public String GenerarListaEmpaque(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";

        String jsonTipoProduct = Utilities.obtenParametro(request, "ordenListaEmpaque");
        RequestPostApi requetPost = new RequestPostApi();

        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenVentaLE");
            JSONVal = requetPost.getPost(service, jsonTipoProduct, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

    public String ObtenerProductoSurtido(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        try {
            String preid = Utilities.obtenParametro(request, "preid");

            String service = props.getValueProp("Host")
                    + "uniongroup/productosurtido/?clave=" + preid;

            JSONVal = requetGet.getGetPaginacion(service, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "{\"items\":[]}";
        }
        return JSONVal;
    }

    public String ConfirmarOrdenVenta(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonOrdenVenta = Utilities.obtenParametro(request, "centralVenta");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenVentaConfirm");
            JSONVal = requetPost.setPut(service, jsonOrdenVenta, request);
        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

    public String EliminarListaEmpaque(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonEliminar = Utilities.obtenParametro(request, "ordenListaEmpaque");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host").trim() + "uniongroup/ordenventaleeliminar/";
            JSONVal = requetPost.getPost(service, jsonEliminar, request);
        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "{\"success\":false,\"message\":\"Error interno en el servidor al intentar eliminar la LE.\"}";
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
