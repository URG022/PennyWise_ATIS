function setupPasswordToggle(inputId, toggleButtonId, iconId) {
    const input = document.getElementById(inputId);
    const toggleButton = document.getElementById(toggleButtonId);
    const eyeIcon = document.getElementById(iconId);
    
    // Verificamos que los elementos existan en el DOM antes de adjuntar el listener
    if (toggleButton && input && eyeIcon) {
        toggleButton.addEventListener("click", function (e) {
            // Evita que el botón envíe el formulario si está dentro del <form>
            e.preventDefault();
            
            // Alternar el tipo (password/text)
            const type = input.getAttribute("type") === "password" ? "text" : "password";
            input.setAttribute("type", type);
            
            // Alternar el ícono (requiere Font Awesome)
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

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    // Obtener los campos de entrada
    const logEmailIn = document.getElementById("logEmail");
    const logPasswordIn = document.getElementById("logPassword");
    const logEmail = logEmailIn.value.trim();
    const logPassword = logPasswordIn.value.trim();
    
    // 1. Validar que no estén vacíos
    if (!logEmail || !logPassword) {
        Swal.fire({
            icon: "warning",
            title: "⚠️ Atención",
            text: "Todos los campos son obligatorios",
        });
        return;
    }
    
    // 2. Si las validaciones pasan, enviar el formulario al servlet
    // El servlet se encargará de la autenticación real
    const form = document.getElementById("loginForm");
    form.submit();
});