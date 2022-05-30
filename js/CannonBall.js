class CannonBall {
  constructor(x, y) {
    var options = {
      isStatic: true
    };
    this.r = 30;
    this.body = Bodies.circle(x, y, this.r, options);
    this.image = loadImage("./assets/cannonball.png");
    this.animation = [this.image];
    this.trajectory=[];
    this.isSink = false;
    World.add(world, this.body);
  }

shoot(){
  var newAngle=cannon.angle-28;
  newAngle=newAngle*(3.14/180);
  var velocidad=p5.Vector.fromAngle(newAngle);
  velocidad.mult(0.5);
  Matter.Body.setStatic(this.body,false);
  Matter.Body.setVelocity(this.body,
    {x:velocidad.x*(180/3.14),y:velocidad.y*(180/3.14)}
  );
}

remove(indice){
  this.isSink=true;
  Matter.Body.setVelocity(this.body,{x:0,y:0});
  this.animation=balaCayendoAlAgua;
  this.speed = 0.05;
  this.r=150;
  setTimeout(()=> {
    Matter.World.remove(world,this.body);
    delete balasDeCañon[indice];
  },1000);
}

animacion(){
  this.speed+=0.05;
}


display(){
  var pos = this.body.position;
  var angle=this.body.angle;
  var index=floor(this.speed % this.animation.length);
  push();
  translate(pos.x, pos.y);
  rotate(angle);
  imageMode(CENTER);
  //image(this.animation[index], 0, 0, this.r, this.r);
  image(this.image,0,0,this.r,this.r);
  pop();
  if (this.body.velocity.x>0 && pos.x>300 && !this.isSink){
    var pocicion=[this.body.position.x, this.body.position.y];
    this.trajectory.push(pocicion);
  }
//for (var i=0;i<this.trajectory.length;i++){
  for (var i = 0; i < this.trajectory.length; i++) {
  image(this.image,this.trajectory[i][0],this.trajectory[i][1],5.5,5);
}
  }

}
