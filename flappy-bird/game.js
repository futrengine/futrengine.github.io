var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

var game = new Phaser.Game(config);
var bird, pipes, score = 0, scoreText, bgMusic, jumpSound, gameOverSound, restartButton;
var isGameOver = false;

function preload() {
    this.load.image('bird', 'bird.png');
    this.load.image('bg', 'background.png');
    this.load.image('pipe', 'pipe.png');
    this.load.audio('bgm', 'bgm.mp3'); // Background music
    this.load.audio('jump', 'jump.mp3'); // Jump sound
    this.load.audio('gameover', 'gameover.mp3'); // Game over sound
}

function create() {
    // Background
    this.add.image(0, 0, 'bg').setOrigin(0, 0);

    // Bird
    bird = this.physics.add.sprite(100, 300, 'bird').setScale(0.5); // Reduce size
    bird.setCollideWorldBounds(true);

    // Pipes
    pipes = this.physics.add.group({
        allowGravity: false,  // Pipes don’t fall
        immovable: true, // Pipes stay fixed
});
this.time.addEvent({ delay: 1500, callback: addPipes, callbackScope: this, loop: true });
    // Sounds
    bgMusic = this.sound.add('bgm', { loop: true, volume: 0.5 });
    jumpSound = this.sound.add('jump', { volume: 1.0 });
    gameOverSound = this.sound.add('gameover', { volume: 1.0 });
    
    bgMusic.play(); // Start BGM

    // Input to make bird jump
    this.input.on('pointerdown', jump);

    // Score Display
    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#FFF' });

    // Restart Button (Hidden at Start)
    restartButton = this.add.text(150, 300, 'Restart', { fontSize: '30px', fill: '#FFF', backgroundColor: '#ff0000' })
        .setPadding(10)
        .setInteractive()
        .setVisible(false)
        .on('pointerdown', restartGame);
}

function update() {
    if (bird.y > 600 || bird.y < 0) gameOver();
}

function jump() {
    if (!isGameOver) {
        bird.setVelocityY(-350); // Increase jump height
        jumpSound.play();
    }
}

function addPipes() {
    if (isGameOver) return;

    var pipeY = Phaser.Math.Between(180, 400); // Make sure pipes are not too high or low
    var upperPipe = pipes.create(400, pipeY - 230, 'pipe').setFlipY(true).setScale(0.6); // Adjust upper pipe
    var lowerPipe = pipes.create(400, pipeY + 230, 'pipe').setScale(0.6); // Adjust lower pipe

    pipes.setVelocityX(-200); // Keep pipes moving at the same speed

    // Ensure pipes are destroyed when off-screen
    pipes.children.iterate(function(pipe) {
        if (pipe.x < -50) {
            pipe.destroy();
            score += 1;
            scoreText.setText('Score: ' + score);
        }
    });

    this.physics.add.collider(bird, pipes, gameOver, null, this);
}

function gameOver() {
    if (!isGameOver) {
        isGameOver = true;
        gameOverSound.play();
        bgMusic.stop();
        bird.setVelocityY(0);
        pipes.setVelocityX(0);
        restartButton.setVisible(true);
    }
}

function restartGame() {
    isGameOver = false;
    score = 0;
    scoreText.setText('Score: 0');
    bird.setPosition(100, 300);
    bird.setVelocity(0, 0);
    pipes.clear(true, true);
    bgMusic.play();
    restartButton.setVisible(false);
}
