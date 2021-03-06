
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.audio('sfx:alert', 'assets/alert2.wav');
    game.load.audio('bgm:mm2Theme', 'assets/backgroundMusic.mp3');
    game.load.image('sky', 'assets/sky.png');
    game.load.image('city', 'assets/cityAllOn.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('box', 'assets/box.png');
    game.load.spritesheet('button', 'assets/Button (1).png', 63, 26);
}

var player;
var platforms;
var cursors;
var objects;
var tick = 0;
var stars;
var score = 0;
var scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'city');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    //platforms.friction = 100;
    
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 48, 'ground');
    
     Button = game.add.sprite(600, game.world.height - 58, 'button');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
    

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    
    // Make box object
    objects = game.add.group();
    objects.enableBody = true;
     box = objects.create(140, game.world.height - 106, 'box');
    //box.body.velocity = 500;
    box.body.gravity.y = 300;
    box.body.drag.x = 500;
    box.collideWorldBounds - true;
    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 300, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
   
    //Button.scale.setTo(2, 2);
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(Button);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;
        
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
        
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    music = game.add.audio('bgm:mm2Theme');
    sound = game.add.audio('sfx:alert');    
    music.play();
    
     
}

    

function update() {
    
    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(platforms, objects);
    var hitObject = game.physics.arcade.collide(player, objects);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(Button, box, pressed, null, this);
    game.physics.arcade.overlap(Button, player, pressed, null, this);
    
    pressed(Button, player);
    tick++;
    
    
    if (tick % 10 == 0) {
        //stars.tint = 0x0000FF;
        
        //stars.visible = true;
        stars.alpha = 0;
    } else if (tick % 10 == 1) {
       //stars.visible = false;
        stars.alpha = 0;
    }
    else if (tick % 10 == 2) {
      //  stars.visible = false;
        stars.alpha = 0;
    }
    else if (tick % 10 == 3) {
      //  stars.visible = false;
        stars.alpha = .5;
    }
    else if (tick % 10 == 4) {
        stars.alpha = .5;
    }
    else if (tick % 10 == 5) {
        stars.alpha = .5;
    }
    else if (tick % 10 == 6) {
        stars.alpha = .5;
    }
    else if (tick % 10 == 7) {
        stars.alpha = 1;
    }
    else if (tick % 10 == 8) {
        stars.alpha = 1;
    }
    else if (tick % 10 == 9) {
        stars.alpha = 1;
    }
    else {
        stars.alpha = 1;
    } 
    
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, objects, pushStuff, null, this);
    
    player.body.gravity.y = 275;
    
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -175;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 175;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && (hitPlatform|| hitObject))
    {
        sound.play();
        player.body.velocity.y = -285;
    }

}

function pushStuff (player, objects) {
    
}

function pressed (Button, player) {
    var press = false;
    if (press == false && game.physics.arcade.overlap(Button, player)) {
    Button.frame = 1;
    console.log("hiiiiiii");
        press = true;
    }
    
    else if (press == false && game.physics.arcade.overlap(Button, box)) {
    Button.frame = 1;
    console.log("hiiiiiii");
        press = true;
    }
    else {
        press = false;
        Button.frame = 0;
    }
}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}