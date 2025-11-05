<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page session="true" %>
<%
    // Verificamos si existe una sesión activa y si el usuario ha iniciado sesión
    HttpSession currentSession = request.getSession(false);
    String currentUserEmail = null;

    if (currentSession != null && Boolean.TRUE.equals(currentSession.getAttribute("isLoggedIn"))) {
        currentUserEmail = (String) currentSession.getAttribute("userEmail");
    } else {
        // Si no hay sesión, redirigimos al login
        response.sendRedirect(request.getContextPath() + "/pages/auth/sesion.jsp");
        return;
    }
%>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inicio</title>

    <!-- Fuentes y estilos -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Open+Sans:wght@400;500&display=swap"
        rel="stylesheet"
    />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../css/styles.css" />
</head>

<body>
    <!-- Navbar -->
    <div id="navbar"></div>

    <!-- Contenido principal -->
    <main class="container text-center">
        <!-- Sección: Resumen -->
        <section>
            <div class="row justify-content-between">
                <h5 class="my-3 text-start fw-bold">Resumen del Mes</h5>

                <div class="col-sm-12 col-md-6 card border-0 shadow-sm contenedores-card my-2">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Categoria</th>
                                <th>Presupuesto</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-resume"></tbody>
                    </table>
                </div>

                <div class="col-sm-12 col-md-5 card border-0 shadow-sm contenedores-card my-2">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Meta Ahorro</th>
                                <th>Contribución Mensual</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-metas"></tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- Sección: Alertas -->
        <section class="my-5">
            <h5 class="my-3 text-start fw-bold">Alertas Presupuesto</h5>
            <div class="row justify-content-center">
                <div class="col-sm-12 card border-0 shadow-sm" id="cardAlert">
                    <h5 class="my-3 text-muted" id="msgAlert">Alertas Presupuesto</h5>
                </div>
            </div>
        </section>

        <!-- Sección: Gráficas -->
        <section class="my-1">
            <h5 class="text-start fw-bold">Gráficas Globales</h5>
            <div class="row justify-content-between">
                <div class="col-sm-7 card border-0 shadow-sm my-2">
                    <h5 class="my-3 text-start fw-bold">Presupuesto vs Real</h5>
                    <canvas id="graficaPresuVSreal"></canvas>
                </div>

                <div class="col-sm-10 col-md-4 card border-0 shadow-sm my-2">
                    <h5 class="my-3 text-start fw-bold">
                        Distribución del dinero (Presupuestado)
                    </h5>
                    <canvas id="graficaDistrDineroPres"></canvas>
                </div>

                <div class="col-sm-10 col-md-4 card border-0 shadow-sm my-2">
                    <h5 class="my-3 text-start fw-bold">
                        Distribución del dinero (Real)
                    </h5>
                    <canvas id="graficaDistrDinReal"></canvas>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <div id="footer"></div>

    <!-- Librerías -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <!-- Scripts -->
    <script src="../js/logout.js"></script>

    <!-- 🔹 Sincronización de sesión con localStorage -->
    <script>
        const SERVER_USER_EMAIL = "<%= currentUserEmail %>";
        if (SERVER_USER_EMAIL) {
            // Guardar usuario actual si no existe o actualizar
            localStorage.setItem("currentUser", JSON.stringify({ email: SERVER_USER_EMAIL }));
            console.log("✅ Usuario sincronizado desde sesión:", SERVER_USER_EMAIL);
        } else {
            // Si no hay sesión válida, limpiar y redirigir
            localStorage.removeItem("currentUser");
            window.location.href = "../auth/sesion.jsp";
        }
    </script>

    <!-- Scripts principales -->
    <script src="../js/homev1.js"></script>
    <script type="module" src="../js/graficas.js"></script>
    <script src="../js/addFooterNav.js"></script>
</body>
</html>
