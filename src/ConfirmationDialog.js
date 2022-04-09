import React, { useEffect, useContext} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Snackbar, SnackbarContent } from '@material-ui/core';
import { PageContext} from './App.js';
export function ConfirmationDialog(props) {
  const agreeProcess = (boolen) => {
    props.agreeProcess(boolen);
  };
  const handleClose = () => {
    props.dialogclose();
  };
  useEffect(() => {

  }, []);
  return (
    <div>
      <Dialog
        open={props.dialogopen}
        onClose={props.dialogclose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are confirm to delete record ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" size="small"  onClick={()=>agreeProcess(true)} color="primary">
            OK
          </Button>
          <Button variant="contained" size="small"  onClick={handleClose} color="default" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function SnapBarError(props) {
  const snapBar = {
    open: false,
    vertical: 'top',
    horizontal: 'right',
  };
  const handleClose = () => {
    props.snapclose();
  };
  const { vertical, horizontal } = snapBar;
  const snackStyle = {
    fontSize: '12px', 
    maxWidth: '100px', 
    backgroundColor: props.snapcolor, 
    color: 'white', 
    fontWeight: 'bold'
  }
  return(
      <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={props.snapopen}
      onClose={handleClose}
      key={snapBar.vertical + snapBar.horizontal}>
      <SnackbarContent style={snackStyle} message={<span id="client-snackbar">{props.message}</span>}/>
      </Snackbar>);
}

export function ReactLoader(props) {
  const { loader } = useContext(PageContext);
  return(
    <>
      {loader &&
        <div className="loaderBackground"><span className="loaderText">Loading...</span></div>
      }
    </>
  )
}
