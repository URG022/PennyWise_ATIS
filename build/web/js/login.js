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
                // Usamos un bloque try/catch simple ya que no hay await ni asincronismo complejo
                try {
                    let users = JSON.parse(localStorage.getItem('users')) || [];

                    // Validar correo duplicado (Solo para el cliente, el Servlet debe validarlo en DB)
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
                    const limitesKey = `limitesDePresupuesto_${email}`;
                    localStorage.setItem(limitesKey, JSON.stringify(VALORES_DEFECTO_LIMITES));

                    // 3. Notificación y Envío (No hay redireccionamiento aquí)
                    // Puedes poner un mensaje de carga, pero no un mensaje de éxito, 
                    // ya que el formulario se enviará al Servlet.
                    Swal.fire({
                        title: 'Datos válidos.',
                        text: 'Enviando registro al servidor...',
                        icon: 'info',
                        showConfirmButton: false,
                        timer: 1500 // Pequeño delay antes de enviar
                    });

                    // IMPORTANTE: NO usamos e.preventDefault() aquí. 
                    // El formulario continuará su envío al action="/PennyWise/loginServlet".

                } catch (err) {
                    Swal.fire({icon: 'error', title: 'Error de Cliente', text: 'Ocurrió un error al guardar datos localmente.'});
                    e.preventDefault();
                    console.error("Error en el localStorage:", err);
                }
            });