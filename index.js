"use strict";
exports.__esModule = true;
//#endregion
//#region Variables Declaration
var prepare = {};
prepare.cards = [];
prepare.progress = 0;
prepare.fullTrack = new Audio('./assets/audio/fulltrack.mp3');
prepare.flipAudio = new Audio('./assets/audio/flip.mp3');
prepare.goodAudio = new Audio('./assets/audio/good.mp3');
prepare.failAudio = new Audio('./assets/audio/fail.mp3');
prepare.gameOverAudio = new Audio('./assets/audio/game-over.mp3');
prepare.fullTrack.loop = true;
var numberOfCards = 20;
var tempNumbers = [];
var cardsHtmlContent = '';
//#endregion
//#region Functions Declaration
var getRandomInt = function (min, max) {
    var result;
    var exists = true;
    min = Math.ceil(min);
    max = Math.floor(max);
    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!tempNumbers.find(function (no) { return no === result.toString(); })) {
            exists = false;
            tempNumbers.push(result.toString());
        }
    }
    return result;
};
var toggleFlip = function (index) {
    prepare.fullTrack.play();
    var card = prepare.cards[index];
    if (!card.flip && card.clickable) {
        flip(card, index);
        selectCard(card, index);
    }
};
var flip = function (card, index) {
    prepare.flipAudio.play();
    if (card) {
        card.flip = card.flip === '' ? 'flip' : '';
        document.getElementById("card-flip-" + index).classList.value = card.flip;
    }
};
var selectCard = function (card, index) {
    if (!prepare.selectedCard_1) {
        prepare.selectedCard_1 = card;
        prepare.selectedIndex_1 = index;
    }
    else if (!prepare.selectedCard_2) {
        prepare.selectedCard_2 = card;
        prepare.selectedIndex_2 = index;
    }
    if (prepare.selectedCard_1 && prepare.selectedCard_2) {
        if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
            prepare.selectedCard_1.clickable = false;
            prepare.selectedCard_2.clickable = false;
            prepare.selectedCard_1 = null;
            prepare.selectedCard_2 = null;
            stopAudio(prepare.failAudio);
            stopAudio(prepare.goodAudio);
            prepare.goodAudio.play();
            changeProgress();
            checkFinish();
        }
        else {
            setTimeout(function () {
                stopAudio(prepare.failAudio);
                stopAudio(prepare.goodAudio);
                prepare.failAudio.play();
                flip(prepare.selectedCard_1, prepare.selectedIndex_1);
                flip(prepare.selectedCard_2, prepare.selectedIndex_2);
                prepare.selectedCard_1 = null;
                prepare.selectedCard_2 = null;
            }, 1000);
        }
    }
};
var changeProgress = function () {
    var progress = prepare.cards.filter(function (card) { return !card.clickable; }).length / numberOfCards * 100;
    var progressElement = document.getElementById('progress');
    progressElement.style.width = progress + "%";
    progressElement.innerText = progress + "%";
};
var checkFinish = function () {
    if (prepare.cards.filter(function (card) { return !card.clickable; }).length === numberOfCards) {
        /** End of Game */
        stopAudio(prepare.fullTrack);
        stopAudio(prepare.failAudio);
        stopAudio(prepare.goodAudio);
        prepare.gameOverAudio.play();
    }
};
var stopAudio = function (audio) {
    if (audio && audio.played) {
        audio.pause();
        audio.currentTime = 0;
    }
};
//#endregion
//#region Game Logic
for (var index = 0; index < numberOfCards / 2; index++) {
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: "./assets/images/" + index + ".jpg",
        flip: '',
        clickable: true,
        index: index
    });
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: "./assets/images/" + index + ".jpg",
        flip: '',
        clickable: true,
        index: index
    });
}
prepare.cards.sort(function (a, b) { return a.id > b.id ? 1 : -1; });
prepare.cards.forEach(function (item, index) {
    cardsHtmlContent += "\n    <span class=\"col-sm-3 col-lg-2\">\n        <!-- Card Flip -->\n        <div onclick=\"toggleFlip(" + index + ")\" class=\"card-flip\">\n            <div id=\"card-flip-" + index + "\">\n                <div class=\"front\">\n                    <!-- front content -->\n                    <div class=\"card\">\n                        <img class=\"card-image\" src=\"./assets/back.jpg\" alt=\"Loading...\">\n                        <span class=\"card-content\">" + (index + 1) + "</span>\n                    </div>\n                </div>\n                <div class=\"back\">\n                    <!-- back content -->\n                    <div class=\"card\">\n                        <img src=\"./assets/images/" + item.index + ".jpg\" alt=\"Image [100%x180]\" data-holder-rendered=\"true\"\n                            style=\"height: 120px; width: 100%; display: block;\">\n                    </div>\n                </div>\n            </div>\n        </div>\n        <!-- End Card Flip -->\n    </span>\n    ";
});
document.getElementById('cards').innerHTML = cardsHtmlContent;
//#endregion
