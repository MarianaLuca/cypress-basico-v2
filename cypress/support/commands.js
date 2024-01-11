Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('teste')
    cy.get('#lastName').type('testando')
    cy.get('#email').type('teste@teste.com')
    cy.get('#open-text-area').type('teste teste')
    cy.contains('button', 'Enviar').click()
})
