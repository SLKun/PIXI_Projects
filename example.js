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
    Text = PIXI.Text
    ;

//Create a Pixi stage and renderer and add the 
//renderer.view to the DOM
var stage = new Container(),
    renderer = autoDetectRenderer(256, 256);
document.body.appendChild(renderer.view);

renderer.backgroundColor = 0xbbada0;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

//load an image and run the `setup` function when it's done
loader
    .add("images/altas.json")
    .on("progress", loadProgressHandler)
    .load(setup);

var cat, icon, icon2, icons;
var state;
var rectangle, line;
var message;

function setup() {
    // var texture = TextureCache["images/tileset.png"];
    // var rect = new Rectangle(64, 128, 32, 32);
    // texture.frame = rect;
    // var rocket = new Sprite(texture);
    // rocket.position.set(64, 64);

    // var cat = new Sprite(resources["images/tileset.png"].texture);
    // cat.position.set(128, 128);
    // cat.scale.set(0.8, 0.8);
    // cat.anchor.set(0.5, 0.5);
    // cat.rotation = 3.14;
    
    rectangle = new Graphics();
    rectangle.beginFill(0x66ccff);
    rectangle.lineStyle(3, 0xffcc66, 0.3);
    rectangle.drawRect(0, 0, 100, 100);
    rectangle.endFill();
    rectangle.x = 100;
    rectangle.y = 100;
    stage.addChild(rectangle);

    line = new Graphics();
    line.lineStyle(5, 0xffffff, 1);
    line.moveTo(0, 0);
    line.lineTo(100, 100);
    line.x = 16;
    line.y = 16;
    stage.addChild(line);

    message = new Text("123456",
        {font: "32px sans-serif", fill: "red",
        stroke:"green", strokeThickness: 5}
    );
    message.position.set(16, 16);
    message.anchor.set(0.5, 0.5);
    stage.addChild(message);

    cat = new Sprite(TextureCache["cat.png"]);
    cat.anchor.set(0.5, 0);
    cat.position.set(renderer.width/2, 0);

    icon2 = new Sprite(TextureCache["2.jpg"]);
    icon2.anchor.set(0.5, 1);
    icon2.position.set(renderer.width/2, renderer.height);

    icon = new Sprite(TextureCache["1.jpg"]);
    icon.anchor.set(0.5, 0.5);
    icon.position.set(renderer.width/2, renderer.height/2);
    icon.vx = 0, icon.vy = 0;

    //Calculate On GPU
    icons = new ParticleContainer();
    // icons = new Container();
    icons.addChild(icon);
    icons.addChild(icon2);

    stage.addChild(cat);
    stage.addChild(icons);

    state = play;

    var left = keyboard(37),
    	  right = keyboard(39),
    	  up = keyboard(38),
    	  down = keyboard(40);

    left.press = function() {
    	if(right.isUp){
    		icon.vx = -1;
    	}else{
    		icon.vx = 0;
    	}
    }
    left.release = function() {
    	if(right.isUp){
    		icon.vx = 0;
    	}else{
    		icon.vx = +1;
    	}
    }
    right.press = function() {
    	if(left.isUp){
    		icon.vx = +1;
    	}else{
    		icon.vx = 0;
    	}
    }
    right.release = function() {
    	if(left.isUp){
    		icon.vx = 0;
    	}else{
    		icon.vx = -1;
    	}
    }

    up.press = function() {
    	if(down.isUp){
    		icon.vy = -1;
    	}else{
    		icon.vy = 0;
    	}
    }
    up.release = function() {
    	if(down.isUp){
    		icon.vy = 0;
    	}else{
    		icon.vy = +1;
    	}
    }
    down.press = function() {
    	if(up.isUp){
    		icon.vy = +1;
    	}else{
    		icon.vy = 0;
    	}
    }
    down.release = function() {
    	if(up.isUp){
    		icon.vy = 0;
    	}else{
    		icon.vy = -1;
    	}
    }

    // For touch
    var mc = new Hammer(renderer.view);
    mc.get('swipe').set({ 
    	direction: Hammer.DIRECTION_ALL,
    	velocity: 0.3,
    	threshold: 10
    });

    // listen to events...
    mc.on("swipeleft swiperight swipeup swipedown", function(ev) {
	console.log(ev.type);
	if (ev.type == "swipeup") {
		icon.vy = -5;
	}
	if (ev.type == "swipedown") {
		icon.vy = +5;
	}
	if (ev.type == "swipeleft") {
		icon.vx = -5;
	}
	if (ev.type == "swiperight") {
		icon.vx = +5;
	}
    });

    //Start the game loop
    gameLoop();
}

function loadProgressHandler(loader, resource){
	console.log('loading ' + resource.url);
}

function gameLoop() {
    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);

    state();

    //Render the stage to see the animation
    renderer.render(stage);
}

function play(){
    icons.x += icon.vx;
    icons.y += icon.vy;

    // Bound to the Boundary
    if(icon.x + icon.width/2 >= renderer.width){
    	icon.x = renderer.width - icon.width/2;
    	icon.vx = 0;
    }
    if(icon.x - icon.width/2 <= 0){
    	icon.x = icon.width/2;
    	icon.vx = 0;
    }
    if(icon.y + icon.height/2 >= renderer.height){
    	icon.y = renderer.height - icon.height/2;
    	icon.vy = 0;
    }
    if(icon.y - icon.height/2 <= 0){
    	icon.y = icon.height/2;
    	icon.vy = 0;
    }
}

function keyboard(keyCode){
	var key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;

	key.upHandler = function(event) {
		if(event.keyCode == key.code){
			if (key.isDown && key.press) {
				key.release();
			}
			key.isDown = false;
			key.isUp = true;
		}
		event.preventDefault();
	};

	key.downHandler = function(event) {
		if(event.keyCode == key.code){
			if (key.isUp && key.press) {
				key.press();
			}
			key.isDown = true;
			key.isUp = false;
		}
		event.preventDefault();
	};

	window.addEventListener(
		"keydown", key.downHandler.bind(key),false
	);
	window.addEventListener(
		"keyup", key.upHandler.bind(key),false
	);

	return key;
}

function hitTestRectangle(r1, r2){
    
}