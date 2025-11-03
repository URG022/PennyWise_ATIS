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
            const type =
                    input.getAttribute("type") === "password" ? "text" : "password";
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

document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // 1. Validaciones Síncronas
    if (!name || !email || !password || !confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: '⚠️ Atención',
            text: 'Por favor completa todos los campos'
        });
        return;
    }

    if (!emailValidation(email)) {
        Swal.fire({
            icon: 'warning',
            title: 'Email inválido',
            text: 'Por favor ingresa un correo válido'
        });
        return;
    }

    if (!passValidation(password)) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña débil',
            html: 'Debe contener:<br>- Minúscula<br>- Mayúscula<br>- Número<br>- Mínimo 8 caracteres'
        });
        return;
    }

    if (!passMatch(password, confirmPassword)) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseñas no coinciden',
            text: 'Por favor verifica tus contraseñas'
        });
        return;
    }

    // 2. Simulación de Operación Asíncrona 
    try {
        // Mostrar un estado de carga
        Swal.fire({
            title: 'Procesando registro...',
            text: 'Por favor, espera.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Lógica de LocalStorage (simulación de respuesta exitosa del servidor)
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Validar correo duplicado
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            Swal.fire({
                icon: 'error',
                title: 'Correo ya registrado',
                text: 'Por favor usa otro correo'
            });
            return;
        }

        // Agregar usuario
        users.push({name, email, password});
        localStorage.setItem('users', JSON.stringify(users));

        const VALORES_DEFECTO_LIMITES = [
            {categoria: "Ahorro", limite: 0},
            {categoria: "Provisiones", limite: 0},
            {categoria: "Gastos Fijos", limite: 0},
            {categoria: "Gastos Variables", limite: 0},
            {categoria: "Deudas", limite: 0}
        ];

        // Crea la clave específica para el *nuevo* usuario
        const limitesKey = `limitesDePresupuesto_${email}`;
        localStorage.setItem(limitesKey, JSON.stringify(VALORES_DEFECTO_LIMITES));

        // Limpiar campos ANTES de la notificación final
        document.getElementById("registerForm").reset();

        // 4. Notificación de Éxito y Redirección
        Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Usuario registrado correctamente'
        }).then(() => {
            // ✅ FORMA ALTERNATIVA: Usar la ruta absoluta codificada directamente.
            // Esto asume que el Context Path de tu app es /PennyWise
            window.location.href = BASE_URL + 'pages/auth/sesion.jsp';
        });

    } catch (error) {
        // Manejo de errores
        Swal.fire({
            icon: 'error',
            title: 'Error de registro',
            text: 'Ocurrió un error al intentar registrar el usuario. Inténtalo de nuevo.'
        });
        console.error("Error en el registro asíncrono:", error);
    }
});