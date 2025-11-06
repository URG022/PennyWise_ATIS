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
 * @author Sarai Villalta
 */

@WebServlet("/registroServlet")
public class registroServlet extends HttpServlet {

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

        // Redirigir al presupuesto
        response.sendRedirect(request.getContextPath() + "/pages/presupuestoPrueba.jsp");
    }
}
