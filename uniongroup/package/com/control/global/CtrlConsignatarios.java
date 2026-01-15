/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
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

            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerConsignatarios(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String serviceConsignatarios = props.getValueProp("HostGlobal")
                    + props.getValueProp("ServiceAdressGlobal");

            String respuestaItems = requetGet.getGetGlobal(serviceConsignatarios);

            respuestaItems = normalizeJson(respuestaItems);

            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            CentralConsignatario CItems = mapper.readValue(respuestaItems, CentralConsignatario.class);

            // ?? IMPORTANTE: Ver si Data tiene elementos
            System.out.println("? CItems.Data es null? " + (CItems.Data == null));
            if (CItems.Data != null) {
                System.out.println("? Total items en Data: " + CItems.Data.size());
            }

            String jsonResult = mapper.writeValueAsString(CItems.Data);

            System.out.println(jsonResult);

            return jsonResult;

        } catch (Exception e) {
            System.out.println("? ERROR en ObtenerItems:");
            e.printStackTrace();
            return "[]";
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
