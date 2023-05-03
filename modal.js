import $ from "./jquery.module.js";

// Get the modal
var modal = $("#modal");

// Get the button that opens the modal
var btn = $("#modal-btn");

// Get the done button
var doneBtn = $("#modal-done-btn");

// Get the <span> element that closes the modal
var span = $(".close:first");

// When the user clicks the button, open the modal
btn.click(function () {
  modal.css("display", "flex");
});

// When the user clicks on <span> (x), close the modal
span.click(function () {
  modal.css("display", "none");
});

doneBtn.click(function () {
  modal.css("display", "none");
});

// When the user clicks anywhere outside of the modal, close it
$(window).click(function (event) {
  if (event.target === modal[0]) {
    modal.css("display", "none");
  }
});
