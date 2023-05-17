
//llamo al canvas
const canvas = document.querySelector('.canvas')

//resultados(score)

let scoreDisplay = document.querySelector('.results')

//let globales para el movimiento
let width = 15

let direccion = 1

aliensID


let direccionDerecha = true

//let para luego hacer el jugador (202 quiere decir que va a estar en el div 202)

let jugadorIndex = 202


//loop para crear divs en donde se van a desarrollar los eventos
//appendChild para añadirlos sin necesariamente escribir todos los divs en el html
for (let i = 0; i < 225; i++) {
  const pixeles = document.createElement('div')
  canvas.appendChild(pixeles)
}

const pixeles = Array.from(document.querySelectorAll('.canvas div'))


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
    pixeles[aliensInvaders[i]].classList.add('invaders')
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

function movimientoJugador(e){
  pixeles[jugadorIndex].classList.remove('jugador')
  switch(e.key){
    case 'izquierdaFlecha':
      if (jugadorIndex % width !==0) jugadorIndex -=1
      break
    case 'derechaFlecha':
      if (jugadorIndex % width < width -1) jugadorIndex +=1
     break
  }
  pixeles[jugadorIndex].classList.add('jugador')

}
document.addEventListener('keydown', movimientoJugador)


/*con esto se mueven los aliens, definiendo los margenes de izq y derecha para hacerlo posible
y tambien que desciendan
siguiendo el mismo metodo del jugador, que se remuevan de un lugar y 
se dibujen en otro
*/


function movimientoAliens(){
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
}

//interval para que se ejecute la funcion (hasta ahora no se detiene)

aliensID = setInterval(movimientoAliens, 350)

//dibujar proyectiles y que se muevan (100 ms)

function disparar(e){
  let proyectil
  let proyectilIndex = jugadorIndex
  function moverDisparo(){
    pixeles[proyectilIndex].classList.remove('disparo')
    proyectilIndex -= width
    pixeles[proyectilIndex].classList.add('disparo')

    if (pixeles[proyectilIndex].classList.contains('invaders')){
      pixeles[proyectilIndex].classList.remove('disparo')
      pixeles[proyectilIndex].classList.remove('invaders')
      pixeles[proyectilIndex].classList.add('boom')
    }
  }
  switch(e.key){
    case 'arribaFlecha':
      proyectil = setInterval(moverDisparo, 100)
  }
}

document.addEventListener('keydown', disparar)
