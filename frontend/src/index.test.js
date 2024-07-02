const fs = require('fs');
const path = require('path');

describe('index.html', () => {
    it('should contain the correct title and meta tags', () => {
        const indexPath = path.join(__dirname, '../public/index.html');
        const indexContent = fs.readFileSync(indexPath, 'utf-8');
        expect(indexContent).toContain('<title>TooRoo</title>');
        expect(indexContent).toContain('<meta name="viewport" content="width=device-width, initial-scale=1">');
        expect(indexContent).toContain('<meta charset="UTF-8">');
    });
});
