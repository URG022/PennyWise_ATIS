<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registro PennyWise</title>
        <!-- Bootstrap CSS y SweetAlert2 CSS -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            rel="stylesheet"
            />
        <link
            href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
            rel="stylesheet"
            />
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            />
        <!-- Custom CSS -->
        <link rel="stylesheet" href="../../css/sesion.css" />
    </head>
    <body>
        <main class="container-fluid">
            <div class="row min-vh-100">
                <!-- Lado Izquierdo: Logo -->
                <section
                    class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-left"
                    >
                    <div class="text-center p-4">
                        <img
                            src="../../imgs/LogoGrande.png"
                            alt="PennyWise Logo"
                            class="logo mb-3"
                            />
                    </div>
                </section>

                <!-- Lado Derecho: Formulario -->
                <section
                    class="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-right"
                    >
                    <div class="w-75 p-4">
                        <h4 class="text-white text-center mb-4">Regístrate</h4>
                        <form id="registerForm" action="${pageContext.request.contextPath}/loginServlet" method="post">
                            <div class="mb-3">
                                <label for="name" class="form-label text-white"
                                       >Nombre Completo</label
                                >
                                <input
                                    type="text"
                                    class="form-control form-input"
                                    id="name"
                                    name="name"
                                    placeholder="Ingresa tu nombre"
                                    required
                                    />
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label text-white">Email</label>
                                <input
                                    type="email"
                                    class="form-control form-input"
                                    id="email"
                                    name="email"
                                    placeholder="ejemplo@correo.com"
                                    />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label text-white"
                                       >Contraseña</label
                                >
                                <div class="input-group">
                                    <input
                                        type="password"
                                        class="form-control form-input"
                                        id="password"
                                        name="password"
                                        placeholder="Contraseña"
                                        required
                                        />
                                    <button
                                        class="btn btn-outline-secondary"
                                        type="button"
                                        id="togglePassword"
                                        >
                                        <i class="fas fa-eye" id="eyeIconPassword"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label text-white"
                                       >Confirmar Contraseña</label
                                >
                                <div class="input-group">
                                    <input
                                        type="password"
                                        class="form-control form-input"
                                        id="confirmPassword"
                                        placeholder="Confirma tu contraseña"
                                        required
                                        />
                                    <button
                                        class="btn btn-outline-secondary"
                                        type="button"
                                        id="toggleConfirmPassword"
                                        >
                                        <i class="fas fa-eye" id="eyeIconConfirm"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <button type="submit" class="btn btn-login w-100">
                                    Registrarse
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </main>

        <!-- Bootstrap JS Bundle -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <!-- SweetAlert2 JS -->
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
        <!-- Custom JS -->
        <script>
            // Funciones de mostrar/ocultar contraseña
            function setupPasswordToggle(inputId, toggleButtonId, iconId) {
                const input = document.getElementById(inputId);
                const toggleButton = document.getElementById(toggleButtonId);
                const eyeIcon = document.getElementById(iconId);

                if (toggleButton && input && eyeIcon) {
                    toggleButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                        input.setAttribute('type', type);

                        if (type === 'text') {
                            eyeIcon.classList.remove('fa-eye');
                            eyeIcon.classList.add('fa-eye-slash');
                        } else {
                            eyeIcon.classList.remove('fa-eye-slash');
                            eyeIcon.classList.add('fa-eye');
                        }
                    });
                }
            }

            setupPasswordToggle('password', 'togglePassword', 'eyeIconPassword');
            setupPasswordToggle('confirmPassword', 'toggleConfirmPassword', 'eyeIconConfirm');

            // Funciones de validación
            function emailValidation(email) {
                const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regx.test(email);
            }

            function passValidation(pass) {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                return regex.test(pass);
            }

            function passMatch(pass, confPass) {
                return pass === confPass;
            }

            // Lógica de Registro (Síncrono para el Servlet)
            document.getElementById("registerForm").addEventListener("submit", function (e) {

                // Obtenemos los valores
                const name = document.getElementById("name").value.trim();
                const email = document.getElementById("email").value.trim();
                const password = document.getElementById("password").value.trim();
                const confirmPassword = document.getElementById("confirmPassword").value.trim();

                let error = false;

                // 1. Validaciones Síncronas
                if (!name || !email || !password || !confirmPassword) {
                    Swal.fire({icon: 'warning', title: '⚠️ Atención', text: 'Por favor completa todos los campos'});
                    error = true;
                } else if (!emailValidation(email)) {
                    Swal.fire({icon: 'warning', title: 'Email inválido', text: 'Por favor ingresa un correo válido'});
                    error = true;
                } else if (!passValidation(password)) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Contraseña débil',
                        html: 'Debe contener:<br>- Minúscula<br>- Mayúscula<br>- Número<br>- Mínimo 8 caracteres'
                    });
                    error = true;
                } else if (!passMatch(password, confirmPassword)) {
                    Swal.fire({icon: 'warning', title: 'Contraseñas no coinciden', text: 'Por favor verifica tus contraseñas'});
                    error = true;
                }

                if (error) {
                    e.preventDefault(); // Detenemos el envío al Servlet si hay errores de validación
                    return;
                }

                // 2. Lógica de LocalStorage (Se ejecuta ANTES de enviar los datos al Servlet)
                try {
                    let users = JSON.parse(localStorage.getItem('users')) || [];

                    // Validar correo duplicado
                    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
                    if (emailExists) {
                        Swal.fire({icon: 'error', title: 'Correo ya registrado', text: 'Por favor usa otro correo'});
                        e.preventDefault(); // Detenemos el envío si el correo ya existe en localStorage
                        return;
                    }

                    // Agregar usuario a LocalStorage (simulación)
                    users.push({name, email, password});
                    localStorage.setItem('users', JSON.stringify(users));

                    // Inicializar límites en LocalStorage
                    const VALORES_DEFECTO_LIMITES = [
                        {categoria: "Ahorro", limite: 0},
                        {categoria: "Provisiones", limite: 0},
                        {categoria: "Gastos Fijos", limite: 0},
                        {categoria: "Gastos Variables", limite: 0},
                        {categoria: "Deudas", limite: 0}
                    ];

                    // ✅ CORRECCIÓN APLICADA: Usamos la concatenación para asegurar el email
                    const limitesKey = 'limitesDePresupuesto_' + email;
                    localStorage.setItem(limitesKey, JSON.stringify(VALORES_DEFECTO_LIMITES));

                    // Limpiar campos antes de la notificación final
                    document.getElementById("registerForm").reset();

                    // 3. Notificación y Envío al Servlet
                    Swal.fire({
                        title: 'Datos válidos.',
                        text: 'Enviando registro al servidor...',
                        icon: 'info',
                        showConfirmButton: false,
                        timer: 1500 // Pequeño delay antes de enviar
                    });

                    // NO usamos e.preventDefault(); el formulario se enviará al Servlet después del timer.

                } catch (err) {
                    Swal.fire({icon: 'error', title: 'Error de Cliente', text: 'Ocurrió un error al guardar datos localmente.'});
                    e.preventDefault();
                    console.error("Error en el localStorage:", err);
                }
            });
        </script>



    </body>
</html>
