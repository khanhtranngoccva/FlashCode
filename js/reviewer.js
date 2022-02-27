(function () {
    const CLOSE_BUTTON = document.querySelector("#review_card_wrapper .close_button");
    const REVIEW_CARD_WRAPPER = document.querySelector("#review_card_wrapper");
    const REVIEW_FRONT = document.querySelector("#review_front");
    const REVIEW_BACK = document.querySelector("#review_back");
    const REVIEW_BACK_BLOCK = document.querySelector("#review_back_block");
    const SELF_GRADING_PANEL = document.querySelector(".self_grading_panel");
    let [review_front_editor, review_back_editor] = [REVIEW_FRONT, REVIEW_BACK].map(element => {
        let editor = ace.edit(element, {mode: "ace/mode/javascript"});
        editor.getSession().setUseWrapMode(true);
        editor.setTheme("ace/theme/dracula");
        editor.setOption("indentedSoftWrap", false);
        editor.setOptions({
            readOnly: true,
            highlightActiveLine: false,
            highlightGutterLine: false,
            dragEnabled: false,
        });
        editor.renderer.$cursorLayer.element.style.opacity = 0
        return editor;
    });
    let current_deck;
    let current_card;
    CLOSE_BUTTON.addEventListener("click", () => {
        REVIEW_CARD_WRAPPER.style.display = "none";
    })
    function update_SM2(card, deck, performance) {
        let review_success;
        // OG algorithm, but I shortened it to 3 days.
        if (performance > 3) {
            if (card.recall_streak === 0) {
                card.interval = 1;
            } else if (card.recall_streak === 1) {
                card.interval = 3;
            } else {
                card.interval = Math.round(card.interval * card.easiness);
            }
            card.recall_streak++;
            review_success = true;
        } else {
            card.recall_streak = 0;
            card.interval = 0;
            review_success = false;
        }
        card.easiness = card.easiness + 0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02);
        if (card.easiness < 1.3) {
            card.easiness = 1.3;
        }
        // Edit the card's due date.
        card.due_date = new Date().getTime() + (card.interval * 86400 * 1000);
        // The card isn't new anymore.
        card.new_card = false;
        // Mutability patch by deep cloning.
        all_decks.update(deck, {ID: card.ID}, row=>JSON.parse(JSON.stringify(card)));
        all_decks.commit();
        return review_success;
    }
    let cards_to_review = [];
    function grab_cards(deck_name) {
        const non_new_cards = shuffle(all_decks.queryAll(deck_name, {query: (card) => card.due_date <= new Date().getTime() && card.new_card === false}));
        let new_cards = [];
        if (non_new_cards.length < REVIEW_SIZE) {
            new_cards = shuffle(all_decks.queryAll(deck_name, {query: {new_card: true}}).slice(0, REVIEW_SIZE - non_new_cards.length));
        }
        return [...non_new_cards, ...new_cards];
    }
    function draw_card() {
        current_card = cards_to_review.shift();
        if (current_card === undefined) {
            REVIEW_CARD_WRAPPER.style.display = "none";
            return;
        }
        review_front_editor.session.setMode(`ace/mode/${current_card.front_type.toLowerCase()}`);
        review_front_editor.setValue(current_card.front);
        review_front_editor.clearSelection();
        review_back_editor.session.setMode(`ace/mode/${current_card.back_type.toLowerCase()}`);
        review_back_editor.setValue(current_card.back);
        review_back_editor.clearSelection();
        REVIEW_BACK_BLOCK.style.display = "flex";
        SELF_GRADING_PANEL.style.opacity = "0";         
    }
    REVIEW_BACK_BLOCK.addEventListener("click", () => {
        REVIEW_BACK_BLOCK.style.display = "none";
        SELF_GRADING_PANEL.style.opacity = "1";
    });
    $(SELF_GRADING_PANEL).on("click", "button", function() {
        const performance = parseInt($(this).attr("score"));
        if (!!update_SM2(current_card, current_deck, performance)) {
            console.log("Review success!");
        } else {
            console.log("Review failure.");
            cards_to_review.push(current_card);
        }
        document.dispatchEvent(refresh_deck_list);
        draw_card();
    })
    $("#all_decks").on("click", ".review_deck", function () {
        current_deck = $(this).attr("target");
        cards_to_review = grab_cards(current_deck);
        REVIEW_CARD_WRAPPER.style.display = "flex";
        draw_card();
    });
    
})();