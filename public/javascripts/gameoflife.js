/*
 * gameoflife.js
 * 
 * Conway's game of life simulator in javascript.
 */

// special global vars
var timer = null;

$(function () {
  // Some globals
  var rows = $("#game-of-life tr").length;
  var cols = $("#game-of-life tr:first td").length;
  var cell = function (r, c) {
    return $("#cell-" + r + "-" + c);
  }
  var num_neighbours = function (r, c) {
    n = 0;
    // Up
    if($("#cell-" + ((rows + r - 1) % rows) + "-" + ((cols + c - 1) % cols)).hasClass('active')) n++;
    if($("#cell-" + ((rows + r - 1) % rows) + "-" + c                      ).hasClass('active')) n++;
    if($("#cell-" + ((rows + r - 1) % rows) + "-" + ((cols + c + 1) % cols)).hasClass('active')) n++;
    // Middle
    if($("#cell-" + r                       + "-" + ((cols + c - 1) % cols)).hasClass('active')) n++;
    if($("#cell-" + r                       + "-" + ((cols + c + 1) % cols)).hasClass('active')) n++;
    // Down
    if($("#cell-" + ((rows + r + 1) % rows) + "-" + ((cols + c - 1) % cols)).hasClass('active')) n++;
    if($("#cell-" + ((rows + r + 1) % rows) + "-" + c                      ).hasClass('active')) n++;
    if($("#cell-" + ((rows + r + 1) % rows) + "-" + ((cols + c + 1) % cols)).hasClass('active')) n++;
    
    return n;
  };
  
  $(".cell").click(function () {
    $(this).toggleClass("active");
  });
  var step_one_generation = function () {
    changed = false;
    for(var row = 0; row < rows; ++row) {
      for(var col = 0; col < cols; ++col) {
        neighbours = num_neighbours(row, col);
        if (cell(row,col).hasClass('active')) {
          if (neighbours != 2 && neighbours != 3) {
            cell(row, col).removeClass('active');
            changed = true;
          }
        }
        else {
          if (neighbours == 3) {
            cell(row, col).addClass('active');
            changed = true;
          }
        }
      }
    }
    if (changed == false && timer != null) {
      window.clearInterval(timer);
      timer = null;
      alert("Simulation ended");
    }
  };
  
  $("#start-simulation").click(function () {
    if(timer == null) {
      timer = window.setInterval(step_one_generation, 500);
    }
  });
  $("#step-one-generation").click(step_one_generation);
});