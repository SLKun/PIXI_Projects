//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    Rectangle = PIXI.Rectangle
    ParticleContainer = PIXI.particles.ParticleContainer,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text;

// Init Canvas
var outterCanvas = new Container(),
    stage = new Container(),
    renderer = autoDetectRenderer(window.innerWidth, window.innerHeight);

// Init Renderer
document.body.appendChild(renderer.view);
renderer.backgroundColor = 0xfbf8f0;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";

window.onresize = init;
init();

// Init Stage
// width = height * 0.714
function init(){
    // Resize Renderer
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);

    // Get Stage Size
    if(renderer.height < renderer.width){
        stage.width0 = renderer.height * 0.714;
        stage.height0 = renderer.height;
        stage.position.set(renderer.width/2 - stage.width0/2, 0);
    }else{
        stage.width0 = renderer.width;
        stage.height0 = renderer.width * 1.4;
        stage.position.set(0, renderer.height/2 - stage.height0/2);
    }

    // draw Mask to show stage
    drawMask(stage);

    outterCanvas.addChild(stage);
    setup();
}

// ----------------------Functions--------------------

function setup() {
    gameScene = new Container();
    stage.addChild(gameScene);

    gameOverScene = new Container();
    stage.addChild(gameOverScene);
    gameOverScene.visible = false;
    
    state = play;

    gameLoop();
}

function gameLoop() {
    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);

    state();

    //Render the stage to see the animation
    renderer.render(outterCanvas);
}

function play() {
    //All the game logic goes here
}

function end() {
    //All the code that should run at the end of the game
}

//The game's helper functions:
//`keyboard`, `hitTestRectangle`, `contain` and `randomInt`
//

function drawMask(container){
    var mask = new Graphics();
    mask.beginFill(0x66ccff);
    mask.drawRect(0, 0, container.width0, container.height0);
    mask.endFill();
    container.addChild(mask);
    console.log(renderer.width, renderer.height);
    console.log(container.x, container.y, container.width0, container.height0);
}