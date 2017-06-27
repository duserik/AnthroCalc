import React from 'react';
import TextField from 'material-ui/TextField';

export const Inputfield = props => {
  return (
    <div className="inputbox">
      {props.label}
      <TextField
        id={props.id}
        type='number'
        step='0.1'
        value={props.value}
        onChange={props.setValue}
      />
    </div>
  )
}
