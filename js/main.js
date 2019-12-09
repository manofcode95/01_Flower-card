// Create PIXI App
const Application = PIXI.Application,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite,
    loader = PIXI.loader,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text,
    BitmapText = PIXI.extras.BitmapText,
    Texture = PIXI.Texture,
    MovieClip = PIXI.extras.MovieClip,
    Renderer = PIXI.Renderer,
    TextStyle = PIXI.TextStyle;

// Set up app
let app = new Application({
        backgroundColor: 0xffffff,
        width: LOGICAL_WIDTH,
        height: LOGICAL_HEIGHT,
        // antialias: true,
        transparent: true,
        autoResize: true,
        resolution: window.devicePixelRatio || 1
    }),
    // Create containers
    startScreen = new Container(),
    gameScreen = new Container(),
    resultScreen = new Container(),
    cardsContainer = new Container();

document.body.appendChild(app.view);
app.stage.addChild(startScreen, gameScreen, resultScreen);
// PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// Load Images
for (let i = 1; i <= 4; i++) {
    MONTHS.forEach(month => {
        listCardName.push(`${month}-${i}.png`);
        cardUrls.push(`./images/${month}-${i}.png`);
    });
}
loader
    .add([
        "./images/sprites.json",
        ...cardUrls,
        "./images/bg1.png",
        "./images/bg2.png"
    ])
    .load(setup);

// Game Setup
function setup(loader, res) {
    canvas = document.querySelector("canvas");
    // Get json
    id = res["./images/sprites.json"].textures;

    // Start Scene
    renderStartScreen();

    // GameScreen
    renderGameScreen();

    // Result scene
    renderResultScreen();

    // Event Listener
    startListener();
    optionsListener();
    backgroundListener();

    // Set resize on device
    resizeHandler();

    // Listen to resize event
    window.addEventListener("resize", resizeHandler);

    // State
    state = gameLoop;
    app.ticker.add(delta => {
        state(delta);
    });
}

// Game Loop
function gameLoop(delta) {
    animateCardColor(delta);
    animateAttachCard(delta);
    stateAnimation(delta);

    if (startScreen.visible) {
        fadeAnimation(startText, delta);
    }
}
