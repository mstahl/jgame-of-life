/*
 * gameoflife.js
 * 
 * Conway's game of life simulator in javascript.
 */

$(function () {
  // Some globals
  var rows = $("#game-of-life").width() / 10;
  var cols = $("#game-of-life").width() / 10;
  
  var timer = null;
  var field = {};
  for(i = 0; i < rows; ++i) {
    field[i] = {};
    for(j = 0; j < cols; ++j) {
      field[i][j] = false;
    }
  }
  
  // Drawing stuff
  var canvas = document.getElementById('game-of-life');
  var context = canvas.getContext('2d');
  var frame_count = 0;
  
  // Set frame counter up
  window.setInterval(function () {
    $("#fps").text("fps: " + frame_count);
    frame_count = 0;
  }, 1000);
  
  var num_neighbours = function (r, c) {
    n = 0;
    // Up
    if(r > 0) {
      if(c > 0) 
        if(field[(rows + r - 1) % rows][(cols + c - 1) % cols]) n++;
      if(field[(rows + r - 1) % rows][c]) n++;
      if(c < cols)
        if(field[(rows + r - 1) % rows][(cols + c + 1) % cols]) n++;
    }
    // Middle
    if(c > 0)
      if(field[r][(cols + c - 1) % cols] == true) n++;
    if(c < cols)
      if(field[r][(cols + c + 1) % cols] == true) n++;
    // Down
    if(r < rows) {
      if(c > 0)
        if(field[(rows + r + 1) % rows][(cols + c - 1) % cols]) n++;
      if(field[(rows + r + 1) % rows][c]) n++;
      if(c < cols)
        if(field[(rows + r + 1) % rows][(cols + c + 1) % cols]) n++;
    }
    
    return n;
  };
  
  // Set onclick to toggle active state of cells
  var handle_mouse = function (e) {
    var row = Math.floor((e.layerY - $("#game-of-life").offset().top) / 10);
    var col = Math.floor((e.layerX - $("#game-of-life").offset().left) / 10);
    
    field[row][col] = !field[row][col];
    redraw();
  };
  $("#game-of-life").click(handle_mouse);
  
  
  var step_one_generation = function () {
    activate = [];
    deactivate = [];
    for(row = 0; row < rows; ++row) {
      for(col = 0; col < cols; ++col) {
        neighbours = num_neighbours(row, col);
        if (field[row][col]) {
          if (neighbours != 2 && neighbours != 3) {
            deactivate = deactivate.concat({row:row, col:col});
          }
        }
        else {
          if (neighbours == 3) {
            activate = activate.concat({row:row, col:col});
          }
        }
      }
    }
    if (activate.length + deactivate.length == 0 && timer != null) {
      window.clearInterval(timer);
      timer = null;
      alert("Simulation ended");
    }
    else {
      for(i = 0; i < activate.length; ++i) {
        field[activate[i].row][activate[i].col] = true;
      }
      for(j = 0; j < deactivate.length; ++j) {
        field[deactivate[j].row][deactivate[j].col] = false;
      }
      
      redraw();
    }
  };
  
  var redraw = function () {
    context.clearRect(0, 0, cols * 10, rows * 10);
    context.fillStyle = "rgb(0,255,0)";
    for(i = 0; i < rows; ++i) {
      for(j = 0; j < cols; ++j) {
        if(field[i][j]) {
          context.fillRect(j * 10, i * 10, 10, 10);
        }
      }
    }
    context.strokeStyle = "rgb(200,200,255)";
    context.beginPath();
    for(i = 0; i < rows; ++i) {
      context.moveTo(0, i * 10);
      context.lineTo(cols * 10, i * 10);
    }
    for(j = 0; j < cols; ++j) {
      context.moveTo(j * 10, 0);
      context.lineTo(10 * j, rows * 10);
    }
    context.stroke();
  };
  
  $("#start-simulation").click(function () {
    if(timer == null) {
      timer = window.setInterval(function () {
        step_one_generation();
        frame_count++;
      }, 1);
    }
  });
  $("#step-one-generation").click(step_one_generation);
  $("#stop-simulation").click(function () {
    window.clearInterval(timer);
    timer = null;
  });
  $("#clear").click(function () {
    field = {};
    for(i = 0; i < rows; ++i) {
      field[i] = {};
      for(j = 0; j < cols; ++j) {
        field[i][j] = false;
      }
    }
    
    redraw();
  });
  
  redraw();
});