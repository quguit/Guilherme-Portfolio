// comentarios

// Variables
const mensagem = "uma string"

//tipo de dado
   // string: "", '', ``
   // number: 1, 2, 3, 4, 5
   // boolean: true, false
   // undefined
   // null
   // object:
      // array: []
      // object: {}
      // function: function(){}

// operadores
   // aritmeticos: +, -, *, /, %
   // atribuição: =
   // comparação: ==, ===, !=, !==, >, <, >=, <=
   // lógicos: &&, ||, !
   // ternário: ?:

//Objetos {}
    const elemento = {
        altura: 100,
        largura: 200,
        cor: 'white',
        data: new Date(),
        finalizada: true,
    }

// arrow function
    const soma = (a, b) => a + b
    // retorn uma alteração direto na section criada no html, substitui o innerHTML
    const criarElemento = (elemento) => {

        let input = '<input type="checkbox" '
        if(elemento.finalizada) input = input + 'checked'
        input = input + '>'
        return `
        <div>
            ${input}
            <span>${atividade.altura}</span>
            <time>${atividade.data}</time>
        </div>
        `
    }

const section = document.querySelector('section')
section.innerHTML = criarElemento(elemento)

// lista, array, vetor []
    const atividades = [
        elemento,
        {
            altura: 200,
            largura: 300,
            cor: 'black',
            data: new Date(),
            finalizada: false,
        },
        {
            altura: 300,
            largura: 400,
            cor: 'red',
            data: new Date(),
            finalizada: true,
        },
    ]

    section.innerHTML = criarElemento(atividades[0])
    section.innerHTML = criarElemento(atividades[1])

    //estrutura de repetição 
    for(let i = 0; i < atividades.length; i++) {
        section.innerHTML = criarElemento(atividades[i])
        // deste modo ele vai apagar o anterior e adicionar o novo
    }
    for(let atividade of atividades) {
        section.innerHTML = section.innerHTML + criarElemento(atividade)
        // deste modo vai incrementar a lista no html, ou seja concatena
    }