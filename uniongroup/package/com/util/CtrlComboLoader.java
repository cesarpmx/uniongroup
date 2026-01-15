/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package com.util;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.ArrayEstatusSN;
import com.entity.ConfigUsuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import org.json.JSONObject;

/**
 *
 * @author mandrade
 */
@WebServlet(name = "CtrlComboLoader_1", urlPatterns = {"/CtrlComboLoader_1"})
public class CtrlComboLoader extends HttpServlet {

    RequestGetApi requetGet = new RequestGetApi();
    ReadProps props = new ReadProps();

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json; charset=ISO-8859-1");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
        response.setHeader("Pragma", "no-cache"); //HTTP 1.0
        response.setDateHeader("Expires", 0);
        PrintWriter out = response.getWriter();
        String bnd = Utilities.obtenParametro(request, "bnd");
        String campo = Utilities.obtenParametro(request, "idCampo");
        String idEmpresa = Utilities.obtenParametro(request, "qry");
        HttpSession session = request.getSession(true);
        session.setAttribute("idEmpresa", idEmpresa);

        // Inventario del 3-100
        // Envio del 101-200
        try {
            switch (bnd) {
                case "1":
                    out.print(ObtenerEmpresa(request, response));
                    break;
                case "2":
                    out.print(ObtenerAlmacen(request, response));
                    break;
                
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String ObtenerEmpresa(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal;
        HttpSession session = request.getSession(true);
        try {
            ArrayList<ConfigUsuario.Empresa> arrayEmpresa = (ArrayList<ConfigUsuario.Empresa>) session.getAttribute("Empresa");
            JSONVal = new ObjectMapper().writeValueAsString(arrayEmpresa);
            //" [{\"empid\": \"581\",\"empnomcorto\": \"HENKEL BC\"},{\"empid\": \"600\",\"empnomcorto\": \"3M SAMPLE CENTER\"}]";

        } catch (Exception e) {
            JSONVal = "";
        }
        return JSONVal;
    }

    public String ObtenerAlmacen(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal;
        HttpSession session = request.getSession(true);
        try {
            ArrayList<ConfigUsuario.Almacene> arrayAlmacen = (ArrayList<ConfigUsuario.Almacene>) session.getAttribute("almacen");
            JSONVal = new ObjectMapper().writeValueAsString(arrayAlmacen);
        } catch (Exception e) {
            JSONVal = "";
        }
        return JSONVal;
    }

    

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
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
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
