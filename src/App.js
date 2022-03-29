// react ... 
//import './App.css';
import { useState} from 'react';
import * as React from 'react';

// MUI5 
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createGlobalStyle } from 'styled-components';
import { makeStyles } from "@material-ui/core/styles"
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import MuiAlert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TableCell from '@mui/material/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Form from './Form';



//styled-components ...
const GlobalStyle = createGlobalStyle`
body{
  margin:0;
  padding:0px;
  background:url( https://wallpaperbat.com/img/449297-math-equations-wallpaper-2288x1617-42404.jpg );
  background-attachment: fixed;
  background-size: cover;
  background-position: center center;
}
#root{
  width:100%;
  display:flex;
  flex-direction: row;
  justify-content:center;
}
@media(max-width:576px){
  #root{
    width:100%;
    display:flex;
    flex-direction: column-reverse;
    justify-content:center;
  }
}
`


const initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1]
]

function App() {
  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initial));

  const useStyles = makeStyles({

    root0: {
      padding: '20px',
      textAlign: 'center'

    },

    root1: {
      background: 'linear-gradient(0deg, rgba(172,195,34,1) 0%, rgba(232,164,17,1) 45%);',
      border: 0,
      borderRadius: 20,
      boxShadow: '0 3px 5px 2px rgb(172,195,34)',
      color: 'white',
      height: 30,
      padding: '12px 20px',
      margin: '2px'
    },

    root2: {
      background: 'linear-gradient(0deg, rgba(195,36,34,1) 51%, rgba(232,164,17,1) 100%);',
      border: 0,
      borderRadius: 20,
      boxShadow: '0 3px 5px 2px rgb(195,34,34)',
      color: 'white',
      height: 30,
      padding: '12px 20px',
      margin: '2px'
    },

    root3: {
      background: 'linear-gradient(0deg, rgba(34,45,195,1) 49%, rgba(17,232,219,1) 98%);',
      border: 0,
      borderRadius: 20,
      boxShadow: '0 3px 5px 2px rgb(34,176,195)',
      color: 'white',
      height: 30,
      padding: '12px 20px',
      margin: '2px'
    }, 

    root4: {
      background: 'bisque',
      border: '3px solid bisque',
      borderCollapse: "collapse",
      margin: '20px'
    }, 

    root5: {
      width: '50px',
      height: '50px',
      fontSize: '20px',
      padding: '0px',
      border: '1px solid black',
      alignItems: "center",
    }, 
  });


    function getDeepCopy (arr) {
      return JSON.parse(JSON.stringify(arr));
    }

    function onInputChange(e, row, col) {
     var val = parseInt(e.target.value) || -1, grid = getDeepCopy(sudokuArr);
     // A bemeneti érték 1 és 9 között kell h legyen, üres cella esetén pedig -1 ...
     if (val ===-1 || val >=1 && val <=9) {
      grid[row] [col] = val;
     }
     setSudokuArr(grid);
    }
    
    //függvény a sudokuk összehasonlításához
    function compareSudokus (currentSudoku, solvedSudoku) {
      let res = {
        isComplete: true,
        isSolvable: true
      }
      for (var i=0; i < 9; i++) {
        for(var j=0; j < 9; j++) {
          if (currentSudoku[i] [j] !=solvedSudoku[i] [j]) {
            if (currentSudoku[i] [j] != -1) {
              res.isSolvable = false;
            }
            res.isComplete = false;
          }
        }
      }
      return res;
    }

    // függvény a sudoku érvényességének ellenőrzésére vagy sem ... 
    function checkSudoku() {
     
      let sudoku = getDeepCopy(initial);
      solver(sudoku);
      let compare = compareSudokus(sudokuArr, sudoku);
      
      if (compare.isComplete) {
      setShowAlert1("Congratulations! You have solved Sudoku!");
    } else if (compare.isSolvable) {
      setShowAlert2("Keep going!");
    }else {
      setShowAlert3("Sudoku can't be solved. Try again");
    }
    }

    function checkRow(grid, row, num) {
      return grid[row].indexOf(num) === -1
    }

      //ellenőrző szám egyedi a col ... 
      function checkCol(grid, col, num) {
        return grid.map(row => [col]).indexOf(num) === -1;
      }

      //Az ellenőrző szám egyedi a dobozban ...
      function checkBox(grid, row, col, num) {
        //get Box start index
        let boxArr= [],
        rowStart = row - (row%3),
        colStart = col - (col%3);
        for (let i=0; i < 3; i++) {
          for (let j=0; j < 3; j++) {
            //get all the cell numbers and push to boxArr
            boxArr.push(grid[rowStart + i] [colStart +j]);
          }
        }

        return boxArr.indexOf(num) === -1;
      }

      function checkValid(grid, row, col, num) {
        // A számnak egyedinek kell lennie a sorban, a oszlopban és a 3x3 négyzetben
        if(checkRow(grid, row, num) && checkCol(grid, col, num) && checkBox(grid, row, col, num)) {
        return true;
      }
      return false;
    }

    function getNext (row, col) {
     // ha a oszlop eléri a 8-at, növelje a sor számát
     // ha a sor eléri a 8-at és az oszlop eléri a 8-at, a következő lesz [0,0]
     // ha a col nem éri el a 8-at, növelje a oszlop számát
      return col !==8 ? [row, col +1] : row !=8 ? [row+1, 0] : [0, 0];
    }
    
    // rekurzív függvény a sudoku megoldásához
    function solver(grid, row=0, col=0) {


      //ha az aktuális cella már megtelt, ugorjon a következő cellára
      if (grid[row] [col] !==-1) {
        // for last cell, dont solve it
        let isLast = row >=8 && col>=8;
        if(!isLast) {
          let [newRow, newCol] = getNext(row, col);
          return solver (grid, newRow, newCol);
        }
      }

      for (let num=1; num <=9; num++) {
        //ellenőrizze, hogy ez a szám megfelel-e a sudoku-korlátoknak
        if (checkValid(grid, row, col, num)) {
            //a cellában lévő szám kitöltése
            grid[row] [col] = num;
            // Következő cella beszerzése és ismételje meg a funkciót
            let [newRow, newCol] = getNext(row, col);

            if(!newRow && !newCol) {
              return true;
            }

            if (solver(grid, newRow, newCol)) {
              return true;
            }
        }
      }


    // ha érvénytelen, töltse ki -1-gyel
    grid[row] [col] = -1;
    return false;
  }


    // függvény a sudoku megoldására érvényes-e vagy sem ...
    function solveSudoku() {
      let sudoku = getDeepCopy(initial);
      solver(sudoku);
      setSudokuArr(sudoku);
    }

    // függvény a sudoku visszaállításához érvényes-e vagy sem ... 
    function resetSudoku() {
      let sudoku = getDeepCopy(initial);
      setSudokuArr(sudoku);
    }

    const theme = createTheme();
    const classes = useStyles();
    const [showAlert1, setShowAlert1] = useState(null);
    const [showAlert2, setShowAlert2] = useState(null);
    const [showAlert3, setShowAlert3] = useState(null);
    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

  return (
    <ThemeProvider theme={theme}>
    <GlobalStyle/>
    <Form/>
    <Box>
    <Typography component="h1" variant="8" style={{color: '#29b6f6', textAlign: 'center'}}>
        Sudoku solver
    </Typography>
    
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
    {showAlert1 && <Alert severity='success' sx={{ width: '40%' }} onClose={() => setShowAlert1(null)} > { showAlert1 } </Alert>}
    {showAlert2 && <Alert severity='info' sx={{ width: '40%' }} onClose={() => setShowAlert2(null)} > { showAlert2 } </Alert>}
    {showAlert3 && <Alert severity='error' sx={{ width: '40%' }} onClose={() => setShowAlert3(null)} > { showAlert3 } </Alert>}
    </Grid>
        <TableCell  className={classes.root4}>
          <TableBody>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
                return <tr border-bottom= "2px solid black" key={rIndex} className={(row + 1) %3 === 0 ? 'bBorder' : ''}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                    return <td   key={rIndex + cIndex} className={(col + 1) %3 === 0 ? 'rBorder' : ''}>
                      <input onChange={(e) => onInputChange(e, row,col)} value={sudokuArr[row] [col]  === -1 ? '' : sudokuArr[row] [col]} 
                      className={classes.root5}
                       disabled={initial[row] [col] !== -1}/>
            </td>
              })}
             </tr>
            })
          }
          </TableBody>
          </TableCell>
         <Box 
           className={classes.root0}>
           <Button 
           className={classes.root1}
           onClick={checkSudoku}>
           Check
           </Button>
           <Button 
           className={classes.root2}
           onClick={solveSudoku}>
           Solve
           </Button>
           <Button 
           className={classes.root3}
           onClick={resetSudoku}>
           Reset
           </Button>
         </Box>
      </Box>
    </ThemeProvider>
  );
}


export default App;