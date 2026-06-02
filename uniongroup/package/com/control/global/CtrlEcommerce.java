/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.global;

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.global.ArrEcommerce;
import com.entity.global.ArrEcommerceDet;
import com.entity.global.ArrProductosSurtidos;
import com.entity.global.CentralEcommerce;
import com.entity.global.CentralEcommerceDet;
import com.entity.global.CentralProductosSurtidos;
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
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;

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
                    
                    case "4":
                    out.print(eliminarPedido(request, response));
                    break;
                    case "5":
                    out.print(generarLE(request, response));
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
        
        String limit = Utilities.obtenParametro(request, "limit");
            String offset = Utilities.obtenParametro(request, "offset");
            
            String dias = Utilities.obtenParametro(request, "dias");
            String fecha = Utilities.obtenParametro(request, "fecha");
        try {
            // idEmpresa = Utilities.obtenParametro(request, "idEmpresa");
            String service = props.getValueProp("Host") + props.getValueProp("ServiceEcommerce")+ "?estatus="+ estatus + "&dias=" +dias + "&fecha=" + fecha + "&offset=" + offset + "&limit=" + limit;;
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
        String le = Utilities.obtenParametro(request, "le");

        try {
            ObjectMapper mapper = new ObjectMapper();

            // 1. Obtener Header
            String serviceH = props.getValueProp("Host") + props.getValueProp("ServiceEcommerce") + "?ecomid=" + ecomid;
            String respH = requetGet.getGet(serviceH);
            CentralEcommerce centralHeader = mapper.readValue(respH, CentralEcommerce.class);
            
            if (centralHeader.items == null || centralHeader.items.isEmpty()) {
                return "{\"ok\":false, \"error\":\"No se encontró el header del pedido\"}";
            }
            ArrEcommerce header = centralHeader.items.get(0);

            // 2. Obtener Detalle Original
            String serviceD = props.getValueProp("Host") + props.getValueProp("ServiceEcommerceDet") + "?clave=" + ecomid;
            String respD = requetGet.getGet(serviceD);
            CentralEcommerceDet det = mapper.readValue(respD, CentralEcommerceDet.class);

            if (det.items == null || det.items.isEmpty()) {
                return "{\"ok\":false, \"error\":\"El detalle del pedido viene vacío\"}";
            }

            // 3. Obtener Unidades Surtidas
            String serviceS = props.getValueProp("Host") + "uniongroup/productosurtido/?clave=" + le;
            String respS = requetGet.getGet(serviceS); 
            CentralProductosSurtidos surtidoData = mapper.readValue(respS, CentralProductosSurtidos.class);

            // Cruzar datos de surtido
            if (surtidoData != null && surtidoData.items != null && !surtidoData.items.isEmpty()) {
                java.util.Map<String, Integer> mapSurtido = new java.util.HashMap<>();
                for (ArrProductosSurtidos s : surtidoData.items) {
                    if (s.itemcode != null) {
                        mapSurtido.put(s.itemcode.trim(), s.unidades);
                    }
                }

                for (ArrEcommerceDet itemDet : det.items) {
                    String itemKey = (itemDet.itemnumber != null) ? itemDet.itemnumber.trim() : "";
                    if (mapSurtido.containsKey(itemKey)) {
                        itemDet.quantity = String.valueOf(mapSurtido.get(itemKey));
                    } else {
                        itemDet.quantity = "0";
                    }
                }
                System.out.println("LOG STDRUEAP: Cantidades actualizadas con Surtido.");
            } else {
                System.out.println("LOG STDRUEAP: Surtido vacío. Se mantiene el pedido original.");
            }

            // Generación de archivo local temporal
            String ts = new java.text.SimpleDateFormat("yyMMdd_HHmmss").format(new java.util.Date());
            String fileName = "STDRUEAP_" + ts + ".txt";
            Path tempFile = Files.createTempFile("stdrueap_", ".txt");
            
            STDRUEAPGenerator.generate(header, det.items, tempFile);
            
            System.out.println("LOG STDRUEAP: Archivo temporal creado con un tamaño de " + Files.size(tempFile) + " bytes.");

            // Configuración FTP
            String ftpHost = "ftp.concir.mx";
            String ftpUser = "global.ug@seyl.mx";
            String ftpPass = "A}5%p.KrRh#i";
            String remoteDir = "/ECOMMERCE/ECOM-OUT"; 

            boolean uploaded = uploadToFTP(tempFile, fileName, ftpHost, ftpUser, ftpPass, remoteDir);
            Files.deleteIfExists(tempFile);

            if (uploaded) {
                return "{\"ok\":true, \"file\":\"" + remoteDir + "/" + fileName + "\"}";
            } else {
                return "{\"ok\":false, \"error\":\"Error al subir el archivo al servidor FTP (Verifica logs)\"}";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"ok\":false, \"error\":\"" + e.getMessage().replace("\"", "'") + "\"}";
        }
    }

    private boolean uploadToFTP(Path localFilePath, String remoteFileName, String host, String user, String pass, String remoteDir) {
        FTPClient ftpClient = new FTPClient();
        try {
            ftpClient.connect(host, 21);
            ftpClient.login(user, pass);
            
            // CAMBIO CLAVE: Usar Modo Pasivo para evitar archivos de 0 bytes debido al Firewall
            ftpClient.enterLocalPassiveMode();
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);

            try (InputStream inputStream = Files.newInputStream(localFilePath)) {
                String remotePath = remoteDir + "/" + remoteFileName;
                boolean done = ftpClient.storeFile(remotePath, inputStream);
                return done;
            }
        } catch (IOException ex) {
            ex.printStackTrace();
            return false;
        } finally {
            try {
                if (ftpClient.isConnected()) {
                    ftpClient.logout();
                    ftpClient.disconnect();
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
    
    
//    public String GenerarSTDRUEAP(HttpServletRequest request, HttpServletResponse response) {
//    String ecomid = Utilities.obtenParametro(request, "ecomid");
//
//    try {
//        ObjectMapper mapper = new ObjectMapper();
//
//        // 1. Obtener header (regresa CentralEcommerce, no ArrEcommerce directo)
//        String serviceH = props.getValueProp("Host") + props.getValueProp("ServiceEcommerce") + "?ecomid=" + ecomid;
//        String respH = requetGet.getGet(serviceH);
//
//        CentralEcommerce centralHeader = mapper.readValue(respH, CentralEcommerce.class);
//
//        if (centralHeader.items == null || centralHeader.items.isEmpty()) {
//            return "{\"ok\":false, \"error\":\"No se encontró header para ecomid " + ecomid + "\"}";
//        }
//
//        ArrEcommerce header = centralHeader.items.get(0);
//
//        // 2. Obtener detalle
//        String serviceD = props.getValueProp("Host") + props.getValueProp("ServiceEcommerceDet") + "?clave=" + ecomid;
//        String respD = requetGet.getGet(serviceD);
//
//        CentralEcommerceDet det = mapper.readValue(respD, CentralEcommerceDet.class);
//
//        if (det.items == null || det.items.isEmpty()) {
//            return "{\"ok\":false, \"error\":\"No hay líneas de detalle para ecomid " + ecomid + "\"}";
//        }
//
//        // 3. Generar archivo
//        String ts = new java.text.SimpleDateFormat("yyMMdd_HHmmss").format(new java.util.Date());
//        Path out = Paths.get("C:/ECOM-OUT/STDRUEAP_" + ts + ".txt");
//
//        STDRUEAPGenerator.generate(header, det.items, out);
//
//        return "{\"ok\":true, \"file\":\"" + out.toString().replace("\\", "/") + "\"}";
//
//    } catch (Exception e) {
//        e.printStackTrace();
//        return "{\"ok\":false, \"error\":\"" + e.getMessage().replace("\"", "'") + "\"}";
//    }
//}
    
    
    public String eliminarPedido(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        String rutaServicio = Utilities.obtenParametro(request, "servicio");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceEcommerce");
            JSONVal = requetPost.setPut(service, jsonLineaNegocio, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }
    
    public String generarLE(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";
        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        RequestPostApi requetPost = new RequestPostApi();
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceEcommerceLE");
            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);

        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
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
