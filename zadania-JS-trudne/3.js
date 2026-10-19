function analyzeTransactions(data) {
  const result = data.reduce((acc, { status, amount, user, category }) => {
    if (status !== "completed") return acc;

    // Agregacja kwoty całkowitej
    acc.totalCompletedAmount += amount;

    // Agregacja kwoty per użytkownik
    acc.usersSummary[user] = (acc.usersSummary[user] || 0) + amount;

    // Pomocnicza agregacja per kategoria
    acc._categories[category] = (acc._categories[category] || 0) + amount;

    return acc;
  }, {
    totalCompletedAmount: 0,
    usersSummary: {},
    _categories: {}
  });

  // Wyznaczenie kategorii o największym przychodzie
  let topCategory = null;
  let maxRevenue = -1;

  for (const [cat, rev] of Object.entries(result._categories)) {
    if (rev > maxRevenue) {
      maxRevenue = rev;
      topCategory = cat;
    }
  }

  delete result._categories;

  return {
    ...result,
    topCategory
  };
}