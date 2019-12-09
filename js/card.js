class Card {
    constructor(name) {
        this.name = name;
    }

    createCover(zIndex) {
        let cover = newSprite(
            id["cover.png"],
            gameScreen,
            1,
            COVER_WIDTH,
            COVER_HEIGHT,
            0.5,
            0.5,
            0,
            0,
            false,
            zIndex
        );

        return cover;
    }

    createOutline() {
        let outline = newSprite(
            id["outline.png"],
            gameScreen,
            1,
            CARD_WIDTH,
            CARD_HEIGHT,
            0.5,
            0.5,
            0,
            0,
            false,
            20
        );
        return outline;
    }

    createSprite() {
        this.sprite = newSprite(
            Texture.fromImage(`./images/${this.name}`),
            gameScreen,
            1,
            CARD_WIDTH,
            CARD_HEIGHT
        );
        this.sprite.anchor.set(0.5);
        // this.sprite.position.set(this.x, this.y);

        // Attach the cover 1
        this.sprite.cover1 = this.createCover(10);
        // Attach the cover 2
        this.sprite.cover2 = this.createCover(5);
        // Attach outline
        this.sprite.outline = this.createOutline();

        // Attach functions
        this.sprite.setColorType1 = this.setColorCoverType1;
        this.sprite.setColorType2 = this.setColorCoverType2;
        this.sprite.showCovers = this.showCovers;
        this.sprite.hideCovers = this.hideCovers;
        this.sprite.moveTo = this.moveTo;
        this.sprite.scaleTo = this.scaleTo;
        this.sprite.getDestroyed = this.getDestroyed;

        // Set up sprite
        this.sprite.name = this.name.split(".")[0];
        this.sprite.buttonMode = false;
        this.sprite.interactive = true;
        this.sprite.canSelect = false;
        this.setMonth();
        this.setType();
        this.setPoint();
        this.sprite.zIndex = 15;
        this.sprite.visible = false;
        return this.sprite;
    }

    setMonth() {
        let month = this.name.split("-")[0];
        let num = MONTHS.indexOf(month) + 1;
        this.sprite.month = num;
    }

    setType() {
        let month = this.name.split("-")[0];
        let i = this.name.split("-")[1].split(".")[0];
        if (i === "1") {
            this.sprite.type = "kasu";
        }

        if (i === "2") {
            if (month === "nov") {
                this.sprite.type = "tan";
            } else {
                this.sprite.type = "kasu";
            }
        }

        if (i === "3") {
            if (TAN_MONTHS_3.includes(month)) {
                this.sprite.type = "tan";
            } else {
                if (month === "aug" || month === "nov") {
                    this.sprite.type = "tane";
                } else if (month === "dec") {
                    this.sprite.type = "kasu";
                }
            }
        }

        if (i === "4") {
            if (HIKARI_MONTHS_4.includes(month)) {
                this.sprite.type = "hikari";
            } else {
                this.sprite.type = "tane";
            }
        }
    }

    setColorCoverType1() {
        this.cover1.tint = CARD_ANIMATE_COLOR_1;
        this.cover2.tint = CARD_ANIMATE_COLOR_2;
    }

    setColorCoverType2() {
        this.cover1.tint = CARD_ANIMATE_COLOR_3;
        this.cover2.tint = CARD_ANIMATE_COLOR_4;
    }

    showCovers() {
        this.cover1.visible = true;
        this.cover2.visible = true;
    }

    hideCovers() {
        this.cover1.visible = false;
        this.cover2.visible = false;
    }

    moveTo(x, y) {
        [this, this.cover1, this.cover2, this.outline].forEach(el => {
            el.x = x;
            el.y = y;
        });
    }

    scaleTo(percent) {
        [this, this.cover1, this.cover2, this.outline].forEach(el => {
            el.width *= percent;
            el.height *= percent;
        });
    }

    setPoint() {
        if (this.sprite.type === "hikari") {
            this.sprite.point = 20;
        } else if (this.sprite.type === "tane") {
            this.sprite.point = 10;
        } else if (this.sprite.type === "tan") {
            this.sprite.point = 5;
        } else if (this.sprite.type === "kasu") {
            this.sprite.point = 1;
        }
    }

    getDestroyed() {
        this.outline.destroy();
        this.cover1.destroy();
        this.cover2.destroy();
        this.destroy();
    }
}
