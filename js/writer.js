(function() {
    const ADD_CARD_WRAPPER = document.querySelector("#add_card_wrapper");
    const FRONT = document.querySelector("#add_front");
    const BACK = document.querySelector("#add_back");
    const ADD_CARD_BUTTON = document.querySelector(".add_card_button");
    const INPUT_TYPE_SELECT = $(".add_card_input_type");
    let [add_front_editor, add_back_editor] = [FRONT, BACK].map(element=>{
        let editor = ace.edit(element, {mode: "ace/mode/javascript"});
        editor.getSession().setUseWrapMode(true);
        editor.setTheme("ace/theme/dracula");
        editor.setOption("indentedSoftWrap", false);
        editor.setOption("enableEmmet", true);
        return editor;
    });
    $(ADD_CARD_BUTTON).on("click", ()=>{
        const front_value = add_front_editor.getValue();
        const back_value = add_back_editor.getValue();
        const front_type = $("#add_front_input_type").val();
        const back_type = $("#add_back_input_type").val();
        all_decks.insert(ADD_CARD_WRAPPER.getAttribute("target"), {
            front: front_value,
            back: back_value,
            front_type: front_type,
            back_type: back_type,
            new_card: true,
            due_date: new Date().getTime(),
            tags: [],
            recall_streak: 0,
            interval: 0,
            easiness: 2.5,
        });
        all_decks.commit();
        add_back_editor.setValue("");
        add_front_editor.setValue("");
    });
    for (let mode of MODES) {
        const mode_lowercase = mode.toLowerCase(); 
        INPUT_TYPE_SELECT.append(`<option value="${mode_lowercase}">${mode}</option>`);
    }
    $("#add_front_input_type").on("change", function(){
        add_front_editor.getSession().setMode(`ace/mode/${this.value}`);
    });
    $("#add_back_input_type").on("change", function(){
        add_back_editor.getSession().setMode(`ace/mode/${this.value}`);
    });
})();