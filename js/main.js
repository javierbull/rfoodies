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
    $('.carousel-cards').each(function () {
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

    // Galería de ganadores
    const $gallery = $('.winners-gallery');

    $gallery.children().each(function () {
        $(this).clone().attr('aria-hidden', 'true').appendTo($gallery);
    });
    // End galeria de ganadores

    // Video receta destacada
    // Extrae el ID desde cualquier formato de link de YouTube
    function obtenerIdYoutube(url) {
        if (!url) return null;
        const patron = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/;
        const coincidencia = url.match(patron);
        return coincidencia ? coincidencia[1] : null;
    }

    $('.video').each(function () {
        const $video = $(this);
        const url = $video.data('video-url');
        const titulo = $video.data('video-title') || 'Video de YouTube';
        const id = obtenerIdYoutube(url);

        // Guarda el estado inicial (portada + botón) para poder restaurarlo
        $video.data('original', $video.html());

        $video.on('click', function () {
            if ($video.hasClass('reproduciendo')) return;

            if (!id) {
                console.error('El link de YouTube no es válido:', url);
                return;
            }

            // Restaura los otros videos a su estado inicial (solo uno a la vez)
            $('.video.reproduciendo').not($video).each(function () {
                const $otro = $(this);
                $otro.removeClass('reproduciendo').html($otro.data('original'));
            });

            const $iframe = $('<iframe>', {
                src: 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1',
                title: titulo,
                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
                referrerpolicy: 'strict-origin-when-cross-origin',
                allowfullscreen: true
            });

            $video.empty().addClass('reproduciendo').append($iframe);
        });
    });
    // End video receta destacada

    // Página de recetas: filtro por categoría + buscador
    const $recetasGrid = $('#recipesGrid');

    if ($recetasGrid.length) {
        const $tarjetas = $recetasGrid.children('.recipe-card');
        const $chips = $('.recipe-filters .chip');
        const $input = $('#recipeSearchInput');
        const $vacio = $('#recipesEmpty');
        let categoriaActiva = 'todas';

        // Ignora mayúsculas y tildes ("pasta" encuentra "Pásta")
        function normalizar(texto) {
            return (texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        }

        function filtrarRecetas() {
            const termino = normalizar($input.val());
            let visibles = 0;

            $tarjetas.each(function () {
                const $tarjeta = $(this);
                const categorias = ($tarjeta.data('categories') || '').toString().split(' ');
                const titulo = normalizar($tarjeta.find('.card-title').text());

                const coincideCategoria = categoriaActiva === 'todas' || categorias.includes(categoriaActiva);
                const coincideTexto = !termino || titulo.includes(termino);
                const mostrar = coincideCategoria && coincideTexto;

                $tarjeta.prop('hidden', !mostrar);
                if (mostrar) visibles++;
            });

            $vacio.prop('hidden', visibles > 0);
        }

        $chips.on('click', function () {
            const $chip = $(this);
            categoriaActiva = $chip.data('category');

            $chips.removeClass('active').attr('aria-pressed', 'false');
            $chip.addClass('active').attr('aria-pressed', 'true');

            filtrarRecetas();
        });

        $input.on('input', filtrarRecetas);

        $('#recipeSearch').on('submit', function (e) {
            e.preventDefault();
            filtrarRecetas();
        });
    }
    // End página de recetas
});