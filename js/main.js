(function () {
    const ADD_DECK_BUTTON = document.querySelector("#add_deck_button");
    const ADD_DECK_WRAPPER = document.querySelector(".add_deck_wrapper");
    const CONFIRM_ADD_DECK_BUTTON = document.querySelector("#confirm_add_deck");
    const CANCEL_ADD_DECK_BUTTON = document.querySelector("#cancel_add_deck");
    const ADD_DECK_INPUT = document.querySelector("#add_deck_input");
    const OVERLAY = document.querySelector(".blocker_overlay_1");

    function toggle_add_deck_wrapper(on_off) {
        if (!!on_off) {
            ADD_DECK_WRAPPER.style.display = "flex";
            OVERLAY.style.display = "block";
        } else {
            ADD_DECK_WRAPPER.style.display = "none";
            OVERLAY.style.display = "none";
        }
    }

    CONFIRM_ADD_DECK_BUTTON.addEventListener("click", function () {
        const return_code = add_deck(ADD_DECK_INPUT.value);
        if (return_code === 0) {
            ADD_DECK_INPUT.value = "";
            toggle_add_deck_wrapper(0);
        }
    });
    CANCEL_ADD_DECK_BUTTON.addEventListener("click", () => toggle_add_deck_wrapper(0));
    ADD_DECK_BUTTON.addEventListener("click", () => toggle_add_deck_wrapper(1));
    ADD_DECK_WRAPPER.addEventListener("submit", e => e.preventDefault());
})();

(function () {
    const CARD_TEMPLATE = `<span class="main_menu_deck_title"></span>
                    <ul class="main_menu_deck_status_list">
                        <li class="main_menu_deck_status"><span class="status_count new">0</span><span
                                class="status_name">New Cards</span></li>
                        <li class="main_menu_deck_status"><span class="status_count to_review">0</span><span
                                class="status_name">To Review</span></li>
                        <li class="main_menu_deck_status"><span class="status_count learnt">0</span><span
                                class="status_name">Completed</span></li>
                    </ul>
                    <nav class="main_menu_deck_buttons">
                        <button class="main_menu_deck_button review_deck"><i class="fas fa-lightbulb"></i></button>
                        <button class="main_menu_deck_button add_card"><i class="fas fa-plus"></i></button>
                        <button class="main_menu_deck_button edit_deck"><i class="fas fa-pencil"></i></button>
                        <button class="main_menu_deck_button delete_deck"><i class="fas fa-trash"></i></button>
                    </nav>`
    const DECK_LIST = document.querySelector("#all_decks");
    document.addEventListener("refresh_deck_list", function () {
        const deck_names = get_all_decks();
        DECK_LIST.innerHTML = "";
        function is_card_due(card) {
            return card.due_date <= new Date().getTime() && !card.new_card;
        }
        function is_card_reviewed(card) {
            return card.due_date > new Date().getTime() && !card.new_card;
        }
        for (let name of deck_names) {
            const output_element = document.createElement("li");
            output_element.classList.add("main_menu_deck");
            output_element.innerHTML = CARD_TEMPLATE;
            output_element.querySelector(".main_menu_deck_title").innerText = name;
            output_element.querySelector(".delete_deck").setAttribute("target", name);
            DECK_LIST.append(output_element);
            output_element.querySelector(".add_card").setAttribute("target", name);
            output_element.querySelector(".new").innerText = all_decks.queryAll(name, {query: {new_card: true}}).length;
            output_element.querySelector(".to_review").innerText = all_decks.queryAll(name, {query: is_card_due}).length;
            output_element.querySelector(".learnt").innerText = all_decks.queryAll(name, {query: is_card_reviewed}).length;
            output_element.querySelector(".review_deck").setAttribute("target", name);
            output_element.querySelector(".edit_deck").setAttribute("target", name);
        }
    });
    document.dispatchEvent(refresh_deck_list);
})();

(function () {
    $("#all_decks").on("click", ".delete_deck", function () {
        remove_deck(this.getAttribute("target"));
    });
})();

(function () {
    const add_card_wrapper = document.querySelector("#add_card_wrapper");
    $("#all_decks").on("click", ".add_card", function () {
        add_card_wrapper.style.display = "flex";
        add_card_wrapper.setAttribute("target", this.getAttribute("target"));
    });
    add_card_wrapper.querySelector(".close_button").addEventListener("click", () => {
        add_card_wrapper.style.display = "none";
        document.dispatchEvent(refresh_deck_list);
    });
})();