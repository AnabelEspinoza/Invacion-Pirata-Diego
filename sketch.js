const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var balasDeCañon=[];
var botes=[];

//var cannonBall;
//var bote;
//var balas=[];
var score=0;
var animacionBienChula=[];
var boteIMG,boteJason;
var boteDestruido= [];
var destructorDeBarcos,rotoJason;
var balaCayendoAlAgua = [];
var balaAlAgua,balaJason;
var isGameOver = false;
var isLaughing= false;


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boteJason= loadJSON("./assets/boat/boat.json");
  boteIMG=loadImage("./assets/boat/boat.png");
  
  balaJason=loadJSON("./assets/waterSplash/waterSplash.json");
  balaAlAgua=loadImage("./assets/waterSplash/waterSplash.png");
  
  rotoJason=loadJSON("./assets/boat/brokenBoat.json");
  destructorDeBarcos=loadImage("./assets/boat/brokenBoat.png");

}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 20;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  var asesinoDeDioses=boteJason.frames;
  for (var i=0;i<asesinoDeDioses.length;i++){
    var pos=asesinoDeDioses[i].position;
    var img=boteIMG.get(pos.x,pos.y,pos.w,pos.h);
    animacionBienChula.push(img);
  }

  var broken=rotoJason.frames;
  for(i=0;i<broken.length;i++){
    var pos=broken[i].position;
     var img=destructorDeBarcos.get(pos.x,pos.y,pos.w,pos.h);
     boteDestruido.push(img);
  }

  var brokenBalas=balaJason.frames;
  for (var i=0;i<brokenBalas.length;i++){
    varpos=brokenBalas[i].position;
    var img=balaAlAgua.get(pos.x,pos.y,pos.w,pos.h);
    balaCayendoAlAgua.push(img);
  }

  //cannonBall = new CannonBall(cannon.x, cannon.y);
  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  //rect(ground.position.x, ground.position.y, width * 2, 1);
  //piso
  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();

// torre
  push();
  translate(tower.position.x, tower.position.y);
  rotate(tower.angle);
  imageMode(CENTER);
  image(towerImage, 0,0, 160, 310);
  pop();

  showBotes();

  for (var i=0; i<balasDeCañon.length; i++){
    juanitoComePapas(i);
    multibalas(balasDeCañon[i],i);
    
  }
  cannon.display();
  //cannonBall.display();
 
 /* Matter.Body.setVelocity(bote.body,{
    x:-0.9,y:0 });
  bote.display();*/

  fill("#6d4c41");
  textSize(40);
  text(`Puntuación:${score}`, width - 200, 50);
  textAlign(CENTER, CENTER);
 
}


function keyReleased() {
   if (keyCode === 32 || keyCode == "Space" && !isGameOver) {
     //sonido de cañon
      balasDeCañon[balasDeCañon.length-1].shoot(); 
    }
    
}


function multibalas(bala,i){
  if (bala){
    bala.display();
    bala.animacion();
    if (bala.body.position.x >=width || bala.body.position.y >=height-50){
      //sonido de bala
      bala.remove(i);
    }
  }
}
    
    
function keyPressed(){
  if (keyCode === 32 || keyCode == "Space"){
    var bala=new CannonBall(cannon.x,cannon.y);
    bala.trjectory=[];
    Matter.Body.setAngle(bala.body, cannon.angle);
    balasDeCañon.push(bala);
    console.log(balasDeCañon);
  }
  
  
}


 function showBotes(){
  if(botes.length>0){
    if(botes.length < 4 && botes[botes.length-1].body.position.x < width-300){
      var pociciones=[-40,-60,-70,-20];
      var pocicion=random(pociciones)
      var bote= new Bote(width,height-100,170,170,pocicion,animacionBienChula);
      botes.push(bote);
      console.log(botes);
      }
      for(var i=0;i<botes.length;i++){
        Matter.Body.setVelocity(botes[i].body,{x:-0.9,y:0});
        botes[i].display();
        botes[i].flash();
      
        var collision = Matter.SAT.collides(this.tower, botes[i].body);
        if (collision.collided && !botes[i].isBroken) {
            //Added isLaughing flag and setting isLaughing to true
            /*if(!isLaughing && !pirateLaughSound.isPlaying()){
              pirateLaughSound.play();
              isLaughing = true
            }*/
          isGameOver = true;
          gameOver();
        }
      }
  }  
  else{
    var bote= new Bote(width-70,height-60,170,170,-80,animacionBienChula);
    botes.push(bote);
  }
}     

function juanitoComePapas(indice){
  for(var i=0; i<botes.length; i++){
    if(balasDeCañon[indice]!== undefined && botes[indice!== undefined]){
      var colicion=Matter.SAT.collides(balasDeCañon[indice].body, botes[indice].body);
      if(colicion.cillided){
        score+=5
        botes[i].remove(i);
       // bala.remove(i);
        Matter.World.remove(world,balasDeCañon[indice].body);
        delete balasDeCañon[indice]
      }
    }
  }
}

function gameOver() {
  swal(
    {
      title: `¡Fin del juego!`,
      text: "¡Gracias por jugar!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jugar de nuevo"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}