// Attach player's card to field's card
function attachCards(currentSprite, fieldSprite) {
    let playerDeck;
    colorAnimating = false;

    if (currentPlayer === "player1") {
        playerDeck = player1Deck;
        currentSprite.interactive = false;
    } else {
        playerDeck = player2Deck;
    }

    // Hide all covers
    hideCoversOfList([...fieldDeck, currentSprite]);
    sortZindex(gameScreen);

    // Move player's card
    currentSprite.scaleTo(fieldSprite.height / currentSprite.height);
    currentSprite.moveTo(fieldSprite.x + 4, fieldSprite.y + 4);

    // Outline animation
    if (!gotNewCard) {
        currentAttachedCard = currentSprite;
        currentAttachedCard.outline.visible = true;
    }

    // Remove card from player's cards and field's cards
    let playerCardIndex = playerDeck.indexOf(currentSprite);
    let fieldCardIndex = fieldDeck.indexOf(fieldSprite);
    if (!gotNewCard) {
        playerDeck.splice(playerCardIndex, 1);
    }
    fieldDeck.splice(fieldCardIndex, 1);

    // Sort player's cards
    sortDecks();

    // Collect and sort cards archived
    wait(DELAY_SORT_SUB_CARDS).then(() => {
        [currentSprite, fieldSprite].forEach(sprite => {
            sprite.scaleTo(0.6);
            switch (sprite.type) {
                case "kasu":
                    setKasuPostions(sprite);
                    break;
                case "tan":
                    setTanPostions(sprite);
                    break;
                case "tane":
                    setTanePostions(sprite);
                    break;
                case "hikari":
                    setHikariPostions(sprite);
            }
        });

        // Open random card if not yet or switch player
        afterAttaching();
    });
}

// Create new deck of cards
function createDeck() {
    // Delete an old deck list
    restDeck.forEach(sprite => {
        sprite.getDestroyed();
    });
    restDeck.splice(0, restDeck.length);

    // Create a new deck
    listCardName.forEach(name => {
        let card = new Card(name);
        restDeck.push(card.createSprite());
    });

    // Shuffle
    shuffleArray(restDeck);
}

// Deal cards
function dealCards(amount) {
    // Delete old cards
    [player1Deck, player2Deck, fieldDeck].forEach((deck, index) => {
        deck.forEach(sprite => {
            sprite.getDestroyed();
        });
        deck.splice(0, deck.length);
        let cardList = restDeck.splice(0, amount);
        deck.push(...cardList);
        if (index !== 1) {
            deck.forEach(sprite => {
                sprite.visible = true;
            });
        }
    });
    turnOffInteractive(player2Deck);
    turnOffInteractive(fieldDeck);
}

// Just for testing
function fakeDeal() {
    [player1Deck, player2Deck, fieldDeck].forEach((deck, index) => {
        deck.forEach(sprite => {
            sprite.getDestroyed();
        });
        deck.splice(0, deck.length);
    });
    restDeck.forEach(el => {});
    player1Deck = [restDeck[0], restDeck[12], restDeck[24], restDeck[36], restDeck[30], restDeck[29], restDeck[38], restDeck[45]];
    player2Deck = [restDeck[1], restDeck[13], restDeck[25], restDeck[37], restDeck[44], restDeck[34], restDeck[39], restDeck[46]];
    fieldDeck = [restDeck[14], restDeck[10], restDeck[43], restDeck[6], restDeck[5], restDeck[4], restDeck[22], restDeck[47]];
    [player1Deck, fieldDeck].forEach((deck, index) => {
        deck.forEach(sprite => {
            sprite.visible = true;
        });
    });
    //   restDeck.splice(0, restDeck.length);
    [...player1Deck, ...player2Deck, ...fieldDeck].forEach(el => {
        let index = restDeck.indexOf(el);
        restDeck.splice(index, 1);
    });
    turnOffInteractive(player2Deck);
}

// Highlight player's cards and cards on the field
function checkToHighLight() {
    playerCardsHighLighted.splice(0, playerCardsHighLighted.length);
    fieldCardsHighLighted.splice(0, fieldCardsHighLighted.length);

    player1Deck.forEach(playerSprite => {
        fieldDeck.forEach(fieldSprite => {
            if (playerSprite.month === fieldSprite.month) {
                if (playerCardsHighLighted.indexOf(playerSprite) === -1) {
                    playerCardsHighLighted.push(playerSprite);
                }
                if (fieldCardsHighLighted.indexOf(fieldSprite) === -1) {
                    fieldCardsHighLighted.push(fieldSprite);
                }
            }
        });
    });
    showCoversOfList(playerCardsHighLighted, "type1");
}

// Show covers of all cards in a list
function showCoversOfList(list, type) {
    colorAnimating = true;
    count = 0;
    if (type === "type1") {
        list.forEach(card => {
            card.setColorType1();
            card.showCovers();
        });
    } else if (type === "type2") {
        list.forEach(card => {
            card.setColorType2();
            card.showCovers();
        });
    }
}

// Hide covers of all cards in a list
function hideCoversOfList(list) {
    list.forEach(card => {
        card.hideCovers();
    });
}

// Set positions of player's cards
function setPlayerCardPositions() {
    yCoordinate = 210;

    for (i = 0; i < player1Deck.length; i++) {
        if (i === 0) {
            let xCoordinate = 4 + player1Deck[0].width / 2;
            player1Deck[i].moveTo(xCoordinate, yCoordinate);
        } else {
            player1Deck[i].moveTo(player1Deck[i - 1].x + player1Deck[i].width + SPACE_BETWEEN_PLAYER_CARDS, yCoordinate);
        }
    }
}

// Set positions of computer's cards
function setComputerCardPositions(reSort = false) {
    if (!reSort) {
        yCoordinate = 15;
        let space = SPACE_BETWEEN_COMPUTER_CARDS;
        destroyList(computerCards);
        for (i = 0; i < player2Deck.length; i++) {
            let card = newSprite(id["frontface1.png"], gameScreen, 0.067, 0, 0, 0.5, 0.5);
            card.zIndex = 5;
            card.position.set(card.width * i + 13 + i * space, yCoordinate);
            computerCards.push(card);
        }
    } else {
        if (player2Deck.length < computerCards.length) {
            computerCards[computerCards.length - 1].destroy();
            computerCards.pop();
        }
    }
}

// Set positions of cards on the field
function setFieldCardPositions() {
    fieldDeck.forEach((card, index) => {
        setFieldCardPosition(card, index);
    });
}

// Set positions of kasu cards
function setKasuPostions(sprite) {
    let index, yCoordinate;
    if (currentPlayer === "player1") {
        kasuList1.push(sprite);
        index = kasuList1.length - 1;
        yCoordinate = 108.5 + index * 4;
    } else {
        kasuList2.push(sprite);
        index = kasuList2.length - 1;
        yCoordinate = 15 + index * 4;
    }

    sprite.zIndex = 20 + index;
    sprite.moveTo(230, yCoordinate);

    sortZindex(gameScreen);
}

// Set positions of tan cards
function setTanPostions(sprite) {
    let index, yCoordinate;

    if (currentPlayer === "player1") {
        tanList1.push(sprite);
        index = tanList1.length - 1;
        yCoordinate = 108.5 + index * 4;
    } else {
        tanList2.push(sprite);
        index = tanList2.length - 1;
        yCoordinate = 15 + index * 4;
    }

    sprite.zIndex = 20 + index;
    sprite.moveTo(230 - (sprite.width + 4), yCoordinate);

    sortZindex(gameScreen);
}

// Set positions of tane cards
function setTanePostions(sprite) {
    let index, yCoordinate;

    if (currentPlayer === "player1") {
        taneList1.push(sprite);
        index = taneList1.length - 1;
        yCoordinate = 108.5 + index * 4;
    } else {
        taneList2.push(sprite);
        index = taneList2.length - 1;
        yCoordinate = 15 + index * 4;
    }

    sprite.zIndex = 20 + index;
    sprite.moveTo(230 - (sprite.width + 4) * 2, yCoordinate);

    sortZindex(gameScreen);
}

// Set positions of hikari cards
function setHikariPostions(sprite) {
    let index, yCoordinate;

    if (currentPlayer === "player1") {
        hikariList1.push(sprite);
        index = hikariList1.length - 1;
        yCoordinate = 108.5 + index * 4;
    } else {
        hikariList2.push(sprite);
        index = hikariList2.length - 1;
        yCoordinate = 15 + index * 4;
    }

    sprite.zIndex = 20 + index;
    sprite.moveTo(230 - (sprite.width + 4) * 3, yCoordinate);

    sortZindex(gameScreen);
}

// Sort player's deck after each turn
function sortDecks() {
    if (currentPlayer === "player1") {
        setPlayerCardPositions();
    } else {
        setComputerCardPositions(true);
    }
}

// Fill the field based on the index
function setFieldCardPosition(card, index) {
    card.index = index;
    card.zIndex = 14;
    card.scaleTo(FIELD_CARD_SCALE);
    xCoordinate = Math.floor(index / 2) * (card.width + 6) + 48;
    yCoordinate = (index % 2) * (card.height + 6) + 80;
    card.moveTo(xCoordinate, yCoordinate);
}

// Find a position to put card on the field
function findMissingIndex() {
    let curIndex;

    for (let i = 0; i < fieldDeck.length; i++) {
        if (i < fieldDeck[i].index) {
            curIndex = i;
            break;
        }
    }
    if (curIndex !== undefined) {
        return curIndex;
    }
    return fieldDeck.length;
}

// Open random card
function openRandomCard() {
    // Get the first card
    let card = restDeck.shift();
    card.visible = true;
    card.interactive = false;
    card.buttonMode = false;

    // Collect
    currentSprite = card;

    // Track
    gotNewCard = true;

    // Set position
    card.anchor.set(0.5);
    card.moveTo(deckImg.x - 1, deckImg.y - 10);

    // Handle
    wait(DELAY_HANDLE_CARD).then(() => {
        handleCard(card, true);
    });
}

// Handle card
function handleCard(card, isRandomTurn = false) {
    // List all cards that match your selection
    choices = getAvailableChoices(card);

    // If more than 1 matched card
    if (choices.length > 1) {
        if (currentPlayer === "player1") {
            // Allow to choose
            turnOnInteractive(choices);
            // Show covers
            if (!isRandomTurn) {
                showCoversOfList([...choices, card], "type2");
            } else {
                showCoversOfList([...choices], "type2");
            }
        } else if (currentPlayer === "player2") {
            let matchedComCards = fieldDeck.filter(el => el.month === card.month);
            if (matchedComCards) {
                matchedComCards.sort((a, b) => b.point - a.point);
                let comCard = matchedComCards[0];
                attachCards(card, comCard);
            } else {
                addRandomCardToField(card);
                checkResult();
            }
        }
    } else if (choices.length === 1) {
        // Only 1 card matched, so get it
        attachCards(card, choices[0]);
    } else if (choices.length <= 0) {
        // No card matched, leave your card to the field
        // If this is not a random card
        if (!isRandomTurn) {
            addPlayerCardToField(card);

            // Get random card
            wait(DELAY_OPEN_RANDOM_CARD).then(() => {
                openRandomCard();
            });
        } else {
            // Leave random card on the field
            addRandomCardToField(card);

            // Check result
            checkResult();
        }
    }
}

// Remove card from player's hand and add to the field
function addPlayerCardToField(sprite) {
    let card;

    // Find position
    let index = findMissingIndex();
    if (currentPlayer === "player1") {
        let playerCardIndex = player1Deck.indexOf(sprite);
        card = player1Deck.splice(playerCardIndex, 1);
    } else {
        let playerCardIndex = player2Deck.indexOf(sprite);
        card = player2Deck.splice(playerCardIndex, 1);
    }

    // Mark index
    card[0].index = index;

    // Add to field deck
    fieldDeck.splice(index, 0, card[0]);

    // Sort player's deck
    sortDecks();

    // Set position for a selected card
    setFieldCardPosition(card[0], index);
}

// Add a random card you got to the field
function addRandomCardToField(card) {
    let index = findMissingIndex();
    card.index = index;
    fieldDeck.splice(index, 0, card);
    setFieldCardPosition(card, index);
}

// Open random card or switch player after attaching cards
function afterAttaching() {
    if (!gotNewCard) {
        wait(DELAY_OPEN_RANDOM_CARD).then(() => {
            openRandomCard();
        });
    } else {
        // Switch turn if already got random card
        checkResult();
    }
}
