import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import EditorShowChart from 'material-ui/svg-icons/editor/show-chart';

export const Resultline = props => {
  let values = props.getValues();

  return (
    <div className="resultline">
      <div className="rlabel">
        <p>{props.label}</p>
      </div>
      <div className="rbar">
        <LinearProgress
          mode="determinate"
          value={values.centile}
          color={values.color}
          style={{
            height: '100%',
          }} />
      </div>
      <div className="rzscore">
        <p>{Math.round(values.value * 100) / 100}</p>
      </div>
      <div className="rchartbutton">
        <RaisedButton
          icon={<EditorShowChart />}
          onClick={() => props.togglePlot(props.keyword)}
          style={{
            height: '100%',
            width: '100%',
            minWidth: '20px',
          }} />
      </div>
    </div>
  )
}
