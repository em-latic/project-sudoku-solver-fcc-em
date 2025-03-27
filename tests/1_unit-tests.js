const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

solver = new Solver();

suite('Unit Tests', () => {

    // Logic handles a valid puzzle string of 81 characters
    test("1 - Valid Puzzle", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const res = solver.validate(puzzle);
        assert.isTrue(res);
    });

    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    test("2 - Invalid character", () => {
        const puzzle = '1.5..2.84..63.12.7.2..x.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const res = solver.validate(puzzle);
        assert.isNotTrue(res);
    });

    // Logic handles a puzzle string that is not 81 characters in length
    test("3 - Short puzzle", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....';
        const res = solver.validate(puzzle);
        assert.isNotTrue(res);
    });

    // Logic handles a valid row placement
    test("4 - Valid row placement", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const res = solver.checkRowPlacement(puzzle, 1, 4, 7);
        assert.isTrue(res);
    });

    // Logic handles an invalid row placement
    test("5 - Invalid row placement", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const res = solver.checkRowPlacement(puzzle, 1, 4, 5);
        assert.isNotTrue(res);
    });

    // Logic handles a valid column placement
    test("6 - Valid column placement", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const res = solver.checkColPlacement(puzzle, 3, 1, 5);
        assert.isTrue(res);
    });

    // Logic handles an invalid column placement
    test("6 - Valid column placement", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const res = solver.checkColPlacement(puzzle, 3, 1, 4);
        assert.isNotTrue(res);
    });

    // Logic handles a valid region (3x3 grid) placement
    test("8 - Valid region placement", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const res = solver.checkRegionPlacement(puzzle, 7, 3, 8);
        assert.isTrue(res);
    });

    // Logic handles an invalid region (3x3 grid) placement
    test("9 - Invalid region placement", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const res = solver.checkRegionPlacement(puzzle, 7, 3, 2);
        assert.isNotTrue(res);
    });

    // Valid puzzle strings pass the solver
    test("10 - Valid puzzle solver", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const solution = solver.solve(puzzle);
        assert.isOk(solution);
    });

    // Invalid puzzle strings fail the solver
    test("11 - Invalid puzzle solver", () => {
        const puzzle = '1.55.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const solution = solver.solve(puzzle);
        assert.isNotTrue(solution);
    });

    // Solver returns the expected solution for an incomplete puzzle
    test("12 - Solution for puzzle solver", () => {
        const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const solved = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
        const solution = solver.solve(puzzle);
        assert.equal(solution, solved);
    });
});
