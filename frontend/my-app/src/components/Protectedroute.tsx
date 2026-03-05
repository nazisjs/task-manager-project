import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ✅ Компонент для защиты маршрутов
 * Если нет токена в localStorage → редирект на /login
 * Если токен есть → показываем страницу
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem("access");

    if (!token) {
        // Нет токена → редирект на логин
        return <Navigate to="/login" replace />;
    }

    // Есть токен → показываем страницу
    return <>{children}</>;
};