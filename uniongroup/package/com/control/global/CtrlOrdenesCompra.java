/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.CentralOrdenesCompra;
import com.entity.LineasOrdenResponseWrapper;
import com.entity.OrdenesCompraResponse;
import com.entity.PurchaseOrder;
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
import jakarta.servlet.http.HttpSession;
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
                    out.print(ObtenerOrdenesCompra(request, response));
                    break;
                case "2": // ? Nueva bandera para obtener líneas de una orden específica
                    out.print(ObtenerLineasOrden(request, response));
                    break;
                case "3": // ? Nueva bandera para obtener líneas de una orden específica
                    out.print(NuevoOrdenCompra(request, response));
                    break;
                case "4": // ? Nueva bandera para obtener líneas de una orden específica
                    out.print(ObtenerPOLocal(request, response));
                    break;
                 case "5": // ? Nueva bandera para obtener líneas de una orden específica
                    out.print(ObtenerPODetLocal(request, response));
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerOrdenesCompra(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String serviceConsignatarios = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServicePurchaseOrderGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);

            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // ? Mapear el array completo de órdenes
            CentralOrdenesCompra[] ordenes = mapper.readValue(respuestaItems, CentralOrdenesCompra[].class);

            // ? Crear un array con la info combinada de PurchaseOrder + ControlValues
            List<Map<String, Object>> resultado = new ArrayList<>();

            for (CentralOrdenesCompra orden : ordenes) {
                Map<String, Object> item = new HashMap<>();

                // Datos de PurchaseOrder
                item.put("DocEntry", orden.PurchaseOrder.DocEntry);
                item.put("DocNum", orden.PurchaseOrder.DocNum);
                item.put("NumAtCard", orden.PurchaseOrder.NumAtCard);
                item.put("DocDate", orden.PurchaseOrder.DocDate);
                item.put("CardCode", orden.PurchaseOrder.CardCode);
                item.put("Memo", orden.PurchaseOrder.Memo);

                // Datos de ControlValues
                item.put("OrderTotal", orden.ControlValues.OrderTotal);
                item.put("TotalLines", orden.ControlValues.TotalLines);

                resultado.add(item);
            }

            return mapper.writeValueAsString(resultado);

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerOrdenesCompra:");
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

            CentralOrdenesCompra[] ordenes = mapper.readValue(respuestaItems, CentralOrdenesCompra[].class);

            for (CentralOrdenesCompra orden : ordenes) {
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
            String service = props.getValueProp("Host") + props.getValueProp("ServiceOrdenCompra");
            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

    public String ObtenerPOLocal(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal;
        String rutaServicio = Utilities.obtenParametro(request, "servicio");
        try {
            String service = props.getValueProp("Host") + props.getValueProp(rutaServicio);
            String respuesta = requetGet.getGet(service);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            OrdenesCompraResponse wrapper = mapper.readValue(respuesta, OrdenesCompraResponse.class);

            JSONVal = mapper.writeValueAsString(wrapper.items);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "[]";
        }
        return JSONVal;
    }

    public String ObtenerPODetLocal(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal;
        String rutaServicio = Utilities.obtenParametro(request, "servicio");
        String docEntry = Utilities.obtenParametro(request, "docEntry"); // ? AGREGAR ESTO

        try {
            String service = props.getValueProp("Host") + props.getValueProp(rutaServicio) + docEntry;
            String respuesta = requetGet.getGet(service);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            LineasOrdenResponseWrapper wrapper = mapper.readValue(respuesta, LineasOrdenResponseWrapper.class);

            JSONVal = mapper.writeValueAsString(wrapper.items);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "[]";
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
