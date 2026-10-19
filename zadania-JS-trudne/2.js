// 1. Funkcja wyższego rzędu debounce
function debounce(fn, delay) {
  let timerId = null;
  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 2. Obsługa zapytania z AbortController i renderowaniem przez DocumentFragment
let currentAbortController = null;

async function searchProducts(query) {
  // Anulowanie poprzedniego, trwającego zapytania HTTP
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();

  if (!query.trim()) {
    renderList([]);
    return;
  }

  try {
    const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`, {
      signal: currentAbortController.signal
    });

    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych");
    }

    const products = await response.json();
    renderList(products);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Poprzednie zapytanie zostało anulowane.');
    } else {
      console.error('Błąd zapytania wyszukiwania:', error);
    }
  }
}

function renderList(products) {
  const container = document.getElementById('results-list');
  container.innerHTML = '';

  // Wydajne budowanie drzewa DOM za pomocą DocumentFragment
  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const li = document.createElement('li');
    li.textContent = product.name;
    fragment.appendChild(li);
  });

  container.appendChild(fragment);
}

// Podpięcie pod pole input
const searchInput = document.getElementById('search-input');
if (searchInput) {
  const handleInput = debounce((e) => searchProducts(e.target.value), 400);
  searchInput.addEventListener('input', handleInput);
}