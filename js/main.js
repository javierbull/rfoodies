"use strict";

$(document).ready(function () {
    // Mostrar y ocultar contraseña
    $('.toggle-password-icon').on('click', function () {
        const $icon = $(this);
        const $passwordInput = $icon.closest('.password-input-wrapper').find('input');

        const isPassword = $passwordInput.attr('type') === 'password';
        $passwordInput.attr('type', isPassword ? 'text' : 'password');
        $icon.attr('name', isPassword ? 'eye-off-outline' : 'eye-outline');
    });
    // End mostrar y ocultar contraseña
});