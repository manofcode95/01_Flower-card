// Switch player
function switchPlayer() {
    gotNewCard = false;
    if (currentPlayer === "player1") {
        currentPlayer = "player2";
        turnOffInteractive(player1Deck);
        hideCoversOfList(player1Deck);
        player2Plays();
    } else {
        currentPlayer = "player1";
        isCardSelected = false;
        checkToHighLight();
        turnOnInteractive(player1Deck);
    }
}

// Collect list of cards that matched your card selection
function getAvailableChoices(sprite) {
    // Collect all cards that match your current card
    let choices = [];
    fieldDeck.forEach(fieldSprite => {
        if (fieldSprite.month === sprite.month) {
            choices.push(fieldSprite);
        }
    });
    return choices;
}

// Player2 turn
function player2Plays() {
    // Pick card
    let pickedCards = getPlayer2Card(player2Deck);
    let player2PickedCard = pickedCards[0];
    player2PickedCard.visible = true;
    let fieldPickedCard = pickedCards[1];

    // If there's card matched
    if (fieldPickedCard) {
        attachCards(player2PickedCard, fieldPickedCard);
    } else {
        // Leave card on the field
        addPlayerCardToField(player2PickedCard);

        // Get random card
        wait(DELAY_OPEN_RANDOM_CARD).then(() => {
            openRandomCard();
        });
    }
}

// Player 2 picks card
function getPlayer2Card(playerDeck) {
    let curPlayerChosenCard,
        curFieldChosenCard,
        curHighestPoint = 0;

    for (let i = 0; i < playerDeck.length; i++) {
        // Get list of cards which have the same month
        let matchMonthCards = fieldDeck.filter(card => {
            if (card.month === playerDeck[i].month) {
                return card;
            }
        });

        if (matchMonthCards.length !== 0) {
            // Sort cards in an array in descending point order
            matchMonthCards.sort((a, b) => b.point - a.point);

            // Check if there's priority card
            // Check the player2's card
            if (playerDeck[i].month === PRIORITY_MONTH.month && playerDeck[i].point === PRIORITY_MONTH.point) {
                curPlayerChosenCard = playerDeck[i];
                curFieldChosenCard = matchMonthCards[0];
                break;
            }

            // Check the matchMonthCards list
            if (
                matchMonthCards.find(card => card.month === PRIORITY_MONTH.month && card.point === PRIORITY_MONTH.point)
            ) {
                curPlayerChosenCard = playerDeck[i];
                curFieldChosenCard = matchMonthCards.find(
                    card => card.month === PRIORITY_MONTH.month && card.point === PRIORITY_MONTH.point
                );
                break;
            }

            // If there's no card has the priority month
            // Choose the the card which the combination of them has the highest score
            if (playerDeck[i].point + matchMonthCards[0].point > curHighestPoint) {
                curPlayerChosenCard = playerDeck[i];
                curFieldChosenCard = matchMonthCards[0];
                curHighestPoint = curPlayerChosenCard.point + curFieldChosenCard.point;
            }
        } else {
            // If no cards on the field have the same month, pick the card with the lowest point
            if (!curFieldChosenCard && !curPlayerChosenCard) {
                let player2DeckClone = player2Deck.slice();
                player2DeckClone.sort((a, b) => a.point - b.point);
                curPlayerChosenCard = player2Deck.find(el => el === player2DeckClone[0]);
                curFieldChosenCard = null;
            }
        }
    }
    return [curPlayerChosenCard, curFieldChosenCard];
}

// Check autowin if player has 4 pairs of cards or 4 cards of the same month
function checkAutoWin(player) {
    let deck,
        isWinner = false,
        type = null,
        month = [];
    if (player === "player1") {
        deck = player1Deck;
    } else {
        deck = player2Deck;
    }

    let months = deck.map(card => card.month);
    let monthsSet = new Set(months);
    monthsSet = Array.from(monthsSet);

    for (let i = 0; i < monthsSet.length; i++) {
        let numOfCardsOfMonth = deck.filter(card => card.month === monthsSet[i]).length;
        if (numOfCardsOfMonth === 4) {
            isWinner = true;
            type = 2;
            month.push(monthsSet[i]);
            break;
        } else if (monthsSet.length === 4) {
            if (numOfCardsOfMonth === 2) {
                isWinner = true;
                type = 1;
            } else {
                isWinner = false;
                break;
            }
        }
    }

    if (!isWinner) {
        if (monthsSet.length === 4) {
            for (let i = 0; i < monthsSet.length; i++) {
                let numOfCardsOfMonth = deck.filter(card => card.month === monthsSet[i]);
                if (numOfCardsOfMonth === 2) {
                    isWinner = true;
                    type = 1;
                } else {
                    isWinner = false;
                    break;
                }
            }
        }
    }

    return { isWinner, type, month };
}

// Check yaku
function checkYaku(player, checkResult = false) {
    let deck,
        yakuList = [];

    if (player === "player1") {
        deck = player1Deck;
        kasuList = kasuList1;
        tanList = tanList1;
        taneList = taneList1;
        hikariList = hikariList1;
    } else {
        deck = player2Deck;
        kasuList = kasuList2;
        tanList = tanList2;
        taneList = taneList2;
        hikariList = hikariList2;
    }

    // Collect all card's name
    let cardNames = [...getCardNamesFromList([...kasuList, ...tanList, ...taneList, ...hikariList])];

    // Test each yaku case
    // Loop through each case of yaku
    YAKU_CASES.forEach(obj => {
        // Cardname's length must be higher than the checked case's
        if (cardNames.length >= obj.list.length) {
            // If cardNames contains names of cards of any yaku
            if (checkArrayContainsArray(cardNames, obj.list)) {
                let result = divideYakuIntoGroup(cardNames, obj);
                yakuList.push(result.yaku);
                cardNames = result.cardNames;
            }
        }
    });
    // Check if able to build yaku based on amount of cards
    let resultOfCheckBaseOnAmount = checkYakuBasedOnAmount(cardNames);
    yakuList.push(...resultOfCheckBaseOnAmount.yakuList);
    cardNames = resultOfCheckBaseOnAmount.cardNames;

    // Only accept if this is a new yaku list
    let curPoint = yakuList.reduce((a, b) => a + b.point, 0);
    if (player === "player1") {
        if (curPoint > curPoint1) {
            curPoint1 = curPoint;
            return yakuList;
        }
    } else if (player === "player2") {
        if (curPoint > curPoint2) {
            curPoint2 = curPoint;
            return yakuList;
        }
    }

    if (checkResult) {
        return yakuList;
    } else {
        return [];
    }
}

// Check some special cases of yaku based on the amount
function checkYakuBasedOnAmount(cardNames) {
    let yakuList = [];
    OTHERS_YAKU_CASES.forEach(obj => {
        let type = obj.type;
        let matchedCardNamesOfPlayer = cardNames.filter(name => {
            if (type !== "kasu") {
                return searchTypeBasedOnName(name) === type;
            } else {
                return searchTypeBasedOnName(name) === type || name === "sep-4";
            }
        });
        if (type === "kasu" && matchedCardNamesOfPlayer.includes("sep-4")) {
            let index = matchedCardNamesOfPlayer.indexOf("sep-4");
            matchedCardNamesOfPlayer.splice(index, 1);
            matchedCardNamesOfPlayer.splice(matchedCardNamesOfPlayer.length, 0, "sep-4");
        }
        if (matchedCardNamesOfPlayer.length >= obj.amount) {
            let point = matchedCardNamesOfPlayer.length - obj.amount + obj.point;
            matchedCardNamesOfPlayer.forEach(name => cardNames.splice(cardNames.indexOf(name), 1));
            yakuList.push({ cards: matchedCardNamesOfPlayer, point });
        }
    });
    return { yakuList, cardNames };
}

// Sort yakus, divide into small groups
function divideYakuIntoGroup(cardNames, yakuCase) {
    let cards = yakuCase.list.slice(),
        point = yakuCase.point,
        bonus = yakuCase.bonus;

    // Delete names of cards of that yaku out of cardNames
    cards.forEach(name => {
        cardNames.splice(cardNames.indexOf(name), 1);
    });

    // Check for bonus
    if (bonus) {
        let bonusCardNames = cardNames.filter(name => {
            // return cardNames.indexOf(el.name) > 0 && el.type === bonus;
            return searchTypeBasedOnName(name) === bonus;
        });
        bonusCardNames.forEach(name => {
            cards.push(name);
            point++;
            cardNames.splice(cardNames.indexOf(name), 1);
        });
    }

    return { yaku: { cards, point }, cardNames };
}

// Show the options after forming yaku
function showOptions(yakuList, showBoard = true) {
    // Delete temp list where saves the sprites
    destroyList(tempYakuResultList);
    destroyList(tempPointList);

    gameBackground.cover.visible = true;
    // Show yaku
    yakuList.forEach((obj, listIndex) => {
        obj.cards.forEach((name, nameIndex) => {
            let card = newSprite(
                Texture.fromImage(`./images/${name}.png`),
                gameScreen,
                0.09,
                0,
                0,
                0.5,
                0.5,
                20 + nameIndex * 13,
                20 + listIndex * 34,
                true,
                60
            );
            tempYakuResultList.push(card);
        });
        let text = new Text(
            obj.point,
            new TextStyle({
                fontWeight: "bold",
                fontSize: 120,
                fill: "0xffffff"
            })
        );
        text.zIndex = 55;
        text.scale.set(0.1);
        text.anchor.set(1, 0.5);
        text.position.set(220, 20 + listIndex * 35);
        gameScreen.addChild(text);
        tempPointList.push(text);
    });

    // Show options
    if (showBoard) {
        if (currentPlayer === "player1") {
            options.forEach(el => (el.visible = true));
        }
    }
}

// Calculate the total score of player1
function calculatePlayerScore() {
    if (!comKoiKoi && curPoint1 < minScoreToBeDoubled) {
        totalPlayerScore += curPoint1;
    } else if (!comKoiKoi && curPoint1 >= minScoreToBeDoubled) {
        totalPlayerScore += curPoint1 * 2;
    } else if (comKoiKoi && curPoint1 < minScoreToBeDoubled) {
        totalPlayerScore += curPoint1 * 2;
    } else if (comKoiKoi && curPoint1 >= minScoreToBeDoubled) {
        totalPlayerScore += curPoint1 * 4;
    }
}

// Calculate the total score of player2
function calculateComScore() {
    if (!playerKoiKoi && curPoint2 < minScoreToBeDoubled) {
        totalComScore += curPoint2;
    } else if (!playerKoiKoi && curPoint2 >= minScoreToBeDoubled) {
        totalComScore += curPoint2 * 2;
    } else if (playerKoiKoi && curPoint2 < minScoreToBeDoubled) {
        totalComScore += curPoint2 * 2;
    } else if (playerKoiKoi && curPoint2 >= minScoreToBeDoubled) {
        totalComScore += curPoint2 * 4;
    }
}

// Set up for new game
function newGame() {
    gameBackground.zIndex = 0;
    createDeck();
    dealCards(8);
    // fakeDeal(8);
    setFieldCardPositions();
    setPlayerCardPositions();
    setComputerCardPositions();

    [kasuList1, kasuList2, tanList1, tanList2, taneList1, taneList2, hikariList1, hikariList2].forEach(arr => {
        arr.forEach(card => {
            card.getDestroyed();
        });
        arr.splice(0, arr.length);
    });

    currentPlayer = "player1";
    endGameSelected = false;
    koiSelected = false;
    playerKoiKoi = false;
    comKoiKoi = false;
    isCardSelected = false;
    isCardHovered = false;
    gotNewCard = false;
    endGameSelected = false;
    koiSelected = false;
    textRunFinished = false;
    isWaiting = false;
    gotNewCard = false;
    colorAnimating = false;
    curPoint1 = 0;
    curPoint2 = 0;
    round++;
    sortZindex(gameScreen);

    let winner1 = checkAutoWin("player1");
    let winner2 = checkAutoWin("player2");
    if (winner1.isWinner && !winner2.isWinner) {
        totalPlayerScore += scoreSpecialCase;
        wait(1500).then(() => {
            showResult();
        });
    }
    if (winner2.isWinner && !winner1.isWinner) {
        totalComScore += scoreSpecialCase;
        wait(1500).then(() => {
            showResult();
        });
    }
    if (winner2.isWinner && winner1.isWinner) {
        wait(1500).then(() => {
            showResult();
        });
    }

    if (!winner1.isWinner && !winner2.isWinner) {
        playerCardsListener();
        fieldCardsListener();
        if (currentPlayer === "player1") {
            checkToHighLight();
        }

        if (!playerWinLastRound) {
            switchPlayer();
        }
    }
}

// Check the result after every turn
function checkResult() {
    let deck;
    if (currentPlayer === "player1") {
        deck = player1Deck;
    } else {
        deck = player2Deck;
    }
    let yakuList = checkYaku(currentPlayer);
    // If player can't form a yaku
    if (yakuList.length === 0) {
        // If player's deck/ computer's deck is not empty, switch player
        if (player1Deck.length !== 0 || player2Deck.length !== 0) {
            wait(DELAY_SWITCH_PLAYER).then(() => {
                switchPlayer();
            });
        } else {
            // Find the winner
            let endCards = checkOutOfCards();
            // Player or computer wins
            if (endCards) {
                wait(DELAY_SHOW_OPTIONS).then(() => {
                    showOptions(endCards.yakuList, false);
                    renderEndGameText();
                });
            } else {
                // If draw
                wait(DELAY_SHOW_OPTIONS).then(() => {
                    renderDraw();
                });
            }
        }
    } else {
        // If creates new yaku
        if (deck.length !== 0) {
            // If player's deck/ computer's deck is not empty, show options
            wait(DELAY_SHOW_OPTIONS).then(() => {
                // Only show options for player1
                if (currentPlayer === "player1") {
                    showOptions(yakuList);
                } else {
                    let choice = Math.random() >= 0.5 ? 1 : 2;
                    showOptions(yakuList, false);
                    optionSelected(choice);
                }
            });
        } else {
            // End that game, chose option 2
            wait(DELAY_SHOW_OPTIONS).then(() => {
                showOptions(yakuList, false);
                optionSelected(2);
            });
        }
    }

    return false;
}

// In case out of cards, find the player with higher score
function checkOutOfCards() {
    let yaku1 = checkYaku("player1", true);
    let yaku2 = checkYaku("player2", true);

    // If score>=minScoreToBeDoubled, x2
    if (curPoint1 > curPoint2) {
        if (curPoint1 >= minScoreToBeDoubled) {
            totalPlayerScore += curPoint1 * 2;
        } else {
            totalPlayerScore += curPoint1;
        }
        return { yakuList: yaku1 };
    } else if (curPoint2 > curPoint1) {
        if (curPoint1 >= minScoreToBeDoubled) {
            totalComScore += curPoint2 * 2;
        } else {
            totalComScore += curPoint2;
        }
        return { yakuList: yaku2 };
    } else {
        return false;
    }
}

// Show the number of current round and start game
function showRoundAndStartGame() {
    gameBackground.zIndex = 45;
    sortZindex(gameScreen);
    startScreen.visible = false;
    resultScreen.visible = false;
    gameScreen.visible = true;
    roundText.texture = id[`round${round + 1}.png`];
    roundText.visible = true;
    wait(DELAY_SHOW_ROUND).then(() => {
        roundText.visible = false;
        newGame();
    });
}

// Random who goes first
function randomFirstPlayer(choice) {
    let playerFirst = true;
    let num1 = randomInt(0, 48);
    let num2 = randomInt(0, 48);
    let month1 = listCardName[num1].slice(0, 3);
    let month2 = listCardName[num2].slice(0, 3);
    while (month1 === month2) {
        num2 = randomInt(0, 48);
        month2 = listCardName[num2].slice(0, 3);
    }
    randomCard1.texture = Texture.fromImage(`./images/${listCardName[num1]}`);
    randomCard2.texture = Texture.fromImage(`./images/${listCardName[num2]}`);

    if (choice === 1) {
        if (MONTHS.indexOf(month1) < MONTHS.indexOf(month2)) {
            playerFirst = true;
            turnText.texture = Texture.fromImage("first.png");
        } else {
            playerFirst = false;
            turnText.texture = Texture.fromImage("second.png");
        }
    } else if (choice === 2) {
        if (MONTHS.indexOf(month1) > MONTHS.indexOf(month2)) {
            playerFirst = true;
            turnText.texture = Texture.fromImage("first.png");
        } else {
            playerFirst = false;
            turnText.texture = Texture.fromImage("second.png");
        }
    }

    resetAllData();

    wait(1000).then(() => {
        [randomCard1, randomCard2, turnText, finger].forEach(el => (el.visible = false));

        if (playerFirst) {
            playerWinLastRound = true;
        } else {
            playerWinLastRound = false;
        }
        showRoundAndStartGame();
    });
}

function resetAllData() {
    startScreen.visible = true;
    gameScreen.visible = false;
    resultScreen.visible = false;
    turnText.visible = true;
    totalPlayerScore = 0;
    totalComScore = 0;
    score1.text = totalPlayerScore;
    score2.text = totalComScore;
    round = 0;
    restartText.visible = false;
    defeatText.visible = false;
    [randomCard1, randomCard2].forEach(el => (el.interactive = false));
}


function adjustOnTablet(w, h, newWidth, newHeight) {
    if (w <= maxTabletWidth) {
        if (w > h) {
            addCustomBtn(w, h, newWidth, newHeight);
        } else {
            if (customBtn) {
                customBtn.style.visibility = "hidden";
            }
        }
    }
}

function addCustomBtn(w, h, newWidth, newHeight) {
    if (!customBtn) {
        let imgHtml = `
            <a target="_blank" class='button' href=${customLink}><img src='./images/custombtn.png'/></a>
            `;
        canvas.insertAdjacentHTML("afterend", imgHtml);
        customBtn = document.querySelector(".button");
        setBtnPosition(w, newWidth, newHeight);
    } else {
        customBtn.style.visibility = "visible";
    }
}

function setBtnPosition(w, newWidth, newHeight) {
    let btnWidth;
    let sideSpace = (w - newWidth) / 2;

    if (w < bigMobileWidth) {
        btnWidth = sideSpace < 100 ? sideSpace + "px" : "100px";
    } else {
        btnWidth = sideSpace < 150 ? sideSpace + "px" : "150px";
    }
    let marginRight = sideSpace / 2;
    customBtn.style.right = `${marginRight}px`;
    customBtn.style.top = `${newHeight / 2}px`;
    customBtn.style.transform = `translate(50%,-50%)`;
    customBtn.style.width = btnWidth;
}
