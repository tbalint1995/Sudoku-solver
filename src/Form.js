//React ...
import React,{useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Firebase
import firebaseDB from "./firebase.js";

// Mui V5
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize'

function App() {

    const useStyles = makeStyles({

        root0: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: '20px',
        padding: '15px',
        //margin: '50px',
          
        display: 'flex',
        verticalAlign: 'center',
        flexDirection: 'column'
          
        },

      root1: {
        background: 'linear-gradient(0deg, rgba(34,195,39,1) 34%, rgba(17,232,219,1) 77%);',
        border: 0,
        borderRadius: 20,
        boxShadow: '-5px 10px 5px -1px rgba(17,153,85,0.75);',
        color: 'white',
        height: 30,
        padding: '12px 20px',
        margin: '2px',
        width:"10%"
       
      },

      root2: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: '20px',
        color: "red"
          
        },

    });
    
  const[state,setState] = useState({
    name: "",
    email: "",
    subject: "",
    message:""
  });

  const {name,email,subject,message} =state;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Kérjük, minden beviteli mezőben adjon meg értéket");
    } else {
      firebaseDB.child("form").push(state);
      setState({ name: "", email: "", subject: "", message: "" });
      toast.success("Az űrlap sikeresen elküldve. Köszönjük, hogy velünk játszott!");
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const classes = useStyles();
  return (
  <section className={classes.root0}>
      <ToastContainer position="top-center"/>
      <Typography component="h1" style={{color: 'red'}}>
      Küldj nekünk üzenetet!
    </Typography>
                  <form id="contactForm" className="contactForm" onSubmit={handleSubmit}>
                    
                          <Grid item xs={4}>
                          <TextField  
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Név"
                          onChange={handleInputChange}
                          value={name}

                          required
                          variant="filled"
                          color="warning"
                          sx={{ input: { color: 'red' } }}
                          />
                          </Grid>
                          <Grid item xs={4}>
                          <TextField
                          type="email"
                          className="form-control"
                          name="email"
                          placeholder="Email"
                          onChange={handleInputChange}
                          value={email}

                          required
                          variant="filled"
                          color="warning"
                          sx={{ input: { color: 'red' } }}

                          />
                          </Grid>
                        <Grid item xs={4}>
                        <TextField 
                          type="text"
                          className="form-control"
                          name="subject"
                          placeholder="A feladat szintje"
                          onChange={handleInputChange}
                          value={subject}

                          required
                          variant="filled"
                          color="warning"
                          sx={{ input: { color: 'red' } }}
                          />
                          </Grid>
                        <Grid item xs={4}>
                        <TextareaAutosize style={{width: '100%'}}
                          type="text"
                          className={classes.root2}
                          name="message"
                          placeholder="Hogy tetszett a feladat?"
                          onChange={handleInputChange}
                          value={message}
                          required
                          />
                          </Grid>
                        <FormGroup>
                          <Button style={{alignSelf: 'center'}}
                                type="submit" 
                                value="Send Message"
                                className={classes.root1}>
                                Küldés
                            </Button>
                        </FormGroup>
                      
                  </form>
    
  </section>
  );
}

export default App;