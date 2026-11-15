// Js/dashboard.js
import { auth, db } from './firebase-config.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú desplegable de perfil (arriba a la derecha)
    const profileBtn = document.getElementById('dash-profile-btn');
    const profileDropdown = document.getElementById('dash-profile-dropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', () => {
            profileDropdown.classList.add('hidden');
        });
    }

    // 2. Navegación por pestañas del Feed Comunitario
    const tabBtns = document.querySelectorAll('.dash-tab-btn');
    const tabContents = {
        alertas: document.getElementById('dash-tab-alertas'),
        adopciones: document.getElementById('dash-tab-adopciones'),
        mapa: document.getElementById('dash-tab-mapa')
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('text-orange-600', 'border-orange-600', 'font-bold');
                b.classList.add('text-slate-500', 'border-transparent', 'font-semibold');
            });
            btn.classList.add('text-orange-600', 'border-orange-600', 'font-bold');
            btn.classList.remove('text-slate-500', 'border-transparent', 'font-semibold');

            Object.values(tabContents).forEach(content => content && content.classList.add('hidden'));
            const target = tabContents[btn.dataset.tab];
            if (target) target.classList.remove('hidden');
        });
    });

    // 3. Buscador global instantáneo por raza, color o palabra clave
    const searchInput = document.getElementById('dash-search-input');
    const petCards = document.querySelectorAll('.dash-pet-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            petCards.forEach(card => {
                const text = card.innerText.toLowerCase();
                const keywords = (card.dataset.keywords || '').toLowerCase();
                card.style.display = (text.includes(query) || keywords.includes(query)) ? 'flex' : 'none';
            });
        });
    }

    // 4. Selector de Radio de Búsqueda
    const radiusSelect = document.getElementById('dash-radius-select');
    const mapRadiusText = document.getElementById('dash-map-radius-text');
    if (radiusSelect && mapRadiusText) {
        radiusSelect.addEventListener('change', (e) => {
            mapRadiusText.textContent = e.target.options[e.target.selectedIndex].text;
        });
    }

    // 5. Sincronizar interruptor "Ofrecerse como Hogar Temporal" con Firebase
    const toggleFoster = document.getElementById('dash-toggle-foster');
    if (toggleFoster) {
        toggleFoster.addEventListener('change', async (e) => {
            const disponible = e.target.checked;
            if (auth.currentUser) {
                try {
                    await update(ref(db, `Usuarios/${auth.currentUser.uid}`), {
                        Hogar_Temporal: disponible
                    });
                } catch (err) {
                    console.error("Error al actualizar Hogar Temporal:", err);
                }
            }
        });
    }

    // 6. Botón "Marcar como Resuelto"
    const btnResolved = document.getElementById('btn-mark-resolved');
    if (btnResolved) {
        btnResolved.addEventListener('click', () => {
            btnResolved.textContent = '¡Caso Resuelto! ✔️';
            btnResolved.classList.add('bg-green-100', 'text-green-800', 'border-green-300');
        });
    }
});