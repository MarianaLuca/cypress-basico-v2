/// <reference types="Cypress" /> 



describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function(){
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        //comando q pergunta ao sistema se o title do html é igual 
        // tittle que foi passado no teste
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })

    it('verifica preenchimento e envio do formulário', function(){
        const longTxt = 'orem ipsum dolor sit amet, consectetur adipiscing elit. Sed a massa ut libero congue blandit. Donec ultrices vitae magna a varius. Suspendisse mattis massa sapien,'
        
        cy.clock()

        cy.get('#firstName').type('teste')
        cy.get('#lastName').type('testando')
        cy.get('#email').type('teste@teste.com')
        cy.get('#open-text-area').type(longTxt, {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.clock()
        cy.get('#firstName').type('teste')
        cy.get('#lastName').type('testando')
        cy.get('#email').type('email.com', {delay: 0})
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })
    
    
    Cypress._.times(3, function(){

        it('campo telefone continua vazio quando o valor sor nao-numerico', function(){
            cy.get('#phone')
                .type('abcde')
                .should('have.value', '')    
        })

    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.clock()
        cy.get('#firstName').type('teste')
        cy.get('#lastName').type('testando')
        cy.get('#email').type('teste@teste.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })
    
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
       cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function(){
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')

        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product')
            .select('YouTube')
            .should('have.value','youtube')
        
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product')
        .select('mentoria')
        .should('have.value','mentoria')
        
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product')
            .select(1)
            .should('have.value','blog')
        
    })
    
    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value','feedback')
    })

    it('seleciona todos as opçoes do radio', function(){
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
        .check()
        .last()
        .uncheck()
    })
    
    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')

            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
            
    })

    it('seleciona um arquivo da pasta fixtures(com drag-drop)', function(){
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json',{action: "drag-drop"})

            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })     
    })

    it('seleciona um arquivo da pasta fixtures(com alias)', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('@sampleFile')

            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })     
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr','target','_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr','target')
            .click()  
        cy.contains('Talking About Testing').should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
        //valida se a msg nao esta visivel
          .should('not.be.visible')
          //(invoca)mostra a mensagem
          .invoke('show')
          //valida se a msg esta visivel
          .should('be.visible')
          // valida se a mensagem contem o seguinte texto
          .and('contain', 'Mensagem enviada com sucesso.')
          // (invoca)esconde a mensagem
          .invoke('hide')
          //valida se a msg nao esta visivel
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

      it('preeenche area de texto usando invoke', function(){
        const longTxt = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
        .invoke('val', longTxt)
        .should('have.value', longTxt)
      })

      it('faz uma requisicao HTTP', function(){
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response){
                const {status, statusText, body} = response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })
      })

      it.only('acha o gato', function(){
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text','CAT TAT')
        cy.get('#subtitle')
            .invoke('text', 'EU 💚 GATOS')
      })

    
})


/*

 it('', function(){
        
    })

*/
