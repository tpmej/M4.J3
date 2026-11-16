(() => {
  'use strict';

  const API_URL = 'api/reservations.php';
  const THEME_STORAGE_KEY = 'smart_office_theme';

  const state = {
    resources: [],
    reservations: [],
    selectedResourceId: null,
  };

  const els = {
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    themeLabel: document.getElementById('theme-label'),

    filterDate: document.getElementById('filter-date'),
    filterStart: document.getElementById('filter-start'),
    filterEnd: document.getElementById('filter-end'),
    filterStatusText: document.getElementById('filter-status-text'),

    officeGrid: document.getElementById('office-grid'),
    availabilityCounter: document.getElementById('availability-counter'),

    reservationsTbody: document.getElementById('reservations-tbody'),
    reservationsCounter: document.getElementById('reservations-counter'),

    icsBanner: document.getElementById('ics-banner'),
    icsBannerDetails: document.getElementById('ics-banner-details'),
    icsDownloadLink: document.getElementById('ics-download-link'),
    icsBannerClose: document.getElementById('ics-banner-close'),

    modal: document.getElementById('booking-modal'),
    modalClose: document.getElementById('modal-close'),
    modalCancel: document.getElementById('modal-cancel'),
    bookingForm: document.getElementById('booking-form'),
    bookingResourceId: document.getElementById('booking-resource-id'),
    modalResourceType: document.getElementById('modal-resource-type'),
    modalTitle: document.getElementById('modal-title'),
    modalResourceName: document.getElementById('modal-resource-name'),
    modalResourceCapacity: document.getElementById('modal-resource-capacity'),
    bookingUserName: document.getElementById('booking-user-name'),
    bookingDate: document.getElementById('booking-date'),
    bookingStart: document.getElementById('booking-start'),
    bookingEnd: document.getElementById('booking-end'),
    modalError: document.getElementById('modal-error'),
    modalSubmit: document.getElementById('modal-submit'),

    toastContainer: document.getElementById('toast-container'),
  };

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(activeTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (theme === 'dark') {
      els.themeIcon.textContent = '☀️';
      els.themeLabel.textContent = 'Tryb jasny';
    } else {
      els.themeIcon.textContent = '🌙';
      els.themeLabel.textContent = 'Tryb ciemny';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function initDefaultDateTime() {
    const now = new Date();
    const todayStr = formatDateLocal(now);

    els.filterDate.min = todayStr;
    els.bookingDate.min = todayStr;

    const targetDate = new Date(now);
    let startHour = now.getHours() + 1;

    if (startHour >= 18) {
      targetDate.setDate(targetDate.getDate() + 1);
      startHour = 9;
    }

    const endHour = Math.min(startHour + 2, 22);

    els.filterDate.value = formatDateLocal(targetDate);
    els.filterStart.value = `${String(startHour).padStart(2, '0')}:00`; els.filterEnd.value = `${String(endHour).padStart(2, '0')}:00`;
  }

  function formatDateLocal(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; }  async function loadAvailability() { const date = els.filterDate.value; const start = els.filterStart.value; const end = els.filterEnd.value;  if (!date \vert{}\vert{} !start \vert{}\vert{} !end) { return; }  if (end <= start) { els.filterStatusText.textContent = 'Godzina zakończenia musi być późniejsza niż rozpoczęcia.'; showToast('Godzina zakończenia musi być późniejsza niż rozpoczęcia.', 'warning'); return; }  const startDateTime = `${date} ${start}`; const endDateTime = `${date} ${end}`;  els.filterStatusText.textContent = `Przedział: ${date} (${start} –${end})`;

    try {
      const params = new URLSearchParams({
        start: startDateTime,
        end: endDateTime,
      });

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Błąd podczas pobierania dostępności.');
      }

      state.resources = data.resources || [];
      state.reservations = data.reservations || [];

      renderOfficeGrid();
      renderReservationsTable();
    } catch (error) {
      showToast(error.message || 'Błąd komunikacji z serwerem.', 'error');
    }
  }

  function renderOfficeGrid() {
    els.officeGrid.innerHTML = '';

    if (state.resources.length === 0) {
      els.officeGrid.innerHTML = '<p class="empty-state">Brak zdefiniowanych stanowisk w bazie danych.</p>';
      els.availabilityCounter.textContent = '0 / 0 wolnych';
      return;
    }

    const freeCount = state.resources.filter((r) => !r.is_occupied).length;
    els.availabilityCounter.textContent = `${freeCount} /${state.resources.length} wolnych`;

    let corridorInserted = false;

    state.resources.forEach((resource) => {
      if (resource.type === 'desk' && !corridorInserted) {
        const corridor = document.createElement('div');
        corridor.className = 'office-corridor';
        corridor.textContent = 'Korytarz główny • Strefa Open Space';
        els.officeGrid.appendChild(corridor);
        corridorInserted = true;
      }

      const isOccupied = Boolean(resource.is_occupied);
      const isSelected = state.selectedResourceId === resource.id && !isOccupied;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = [
        'resource-card',
        resource.type === 'room' ? 'type-room' : 'type-desk',
        isOccupied ? 'status-occupied' : isSelected ? 'status-selected' : 'status-free',
      ].join(' ');

      btn.setAttribute('aria-disabled', isOccupied ? 'true' : 'false');
      btn.dataset.id = String(resource.id);

      const kindLabel = resource.type === 'room' ? 'Sala konferencyjna' : 'Biurko';
      const statusText = isOccupied ? '⛔ Zajęte' : isSelected ? '🔵 Wybrane' : '✅ Wolne';

      btn.innerHTML = `
        <div class="resource-top">
          <span class="resource-kind">${kindLabel}</span>
          <span class="resource-capacity">👤 ${resource.capacity} os.</span>
        </div>
        <div class="resource-name"></div>
        <div class="resource-status-badge">${statusText}</div>
      `;

      btn.querySelector('.resource-name').textContent = resource.name;

      btn.addEventListener('click', () => {
        if (isOccupied) {
          showToast(`Stanowisko "${resource.name}" jest już zajęte w wybranym terminie.`, 'error');
          return;
        }
        openBookingModal(resource);
      });

      els.officeGrid.appendChild(btn);
    });
  }

  function renderReservationsTable() {
    els.reservationsTbody.innerHTML = '';
    els.reservationsCounter.textContent = `${state.reservations.length} rezerwacji`;  if (state.reservations.length === 0) { const tr = document.createElement('tr'); tr.innerHTML = '<td colspan="6" class="empty-state">Brak aktywnych lub nadchodzących rezerwacji.</td>'; els.reservationsTbody.appendChild(tr); return; }  state.reservations.forEach((res) => { const tr = document.createElement('tr');  const tdId = document.createElement('td'); tdId.textContent = `#${res.id}`;

      const tdResource = document.createElement('td');
      const strongName = document.createElement('strong');
      strongName.textContent = res.resource_name;
      tdResource.appendChild(strongName);

      const tdUser = document.createElement('td');
      tdUser.textContent = res.user_name;

      const tdStart = document.createElement('td');
      tdStart.textContent = res.start_time;

      const tdEnd = document.createElement('td');
      tdEnd.textContent = res.end_time;

      const tdActions = document.createElement('td');
      const actionsBox = document.createElement('div');
      actionsBox.className = 'action-buttons';

      const icsLink = document.createElement('a');
      icsLink.href = `api/ics.php?id=${encodeURIComponent(res.id)}`; icsLink.className = 'btn btn-ics-sm'; icsLink.download = 'rezerwacja.ics'; icsLink.textContent = '📅 .ics'; icsLink.title = 'Pobierz plik kalendarza iCalendar';  const cancelBtn = document.createElement('button'); cancelBtn.type = 'button'; cancelBtn.className = 'btn btn-danger-sm'; cancelBtn.textContent = 'Anuluj'; cancelBtn.addEventListener('click', () => handleDeleteReservation(res));  actionsBox.appendChild(icsLink); actionsBox.appendChild(cancelBtn); tdActions.appendChild(actionsBox);  tr.append(tdId, tdResource, tdUser, tdStart, tdEnd, tdActions); els.reservationsTbody.appendChild(tr); }); }  function openBookingModal(resource) { state.selectedResourceId = resource.id; renderOfficeGrid();  els.bookingResourceId.value = String(resource.id); els.modalResourceType.textContent = resource.type === 'room' ? 'Sala konferencyjna' : 'Stanowisko biurkowe'; els.modalTitle.textContent = `Rezerwacja: ${resource.name}`;
    els.modalResourceName.textContent = resource.name;
    els.modalResourceCapacity.textContent = `${resource.capacity}${resource.capacity === 1 ? 'osoba' : 'osób'}`;

    els.bookingDate.value = els.filterDate.value;
    els.bookingStart.value = els.filterStart.value;
    els.bookingEnd.value = els.filterEnd.value;

    hideModalError();
    els.modal.classList.remove('hidden');
    els.bookingUserName.focus();
  }

  function closeBookingModal() {
    els.modal.classList.add('hidden');
    state.selectedResourceId = null;
    hideModalError();
    renderOfficeGrid();
  }

  function showModalError(message) {
    els.modalError.textContent = message;
    els.modalError.classList.remove('hidden');
  }

  function hideModalError() {
    els.modalError.textContent = '';
    els.modalError.classList.add('hidden');
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();
    hideModalError();

    const resourceId = Number(els.bookingResourceId.value);
    const userName = els.bookingUserName.value.trim();
    const date = els.bookingDate.value;
    const start = els.bookingStart.value;
    const end = els.bookingEnd.value;

    if (userName.length < 3) {
      showModalError('Imię i nazwisko musi zawierać co najmniej 3 znaki.');
      els.bookingUserName.focus();
      return;
    }

    if (!date || !start || !end) {
      showModalError('Uzupełnij datę oraz godziny rozpoczęcia i zakończenia.');
      return;
    }

    if (end <= start) {
      showModalError('Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.');
      return;
    }

    const startDateTimeObj = new Date(`${date}T${start}:00`);
    const now = new Date();
    now.setSeconds(0, 0);

    if (Number.isNaN(startDateTimeObj.getTime()) || startDateTimeObj < now) {
      showModalError('Nie można dokonać rezerwacji na termin z przeszłości.');
      return;
    }

    const payload = {
      resource_id: resourceId,
      user_name: userName,
      start_time: `${date}${start}`,
      end_time: `${date}${end}`,
    };

    els.modalSubmit.disabled = true;
    els.modalSubmit.textContent = 'Zapisywanie...';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          showModalError(data.message || 'Wybrany termin koliduje z inną rezerwacją.');
          showToast(data.message || 'Konflikt terminów (409 Conflict).', 'error');
          await loadAvailability();
          return;
        }
        throw new Error(data.message || 'Nie udało się zapisać rezerwacji.');
      }

      els.filterDate.value = date;
      els.filterStart.value = start;
      els.filterEnd.value = end;

      const resourceLabel = els.modalResourceName.textContent;
      closeBookingModal();
      showToast(data.message || 'Rezerwacja została utworzona!', 'success');

      if (data.reservation_id) {
        els.icsDownloadLink.href = data.ics_url || `api/ics.php?id=${data.reservation_id}`; els.icsBannerDetails.textContent = `${resourceLabel} • ${date} (${start} – ${end}) •${userName}`;
        els.icsBanner.classList.remove('hidden');
      }

      await loadAvailability();
    } catch (error) {
      showModalError(error.message || 'Wystąpił błąd podczas zapisu rezerwacji.');
      showToast(error.message || 'Błąd zapisu rezerwacji.', 'error');
    } finally {
      els.modalSubmit.disabled = false;
      els.modalSubmit.textContent = 'Potwierdź rezerwację';
    }
  }

  async function handleDeleteReservation(reservation) {
    const confirmed = window.confirm(
      `Czy na pewno chcesz anulować rezerwację #${reservation.id} (${reservation.resource_name},${reservation.start_time})?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}?id=${encodeURIComponent(reservation.id)}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Nie udało się anulować rezerwacji.');
      }

      showToast(data.message || 'Rezerwacja została anulowana.', 'success');
      await loadAvailability();
    } catch (error) {
      showToast(error.message || 'Błąd podczas usuwania rezerwacji.', 'error');
    }
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'icon-btn';
    closeBtn.style.fontSize = '1.2rem';
    closeBtn.setAttribute('aria-label', 'Zamknij powiadomienie');
    closeBtn.textContent = '×';

    const dismiss = () => {
      toast.classList.add('toast-closing');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    closeBtn.addEventListener('click', dismiss);
    toast.append(textSpan, closeBtn);
    els.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.isConnected) {
        dismiss();
      }
    }, 4500);
  }

  function bindEvents() {
    els.themeToggle.addEventListener('click', toggleTheme);

    els.filterDate.addEventListener('change', loadAvailability);
    els.filterStart.addEventListener('change', loadAvailability);
    els.filterEnd.addEventListener('change', loadAvailability);

    els.modalClose.addEventListener('click', closeBookingModal);
    els.modalCancel.addEventListener('click', closeBookingModal);
    els.modal.addEventListener('click', (e) => {
      if (e.target === els.modal) {
        closeBookingModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.modal.classList.contains('hidden')) {
        closeBookingModal();
      }
    });

    els.bookingForm.addEventListener('submit', handleBookingSubmit);

    els.icsBannerClose.addEventListener('click', () => {
      els.icsBanner.classList.add('hidden');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDefaultDateTime();
    bindEvents();
    loadAvailability();
  });
})();