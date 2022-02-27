"use strict";

let all_decks = new localStorageDB("decks", localStorage);

function add_deck(deck_name) {
    const DECK_EXISTS = document.querySelector("#deck_already_exists");
    const EMPTY_NAME = document.querySelector("#deck_empty_name");
    if (!deck_name) {
        pop_error_message(EMPTY_NAME);
        return 2;
    }
    if (all_decks.tableExists(deck_name)) {
        pop_error_message(DECK_EXISTS);
        return 1; // Table already exists.
    } else {
        all_decks.createTable(deck_name, ["front", "front_type", "back", "back_type", "new_card", "due_date", "tags", "recall_streak", "interval", "easiness"]);
        all_decks.commit();
        document.dispatchEvent(refresh_deck_list);
        return 0;
    }
}

function get_all_decks() {
    return Object.keys(JSON.parse(all_decks.serialize()).tables);
}

function remove_deck(deck_name) {
    all_decks.dropTable(deck_name);
    all_decks.commit();
    document.dispatchEvent(refresh_deck_list);
}



