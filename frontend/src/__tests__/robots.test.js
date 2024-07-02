const fs = require('fs');
const path = require('path');

describe('robots.txt', () => {
    it('should contain the correct directives', () => {
        const robotsPath = path.join(__dirname, '../public/robots.txt');
        const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
        expect(robotsContent).toContain('User-agent: *');
        expect(robotsContent).toContain('Disallow:');
    });
});
