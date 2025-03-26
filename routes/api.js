'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      if(puzzle.length !== 81){
        return res.json({ error: "Expected puzzle to be 81 characters long" });
      }

      const coordRegex = /^[a-iA-I][1-9]$/;
      if(!coordRegex.test(coordinate)) {
        return res.json({ error:"Invalid coordinate" });
      }

      const valuesOk = /^[1-9]$/;
      if(!valuesOk.test(value)) {
        return res.json({ error:"Invalid value" });
      }

      const code = coordinate[0].toUpperCase().charCodeAt(0) - 64; // map coordinate letters to num values (1-9) using ASCII values: to uppercase, A >> 65
      const rowNr = code;
      const colNr = coordinate[1];

      const isValueInRowOk = solver.checkRowPlacement(puzzle, rowNr, colNr, value);
      const isValueInColOk = solver.checkColPlacement(puzzle, rowNr, colNr, value);
      const isValueInRegionOk = solver.checkRegionPlacement(puzzle, rowNr, colNr, value);

      if(isValueInRowOk && isValueInColOk && isValueInRegionOk){
        return res.json({ valid: true });
      }
      else{
        let conflicts = [];
        if(!isValueInRowOk) conflicts.push("row");
        if(!isValueInColOk) conflicts.push("column");
        if(!isValueInRegionOk) conflicts.push("region");

        return res.json({ valid: false, conflict: conflicts });
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {

      const puzzle = req.body.puzzle;

      if(puzzle.length !== 81){
        return res.json({ error: "Expected puzzle to be 81 characters long" });
      }

      const solution = solver.solve(puzzle);
      if(solution === "No solution"){
        return res.json({ error : "Puzzle cannot be solved" });
      }

      res.json({ solution: solution });

    });
};
