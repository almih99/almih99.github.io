'use strict'

// add new day to schedule panel
function addNextDay() {
  var lastDate = $(this)
    .closest(".itinery-panel")
    .find(".datepicker:last")
    .val().substr(0,10);
  var newDate = (new Date(Date.parse(lastDate) + 24*60*60*1000))
    .toISOString().substr(0,10);
  var panel=$(`
    <div class="itenery-panel-one-day">
      <div class="row">
        <div class="col-xs-6 itenery-panel-day"><span class="glyphicon glyphicon-remove-sign glyphicon-red"></span> Day <span class="day-number">1</span></div>
        <div class="col-xs-6 text-right"><input type="text" class="datepicker" size="13" value= "${newDate} ▼"></div>
      </div>
      <div class="drop-target">Drag Destination Here</div>
    </div>`);
  panel.find(".datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yy-mm-dd ▼"
  });
  panel.find(".glyphicon-remove-sign").click(dismissThisDay);
  hangDnDTargetHandlers(panel.find(".drop-target"));
  $(this).parent().before(panel);
  // $(this).get(0).scrollIntoView();
  recountItinaryDays();
}

// remove day from schedule panel
function dismissThisDay() {
  $(this).closest(".itenery-panel-one-day").remove();
  recountItinaryDays();
}

// renumber all days on schedule panel
function recountItinaryDays() {
  $("span.day-number").text(n=>Number(n)+1);
}

// select places by category
function filterDestination(selector) {
  console.log(selector);
  switch(selector) {
    case 'filter-all':
      $('#dest-filter').html('All <span class="caret"></span>');
      break;
    case 'filter-mountains':
      $('#dest-filter').html('Mountains <span class="caret"></span>');
      break;
    case 'filter-entertainments':
      $('#dest-filter').html('Entertainments <span class="caret"></span>');
      break;
    case 'filter-beaches':
      $('#dest-filter').html('Beaches <span class="caret"></span>');
      break;
  }
  var all = $(".destination-list-panel .media");
  all.not("." + selector).slideUp("fast");
  all.filter("." + selector).slideDown("fast");
}

// print schedule
function printSchedule(e) {
  // hide everything except schedule
  $("body").addClass("print-schedule");
  print();
  // restore hidden items
  $("body").removeClass("print-schedule");
}

// DnD

// draggable object
var nowDragged = null;

// Set handlers for copying from source panel
function hangDnDPrimarySourceHandlers(dest) {

  function handleDragStart (e) {
    nowDragged = $(this).clone();
    $(".itinery-panel .drop-target").addClass("active");
    try {
      // for firefox
      e.originalEvent.dataTransfer.setData('Text', this.id);
    } catch(err) {
      console.log(err);
    }
  }

  function handleDragEnd (e) {
    hangDnDSecondarySourceHandlers(nowDragged);
    $(".itinery-panel .drop-target").removeClass("active");
    nowDragged = null;
  }

  dest.on("dragstart", handleDragStart)
      .on("dragend", handleDragEnd);
}

// Set handlers for moving in schedule panel
function hangDnDSecondarySourceHandlers(dest) {

  function handleDragStart (e) {
    nowDragged = $(this);
    $(".itinery-panel .drop-target").addClass("active");
    $(".itinery-panel .panel-footer").addClass("active");
    try {
      // for firefox
      e.originalEvent.dataTransfer.setData('Text', this.id);
    } catch(err) {
      console.log(err);
    }
  }

  function handleDragEnd (e) {
    nowDragged = null;
    $(".itinery-panel .drop-target").removeClass("active");
    $(".itinery-panel .panel-footer").removeClass("active");
  }

  dest.on("dragstart", handleDragStart)
      .on("dragend", handleDragEnd);
}

// Set handlers for drop target items
function hangDnDTargetHandlers(dest) {
  function handleDragEnter(e) {
    $(this).addClass("hovered");
    e.preventDefault();
  }

  function handleDrop(e) {
    if(!nowDragged) return;
    $(this).removeClass("hovered");
    $(this).before(nowDragged);
    nowDragged.css("display", "none");
    nowDragged.slideDown("fast");
  }

  function handleDragLeave(e) {
    $(this).removeClass("hovered");
    e.preventDefault();
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  dest.on("drop", handleDrop)
    .on("dragover", handleDragOver)
    .on("dragenter", handleDragEnter)
    .on("dragleave", handleDragLeave);
}

// Set handlers for remove panel
function hangDnDRemoveHandlers(dest) {
  function handleDragEnter(e) {
    $(this).addClass("hovered");
    e.preventDefault();
  }

  function handleDrop(e) {
    if(!nowDragged) return;
    $(this).removeClass("hovered");
    $(".itinery-panel .panel-footer").removeClass("active");
    nowDragged.remove();
  }

  function handleDragLeave(e) {
    $(this).removeClass("hovered");
    e.preventDefault();
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  dest.on("drop", handleDrop)
    .on("dragover", handleDragOver)
    .on("dragenter", handleDragEnter)
    .on("dragleave", handleDragLeave);
}

/*
initialization
*/
$(function() {
  $(".datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yy-mm-dd ▼"
  });

  $(".datepicker").val((new Date()).toISOString().substr(0,10) + " ▼");
  $("#add-button").click(addNextDay);
  $("#print-schedule").click(printSchedule);

  hangDnDTargetHandlers($(".drop-target"));
  hangDnDPrimarySourceHandlers($(".destination-list-panel [draggable]"));
  hangDnDRemoveHandlers($(".itinery-panel .panel-footer"));
});
