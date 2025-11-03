/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pennywise;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

/**
 *
 * @author Usuario
 */

@WebServlet("/loginServlet")
public class loginServlet extends HttpServlet  {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Obtener datos del formulario
        String nombre = request.getParameter("nombre");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Aquí puedes hacer la lógica para registrar el usuario en la base de datos o en memoria
        // Por ejemplo:
        System.out.println("Usuario registrado: " + nombre + " - " + email);

        // Guardar usuario en sesión (opcional)
        HttpSession sesion = request.getSession();
        sesion.setAttribute("usuario", nombre);

        // ✅ Redirigir a la página de sesión
        response.sendRedirect(request.getContextPath() + "/pages/auth/sesion.jsp");
    }
}
