const manifest = require('../public/manifest.json');

describe('Manifest', () => {
    it('should have the correct properties', () => {
        expect(manifest).toHaveProperty('short_name', 'React App');
        expect(manifest).toHaveProperty('name', 'Create React App Sample');
        expect(manifest).toHaveProperty('icons');
        expect(manifest.icons).toBeInstanceOf(Array);
        expect(manifest).toHaveProperty('start_url', '.');
        expect(manifest).toHaveProperty('display', 'standalone');
        expect(manifest).toHaveProperty('theme_color', '#000000');
        expect(manifest).toHaveProperty('background_color', '#ffffff');
    });
});
