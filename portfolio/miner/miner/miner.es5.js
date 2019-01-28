'use strict';
/*
This is a simple implementation of miner game.
There are 2 global functions:
 makeMinerBoard(where, mineCount, width, height, cellSize, cellSpacing)
and
 resetMinerBoard(where)
The first one takes id of placeholder and build gamefield in it.
The second one reset field to initial state.

Tis file doesn't implements UI for timer, counter, game control. Instead it implements a set of events for building this items by yourself.

Example of full implementation see in miner-wrapper.html
*/
// miner game namespace

require("regenerator-runtime/runtime");

require("core-js/modules/es6.number.constructor");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

(function () {
  var _marked =
  /*#__PURE__*/
  regeneratorRuntime.mark(neighborCells),
      _marked2 =
  /*#__PURE__*/
  regeneratorRuntime.mark(allCells);

  // exported
  /////////////////////////////////////////////////////////////
  // function builds a new field as last child of
  // node where and fills it with mines
  function makeMinerBoard(where, mineCount, width, height) {
    var cellSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 30;
    var cellSpacing = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2;
    //
    // outer table element
    var tbl = document.createElement("table");
    tbl.classList.add("miner-table");
    tbl.classList.add("miner-table-uninitialized");
    tbl.style.tableLayout = "fixed";
    tbl.style.width = width * (cellSize + cellSpacing) + "px"; //fixed width for

    tbl.style.emptyCells = "show";
    tbl.style.borderSpacing = cellSpacing + "px";
    tbl.setAttribute("data-mines", mineCount);
    tbl.addEventListener('click', onCellClick);
    tbl.addEventListener("contextmenu", onCellRClick); // tbody element

    var tb = document.createElement("tbody");
    tbl.appendChild(tb);

    for (var rn = 0; rn < height; rn++) {
      // row element
      var r = document.createElement("tr");
      r.className = "miner-row";

      for (var cn = 0; cn < width; cn++) {
        // cell element
        var c = document.createElement("td");
        c.className = "miner-cell";
        c.style.width = cellSize + "px";
        c.style.height = cellSize + "px";
        c.style.fontSize = Math.floor(cellSize * 0.8) + "px";
        c.style.textAlign = "center";
        c.style.verticalAlign = "middle";
        c.style.borderWidth = "0px";
        r.appendChild(c);
      }

      tb.appendChild(r);
    }

    document.getElementById(where).appendChild(tbl); // fire event

    fireMinerEvent(tbl, "minerfieldready");
  } // exported
  /////////////////////////////////////////////////////////////
  // start new game on the same field


  function resetMinerBoard(where) {
    var tbl = document.getElementById(where).querySelector("table");
    tbl.classList.add("miner-table");
    tbl.classList.add("miner-table-uninitialized");
    tbl.classList.remove("miner-table-frozen");
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = allCells(tbl)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var c = _step.value;
        c.className = "miner-cell";
        c.removeAttribute("data-neighbors");
      } // fire event

    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    fireMinerEvent(tbl, "minerfieldready");
  } // place count minis on field table, but not in the currentCell


  function placeMines(tbl, count, currentCell) {
    var rowLimit = tbl.rows.length;
    var colLimit = tbl.rows[0].cells.length; // place mines

    minesLoop: for (var mine = 0; mine < count; mine++) {
      var limit = 100; // max attempts count

      do {
        if (! --limit) break minesLoop;
        var r = Math.floor(Math.random() * rowLimit);
        var c = Math.floor(Math.random() * colLimit);
        var cell = tbl.rows[r].cells[c];
      } while (cell == currentCell || cell.classList.contains("miner-cell-mine"));

      cell.classList.add("miner-cell-mine");
    } // fore each cell count amount of neighbors


    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = allCells(tbl)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var c = _step2.value;
        var nbcnt = 0;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = neighborCells(c)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var nc = _step3.value;
            if (nc.classList.contains("miner-cell-mine")) nbcnt++;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        c.setAttribute("data-neighbors", nbcnt);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  } // handles left click


  function onCellClick(e) {
    // if not need to open - return
    if (e.target.tagName !== "TD") return;
    if (e.target.closest("table").classList.contains("miner-table-frozen")) return;
    if (e.target.classList.contains("miner-cell-flag")) return;
    if (e.target.classList.contains("miner-cell-opened")) return; // parent table

    var tbl = e.target.closest("table"); // if it is a first click, set all mines on the field

    if (tbl.classList.contains("miner-table-uninitialized")) {
      placeMines(tbl, tbl.dataset.mines, e.target);
      tbl.classList.remove("miner-table-uninitialized");
    }

    markAsOpened(e.target); // fire open cell event

    fireMinerEvent(e.target, "mineropencell");

    if (e.target.classList.contains("miner-cell-mine")) {
      // lock field and show all mines
      tbl.classList.add("miner-table-frozen"); // fire fail event

      fireMinerEvent(e.target, "minerfail");
    } else {
      // check if all cells opened
      var score = fillEvent({}, tbl);

      if (score.cells === score.opend + score.mines) {
        tbl.classList.add("miner-table-frozen"); // fire win event

        fireMinerEvent(e.target, "minerwin");
      }
    }
  } // function opens all neighbor cells
  // for cells with zero neighbor mines.


  function markAsOpened(cell) {
    cell.classList.add("miner-cell-opened");
    cell.classList.remove("miner-cell-flag");

    if (cell.dataset.neighbors === "0") {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = neighborCells(cell)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var nb = _step4.value;
          if (nb.classList.contains("miner-cell-opened")) continue;
          markAsOpened(nb);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  } // handles right click


  function onCellRClick(e) {
    e.preventDefault();
    if (e.target.tagName !== "TD") return;
    if (e.target.classList.contains("miner-cell-opened")) return;
    if (e.target.closest("table").classList.contains("miner-table-frozen")) return;
    e.target.classList.toggle("miner-cell-flag"); // fire event

    fireMinerEvent(e.target, "minersetflag");
  } // auxiliary function fires event of appropriated type and attributes


  function fireMinerEvent(target, type) {
    var primaryEvent = new Event(type, {
      bubbles: true,
      cancelable: true
    });
    fillEvent(primaryEvent, target);
    target.dispatchEvent(primaryEvent);
  } // fill all fields in event object
  // the second parameth - cell, for click on which event triggered


  function fillEvent(event, target) {
    var tbl = target.closest("table"); // fill with static data

    event.mines = Number(tbl.dataset.mines);
    event.cells = tbl.rows.length * tbl.rows[0].cells.length; // count dynamic data

    event.marked = 0;
    event.opend = 0;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = allCells(tbl)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var c = _step5.value;
        if (c.classList.contains("miner-cell-flag")) event.marked++;
        if (c.classList.contains("miner-cell-opened")) event.opend++;
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return event;
  } /////////////////////////////////////////////////////////////
  // generator gets any cell of table, and
  // returns iterator, which iterate through
  // all neighbor cells
  // intented usage:
  // for(i of neighborCells(e.target)){...}


  function neighborCells(cell) {
    var cellRow, cellCol, rowLimit, colLimit, r, c;
    return regeneratorRuntime.wrap(function neighborCells$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (cell.matches("td")) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            cellRow = cell.closest("tr").rowIndex;
            cellCol = cell.cellIndex;
            rowLimit = cell.closest("table").rows.length;
            colLimit = cell.closest("tr").cells.length;
            r = cellRow - 1;

          case 7:
            if (!(r <= cellRow + 1)) {
              _context.next = 24;
              break;
            }

            if (!(r < 0 || r >= rowLimit)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("continue", 21);

          case 10:
            c = cellCol - 1;

          case 11:
            if (!(c <= cellCol + 1)) {
              _context.next = 21;
              break;
            }

            if (!(r == cellRow && c == cellCol)) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("continue", 18);

          case 14:
            if (!(c < 0 || c >= colLimit)) {
              _context.next = 16;
              break;
            }

            return _context.abrupt("continue", 18);

          case 16:
            _context.next = 18;
            return cell.closest("table").rows[r].cells[c];

          case 18:
            c++;
            _context.next = 11;
            break;

          case 21:
            r++;
            _context.next = 7;
            break;

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _marked, this);
  } /////////////////////////////////////////////////////////////
  // generator gets table or any cell in table and
  // returns iterator, which iterate through
  // all cells of this table


  function allCells(point) {
    var tbl, rowLimit, colLimit, r, currentRow, c;
    return regeneratorRuntime.wrap(function allCells$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            tbl = point.closest("table");
            rowLimit = tbl.rows.length;
            colLimit = tbl.rows[0].cells.length;
            r = 0;

          case 4:
            if (!(r < rowLimit)) {
              _context2.next = 16;
              break;
            }

            currentRow = tbl.rows[r];
            c = 0;

          case 7:
            if (!(c < colLimit)) {
              _context2.next = 13;
              break;
            }

            _context2.next = 10;
            return currentRow.cells[c];

          case 10:
            c++;
            _context2.next = 7;
            break;

          case 13:
            r++;
            _context2.next = 4;
            break;

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _marked2, this);
  } // miner game export


  window.makeMinerBoard = makeMinerBoard;
  window.resetMinerBoard = resetMinerBoard;
})();
