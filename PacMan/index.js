const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
    static width = 40;
    static height = 40;
    constructor({ position, image }) {    
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }
    draw() {
        //c.fillStyle = 'blue';
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class Player{
    constructor({ position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Pellet{
  constructor({ position }) {
      this.position = position;
      this.radius = 3;
  }
  draw() {
      c.beginPath();
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = 'white';
      c.fill();
      c.closePath();
  }
}

const pellets = [];
const boundaries = [];
const player = new Player({
    position: {
      x: Boundary.width * 1.5,
      y: Boundary.height * 1.5
    },
    velocity: {
      x: 0,
      y: 0
    }
});

const keys = {
    ArrowUp: {
      pressed: false
    },
    ArrowDown: {
      pressed: false
    },
    ArrowLeft: {
      pressed: false
    },
    ArrowRight: {
      pressed: false
    }
}

let lastKey = '';

const map1 = [
  ['1', '-', '-', '-', '-', 'T', '-', '-', '-', '-', '2'],
  ['|', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
  ['|', ' ', '1', '>', ' ', 'U', ' ', '<', '2', ' ', '|'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
  ['|', ' ', 'U', ' ', '<', '-', '>', ' ', 'U', ' ', '|'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['|', ' ', '???', ' ', '<', '-', '>', ' ', '???', ' ', '|'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
  ['|', ' ', '3', '>', ' ', '???', ' ', '<', '4', ' ', '|'],
  ['|', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
  ['3', '-', '-', '-', '-', '???', '-', '-', '-', '-', '4'],
];

const map = [
  ['1', '-', '-', '-', '-', 'T', '-', '-', '-', '-', '-', '-', '-', 'T', '-', '-', '-', '-', '2'],
  ['|', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
  ['|', ' ', '1', '>', ' ', 'U', ' ', '<', '-', '-', '-', '>', ' ', 'U', ' ', '<', '2', ' ', '|'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
  ['|', ' ', 'U', ' ', '<', '>', ' ', '1', '>', ' ', '<', '2', ' ', '<', '>', ' ', 'U', ' ', '|'],
  ['|', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
  ['|', ' ', '???', ' ', '<', '>', ' ', '3', '-', '-', '-', '4', ' ', '<', '>', ' ', '???', ' ', '|'],
  ['|', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', '|'],
  ['|', ' ', '3', '>', ' ', '???', ' ', '<', '-', '-', '-', '>', ' ', '???', ' ', '<', '4', ' ', '|'],
  ['|', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
  ['3', '-', '-', '-', '-', '???', '-', '-', '-', '-', '-', '-', '-', '???', '-', '-', '-', '-', '4'],
];

function createImage(src){
    const image = new Image();
    image.src = src;
    return image;
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
// laterais basicas
          case '-':
            boundaries.push(
              new Boundary({
                position: {
                    x: j * Boundary.width,
                    y: i * Boundary.height
                },
                image: createImage('./assets/pipeHorizontal.png')
              })
            )
            break;  
          case '|':
            boundaries.push(
              new Boundary({
                position: {
                    x: j * Boundary.width,
                    y: i * Boundary.height
                },
                image: createImage('./assets/pipeVertical.png')
              })
            )
            break;  
//cantos
          case '1':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeCorner1.png')
            })
          )
          break; 
          case '2':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeCorner2.png')
            })
          )
          break; 
          case '3':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeCorner4.png')
            })
          )
          break; 
          case '4':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeCorner3.png')
            })
          )
          break;
//bloco
          case 'b':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/block.png')
            })
          )
          break;   
//tri/quad
          case '+':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeCross.png')
            })
          )
          break;
          case 'T':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeConnectorBottom.png')
            })
          )
          break;
          case '???':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeConnectorTop.png')
            })
          )
          break;
          case 'L':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeConnectorLeft.png')
            })
          )
          break;
          case 'R':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/pipeConnectorRight.png')
            })
          )
          break;
//finais
          case 'U':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/capBottom.png')
            })
          )
          break;
          case '???':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/capTop.png')
            })
          )
          break;
          case '<':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/capLeft.png')
            })
          )
          break;
          case '>':
          boundaries.push(
            new Boundary({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
              image: createImage('./assets/capRight.png')
            })
          )
          break;  
          case '.':
          pellets.push(
            new Pellet({
              position: {
                  x: j * Boundary.width,
                  y: i * Boundary.height
              },
            })
          )
          break;          
        }
    })
})

function circleCollideRect({
    circle,
    rect
}){
    return (circle.position.y - circle.radius + circle.velocity.y 
          <= rect.position.y + rect.height &&
        circle.position.x + circle.radius + circle.velocity.x 
          >= rect.position.x &&
        circle.position.y + circle.radius + circle.velocity.y 
          >= rect.position.y &&
        circle.position.x - circle.radius + circle.velocity.x 
          <= rect.position.x + rect.width) 
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
        for (let i=0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollideRect({
                circle: {...player, velocity: {
                    x: 0, 
                    y: -5
                }},
                rect: boundary
                })
            ){
                player.velocity.y = 0; 
                break
            } else {
            player.velocity.y = -5;
            }
        }
    }  else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown') {
        for (let i=0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollideRect({
                circle: {...player, velocity: {
                    x: 0, 
                    y: 5
                }},
                rect: boundary
                })
            ){
                player.velocity.y = 0; 
                break
            } else {
            player.velocity.y = 5;
            }
        }
    }  else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
        for (let i=0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollideRect({
                circle: {...player, velocity: {
                    x: -5, 
                    y: 0
                }},
                rect: boundary
                })
            ){
                player.velocity.x = 0; 
                break
            } else {
            player.velocity.x = -5;
            }
        }
    }  else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
        for (let i=0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollideRect({
                circle: {...player, velocity: {
                    x: 5, 
                    y: 0
                }},
                rect: boundary
                })
            ){
                player.velocity.x = 0; 
                break
            } else {
            player.velocity.x = 5;
            }
        }
    }

    pellets.forEach((pellet) => {
      pellet.draw()
    })

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (circleCollideRect({
            circle: player,
            rect: boundary
            })
        ){
            player.velocity.y = 0;
            player.velocity.x = 0;
        }
    });
    player.update();
    //player.velocity.y = 0;
    //player.velocity.x = 0;
}
animate();



addEventListener('keydown', ({key}) => {
    switch (key) {
      case 'ArrowUp':
        keys.ArrowUp.pressed = true;
        lastKey = 'ArrowUp';
        break;
      case 'ArrowDown':
        keys.ArrowDown.pressed = true;
        lastKey = 'ArrowDown';
      break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        lastKey = 'ArrowLeft';
      break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        lastKey = 'ArrowRight';
      break;
    }
});

window.addEventListener('keyup', ({key}) => {
    switch (key) {
      case 'ArrowUp':
        keys.ArrowUp.pressed = false;
        break;
      case 'ArrowDown':
        keys.ArrowDown.pressed = false;
      break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
      break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = false;
      break;
    }
});