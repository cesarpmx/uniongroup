/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.control.configuracion;

/**
 *
 * @author azielocampo
 */
        

import com.dao.RequestGetApi;
import com.dao.RequestPostApi;
import com.entity.inventario.CentralRespuestaServidor;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.util.ReadProps;
import com.util.Utilities;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import static jakarta.mail.Transport.send;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Properties;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@WebServlet(name = "CtrlConfiguracionUsuario", urlPatterns = {"/ConfigUsuario"})

public class CtrlConfiguracionUsuario extends HttpServlet {

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
                    out.print(RecuperarContraseña(request, response));
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }

    public String RecuperarContraseña(HttpServletRequest request, HttpServletResponse response) {
        String JSONVal = "";

        String jsonLineaNegocio = Utilities.obtenParametro(request, "valores");
        String correoUsuario = Utilities.obtenParametro(request, "correo");
//        String correoUsuario = "aziel.balbuena@concir.mx";
        String _cve = Utilities.obtenParametro(request, "_cve");
        String correoSoporte= "";
        
        String cuerpoMensaje = "<h3>Hola: " + correoUsuario + "</h3>"
                    + "<p>Su contraseña se ha restablecido con éxito.</p>"
                    + "<p>Su nueva contraseña es: <b>" + _cve + "</b></p>"
                    + "<p>Cualquier duda, comuníquese con: soporte@concir.com</p>";
        
        JSONObject jsonInformacionCorreo = new JSONObject();
        jsonInformacionCorreo.put("asunto", "Confirmación cambio de contraseña");
        jsonInformacionCorreo.put("agente",correoSoporte );
        jsonInformacionCorreo.put("usuario",correoUsuario );
        jsonInformacionCorreo.put("cuerpoMensaje", cuerpoMensaje);
        jsonInformacionCorreo.put("archivoAdjunto", "");
        
        RequestPostApi requetPost = new RequestPostApi();
        
        try {
            String service = props.getValueProp("Host") + props.getValueProp("ServiceRecuperarContraseña");
            JSONVal = requetPost.getPost(service, jsonLineaNegocio, request);
            
            // Convertir la respuesta JSON a un objeto JSONObject
            JSONObject jsonResponse = new JSONObject(JSONVal);
            
            // Verificar si la respuesta es exitosa
            if ("true".equals(jsonResponse.optString("success", "true"))) {
                
                String correo = enviarCorreo(request, response, jsonInformacionCorreo.toString(), _cve, correoUsuario, jsonInformacionCorreo.toString());
                
            } else {
                // Manejar el caso en que la respuesta no sea exitosa
                return JSONVal;
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            JSONVal = "";
        }
        return JSONVal;
    }
       
    public String enviarCorreo(HttpServletRequest request, HttpServletResponse response, String jsonLineaNegocio, String _cve, String correoUsuario, String jsonInformacionCorreo) throws IOException {
        String JSONServidorResp = "";
        int claveEmpresa = 1;

        InputStream imageStream = getServletContext().getResourceAsStream("/img/newLogoLogin.png");
        byte[] imageBytes = imageStream.readAllBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        // Verificar si los parámetros son nulos
        String detalle_Bitacora = "";
        if (jsonLineaNegocio == null || correoUsuario == null) {
            return "{\"success\": false, \"message\": \"Alguno de los parámetros es nulo.\"}";
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            
            JsonNode jsonCorreo = mapper.readTree(jsonInformacionCorreo);
        
            String asunto = jsonCorreo.get("asunto").asText();

            String serviceServidor = props.getValueProp("Host") + props.getValueProp("ServiceRespuestaServidor") + claveEmpresa;
            String repuesta = requetGet.getGet(serviceServidor);

            CentralRespuestaServidor Venta = new ObjectMapper().readValue(repuesta, CentralRespuestaServidor.class);
            JSONServidorResp = new ObjectMapper().writeValueAsString(Venta.items);

            JSONArray jsonResponseServidor = new JSONArray(JSONServidorResp);
            JSONObject jsonObjectServidor = jsonResponseServidor.getJSONObject(0);

            if (jsonResponseServidor != null) {

                String host = jsonObjectServidor.getString("emahost");
                int port = jsonObjectServidor.getInt("emaport");
                final String username = jsonObjectServidor.getString("emauser");
                final String password = jsonObjectServidor.getString("emapassword");

                // Configurar las propiedades para la conexión SMTP
                Properties props = new Properties();
                props.put("mail.smtp.host", host);
                props.put("mail.smtp.port", port);
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");
                props.put("mail.smtp.ssl.trust", "*");

                // Crear la sesión con la autenticación
                Session session = Session.getInstance(props, new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });
                
                // Crear el mensaje de correo
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(username));

                String correo = correoUsuario.trim();
                message.setRecipient(Message.RecipientType.TO, new InternetAddress(correo));
                message.setSubject(asunto);
                 
                // Crear el cuerpo del mensaje en HTML
                String cuerpoMensaje = "<h3>Hola: " + correo + "</h3>"
                    + "<p>Su contraseña se ha restablecido con éxito.</p>"
                    + "<p>Su nueva contraseña es: <b>" + _cve + "</b></p>"
                    + "<p>Cualquier duda, comuníquese con: soporte@concir.com</p>"
                
                + "<br><br>"
                + "<img src='data:image/png;base64," + base64Image + "' width='350' height='95' alt='Logo' />"
                + "<p>Confidenciality Note: Este mensaje y cualquiera de sus anexos, contienen información confidencial y está dirigido únicamente al destinatario designado en la parte superior de este correo. Cualquier uso por parte de otro destinatario estará estrictamente prohibido. Si usted recibió este correo por error, favor de contactar al remitente y eliminar este mensaje de su buzón. This e-mail and any attachment to it, contains confidential information that is intended only for the addressee(s) named above. Any use by an unintended recipient is strictly prohibited. If you have received this e-mail in error, please contact the sender and delete this e-mail from your system.\n"
                        + "No imprima este correo si no es necesario. Ahorrar papel protege el medio ambiente.</p>";

                MimeBodyPart textoParte = new MimeBodyPart();
                textoParte.setContent(cuerpoMensaje, "text/html");

                MimeMultipart multipart = new MimeMultipart();
                multipart.addBodyPart(textoParte);

                message.setContent(multipart);

                // Enviar el correo
                Transport.send(message);
            } else {
                System.out.println("El JSON de configServer está vacío o no tiene elementos.");
                return "El JSON de configServer está vacío o no tiene elementos.";
            }

            System.out.println("Correo electrónico enviado con éxito.");
            return "{\"success\": true, \"message\": \"Su solicitud ha sido exitosa, se ha enviado un mensaje al siguiente(s) correo(s) " + correoUsuario + "\"}";

        } catch (MessagingException | JSONException e) {
            e.printStackTrace();
            return "{\"success\": false, \"message\": \"La bitacora se guardo correctamente pero hubo un error en la autenticación para el envio del correo.\"}";
        }
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
