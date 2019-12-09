// Fade animation
function fadeAnimation(sprite, delta) {
    sprite.alpha += fadeSpeed * delta;
    if (sprite.alpha >= 1.4) {
        sprite.alpha = 1;
        fadeSpeed *= -1;
    }
    if (sprite.alpha <= 0.3) {
        sprite.alpha = 0.3;
        fadeSpeed *= -1;
    }
}

// Animate color of the covers
function animateCardColor(delta) {
    if (currentPlayer === "player1") {
        if (colorAnimating) {
            if (count >= 1) {
                count = 1;
                speed = -FADE_OUT_SPEED;
            } else if (count <= 0) {
                count = 0;
                speed = FADE_IN_SPEED;
            }
            count += speed * delta;
            [...player1Deck, ...fieldDeck].forEach(sprite => {
                sprite.cover1.alpha = count;
            });
        }
    }
}

// Animate white outline around the card
function animateAttachCard(delta) {
    if (currentAttachedCard) {
        if (currentAttachedCard.outline.visible === true) {
            if (currentAttachedCard.outline.alpha > 0) {
                currentAttachedCard.outline.scale.x += 0.0015 * delta;
                currentAttachedCard.outline.scale.y += 0.0015 * delta;

                currentAttachedCard.outline.alpha -= 0.05 * delta;
            } else {
                currentAttachedCard.outline.visible = false;
            }
        }
    }
}

// States run across the screen
function stateAnimation(delta) {
    [koiText, endText].forEach(el => {
        if (el.visible === true && !textRunFinished) {
            if (el.x < 120) {
                el.x += el.speed * delta;
            } else {
                el.speed = 0;
                el.x = 120;
                textRunFinished = true;
            }
        }
    });
}

// Breath animation
function breathAnimation(sprite, top, bot, delta) {
    sprite.y += sprite.vy * delta;
    if (sprite.y >= top) {
        sprite.y = top;
        sprite.vy = -Math.abs(sprite.vy);
    }
    if (sprite.y <= bot) {
        sprite.y = bot;
        sprite.vy = Math.abs(sprite.vy);
    }
}
