async function fetchWithCache(url, ttlMs) {
  const cachedRaw = localStorage.getItem(url);
  let cachedData = null;

  if (cachedRaw) {
    try {
      cachedData = JSON.parse(cachedRaw);
      const isFresh = Date.now() - cachedData.timestamp < ttlMs;
      
      // Jeśli dane są aktualne, zwróć je z pamięci podręcznej
      if (isFresh) {
        return cachedData.data;
      }
    } catch (err) {
      // W przypadku uszkodzonych danych w localStorage, usuwamy je
      localStorage.removeItem(url);
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Błąd HTTP! Status: ${response.status}`);
    }

    const data = await response.json();
    const cachePayload = {
      timestamp: Date.now(),
      data
    };

    localStorage.setItem(url, JSON.stringify(cachePayload));
    return data;
  } catch (error) {
    // Brak sieci/błąd pobierania – awaryjny powrót do przestarzałego cache
    if (cachedData && cachedData.data) {
      console.warn("Brak połączenia sieciowego. Zwrócono przestarzałe dane z cache:", error);
      return cachedData.data;
    }
    
    throw error;
  }
}