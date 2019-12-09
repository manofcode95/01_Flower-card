// Random int
function randomInt(min, max) {
    // RandomInt(1,8)-->[1,7]
    return Math.floor(Math.random() * (max - min)) + min;
}

// Random Negative
function randomNegative() {
    return Math.random() < 0.5 ? -1 : 1;
}

// Shuffle list
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = randomInt(0, array.length - 1); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
}

// Rotate random the image
function randomRadiant(degree, times) {
    let radiant = (degree * 3.14159) / 180;
    return radiant * randomInt(0, times);
}

// Resize handler
function resizeHandler() {
    let newWidth, newHeight, scaleFactor;
    const w = Math.max(window.innerWidth, document.documentElement.clientWidth);
    const h = Math.max(window.innerHeight, document.documentElement.clientHeight);

    if (w > h && w <= maxTabletWidth) {
        scaleFactor = Math.min((w - paddingBottom) / LOGICAL_WIDTH, (h - paddingBottom) / LOGICAL_HEIGHT);
    } else {
        scaleFactor = Math.min(w / LOGICAL_WIDTH, h / LOGICAL_HEIGHT);
    }

    newWidth = Math.ceil(LOGICAL_WIDTH * scaleFactor);
    newHeight = Math.ceil(LOGICAL_HEIGHT * scaleFactor);

    // Add custom btn
    adjustOnTablet(w, h, newWidth, newHeight);

    app.renderer.resize(newWidth, newHeight);
    app.stage.scale.set(scaleFactor);
}

// Get texture list
function getTextures(amounts, name, person = true) {
    textures = [];
    for (let i = 0; i <= amounts; i++) {
        let texture = Texture.fromImage(`${name}${i}.png`);
        textures.push(texture);
    }
    if (person) {
        textures.push(Texture.fromImage("front0.png"));
    }
    return textures;
}

// Set timeout function
function wait(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}

// Random coordinate
function randomV(target, limit, up = false) {
    let negative = randomNegative();
    let randomNum = randomInt(0, limit) / 10;
    if (up && negative === -1) {
        return target + (randomNum / 2) * negative;
    }
    return target + randomNum * negative;
}

// Create new sprite quickly
function newSprite(
    url,
    container,
    scale,
    width,
    height,
    anchorX = 0,
    anchorY = 0,
    x = 0,
    y = 0,
    visible = true,
    zIndex
) {
    let el = new Sprite(url);
    el.scale.set(scale);
    if (width) {
        el.width = width;
    }
    if (height) {
        el.height = height;
    }
    container.addChild(el);
    el.anchor.set(anchorX, anchorY);
    el.x = x;
    el.y = y;
    el.visible = visible;
    if (zIndex) {
        el.zIndex = zIndex;
    }
    return el;
}

// On, off interactive
function setInteractive(sprite, status) {
    sprite.interactive = status;
    sprite.buttonMode = status;
}

// Create new graphic quickly
function newGraphic(
    screen,
    shape,
    width,
    height,
    color,
    x = 0,
    y = 0,
    alpha = 1,
    visible = true
) {
    let graphic = new Graphics();
    graphic.beginFill(color, alpha);
    if (shape === "circle") {
        graphic.drawCircle(0, 0, width);
    } else if (shape === "rect") {
        graphic.drawRect(0, 0, width, height);
    }
    graphic.endFill();
    graphic.x = x;
    graphic.y = y;
    graphic.visible = visible;
    screen.addChild(graphic);
    return graphic;
}

// Sort elements based on zIndex
function sortZindex(screen) {
    screen.children.sort(function(a, b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return a.zIndex - b.zIndex;
    });
}

// Turn off interactive of list
function turnOffInteractive(list) {
    list.forEach(el => {
        el.interactive = false;
        el.buttonMode = false;
    });
}

// Turn on interactive of list
function turnOnInteractive(list, buttonMode = false) {
    list.forEach(el => {
        if (buttonMode) {
            el.buttonMode = buttonMode;
        }
        el.interactive = true;
    });
}

// Turn off visible of the list of sprites
function hideSprites(arr) {
    arr.forEach(el => (el.visible = false));
}

// Turn on visible of the list of sprites
function unHideSprites(arr) {
    arr.forEach(el => (el.visible = true));
}

// Find index of card based on name in the restDeck
function findIndexCardName(name) {
    return restDeck.findIndex(el => el.name === name);
}

// Destroy a whole list
function destroyList(arr, isCard = false) {
    arr.forEach(el => {
        if (!isCard) {
            el.destroy();
        } else {
            el.getDestroyed();
        }
    });
    arr.splice(0, arr.length);
}

// Search for type of card base on name
function searchTypeBasedOnName(name) {
    let month = name.split("-")[0],
        type;

    let i = name.split("-")[1].split(".")[0];
    if (i === "1") {
        type = "kasu";
    }

    if (i === "2") {
        if (month === "nov") {
            type = "tan";
        } else {
            type = "kasu";
        }
    }

    if (i === "3") {
        if (TAN_MONTHS_3.includes(month)) {
            type = "tan";
        } else {
            if (month === "aug" || month === "nov") {
                type = "tane";
            } else if (month === "dec") {
                type = "kasu";
            }
        }
    }

    if (i === "4") {
        if (HIKARI_MONTHS_4.includes(month)) {
            type = "hikari";
        } else {
            type = "tane";
        }
    }

    return type;
}

// Remove specific name out of the list
function findAndDeleteCardByName(name, arr) {
    let index = arr.indexOf(el => el.name === name);
    arr.splice(index, 1);
}

// Convert list of cards into list of card's names
function getCardNamesFromList(list) {
    return list.map(el => el.name);
}

// Check if arr1 contains elements of arr2
function checkArrayContainsArray(arr1, arr2) {
    return arr2.every(el => {
        return arr1.indexOf(el) >= 0;
    });
}
