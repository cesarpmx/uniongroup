<%@page import="java.text.SimpleDateFormat;
import java.util.*;" contentType="text/html" pageEncoding="ISO-8859-1"%>
<%
            SimpleDateFormat fmtmes = new SimpleDateFormat("MM");
            SimpleDateFormat fmtanio = new SimpleDateFormat("yyyy");
            Calendar calendario = Calendar.getInstance();
            Date fecha = calendario.getTime();
            String mes = "", anio = "", fechaMin = "", fechaMax = "", Scriptjs = "";
            mes = fmtmes.format(fecha);
            anio = fmtanio.format(fecha);
            fechaMin = "01/" + mes + "/" + anio;
            Integer vari = Integer.parseInt(mes) + 1;
            if (vari >= 10) {
                fechaMax = "02/" + vari + "/" + anio;
            } else {
                fechaMax = "02/0" + vari + "/" + anio;
            }

%>
<script type="text/javascript">var fechMin ='<%=fechaMin%>';var fechMax='<%=fechaMax%>'; var Scriptjs=<%=session.getAttribute("modulos").toString()%>; var acceso='<%=session.getAttribute("acceso").toString()%>';</script>
<!--Modulos Principales-->
<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/modulos/archivos_genericos/acciones_genericasload.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/modulos/archivos_genericos/FuncionesGenericas.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/modulos/archivos_genericos/ComboBoxCia.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/modulos/archivos_genericos/StoreCombo.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/modulos/archivos_genericos/Records.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/modulos/archivos_genericos/ImportarExcel.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/modulos/global/PanelConsignatarios.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/principal.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/js_scripts/home.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/Utils.js"></script>


<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js"></script>


