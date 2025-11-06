<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg custom-nav fixed-top">
    <div class="container-fluid">
        <!-- LOGO -->
        <a class="navbar-brand" href="#">
            <img src="../imgs/LogoPequeño.png" alt="Logo" height="60" />
        </a>

        <!-- BOTÓN RESPONSIVE -->
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            >
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- LINKS -->
        <div class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item">
                    <a class="nav-link active" href="home.jsp">Inicio</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="registro.jsp">Registro</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="presupuesto.jsp">Presupuesto</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="metas.jsp">Metas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="nosotros.jsp">Nosotros</a>
                </li>
            </ul>

            <!-- BOTÓN DERECHA -->
            <a
                class="dropdown-toggle btn-login"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="btn-profile"
                >
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><hr class="dropdown-divider" /></li>
                <li>
                    <button class="dropdown-item" id="btn-logout" type="button">Cerrar sesión</button>
                </li>
            </ul>
        </div>
    </div>
</nav>
