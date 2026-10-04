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

    // Carousel de beneficios
    $('.carousel-benefits').each(function () {
        const $carousel = $(this);
        const $track = $carousel.find('.carousel-track');
        const $prev = $carousel.find('.prev');
        const $next = $carousel.find('.next');
        const track = $track[0];
 
        // Distancia de un desplazamiento = ancho de una card + gap
        function getStep() {
            const card = $track.children('.card-product')[0];
            const gap = parseFloat($track.css('column-gap')) || 0;
            return card.getBoundingClientRect().width + gap;
        }
 
        // Centra los botones verticalmente respecto a la imagen
        function alignButtons() {
            const imgHeight = $track.find('.card-img-top').first().outerHeight();
            $carousel[0].style.setProperty('--btn-top', (imgHeight / 2) + 'px');
        }
 
        // Deshabilita los botones al llegar al inicio o al final
        function updateState() {
            const max = track.scrollWidth - track.clientWidth - 1;
            $prev.prop('disabled', track.scrollLeft <= 0);
            $next.prop('disabled', track.scrollLeft >= max);
        }
 
        $prev.on('click', function () {
            track.scrollBy({ left: -getStep() });
        });
 
        $next.on('click', function () {
            track.scrollBy({ left: getStep() });
        });
 
        $track.on('scroll', updateState);
 
        $track.on('keydown', function (e) {
            if (e.key === 'ArrowRight') $next.trigger('click');
            if (e.key === 'ArrowLeft') $prev.trigger('click');
        });
 
        $(window).on('resize', function () {
            alignButtons();
            updateState();
        });
 
        $track.find('img').on('load', alignButtons);
 
        alignButtons();
        updateState();
    });
    // End carousel de beneficios
});