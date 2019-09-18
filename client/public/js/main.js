/* eslint-env jquery, browser */
$(document).ready(() => {
  $('#stillWorkHere').change(function () {
    console.log($($("#projectEnd").parent().parent()[0]));
    if (this.checked) {
      $($("#projectEnd").parent().parent()[0]).addClass("d-none");
    } else {
      $($("#projectEnd").parent().parent()[0]).removeClass("d-none");
    }
  });
  $('#technologies').multiselect();
  $('#skillsRequired').multiselect();
  $('#industry').multiselect();
});