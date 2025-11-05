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

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if (email == null || email.trim().isEmpty()
                || password == null || password.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/pages/auth/sesion.jsp?error=empty");
            return;
        }

        // ✅ Si el JS ya validó, aquí solo creamos la sesión
        HttpSession session = request.getSession();
        session.setAttribute("userEmail", email);
        session.setAttribute("isLoggedIn", true);

        // Redirigir al home
        response.sendRedirect(request.getContextPath() + "/pages/home.jsp");
    }
}
