const REVIEW_SIZE = 20;
const MODES = ["JavaScript", "HTML", "CSS", "Python", "TypeScript"];
const VERSION = "0.0.0alpha";
const refresh_deck_list = new Event("refresh_deck_list");
ace.config.set("basePath", "https://pagecdn.io/lib/ace/1.4.13");

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}