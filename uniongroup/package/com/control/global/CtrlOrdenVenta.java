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
import java.util.ArrayList;
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
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerOrdenesVenta(HttpServletRequest request, HttpServletResponse response) {
        String idEstatusVenta;
        idEstatusVenta = Utilities.obtenParametro(request, "idEstatusVenta");

        try {

            idEstatusVenta = Utilities.obtenParametro(request, "idEstatusVenta");

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String serviceConsignatarios = props.getValueProp("Host")
                    + props.getValueProp("ServiceOrdenVenta") + "?estatus=" + idEstatusVenta;

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);
            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true); // ? AGREGAR ESTO

            CentralOrdenVenta CItems = mapper.readValue(respuestaItems, CentralOrdenVenta.class);
            String jsonResult = mapper.writeValueAsString(CItems.items);
            System.out.println(jsonResult);
            return jsonResult;
        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerOrdenesCompra:");
            e.printStackTrace();
            return "[]";
        }
    }

    public String ObtenerPSDetLocal(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String docEntry = Utilities.obtenParametro(request, "docEntry");
            String service = props.getValueProp("Host")
                    + props.getValueProp("ServiceOrdenVentaDet")
                    + docEntry;

            String respuesta = requetGet.getGetGlobal(service);
            respuesta = normalizeJson(respuesta);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            // ? Reutilizar la clase wrapper de ORDS
            LineasOrdenVentaResponseWrapper wrapper = mapper.readValue(respuesta, LineasOrdenVentaResponseWrapper.class);

            return mapper.writeValueAsString(wrapper.items);
        } catch (Exception e) {
            e.printStackTrace();
            return "[]";
        }
    }

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
                item.put("TotalLines", orden.ControlValues.TotalLines);
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
    
    public String NuevoOrdenVenta(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenVenta");
            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);

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
