package com.pennywise;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/sesionServlet")
public class sesionServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Obtener datos del formulario
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        
        // Validación básica
        if (email == null || email.trim().isEmpty() || 
            password == null || password.trim().isEmpty()) {
            // Redirigir con mensaje de error
            response.sendRedirect(request.getContextPath() + "/pages/auth/sesion.jsp?error=empty");
            return;
        }
        
        // TODO: Aquí debes validar contra tu base de datos
        // Por ahora, ejemplo simple:
        boolean isValidUser = true;
        
        if (isValidUser) {
            // Crear sesión y guardar datos del usuario
            HttpSession session = request.getSession();
            session.setAttribute("userEmail", email);
            session.setAttribute("isLoggedIn", true);
            // Si tienes el nombre del usuario:
            // session.setAttribute("userName", userName);
            
            // Redirigir a home
            response.sendRedirect(request.getContextPath() + "/pages/home.jsp");
        } else {
            // Credenciales incorrectas
            response.sendRedirect(request.getContextPath() + "/pages/auth/sesion.jsp?error=credentials");
        }
    }
}