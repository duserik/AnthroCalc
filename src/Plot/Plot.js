import React from 'react';
import ReactHighcharts from 'react-highcharts';

export default class Plot extends React.Component {
  constructor(props) {
    super(props);

    this.getSeries = this.getSeries.bind(this);
  }

  getSeries() {
    if (!this.props.showplot) {
      return;
    }

    let table = this.props.plotdata.table;

    let SD3data = [];
    let SD2data = [];
    let SD1data = [];
    let SD0data = [];
    let nSD1data = [];
    let nSD2data = [];
    let nSD3data = [];
    for (let key in table) {
      SD3data.push([Number(key), table[key].SD3]);
      SD2data.push([Number(key), table[key].SD2]);
      SD1data.push([Number(key), table[key].SD1]);
      SD0data.push([Number(key), table[key].SD0]);
      nSD1data.push([Number(key), table[key].SD1neg]);
      nSD2data.push([Number(key), table[key].SD2neg]);
      nSD3data.push([Number(key), table[key].SD3neg]);
    }

    return [
      {
        name: 'Patient',
        data: [[this.props.plotdata.measurement1, this.props.plotdata.measurement2]],
        enableMouseTracking: false,
        color: 'black',
        marker: {
          radius: 4
        },
      }, {
        name: 'SD3',
        data: SD3data,
        color: 'black',
        enableMouseTracking: false,
        marker: {
          radius: 0
        },
      }, {
        name: 'SD2',
        data: SD2data,
        color: 'red',
        enableMouseTracking: false,
        marker: {
          radius: 0
        },
      }, {
        name: 'SD1',
        data: SD1data,
        color: 'yellow',
        enableMouseTracking: false,
        marker: {
          radius: 0
        },
      }, {
        name: 'Median',
        data: SD0data,
        color: 'green',
        enableMouseTracking: false,
        marker: {
          radius: 0
        },
      }, {
        name: 'SD1neg',
        data: nSD1data,
        color: 'yellow',
        enableMouseTracking: false,
        marker: {
          radius: 0
        },
      }, {
        name: 'SD2neg',
        data: nSD2data,
        color: 'red',
        enableMouseTracking: false,
        marker: {
          radius: 0
        },
      }, {
        name: 'SD3neg',
        data: nSD3data,
        color: 'black',
        enableMouseTracking: false,
        marker: {
          radius: 0
        },
      },
    ]
  }

  render() {
    let config = {
      chart: {
        type:'scatter',
        zoomType: 'xy',
      },
      credits: false,
      legend: {
        enabled: false,
      },
      plotOptions: {
        scatter: {
          lineWidth: 2
        },
        marker: {
          enabled: false
        }
      },
      xAxis: {
        maxPadding: 0,
        plotLines:
        [{
          color: '#FF0000',
          width: 1,
          value: this.props.plotdata.measurement1,
          zIndex: 5,
        }]
      },
      yAxis: {
        maxPadding: 0,
        plotLines:
        [{
          color: '#FF0000',
          width: 1,
          value: this.props.plotdata.measurement2,
          zIndex: 5,
        }]
      },
      series: this.getSeries(),
    };

    console.log(this.props.plotdata);

    return (
      <div>
        {this.props.showplot &&
          <ReactHighcharts config={config} />
        }
      </div>
    );
  }
}
