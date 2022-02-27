"use strict";
(function () {
    const EDIT_CARD_WRAPPER = document.querySelector("#edit_card_wrapper");
    const FRONT_EDIT_DIV = document.querySelector("#edit_front");
    const BACK_EDIT_DIV = document.querySelector("#edit_back");
    const SEARCH_INPUT = document.querySelector("#card_search_input");
    const SEARCH_OUTPUT = document.querySelector("#card_search_output");
    const MODES = ["JavaScript", "HTML", "CSS", "Python", "TypeScript"];
    let current_deck;
    let current_card;
    let [front_editor, back_editor] = [FRONT_EDIT_DIV, BACK_EDIT_DIV].map(element => {
        let editor = ace.edit(element, {mode: "ace/mode/javascript"});
        element.addEventListener("input", update_this_card);
        element.addEventListener("paste", update_this_card);
        element.addEventListener("keyup", update_this_card);
        editor.getSession().setUseWrapMode(true);
        editor.setTheme("ace/theme/dracula");
        editor.setOption("indentedSoftWrap", false);
        editor.setOption("enableEmmet", true);
        return editor;
    });
    EDIT_CARD_WRAPPER.querySelector(".close_button").addEventListener("click", () => {
        EDIT_CARD_WRAPPER.style.display = "none";
        document.dispatchEvent(refresh_deck_list);
    });
    SEARCH_INPUT.addEventListener("input", () => {
        display_card_query();
    })

    function display_card_query() {
        try {
            let regex;
            let search_query = SEARCH_INPUT.value;
            if (search_query !== "") {
                regex = new RegExp(search_query, "gi");
            }
            let search_results = query_cards_in_deck(current_deck, regex);
            SEARCH_OUTPUT.innerHTML = "";
            for (let card of search_results) {
                add_card_ui_entry(card);
            }
        } catch (e) {
            return undefined;
        }
    }
    
    function add_card_ui_entry(card) {
        const new_element = document.createElement("li");
        new_element.classList.add("search_result");
        new_element.innerHTML = `<code class="search_result_front"></code><code class="search_result_back"></code>` 
        new_element.querySelector(".search_result_front").innerText = card.front;
        new_element.querySelector(".search_result_back").innerText = card.back;
        new_element.setAttribute("target", card.ID);
        SEARCH_OUTPUT.append(new_element);
    }

    function query_cards_in_deck(deck_name, regex) {
        if (regex !== undefined) {
            return all_decks.queryAll(deck_name, {query: function (card) {
                let front_matched = regex.test(card.front.replace(/\s/g, " ").replace(/\s+/g, " "));
                let back_matched = regex.test(card.back.replace(/\s/g, " ").replace(/\s+/g, " "));
                // console.log(front_matched, back_matched);
                return front_matched || back_matched;
            }});
        } else {
            return all_decks.queryAll(deck_name);
        }
    }

    $("#all_decks").on("click", ".edit_deck", function () {
        EDIT_CARD_WRAPPER.style.display = "flex";
        front_editor.setValue("");
        back_editor.setValue("");
        current_deck = $(this).attr("target");
        display_card_query();
    });

    $(SEARCH_OUTPUT).on("click", ".search_result", function() {
        current_card = all_decks.queryAll(current_deck, {query: {ID: parseInt($(this).attr("target"))}})[0];
        // console.log(current_card);
        front_editor.setValue(current_card.front);
        front_editor.clearSelection();
        back_editor.setValue(current_card.back);
        back_editor.clearSelection();
    })

    function update_this_card() {
        current_card.front = front_editor.getValue();
        current_card.back = back_editor.getValue();
        all_decks.update(current_deck, {ID: current_card.ID}, card=>JSON.parse(JSON.stringify(current_card)));
        all_decks.commit();
        display_card_query();
    }
})();