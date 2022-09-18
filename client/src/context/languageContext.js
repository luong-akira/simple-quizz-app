import React, { createContext } from "react";

export const data = {
    vn: {
        Languages: "Tieng viet",
        Hello: "Xin chào",
        Home: "Trang chủ",
        Login: "Đăng nhập",
        Register: "Đăng ký",
        Search: "Tìm Kiếm",
        Username: "Tên đăng nhập",
        Password: "Mật khẩu",
        Login_with_google: "Đăng nhập với google",
        Register: "Đăng ký",
        Dont_have_an_account: "Chưa có tài khoản",
        Logout: "Đăng xuất",
        Name: "Tên",
        Confirm_Password: "Gõ lại mật khẩu",
    },
    en: {
        Languages: "English",
        Hello: "Hello",
        Home: "Home",
        Login: "Login",
        Register: "Register",
        Search: "Search",
        Username: "Username",
        Password: "Password",
        Login_with_google: "Login with google",
        Register: "Register",
        Dont_have_an_account: "Don't have an account",
        Logout: "Logout",
        Name: "Name",
        Confirm_Password: "Confirm Password",
    },
};
export const LanguageContext = createContext(null);
