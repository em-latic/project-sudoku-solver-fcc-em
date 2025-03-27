class SudokuSolver {

  validate(puzzleString) {

    if(puzzleString.length !== 81) { 
      console.log('Wrong size of puzzle');
      return false;
    }

    const allowedVals = /[1-9]|\./;
    for(let i = 0; i<puzzleString.length; i++){
      if(!allowedVals.test(puzzleString[i])){
        console.log(`Invalid characters in puzzle: ${puzzleString[i]}`);
        return false;
      }
    }

    return true;
  }

  checkSolution(puzzleString) {
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

    if(!this.validate(puzzleString)) {
      return false;
    }

    //const nums = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };

    //let solved = puzzleString.slice(0);
    let solved = puzzleString.split('');

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

    let solutionsUpdated = false;

    // keep trying until all cells have a value
    do { // this means: if there are still empty cells AND (at least one was assigned in the loop OR a solution space was updated)

      assignCounter = 0; // Reset counter
      solutionsUpdated = false; // Reset state

      // LOOP through the whole puzzle, checking possible solution values for each element/cell (LOOP A)
      for (let i = 0; i < puzzleString.length; i++) {

        let current = solved[i];  //puzzleString[i];
        let possibleValues = solutions[i].slice();

        const rowNr = Math.floor(i / 9) + 1;
        const colNr = i % 9 + 1;

        //let solutionsUpdated = false; moved UP and used as while loop control

        //do{
          if (current === '.') {
            //solutionsUpdated = false; //Moved UP
  
            for (var val in possibleValues) {
              // if a 'val' (e.g. 1,5,8) fails 1 check, it is removed from possible solutions
              let value = possibleValues[val];
              let index = solutions[i].indexOf(value);
  
              let isValidRow = this.checkRowPlacement(solved, rowNr, colNr, value); // 'solved' instead of 'puzzleString'
              let isValidCol = this.checkColPlacement(solved, rowNr, colNr, value);
              let isValidReg = this.checkRegionPlacement(solved, rowNr, colNr, value);
  
              if (!isValidRow || !isValidCol || !isValidReg) {
                if (solutions[i].length === 1) {
  
                  console.log(`Cell # is ${i} and its last possible solution is ${solutions[i]}`);
                  console.log(`This is the solution so far ${solved} `);
  
                  // this means the last possible value is also invalid
                  console.log('No solution');
                  return false;   //"No solution";
                }
                //let invalidVal = solutions[i].splice(val, 1); // remove from list of options for this cell
                let invalidVal = solutions[i].splice(index, 1);
                solutionsUpdated = true;
  
                //////// DEBUG
                //
                    // if(i==13) {
                    //   //console.log(`The cell is ${i}`);
                    //   console.log(`Invalid value: ${invalidVal}`);
                    //   console.log(`Possible remaining : ${solutions[i]}`);
                    // }
                ///////
              }
              else if (solutions[i].length === 1) { // only 1 possible value left, and it is also valid
                solved[i] = value;
                //solutions[i] = value;
                assignCounter++; // increment the # of solutions found in this round
                missingCounter--;

                //DEBUG:
                //console.log(`Assigning value [${value}] to cell [${i}], corresponds to row [${rowNr}], col[${colNr}]  - Solutions were: ${solutions[i]} `);
              }
  
            }
          }
        //}
        //while(solutionsUpdated)
        

      } // Loop A


      // SINGLE PROVIDER checks:

      //  /*

      // Check the rows for values with unique placings:
      for (let i = 0; i < 81; i += 9) {
        let valueFound;

        do {
          valueFound = false; // reset flag

          if (!solved.slice(i, i + 9).includes('.')) continue; // avoid new iteration in fully solved rows

          const rowNums = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };
          let rowValues = [];

          for (let j = 0; j < 9; j++) {
            if (solved[i + j] === '.') { // for empty cells, we determine if a value can only be found there (i.e. 'provided by' that element) 
              solutions[i + j].forEach(num => { rowNums[num]++; });
            }
            else {
              rowValues.push(solved[i+j]); // add to tracking array
            }
          }// loop by col

          // Find keys with val=1 (unique occurrences)
          const uniqueVals = Object.keys(rowNums).filter(key => rowNums[key] === 1);

          if (uniqueVals.length > 0) {
            //valueFound = true;

            uniqueVals.forEach(val => {
              for (let j = 0; j < 9; j++) {
                if (solved[i + j] === '.') {

                  let rowNr = Math.floor((i + j)/9 + 1);
                  let colNr = (i + j) % 9 + 1;

                  // this ensures this solution array contains the value, which we know can only be placed here for this row (and also we still need this value)
                  if (solutions[i + j].includes(val) 
                    && !rowValues.includes(val)
                    && this.checkColPlacement(solved, rowNr, colNr, val) //added checks for MASTER level
                    && this.checkRegionPlacement(solved, rowNr, colNr, val)
                  ) 
                  { 
                    valueFound = true;

                    solved[i + j] = val; // assign value to cell
                    //solutions[i + j] = [val];
                    missingCounter--; // decrement # of cells yet to be filled
                    assignCounter++;

                    //DEBUG:
                    //console.log(`ROW Provider: Assigning Value [${val}] to Cell [${i+j}] in ROW [${rowNr}], COL[${colNr}] - Solutions were: ${solutions[i + j]}`);
                  }
                }
              }// loop by col
            })

          }
        }
        while (valueFound)
      }// loop by row


      // Check the columns for values with unique placings:
      for (let i = 0; i < 9; i++) {
        let valueFound;
        do {
          valueFound = false; // reset flag

          //if (!solved.slice(i, i + 9).includes('.')) continue; // avoid new iteration in fully solved cols

          const colNums = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };
          let colValues = [];

          for (let j = 0; j < 81; j+=9) {
            if (solved[i + j] === '.') {
              solutions[i + j].forEach(num => { colNums[num]++; });
            }
            else{
              colValues.push(solved[i + j]); // the value is already assigned, so we add to tracking array 
            }
          }// loop by row

          // Find keys with val=1 (unique occurrences)
          const uniqueVals = Object.keys(colNums).filter(key => colNums[key] === 1);

          if (uniqueVals.length > 0) {
            //valueFound = true; **might be causng infinite loop, since solutions space is not updated with new assignments

            uniqueVals.forEach(val => {
              for (let j = 0; j < 81; j+=9) {
                if (solved[i + j] === '.') {

                  let rowNr = Math.floor((i + j)/9 + 1);
                  let colNr = (i + j) % 9 + 1;

                  // we ensure value can only be placed here for this col & that we still dont have it assigned in this column
                  if (
                    solutions[i + j].includes(val) 
                    && !colValues.includes(val)
                    && this.checkRowPlacement(solved, rowNr, colNr, val) //added checks for MASTER level
                    && this.checkRegionPlacement(solved, rowNr, colNr, val)
                  ) 
                  { 
                    valueFound = true;

                    solved[i + j] = val; // assign value to cell
                    solutions[i + j] = [val];

                    missingCounter--; // decrement # of cells yet to be filled
                    assignCounter++;

                    //DEBUG:
                    //console.log(`COL Provider: Assigning Value [${val}] to Cell [${i+j}] in ROW [${rowNr}], COL[${colNr}] - Solutions were: ${solutions[i + j]}`);
                  }
                }
              }// loop by row
            })

          }
        }
        while (valueFound)
      }// loop by column


      // Check the regions for values with unique placings:
      for (let i = 0; i < 9; i++) {
        
        let valueFound;
        do {
          valueFound = false; // reset flag

          //if (!solved.slice(i, i + 9).includes('.')) continue; // avoid new iteration in fully solved cols

          const regNums = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };
          let regValues = [];

          let regionIndexes = [];
          for (let j = 0; j < 9; j+=3) {
            regionIndexes[j] = i*9 + j;
            regionIndexes[j+1] = i*9 + j+1;
            regionIndexes[j+2] = i*9 + j+2;
          }

          regionIndexes.forEach( idx => {
            if (solved[idx] === '.') {
              solutions[idx].forEach(num => { regNums[num]++; });
            }
            else {
              regValues.push(solved[idx]);
            }
          })

          const uniqueVals = Object.keys(regNums).filter(key => regNums[key] === 1);

          if (uniqueVals.length > 0) {
            //valueFound = true;

            uniqueVals.forEach(val => {

              regionIndexes.forEach( idx => {
                if (solved[idx] === '.') {

                  let rowNr = Math.floor((idx)/9 + 1);
                  let colNr = (idx) % 9 + 1;

                  // Ensure value can only be placed here for this region & we still need it
                  if (
                    solutions[idx].includes(val) 
                    && !regValues.includes(val)
                    && this.checkRowPlacement(solved, rowNr, colNr, val)
                    && this.checkColPlacement(solved, rowNr, colNr, val)
                  ) 
                  { 
                    valueFound = true;

                    solved[idx] = val;
                    //solutions[idx] = [val];
                    missingCounter--;
                    assignCounter++;

                    //DEBUG:
                    //console.log(`REGION Provider: Assigning Value [${val}] to Cell [${idx}] in ROW [${rowNr}], COL[${colNr}] - Solutions were: ${solutions[idx]}`);
                  }
                }
              })

            })

          }
        }
        while (valueFound)
      }// loop by region
      
      //  */

      // if(assignCounter === 0) {
      //   console.log(`Puzzle not solved completely ${solved}`);
      //   return solved.join('');
      // }

    } // WHILE loop
    while (missingCounter > 0 && (assignCounter > 0 || solutionsUpdated) ) 

    if(missingCounter > 0) console.log(`Puzzle not solved completely ${solved}`);

    return solved.join('');
  }// solve()

}

module.exports = SudokuSolver;

