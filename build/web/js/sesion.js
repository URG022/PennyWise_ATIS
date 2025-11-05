// =========================================================================
// 1️⃣ FUNCIÓN PARA MOSTRAR/OCULTAR CONTRASEÑA
// =========================================================================
function setupPasswordToggle(inputId, toggleButtonId, iconId) {
    const input = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleButtonId);
    const eyeIcon = document.getElementById(iconId);

    if (toggleButton && input && eyeIcon) {
        toggleButton.addEventListener("click", function (e) {
            e.preventDefault();

            const type = input.getAttribute("type") === "password" ? "text" : "password";
            input.setAttribute("type", type);

            if (type === "text") {
                eyeIcon.classList.remove("fa-eye");
                eyeIcon.classList.add("fa-eye-slash");
            } else {
                eyeIcon.classList.remove("fa-eye-slash");
                eyeIcon.classList.add("fa-eye");
            }
        });
    }
}

// Configurar el toggle para el campo de Contraseña
setupPasswordToggle("logPassword", "togglePassword", "eyeIconPassword");

// =========================================================================
// 2️⃣ VALIDACIÓN DE LOGIN CONTRA LOCALSTORAGE + ENVÍO AL SERVLET
// =========================================================================
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const logEmail = document.getElementById("logEmail").value.trim();
    const logPassword = document.getElementById("logPassword").value.trim();

    // 1️⃣ Validar campos vacíos
    if (!logEmail || !logPassword) {
        Swal.fire({
            icon: "warning",
            title: "⚠️ Atención",
            text: "Todos los campos son obligatorios",
        });
        return;
    }

    // 2️⃣ Obtener lista de usuarios del localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.length === 0) {
        Swal.fire({
            icon: "error",
            title: "❌ No hay usuarios registrados",
            text: "Por favor, regístrate antes de iniciar sesión.",
        });
        return;
    }

    // 3️⃣ Buscar usuario válido
    const foundUser = users.find(
        (user) => user.email === logEmail && user.password === logPassword
    );

    if (!foundUser) {
        Swal.fire({
            icon: "error",
            title: "❌ Credenciales incorrectas",
            text: "El correo o la contraseña no coinciden",
        });
        return;
    }

    // 4️⃣ Guardar el usuario actual en localStorage
    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    // 5️⃣ Mostrar mensaje de éxito y enviar el formulario al servlet
    Swal.fire({
        icon: "success",
        title: "✅ Bienvenido",
        text: `Hola, ${foundUser.name}`,
        showConfirmButton: false,
        timer: 1000,
    });

    setTimeout(() => {
        // ✅ Ahora sí, enviar el formulario al servlet para que cree la sesión y redirija
        document.getElementById("loginForm").submit();
    }, 1000);
});
