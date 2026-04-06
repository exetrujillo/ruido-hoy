// Para poder subir noticias en markdown simple
const MarkdownParser = {
    parse: function (text) {
        if (!text) return '';

        let html = text
            // Bold: **texto**
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italics: *texto*
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Headers: # Titulos
            .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
            .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>');

        const lines = html.split('\n');
        return lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            if (/^<h[1-6]>/.test(trimmed)) return trimmed;
            return `<p class="mb-3">${trimmed}</p>`;
        }).join('');
    },

    truncate: function (text, limit = 120) {
        if (!text) return '';
        let plain = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/^#+ /gim, '');

        if (plain.length <= limit) return this.parse(plain);
        return this.parse(plain.substring(0, limit) + '...');
    }
};

window.MarkdownParser = MarkdownParser;
