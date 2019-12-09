// Game setup
const LOGICAL_WIDTH = 240,
    LOGICAL_HEIGHT = 240,
    CARD_WIDTH = 23,
    CARD_HEIGHT = 36.225,
    COVER_WIDTH = 28,
    COVER_HEIGHT = 41.5,
    MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
    TAN_MONTHS_3 = [],
    HIKARI_MONTHS_4 = [],
    CARD_ANIMATE_COLOR_1 = 0xfcf800,
    CARD_ANIMATE_COLOR_2 = 0xcc8c02,
    CARD_ANIMATE_COLOR_3 = 0xff2814,
    CARD_ANIMATE_COLOR_4 = 0xffffff,
    FADE_IN_SPEED = 0.05,
    FADE_OUT_SPEED = 0.03,
    SPACE_BETWEEN_PLAYER_CARDS = 6.85,
    SPACE_BETWEEN_COMPUTER_CARDS = 1,
    PRIORITY_MONTH = { month: 9, point: 10 },
    FIELD_CARD_SCALE = 0.75,
    DELAY_OPEN_RANDOM_CARD = 500,
    DELAY_HANDLE_CARD = 500,
    DELAY_SWITCH_PLAYER = 1500,
    DELAY_SHOW_OPTIONS = 1500,
    DELAY_SORT_SUB_CARDS = 500,
    DELAY_SORT_PLAYER_DECK = 500,
    DELAY_SHOW_ROUND = 1000,
    KOI_TEXT_SPEED = 2.5,
    END_TEXT_SPEED = 2.5,
    YAKU_CASES = [
        {
            point: 10,
            list: ["jan-4", "mar-4", "aug-4", "nov-4", "dec-4"],
            bonus: null
        },
        {
            point: 8,
            list: ["jan-4", "mar-4", "aug-4", "dec-4"],
            bonus: null
        },
        {
            point: 7,
            list: ["jan-4", "mar-4", "aug-4", "nov-4"],
            bonus: null
        },
        {
            point: 7,
            list: ["jan-4", "mar-4", "nov-4", "dec-4"],
            bonus: null
        },
        {
            point: 7,
            list: ["jan-4", "aug-4", "nov-4", "dec-4"],
            bonus: null
        },
        {
            point: 7,
            list: ["mar-4", "aug-4", "nov-4", "dec-4"],
            bonus: null
        },
        {
            point: 5,
            list: ["jan-4", "mar-4", "aug-4"],
            bonus: null
        },
        {
            point: 5,
            list: ["jan-4", "mar-4", "dec-4"],
            bonus: null
        },
        {
            point: 5,
            list: ["jan-4", "aug-4", "dec-4"],
            bonus: null
        },
        {
            point: 5,
            list: ["mar-4", "aug-4", "dec-4"],
            bonus: null
        },
        {
            point: 5,
            list: ["mar-4", "sep-4"],
            bonus: null
        },
        {
            point: 5,
            list: ["aug-4", "sep-4"],
            bonus: null
        },
        {
            point: 5,
            list: ["jun-4", "jul-4", "oct-4"],
            bonus: "tane"
        },
        {
            point: 10,
            list: ["jan-3", "feb-3", "mar-3", "jun-3", "sep-3", "oct-3"],
            bonus: "tan"
        },
        {
            point: 5,
            list: ["jun-3", "sep-3", "oct-3"],
            bonus: "tan"
        },
        {
            point: 5,
            list: ["jan-3", "feb-3", "mar-3"],
            bonus: "tan"
        }
    ],
    OTHERS_YAKU_CASES = [
        { type: "tane", amount: 5, point: 1 },
        { type: "tan", amount: 5, point: 1 },
        { type: "kasu", amount: 10, point: 1 }
    ];

MONTHS.forEach(el => {
    if (el !== "aug" && el !== "nov" && el !== "dec") {
        TAN_MONTHS_3.push(el);
    }
});

MONTHS.forEach(el => {
    if (el === "jan" || el === "mar" || el === "aug" || el === "nov" || el === "dec") {
        HIKARI_MONTHS_4.push(el);
    }
});

let idCards,
    id,
    frontFaceTexture,
    fadeSpeed = 0.023,
    cardUrls = [],
    listCardName = [],
    player1Deck = [],
    player2Deck = [],
    fieldDeck = [],
    restDeck = [],
    kasuList1 = [],
    kasuList2 = [],
    tanList1 = [],
    tanList2 = [],
    taneList1 = [],
    taneList2 = [],
    hikariList1 = [],
    hikariList2 = [],
    computerCards = [],
    fieldCardsHighLightedCur = [],
    fieldCardsHighLighted = [],
    playerCardsHighLighted = [],
    trackFieldCardPosition,
    scoreSpecialCase = 6,
    currentPlayer = "player1",
    playerWinLastRound = true,
    currentSprite,
    speed,
    minScoreToBeDoubled = 7,
    count = 0,
    isCardHovered = false,
    colorAnimating = false,
    isCardSelected = false,
    gotNewCard = false,
    playerKoiKoi = false,
    comKoiKoi = false,
    isWaiting = false,
    textRunFinished = false,
    endGameSelected = false,
    koiSelected = false,
    isDraw = false,
    tempYakuResultList = [],
    tempPointList = [], // List of text
    currentAttachedCard,
    round = 0,
    totalRounds = 6,
    curPoint1 = 0,
    curPoint2 = 0,
    totalPlayerScore = 0,
    totalComScore = 0,
    customBtn,
    paddingBottom = 48,
    minTabletWidth = 768,
    maxTabletWidth = 1400,
    bigMobileWidth = 700,
    customLink = "https://plala.s3-ap-northeast-1.amazonaws.com/web/hikari_game/index.html";
