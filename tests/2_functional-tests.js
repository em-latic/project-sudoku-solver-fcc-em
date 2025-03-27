const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    // Solve a puzzle with valid puzzle string: POST request to /api/solve
    test("1 - Solve valid puzzle API", (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end((err, res) => {
            assert.deepEqual(res.body, { solution: '135762984946381257728459613694517832812936745357824196473298561581673429269145378' });
            done();
        });
    })
    // Solve a puzzle with missing puzzle string: POST request to /api/solve
    test("2 - Solve missing puzzle API", (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '' })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: 'Required field(s) missing' });
            done();
        });
    })
    // Solve a puzzle with invalid characters: POST request to /api/solve
    test("3 - Solve puzzle invalid char API", (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '1.0..2.84..A3.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..1W....926914.37.' })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
            done();
        });
    })
    // Solve a puzzle with incorrect length: POST request to /api/solve
    test("4 - Solve puzzle incorrect length API", (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926' })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
            done();
        });
    })
    // Solve a puzzle that cannot be solved: POST request to /api/solve
    test("5 - Solve puzzle that cannot be solved API", (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
            done();
        });
    })

    // api/check
    
    // Check a puzzle placement with all fields: POST request to /api/check
    test("6 - Solve valid puzzle API", (done) => {
        chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end((err, res) => {
            assert.deepEqual(res.body, { solution: '135762984946381257728459613694517832812936745357824196473298561581673429269145378' });
            done();
        });
    })
    // Check a puzzle placement with single placement conflict: POST request to /api/check
    // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    // Check a puzzle placement with all placement conflicts: POST request to /api/check
    // Check a puzzle placement with missing required fields: POST request to /api/check
    // Check a puzzle placement with invalid characters: POST request to /api/check
    // Check a puzzle placement with incorrect length: POST request to /api/check
    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    // Check a puzzle placement with invalid placement value: POST request to /api/check

    

});

