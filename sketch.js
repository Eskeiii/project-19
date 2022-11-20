var trex, trex_running, edges;
var groundImage;
var cloudImage;
var obstaclevelocity = -5
var AIenabled = "false"

function preload(){
  trex_running = loadAnimation("Stickman running 1.png","stickman running 2.png","stickman running 3.png","stickman running 4.png","stick man running 5.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obstacle1 = loadImage("R.png")
  trex_collided = loadImage("trex_collided.png")
  gameoverimage = loadImage("gameOver.png")
  retryimage = loadImage("restart.png")
  jumpsound = loadSound("jump.mp3")
  deathsound = loadSound("die.mp3")
  scoresound = loadSound("checkpoint.mp3")
}




var gamestate = "play"
function setup(){
  createCanvas(windowWidth/2, windowHeight/2);
  
  
  game_over = createSprite(300,110)
  game_over.addImage(gameoverimage)
  game_over.scale = 0.9
  game_over.visible = false

  restart = createSprite(300,140)
  restart.scale = 0.8
  restart.addImage(retryimage)
  restart.visible = false

  // creating trex
  trex = createSprite(50,(windowHeight/1.7)-35,20,50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();
  trex.setCollider("circle", 0, 0, 40)
  
  
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50

  //adding ground
  ground = createSprite(200,(windowHeight/2) - 10,600,10);
  ground.addAnimation("running", groundImage);
  ground.velocityX = -5
  
  obstaclesGroup = new Group()
  CloudsGroup = new Group()

  
  
}
var score = 0

function draw(){
  //set background color 


  background("white");
  
  text("Score: " + score, 500, 50 )

  if (score % 100 === 0 && score > 0){
    scoresound.play()
  }

  if(gamestate === "end" && mousePressedOver(restart)){
    reset()
  }

 
 

  if (gamestate === "play") {
    if(frameCount % 2 === 0){
      score = score + 1
    }
    ground.velocityX = -(5 + score/400)
    obstaclevelocity = ground.velocityX
    obstaclesGroup.setVelocityXEach(obstaclevelocity)
  }

  if (ground.x<0){
    ground.x = ground.width/2 
  }
  //logging the y position of the trex
   
  if (gamestate === "play"){
   if (trex.isTouching(obstaclesGroup)){
     gamestate = "end"
     trex.velocityY = -23
     console.log(gamestate)
     deathsound.play()
   }
  }
  //jump when space key is pressed
  
  if((keyDown("space") || touches.length > 0) && trex.isTouching(ground) && gamestate === "play"){
    trex.velocityY = -10;
    jumpsound.play()
    Touches = [];
  }
  
  trex.velocityY = trex.velocityY + 0.5;
  
  //stop trex from falling down
  trex.collide(edges[3])

  if (gamestate === "play") {
    spawnclouds()
    spawnobstacles();
  } 
  drawSprites();
  
  if (gamestate === "end") {
    obstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    ground.velocityX = 0;
    obstaclesGroup.setLifetimeEach(10000);
    CloudsGroup.setLifetimeEach(10000);
    restart.visible = true
    game_over.visible = true
  
  }
  
}

function spawnobstacles()
{
  if (frameCount % 80 === 0){
    var obstacle = createSprite((windowWidth/2) + 50, (windowHeight/2) - 17,10,40)
    obstacle.velocityX = -5
    obstacle.addImage(obstacle1)
    

    obstacle.scale = 0.03
    obstacle.lifetime = windowWidth/4


    obstaclesGroup.add(obstacle)



  }
}

function reset(){
 score = 0
 game_over.visible = false
 restart.visible = false
 gamestate = "play"

 CloudsGroup.destroyEach()
 obstaclesGroup.destroyEach()
 
 trex.addAnimation("running", trex_running);
}


function spawnclouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(650,120,40,10)
    cloud.addImage(cloudImage)
    cloud.velocityX = 0 - Math.round(random(2,3))
    cloud.scale = Math.random(0.8,1.4)
    cloud.y = Math.round(random(50,120))
    cloud.lifetime = 400   
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1
    CloudsGroup.add(cloud)
  }
}