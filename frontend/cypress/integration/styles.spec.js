describe('Visual Regression Test', () => {
    it('should match the visual snapshot for the home page', () => {
        cy.visit('/');
        cy.document().toMatchImageSnapshot();
    });
});
