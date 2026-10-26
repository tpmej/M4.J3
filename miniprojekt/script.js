document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Blokuje domyślne przeładowanie strony

  // 1. Pobieramy wartości z pól
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const status = document.getElementById('status');

  // 2. Walidacja w JS (czy pola nie są puste)
  if (!name || !email || !message) {
    status.className = 'err';
    status.innerText = 'Wypełnij wszystkie pola!';
    return;
  }

  // 3. Wysyłka fetch() do PHP
  try {
    const response = await fetch('process.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    // 4. Obsługa odpowiedzi z serwera
    if (result.status === 'success') {
      status.className = 'ok';
      status.innerText = result.message;
      document.getElementById('contactForm').reset(); // Czyści formularz
    } else {
      status.className = 'err';
      status.innerText = result.message;
    }
  } catch (error) {
    status.className = 'err';
    status.innerText = 'Błąd połączenia z serwerem!';
  }
});