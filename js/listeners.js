// Player's cards event
function playerCardsListener() {
    player1Deck.forEach(playerSprite => {
        // On card hovered
        playerSprite.on("pointerover", () => {
            onCardHovered(playerSprite);
        });

        // On card out
        playerSprite.on("pointerout", () => {
            onCardMouseOut(playerSprite);
        });

        // On card down
        playerSprite.on("pointerdown", () => {
            onPlayerCardTapped(playerSprite);
        });
    });
}

// Field cards event
function fieldCardsListener() {
    fieldDeck.forEach(fieldSprite => {
        // On card down
        fieldSprite.on("pointerdown", () => {
            if (isCardSelected) {
                turnOffInteractive(fieldDeck);
                attachCards(currentSprite, fieldSprite);
            }
        });
    });
}

// Highlight field cards have the same month
function onCardHovered(sprite) {
    if (currentPlayer === "player1") {
        if (!isCardSelected) {
            isCardHovered = true;
            hideCoversOfList(fieldDeck);

            // Delete old list
            fieldCardsHighLightedCur.splice(0, fieldCardsHighLightedCur.length);

            // Get available choices
            fieldCardsHighLightedCur = getAvailableChoices(sprite);

            if (fieldCardsHighLightedCur.length) {
                showCoversOfList(fieldCardsHighLightedCur, "type1");
            }
        }
    }
}

// Hide the highlight
function onCardMouseOut(sprite) {
    if (currentPlayer === "player1" && fieldCardsHighLightedCur) {
        if (!isCardSelected) {
            isCardHovered = false;
            hideCoversOfList(fieldCardsHighLightedCur);
            fieldCardsHighLightedCur.splice(0, fieldCardsHighLightedCur.length);
        }
    }
}

// Change color of highlighted cards
function onPlayerCardTapped(sprite) {
    isCardSelected = true;
    currentSprite = sprite;

    // Disable interactive
    turnOffInteractive(player1Deck);
    turnOffInteractive(fieldDeck);

    // Hide covers
    hideCoversOfList(player1Deck);

    // Handle card
    handleCard(sprite);
}

// Option's event
function optionsListener() {
    [option1, option2, option3].forEach((option, index) => {
        option.on("pointerdown", () => {
            optionSelected(index + 1);
        });
    });
}

// Option selected
function optionSelected(choice) {
    switch (choice) {
        case 1:
            if (currentPlayer === "player1") {
                options.forEach(el => (el.visible = false));
                playerKoiKoi = true;
            } else {
                comKoiKoi = true;
            }
            longBoard.visible = true;
            koiText.visible = true;
            koiText.speed = KOI_TEXT_SPEED;
            koiSelected = true;
            break;
        case 2:
            if (currentPlayer === "player1") {
                options.forEach(el => (el.visible = false));
                calculatePlayerScore();
                playerWinLastRound = true;
            } else {
                calculateComScore();
                playerWinLastRound = false;
            }
            renderEndGameText();
            break;
        case 3:
            destroyList(tempYakuResultList);
            destroyList(tempPointList);
            gameBackground.cover.visible = false;
            options.forEach(el => (el.visible = false));
            isWaiting = true;
    }
}

// Background Listener
function backgroundListener() {
    gameBackground.on("pointerdown", () => {
        // Option 3 was chosen, hide all yakus and options
        if (isWaiting) {
            let yakuList = checkYaku(currentPlayer, true);
            showOptions(yakuList);
            isWaiting = false;
        }

        // Else
        if (textRunFinished || isDraw) {
            textRunFinished = false;

            destroyList(tempYakuResultList);
            destroyList(tempPointList);
            gameBackground.cover.visible = false;
            [longBoard, koiText, endText].forEach(el => (el.visible = false));
            koiText.x = -80;
            endText.x = -50;
            if (koiSelected) {
                // Option 1 was chosen or draw, continue game
                koiSelected = false;
                switchPlayer();
            }
            if (endGameSelected || isDraw) {
                showResult();
            }
        }
    });

    // Click on the result background
    resultBackground.on("pointerdown", () => {
        if (round < totalRounds) {
            // If round < totalRounds, show the number of current round and play new game
            showRoundAndStartGame();
        }
    });
}

function startListener() {
    // Start text event
    blackBar.on("pointerdown", () => {
        blackBar.interactive = false;
        [startText, bigCard, blackBar].forEach(el => (el.visible = false));
        renderRandomScreen();
    });
    [randomCard1, randomCard2].forEach((card, index) => {
        // Hover random card effect
        card.on("pointerover", () => {
            finger.visible = true;
            finger.x = card.x;
        });

        // Hide the finger when the pointer is out of card
        card.on("pointerout", () => {
            finger.visible = false;
        });

        // Random first turn
        card.on("pointerdown", () => {
            finger.visible = true;
            finger.x = card.x;
            randomFirstPlayer(index + 1);
        });
    });

    // Click restartText to restart new game
    restartText.on("pointerdown", () => {
        renderRandomScreen();
    });
}
