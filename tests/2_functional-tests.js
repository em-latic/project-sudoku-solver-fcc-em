const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    // 'API: solve' functional Tests
    //
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
            assert.deepEqual(res.body, { error: 'Required field missing' });
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


    // 'API: check' functional Tests
    //
    // Check a puzzle placement with single placement conflict: POST request to /api/check
    test("7 - Check placement with 1 conflict API", (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send(
            { 
            puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', 
            coordinate: 'A2', 
            value: 7 
        })
        .end((err, res) => {
            assert.deepEqual(res.body, { valid: false, conflict: ["row"] });
            done();
        })
    });

    // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    test("8 - Check placement with multiple conflicts API", (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send(
            { 
            puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', 
            coordinate: 'b2', 
            value: 8 
        })
        .end((err, res) => {
            assert.deepEqual(res.body, { valid: false, conflict: ["row", "column"] });
            done();
        })
    });

    // Check a puzzle placement with all placement conflicts: POST request to /api/check
    test("9 - Check placement with all conflicts API", (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send(
            { 
            puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', 
            coordinate: 'b2', 
            value: 5 
        })
        .end((err, res) => {
            assert.deepEqual(res.body, { valid: false, conflict: ["row", "column", "region"] });
            done();
        })
    });

    // Check a puzzle placement with missing required fields: POST request to /api/check
    test("10 - Check placement with missing fields API", (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send(
            { 
            puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', 
            coordinate: 'A1',
            value: ""
        })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: "Required field(s) missing" });
            done();
        })
    });

    // Check a puzzle placement with invalid characters: POST request to /api/check
    test("11 - Check placement in puzzle with invalid characters API", (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send(
            { 
            puzzle: '..839.7.575..X..964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', 
            coordinate: 'A1',
            value: "1"
        })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
            done();
        })
    });
    // Check a puzzle placement with incorrect length: POST request to /api/check
    test("12 - Check placement in puzzle of incorrect length API", (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send(
            { 
            puzzle: '839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492', 
            coordinate: 'A1',
            value: "1"
        })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
            done();
        })
    });
    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    test("13 - Check placement with invalid coordinate API", (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send(
            { 
            puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', 
            coordinate: 'X10',
            value: "5"
        })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: "Invalid coordinate" });
            done();
        })
    });
    // Check a puzzle placement with invalid placement value: POST request to /api/check
    test("14 - Check placement with invalid value API", (done) => {
        chai
        .request(server)
        .post('/api/check')
        .send(
            { 
            puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', 
            coordinate: 'a1',
            value: "10"
        })
        .end((err, res) => {
            assert.deepEqual(res.body, { error: "Invalid value" });
            done();
        })
    });
});

