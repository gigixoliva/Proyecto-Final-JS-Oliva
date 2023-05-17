
//llamo al canvas
const grid = document.querySelector('.grid')

//resultados(score)

let resultsDisplay = document.querySelector('.results')

//let globales
let width = 15

let direccion = 1

let aliensID

let direccionDerecha = true

let aliensRemoved = []

let results = 0

//let para luego hacer el jugador (202 quiere decir que va a estar en el div 202)

let jugadorIndex = 202


//loop para crear divs en donde se van a desarrollar los eventos
//appendChild para añadirlos sin necesariamente escribir todos los divs en el html
for (let i = 0; i < 225; i++) {
  const pixeles = document.createElement('div')
  grid.appendChild(pixeles)
}

const pixeles = Array.from(document.querySelectorAll('.grid div'))


//se asigna el orden y cuales van a ser los divs para los aliens

const aliensInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

/*dibuja los aliens
classList para añadir la clase a lo que se está dibujando sin necesidad de 
hacerlo manualmente en el html
el draw a lo ultimo para que se ejecute automaticamente */

function draw() {
  for (let i = 0; i < aliensInvaders.length; i++) {
    if(!aliensRemoved.includes(i)){
     pixeles[aliensInvaders[i]].classList.add('invaders')
    }
  }
} 
draw()

//con esta se remueven para poder setearles movimiento 
function remove() {
  for (let i = 0; i < aliensInvaders.length; i++) {
    pixeles[aliensInvaders[i]].classList.remove('invaders')
  }
} 

//pa que dibuje al jugador, lo posiciona y le añade clase igual que a los aliens anteriormente

pixeles[jugadorIndex].classList.add('jugador')

/*para el movimiento del jugador
con esto le estoy diciendo que lo remueva de la posicion anterior y lo vuelva a 
dibujar
usando switch y break para las direcciones (izq,der) y se
va a mover 1 div a la vez
*/

function moverJugador(e){
  pixeles[jugadorIndex].classList.remove('jugador')
  switch(e.key){
    case 'ArrowLeft':
      if (jugadorIndex % width !==0) jugadorIndex -=1
      break
    case 'ArrowRight':
      if (jugadorIndex % width < width -1) jugadorIndex +=1
     break
  }
  pixeles[jugadorIndex].classList.add('jugador')

}
document.addEventListener('keydown', moverJugador)


/*con esto se mueven los aliens, definiendo los margenes de izq y derecha para hacerlo posible
y tambien que desciendan
siguiendo el mismo metodo del jugador, que se remuevan de un lugar y 
se dibujen en otro
*/


function moverAliens(){
  const margenIzquierdo = aliensInvaders[0] % width === 0
  const margenDerecho = aliensInvaders[aliensInvaders.length-1] % width === width -1
  remove()

  if(margenDerecho && direccionDerecha){
    for (let i = 0; i < aliensInvaders.length; i++) {
      aliensInvaders[i] += width +1 
      direccion = -1
      direccionDerecha = false
    }
  }

  if(margenIzquierdo && !direccionDerecha){
    for (let i= 0; i < aliensInvaders.length; i++){
      aliensInvaders[i] += width
      direccion = 1
      direccionDerecha = true
    }
  }

  for (let i=0; i < aliensInvaders.length; i++){
    aliensInvaders[i] += direccion
  }

  draw()


 if (pixeles[jugadorIndex].classList.contains('invaders', 'jugador')){
  resultsDisplay.innerHTML = 'GAME OVER'
  clearInterval(aliensID)
 }

  for (let i = 0; i <aliensInvaders.length; i++){
     if (aliensInvaders[i] > (pixeles.length)){
     resultsDisplay.innerHTML = 'GAME OVER'
     clearInterval(aliensID)
  }
 }
  if (aliensRemoved.length === aliensInvaders.length){
    resultsDisplay.innerHTML = 'YOU WON!', (results)
    clearInterval(aliensID)
   }

}

//interval para que se ejecute la funcion (hasta ahora no se detiene hasta que toque al jugador)

aliensID = setInterval(moverAliens, 500)

//dibujar proyectiles y que se muevan (100 ms)

function disparar(e){
  let disparoID
  let disparoIndex = jugadorIndex
  function moverDisparo(){
    pixeles[disparoIndex].classList.remove('disparo')
    disparoIndex -= width
    pixeles[disparoIndex].classList.add('disparo')

    if (pixeles[disparoIndex].classList.contains('invaders')){
      pixeles[disparoIndex].classList.remove('disparo')
      pixeles[disparoIndex].classList.remove('invaders')
      pixeles[disparoIndex].classList.add('boom')
      //para eliminar los proyectiles en 3s cuando pasan por los aliens
     setTimeout(() => pixeles[disparoIndex].classList.remove('boom'),250)
     clearInterval(disparoID)
     
     const alienRemoved = aliensInvaders.indexOf(disparoIndex) 
     aliensRemoved.push(alienRemoved)
     results ++ 
     resultsDisplay.innerHTML = results
    }
  }
  switch(e.key){
    case 'ArrowUp':
      disparoID = setInterval(moverDisparo, 100)
  }
}

document.addEventListener('keydown', disparar)
