// fuzzy match
const Busqueda = {
    // algoritmo de Levenshtein
    getDistance: function (a, b) {
        const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = b[i - 1] === a[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return matrix[b.length][a.length];
    },

    fuzzy: function (query, target) {
        if (!query) return true;

        const q = query.toLowerCase().trim();
        const t = target.toLowerCase().trim();

        if (t.includes(q)) return true;

        const targetWords = t.split(/\s+/);
        const queryWords = q.split(/\s+/);

        return queryWords.every(qw => {
            return targetWords.some(tw => {
                const tolerance = tw.length > 4 ? 2 : 1;
                return this.getDistance(qw, tw) <= tolerance;
            });
        });
    },

    filterNews: function (newsArray, query) {
        if (!query) return newsArray;
        return newsArray.filter(item => this.fuzzy(query, item.title));
    }
};

window.Busqueda = Busqueda;
