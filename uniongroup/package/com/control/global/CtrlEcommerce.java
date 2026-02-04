/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.entity.global.ArrEcommerce;
import com.entity.global.CentralEcommerce;
import com.entity.global.CentralEcommerceDet;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.util.ReadProps;
import com.util.STDRUEAPGenerator;
import com.util.Utilities;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Path;
import java.nio.file.Paths;
/**
 *
 * @author ray_w
 */
@WebServlet(name = "CtrlEcommerce", urlPatterns = {"/Ecommerce"})
public class CtrlEcommerce extends HttpServlet {

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
                    out.print(ObtenerHeaderEcom(request, response));
                    break;

                case "2":
                    out.print(ObtenerEcommerceDet(request, response));
                    break;

                case "3":
                    out.print(GenerarSTDRUEAP(request, response));
                    break;

            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerHeaderEcom(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal, idEmpresa;
        HttpSession session = request.getSession(true);
        String estatus = Utilities.obtenParametro(request, "estatus");
        try {
            // idEmpresa = Utilities.obtenParametro(request, "idEmpresa");
            String service = props.getValueProp("Host") + props.getValueProp("ServiceEcommerce")+ "?estatus="+ estatus;
            String repuesta = requetGet.getGet(service);
            CentralEcommerce tipoIngreso = new ObjectMapper().readValue(repuesta, CentralEcommerce.class);
            JSONVal = new ObjectMapper().writeValueAsString(tipoIngreso.items);
        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }

    public String ObtenerEcommerceDet(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal, idEmpresa;
        HttpSession session = request.getSession(true);
        String clave = Utilities.obtenParametro(request, "clave");
        try {
            // idEmpresa = Utilities.obtenParametro(request, "idEmpresa");
            String service = props.getValueProp("Host") + props.getValueProp("ServiceEcommerceDet") + "?clave=" + clave;
            String repuesta = requetGet.getGet(service);
            CentralEcommerceDet CEcomDet = new ObjectMapper().readValue(repuesta, CentralEcommerceDet.class);
            JSONVal = new ObjectMapper().writeValueAsString(CEcomDet.items);
        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }
    
    
    public String GenerarSTDRUEAP(HttpServletRequest request, HttpServletResponse response) {
    String ecomid = Utilities.obtenParametro(request, "ecomid");

    try {
        ObjectMapper mapper = new ObjectMapper();

        // 1. Obtener header (regresa CentralEcommerce, no ArrEcommerce directo)
        String serviceH = props.getValueProp("Host") + props.getValueProp("ServiceEcommerce") + "?ecomid=" + ecomid;
        String respH = requetGet.getGet(serviceH);

        CentralEcommerce centralHeader = mapper.readValue(respH, CentralEcommerce.class);

        if (centralHeader.items == null || centralHeader.items.isEmpty()) {
            return "{\"ok\":false, \"error\":\"No se encontró header para ecomid " + ecomid + "\"}";
        }

        ArrEcommerce header = centralHeader.items.get(0);

        // 2. Obtener detalle
        String serviceD = props.getValueProp("Host") + props.getValueProp("ServiceEcommerceDet") + "?clave=" + ecomid;
        String respD = requetGet.getGet(serviceD);

        CentralEcommerceDet det = mapper.readValue(respD, CentralEcommerceDet.class);

        if (det.items == null || det.items.isEmpty()) {
            return "{\"ok\":false, \"error\":\"No hay líneas de detalle para ecomid " + ecomid + "\"}";
        }

        // 3. Generar archivo
        String ts = new java.text.SimpleDateFormat("yyMMdd_HHmmss").format(new java.util.Date());
        Path out = Paths.get("C:/ECOM-OUT/STDRUEAP_" + ts + ".txt");

        STDRUEAPGenerator.generate(header, det.items, out);

        return "{\"ok\":true, \"file\":\"" + out.toString().replace("\\", "/") + "\"}";

    } catch (Exception e) {
        e.printStackTrace();
        return "{\"ok\":false, \"error\":\"" + e.getMessage().replace("\"", "'") + "\"}";
    }
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
