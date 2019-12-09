// Render start screen
function renderStartScreen() {
    startBackground = newSprite(Texture.fromImage("./images/bg2.png"), startScreen, 1, 240, 240);

    bigCard = newSprite(Texture.fromImage("./images/bg1.png"), startScreen, 0.5, 0, 0, 0.5, 0.5, 125, 103);

    blackBar = newSprite(id["black.png"], startScreen, 1, 240, 27, 0.5, 0.5, 120, 210);
    blackBar.interactive = true;
    startText = newSprite(id["starttext.png"], startScreen, 0.25, 0, 0, 0.5, 0.5, blackBar.x, blackBar.y);

    frontFaceTexture = Texture.fromImage("frontface1.png");
    randomCard1 = newSprite(frontFaceTexture, startScreen, 0.14, 0, 0, 0.5, 0.5, 75, 120, false);

    randomCard2 = newSprite(frontFaceTexture, startScreen, 0.14, 0, 0, 0.5, 0.5, 165, 120, false);

    turnOnInteractive([randomCard1, randomCard2]);
    finger = newSprite(id["finger.png"], startScreen, 0.15, 0, 0, 0.5, 0.5, randomCard1.x, 143, false);

    turnText = newSprite(Texture.fromImage("first.png"), startScreen, 0.22, 0, 0, 0.5, 0.5, 120, randomCard1.y, false);
}

// Render game screen
function renderGameScreen() {
    gameScreen.visible = false;
    gameBackground = newSprite(Texture.fromImage("./images/bg2.png"), gameScreen, 1, 240, 240);
    gameBackground.cover = newGraphic(gameScreen, "rect", 240, 240, "0x000000", 0, 0, 0.2, false);
    gameBackground.interactive = true;
    gameBackground.cover.zIndex = 50;

    // Player score boxes
    scoreBox1 = newSprite(id["box.png"], gameScreen, 0.1, 0, 0, 0, 0.5, 120, 137, true, 20);
    score1 = new Text(0, new TextStyle({ fontWeight: "bold", fontSize: "50px" }));
    score1.scale.set(0.2);
    score1.zIndex = 20;
    score1.anchor.set(1, 0.5);
    score1.x = scoreBox1.x + scoreBox1.width / 2 + 2;
    score1.y = scoreBox1.y;
    gameScreen.addChild(score1);

    scoreBox2 = newSprite(id["box.png"], gameScreen, 0.1, 0, 0, 0, 0.5, 120, 55, true, 20);

    score2 = new Text(0, new TextStyle({ fontWeight: "bold", fontSize: "50px" }));
    score2.scale.set(0.2);
    score2.zIndex = 20;
    score2.anchor.set(1, 0.5);
    score2.x = scoreBox2.x + scoreBox2.width / 2 + 2;
    score2.y = scoreBox2.y;
    gameScreen.addChild(score2);

    // Option box
    optionBox = newSprite(id["board.png"], gameScreen, 0.15, 0, 0, 0.5, 1, 120, 240, false, 55);

    option2 = newSprite(
        id["option2.png"],
        gameScreen,
        0.15,
        0,
        0,
        0,
        0.5,
        85,
        240 - optionBox.height + optionBox.height / 2,
        false,
        55
    );

    option1 = newSprite(id["option1.png"], gameScreen, 0.15, 0, 0, 0, 0.5, 85, option2.y - 17, false, 55);

    option3 = newSprite(id["option3.png"], gameScreen, 0.15, 0, 0, 0, 0.5, 85, option2.y + 17, false, 55);
    options.push(optionBox, option1, option2, option3);
    turnOnInteractive(options);

    // Long board
    longBoard = newSprite(id["longboard.png"], gameScreen, 0.15, 0, 0, 0.5, 0.5, 120, 195, false, 56);
    longBoard.alpha = 0.85;

    // End text
    endText = newSprite(id["end.png"], gameScreen, 0.33, 0, 0, 0.5, 0.5, -50, longBoard.y + 1, false, 56);
    endText.speed = 0;

    // Koi text
    koiText = newSprite(id["koikoi.png"], gameScreen, 0.33, 0, 0, 0.5, 0.5, -80, longBoard.y + 1, false, 56);
    koiText.speed = 0;

    // Round text
    roundText = newSprite(id["round1.png"], gameScreen, 0.18, 0, 0, 0.5, 0.5, 120, 120, false, 60);

    // Deck
    deckImg = newSprite(id["deck2.png"], gameScreen, 0.13, 0, 0, 0.5, 0.5, 20, 95, true, 10);

    // Draw text
    drawTexture = Texture.fromImage("draw.png");
    drawText = newSprite(drawTexture, gameScreen, 0.2, 0, 0, 0.5, 0.5, 120, 120, false, 60);
}

// Render result screen
function renderResultScreen() {
    resultScreen.visible = false;
    resultBackground = newSprite(Texture.fromImage("./images/bg2.png"), resultScreen, 1, 240, 240);

    resultBackground.interactive = true;
    resultBackground.cover = newGraphic(resultScreen, "rect", 240, 240, "0x000000", 0, 0, 0.2, true);

    resultRoundText = newSprite(id[`round${round}.png`], resultScreen, 0.18, 0, 0, 0.5, 0.5, 120, 40, true, 60);

    resultText = newSprite(id[`resulttext.png`], resultScreen, 0.2, 0, 0, 0.5, 0.5, 120, 50, false, 60);

    youText = newSprite(id[`you.png`], resultScreen, 0.25, 0, 0, 0.5, 0.5, 70, 85, true, 60);

    cpuText = newSprite(id[`cpu.png`], resultScreen, 0.25, 0, 0, 0.5, 0.5, 170, 85, true, 60);

    youResultText = new Text("0", {
        fontSize: 120,
        fontWeight: "bold",
        fill: "0xffffff"
    });

    cpuResultText = new Text("0", {
        fontSize: 120,
        fontWeight: "bold",
        fill: "0xffffff"
    });

    [youResultText, cpuResultText].forEach(el => {
        el.scale.set(0.15);
        el.anchor.set(0.5);
        resultScreen.addChild(el);
        el.y = 115;
    });
    youResultText.x = youText.x;
    cpuResultText.x = cpuText.x;

    // Defeat text
    winTexture = Texture.fromImage("win.png");
    defeatTexture = Texture.fromImage("defeat.png");

    defeatText = newSprite("", resultScreen, 0.25, 0, 0, 0.5, 0.5, 120, 150, false, 60);

    // Restart text
    restartText = newSprite(id["again.png"], resultScreen, 0.23, 0, 0, 0.5, 0.5, 120, 197, false, 60);
    restartText.interactive = true;
}

// Render random screen
function renderRandomScreen() {
    [startScreen, randomCard1, randomCard2, finger].forEach(el => (el.visible = true));
    [gameScreen, resultScreen, turnText].forEach(el => (el.visible = false));
    [randomCard1, randomCard2].forEach(el => {
        el.texture = frontFaceTexture;
        el.interactive = true;
    });
}

// Render draw screen
function renderDraw() {
    destroyList(tempYakuResultList);
    destroyList(tempPointList);
    gameBackground.zIndex = 45;
    gameBackground.cover.visible = true;
    sortZindex(gameScreen);
    drawText.visible = true;
    isDraw = true;
}

// Render the option 2
function renderEndGameText() {
    gameBackground.zIndex = 45;
    sortZindex(gameScreen);
    longBoard.visible = true;
    endText.visible = true;
    endText.speed = END_TEXT_SPEED;
    endGameSelected = true;
}

// Show result
function showResult() {
    // Option 2 was chosen or draw, show result
    youResultText.text = totalPlayerScore;
    cpuResultText.text = totalComScore;
    score1.text = totalPlayerScore;
    score2.text = totalComScore;
    isDraw = false;
    drawText.visible = false;
    resultRoundText.texture = id[`round${round}.png`];
    resultText.visible = false;
    unHideSprites([youText, cpuText, youResultText, cpuResultText, resultRoundText]);

    // If this is the last round, show result & restart btn
    if (round === totalRounds) {
        resultRoundText.visible = false;
        resultText.visible = true;
        if (totalComScore > totalPlayerScore) {
            defeatText.texture = defeatTexture;
        } else if (totalComScore < totalPlayerScore) {
            defeatText.texture = winTexture;
        } else {
            defeatText.texture = drawTexture;
        }
        unHideSprites([restartText, defeatText]);
    }
    resultScreen.visible = true;
}
