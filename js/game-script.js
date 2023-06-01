//window on load para poder poner el script en el head

window.addEventListener('load', (event) =>{
  //botonstart
  function startGame(){
      //llamo al canvas
      const grid = document.querySelector('.grid')
  
      //resultados
      let resultsDisplay = document.querySelector('.results')
      //score
      let scoreDisplay = document.querySelector('.score')
  
      //let globales
      let width = 15
  
      let direccion = 1
  
      let aliensID
   
      let direccionDerecha = true
  
      let aliensRemoved = []
  
      let results = 0
  
      //let para luego hacer el jugador (202 quiere decir que va a estar en el div 202 de 224)
  
      let jugadorIndex = 202
  
  
      //for para crear divs desde js a html en donde se van a desarrollar los eventos
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
      hacerlo manualmente en el html*/

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
  

  
      //para que dibuje al jugador, lo posiciona y le añade clase igual que a los aliens anteriormente
  
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
  
  
      /*se mueven los aliens, definiendo los margenes de izq y derecha para hacerlo posible
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
  
          /*condiciones para ganar o perder (si el jugador/alien se chocan en un solo lugar, 
          se pierde/si aún quedan aliens y llegan hasta el margen de abajo también)*/
  
       if (pixeles[jugadorIndex].classList.contains('invaders', 'jugador')){
          resultsDisplay.innerHTML = 'GAME OVER'
          clearInterval(aliensID)
          clearTimer()
          }
  
       for (let i = 0; i <aliensInvaders.length; i++){
          if (aliensInvaders[i] > (pixeles.length)){
              resultsDisplay.innerHTML = 'GAME OVER'
              clearInterval(aliensID)
              clearTimer()
              }
          }
          if (aliensRemoved.length === aliensInvaders.length){
              resultsDisplay.innerHTML = 'YOU WON!', (results)
              clearInterval(aliensID)
              clearTimer()
          }
  
      }
  
      aliensID = setInterval(moverAliens, 500)
  
      /*dibujar proyectiles y que se muevan (250 ms)
      se hace lo mismo como con el jugador y los aliens, se dibujan
      */
  
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
                  //para eliminar los proyectiles en 2.5s cuando pasan por los aliens
                  setTimeout(() => pixeles[disparoIndex].classList.remove('boom'),250)
                  clearInterval(disparoID)
  
                  /*sumar 1 cada vez que un alien se remueve y modificar el texto en 
                  <h1> en html con results y resultsDisplay*/
       
                  const alienRemoved = aliensInvaders.indexOf(disparoIndex) 
                  aliensRemoved.push(alienRemoved)
                  results ++ 
                  scoreDisplay.innerHTML = results
              }
           //tecla de flecha arriba para disparar en 100ms
          }
          switch(e.key){
             case 'ArrowUp':
              disparoID = setInterval(moverDisparo, 100)
          }
      }
      //que se ejecute con un evento(tecla)
      document.addEventListener('keydown', disparar)
  
  }
  /*get element para llamar al boton y le añado un evento, y que cuando clickeo
  corra el código de arriba, despues const para desactivarlo una vez que se haya clickeado
  ya que si no se siguen dibujando los objetos si se sigue haciendo click
  en el boton start(vuelve a correr el código sobre lo que ya había)
  */
  document.getElementById("startBtn").addEventListener("click", startGame)
  const boton = document.getElementById("startBtn")
  const desactivarBtn = () => {
  boton.disabled = true
  }
  boton.addEventListener('click', desactivarBtn)

  //timer
  let minutesCount = 0
  let secondsCount = 0
  let milisecondsCount = 0
  minutes = document.getElementById("minutes")
  seconds = document.getElementById("seconds")
  miliseconds = document.getElementById("miliseconds")

  function startTimer(){
 minutessetInterval = setInterval(function(){
  minutesCount += 1
  minutes.innerHTML = minutesCount
 }, 60000)

 secondssetInterval = setInterval(function(){
  secondsCount += 1
  if(secondsCount > 59){
      secondsCount = 1
  }
  seconds.innerHTML = secondsCount
 },1000)

 milisecondssetInterval = setInterval(function(){
  milisecondsCount += 1
  if(milisecondsCount > 99){
      milisecondsCount = 1
  }
  miliseconds.innerHTML = milisecondsCount
 },10)
}
document.getElementById("startBtn").addEventListener("click", startTimer) 

//para parar el timer una vez que el juego finalize usando las condiciones para ganar/perder

function clearTimer(){
  clearInterval(minutessetInterval)
  clearInterval(secondssetInterval)
  clearInterval(milisecondssetInterval)
}

  //boton restart
  function refreshGame(){
      location.reload()
  }
  document.getElementById("restart").addEventListener("click", refreshGame)


  //storage local
  
})