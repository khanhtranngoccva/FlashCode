// ERROR MESSAGE
function pop_error_message(element) {
    element.classList.remove("pop_out");
    setTimeout(()=>element.classList.add("pop_out"), 1);
}

// THEMES FOR HEADER WINDOW
(function() {
    ["ace-dracula", "ace-chrome"].map((x)=>$(".code_window_header, .card_browser").addClass(x));
}());