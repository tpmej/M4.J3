document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamiczny licznik znaków (limit 300)
    const descriptionInput = document.getElementById('description');
    const charCounter = document.getElementById('charCounter');
    const MAX_CHARS = 300;

    if (descriptionInput && charCounter) {
        const updateCounter = () => {
            const currentLength = descriptionInput.value.length;
            charCounter.textContent = `${currentLength} / ${MAX_CHARS}`;
            charCounter.classList.toggle('limit-near', currentLength >= 270);
        };

        descriptionInput.addEventListener('input', updateCounter);
        updateCounter();
    }

    // 2. Walidacja formularza przed wysłaniem
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        const roomInput = document.getElementById('room');
        const titleInput = document.getElementById('title');
        const roomError = document.getElementById('roomError');
        const titleError = document.getElementById('titleError');
        const descError = document.getElementById('descError');

        ticketForm.addEventListener('submit', (event) => {
            let isValid = true;

            roomError.textContent = '';
            titleError.textContent = '';
            descError.textContent = '';

            if (roomInput.value.trim() === '') {
                roomError.textContent = 'Podaj numer sali lub lokalizację.';
                isValid = false;
            }

            if (titleInput.value.trim().length < 5) {
                titleError.textContent = 'Tytuł musi zawierać co najmniej 5 znaków.';
                isValid = false;
            }

            if (descriptionInput.value.trim() === '') {
                descError.textContent = 'Opis usterki nie może być pusty.';
                isValid = false;
            } else if (descriptionInput.value.length > MAX_CHARS) {
                descError.textContent = 'Opis przekracza limit 300 znaków.';
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
            }
        });
    }

    // 3. Filtrowanie i wyszukiwanie zgłoszeń na żywo (DOM)
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const ticketCards = document.querySelectorAll('.ticket-card');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let currentStatusFilter = 'all';

    const filterTickets = () => {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        let visibleCount = 0;

        ticketCards.forEach((card) => {
            const cardStatus = card.dataset.status || '';
            const cardText = card.textContent.toLowerCase();

            const matchesStatus = currentStatusFilter === 'all' || cardStatus === currentStatusFilter;
            const matchesSearch = query === '' || cardText.includes(query);

            if (matchesStatus && matchesSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (noResultsMessage && ticketCards.length > 0) {
            noResultsMessage.classList.toggle('hidden', visibleCount > 0);
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterTickets);
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            currentStatusFilter = button.dataset.filter || 'all';
            filterTickets();
        });
    });

    // 4. Potwierdzenie usunięcia zamkniętego zgłoszenia
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            const confirmed = confirm('Czy na pewno chcesz trwale usunąć to zgłoszenie?');
            if (!confirmed) {
                event.preventDefault();
            }
        });
    });
});