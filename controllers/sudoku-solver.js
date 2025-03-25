class SudokuSolver {

  validate(puzzleString) {
    let isValid = true;

    const digitSum = 1+2+3+4+5+6+7+8+9; // should be 45

    let acc = 0;
    puzzleString.forEach(element => {
      acc += Number(element);
    });
    if(acc !== digitSum*9){
      return false;
    }

    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        const row = i + 1;
        const col = j + 1;

        let isValidInRow = this.checkRowPlacement(puzzleString, row, col, puzzleString[i+j]);
        let isValidInCol = this.checkColPlacement(puzzleString, row, col, puzzleString[i+j]);
        let isValidInRegion = this.checkRegionPlacement(puzzleString, row, col, puzzleString[i+j]);

        isValid = isValidInRow &&  isValidInCol && isValidInRegion;
        if(!isValid) {
          return false;
        }
      } // loop for columns
    }// loop for rows

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const sectionIndex = (row - 1) * 9;
    const rowValues = puzzleString.slice(sectionIndex, sectionIndex + 9);
    
    for(let i=0; i<9; i++){
      if(rowValues[i] === '.' || i === column - 1) continue;
      if(value == rowValues[i]) return false; // the placed value exists already in the row; use '==' to compare to string
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colValues = [];
    for(let i=0; i<9*9; i+=9){
      colValues.push(puzzleString[column - 1 + i]);
    }
    for(let i=0; i<9; i++){
      if(colValues[i] === '.' || i === row - 1) continue;
      if(value == colValues[i]) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowFactor = 0; // defines the rows to move to reach 'upper-left' pivot, in any of the 9 3x3 grids
    let colFactor = 0; // defines the cols to move to reach pivot

    if(row % 3 === 0) {
      rowFactor = 2; // 'moves up' 2 places (for rows 3, 6 & 9)
    }
    else if(row % 3 === 2) {
      rowFactor = 1; // 'moves up' 1 place (rows 2, 5 & 8)
    }

    if(column % 3 === 0) {
      colFactor = 2; // 'moves left' 2 places
    }
    else if(column % 3 === 2) {
      colFactor = 1; // 'moves left' 1 place
    }

    let regionValues = [];

    const pivotRowIdx = row - rowFactor - 1 // offset by the rowFactor and -1 to account for 0-based arrays
    const pivotColIdx = column - colFactor - 1 // offset by the colFactor and -1 to adjust col# vs 0-based index

    for(let i = 0; i < 3; i++){
      const complexIdx = (pivotRowIdx+i)*9 + pivotColIdx; // each i-iteration moves down 1 row (i.e. +9)
      const rowSection = puzzleString.slice(complexIdx, complexIdx + 3 ); //extracts a 1x3 row section to copy 
      regionValues = regionValues.concat([...rowSection]);  //copies a 1x3 section to the region
    }

    //loop to check region for duplicate with 'value'
    for(let i=0; i<9; i++){
      if(regionValues[i] === '.') continue; // no value has been assigned yet to cell -> '.'
      //if( i === rowFactor + columnFactor - 1 ) continue; //is the same cell we are checking, but it should be '.' at this point?
      if(value == regionValues[i]) return false; // the same value already exists in the region
    }

    return true; // indicate the value is possible in this position of the region (not necessarily the correct one)
  }

  solve(puzzleString) {
    let solutionSpace = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let solutions = [];

    let missingInRow = []
    let missingInCol = []
    let missingInReg = []
    const nums = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };


    let solved = puzzleString.slice(0);

    let assignCounter = 0; //tracks how many cells are assigned a value in a given round
    let missingCounter = 9 * 9; // tracks how many values/cells need to be assigned

    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] === '.') {
        solutions[i] = solutionSpace.slice();
      }
      else {
        solutions[i] = puzzleString[i];
        missingCounter--; //decrement the # of cells that need solving
      }
    }

    // check if there are cells in the scope (i.e. row, colunm or region) that are the only place a value can be assigned in
    //function checkUniqueProvider(scope, ) {}

    // keep trying until all cells have a value
    while (missingCounter > 0) {

      // LOOP through the whole puzzle, checking possible solution values for each element/cell (LOOP A)
      
      for (let i = 0; i < puzzleString.length; i++) {

        let current = solved[i];  //puzzleString[i];
        let possibleValues = solutions[i].slice();

        const rowNr = Math.floor(i / 9) + 1;
        const colNr = i % 9 + 1;

        assignCounter = 0; // Reset counter

        if (current === '.') {
          //if(possibleValues.length)
          for (var val in possibleValues) {
            // if a 'val' (e.g. 1,5,8) fails 1 check, it is removed from possible solutions
            let value = possibleValues[val];

            let isValidRow = this.checkRowPlacement(puzzleString, rowNr, colNr, value);
            let isValidCol = this.checkColPlacement(puzzleString, rowNr, colNr, value);
            let isValidReg = this.checkRegionPlacement(puzzleString, rowNr, colNr, value);

            if (!isValidRow || !isValidCol || !isValidReg) {
              if (solutions[i].length === 1) {
                // this means the last possible value is also invalid
                return 'No solution';
              }
              let invalidVal = solutions[i].splice(val, 1); // remove from list of options for this cell
            }
            else if (solutions[i].length === 1) { // only 1 possible value left, and it is also valid
              solved[i] = value;
              solutions[i] = value;
              assignCounter++; // increment the # of solutions found in this round
              missingCounter--;
            }

          }
        }

      } // Loop A


      // Check the rows for values with unique placings:
      for (let i = 0; i < 81; i += 9) {
        do {
          let valueFound = false; // reset flag

          if (!solved.slice(i, i + 9).includes('.')) continue; // avoid new iteration in fully solved rows

          const rowNums = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };

          for (let j = 0; j < 9; j++) {
            if (solved[i + j] === '.') { // for empty cells, we determine if a value can only be found there (i.e. 'provided by' that element) 
              solutions[i + j].forEach(num => {
                rowNums[num]++;
              });
            }
          }// loop by col

          // Find keys with val=1 (unique occurrences)
          const uniqueVals = Object.keys(rowNums).filter(key => rowNums[key] === 1);

          if (uniqueVals.length > 0) {
            valueFound = true;

            uniqueVals.forEach(val => {
              for (let j = 0; j < 9; j++) {
                if (solved[i + j] === '.') {
                  if (solutions[i + j].includes(val)) { // this meams this solution array contains the value, which we know can only be placed here for this row 
                    solved[i + j] = val; // assign value to cell
                    solutions[i + j] = [val];
                    missingCounter--; // decrement # of cells yet to be filled
                  }
                }
              }// loop by col
            })

          }
        }
        while (valueFound)

      }// loop by row

    } // WHILE loop


  }// solve()

}

module.exports = SudokuSolver;

