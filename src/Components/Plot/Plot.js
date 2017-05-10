import React from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
HighchartsMore(ReactHighcharts.Highcharts);

export default class Plot extends React.Component {
  constructor(props) {
    super(props);

    this.getSeries = this.getSeries.bind(this);
    this.getPlotlines = this.getPlotlines.bind(this);
  }

  getSeries(label, data, color) {
    return {
      name: label,
      data: data,
      color: color,
      animation: false,
      enableMouseTracking: false,
      marker: {
        radius: 0
      },
    };
  }

  getPlotlines(label, data, color) {
    return {
      color: 'white',
      width: 0,
      label:
      {
        text: label,
        align: 'right',
        style: {
          color: color,
          fontWeight: 'bold',
        },
      },
      value: (data.slice(-1)[0][1] + data.slice(-1)[0][2] * 2) / 3 ,
      zIndex: 5,
    }
  }

  render() {
    // add default zoom level around patient

    // add label to end of each line

    // reduce number of data points by factor of 10 or more

    let table = this.props.plotdata.table;

    let SD4_SD3 = [];
    let SD3_SD2 = [];
    let SD2_SD1 = [];
    let SD1_nSD1 = [];
    let nSD1_nSD2 = [];
    let nSD2_nSD3 = [];
    let nSD3_nSD4 = [];
    for (let key = 0; key < Object.keys(table).length; key += 10) {
      let num = Object.keys(table)[key];
      let obj = table[num];
      SD4_SD3.push([Number(num), obj.SD4, obj.SD3]);
      SD3_SD2.push([Number(num), obj.SD3, obj.SD2]);
      SD2_SD1.push([Number(num), obj.SD2, obj.SD1]);
      SD1_nSD1.push([Number(num), obj.SD1, obj.SD1neg]);
      nSD1_nSD2.push([Number(num), obj.SD1neg, obj.SD2neg]);
      nSD2_nSD3.push([Number(num), obj.SD2neg, obj.SD3neg]);
      nSD3_nSD4.push([Number(num), obj.SD3neg, obj.SD4neg]);
    }

    let config = {
      title: {
        text: this.props.plotdata.title,
        floating: true,
        align: 'left',
        x: 90,
      },
      chart: {
        type: 'arearange',
        zoomType: 'xy',
        backgroundColor: '#ededed',
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
        maxPadding: 0.04,
        tickInterval: 1,
        title:
        {
          text: this.props.plotdata.xtitle,
        },
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
        tickInterval: 1,
        title:
        {
          text: this.props.plotdata.ytitle,
        },
        plotLines:
        [{
          color: '#FF0000',
          width: 1,
          value: this.props.plotdata.measurement2,
          zIndex: 5,
        },
        this.getPlotlines('+3 SD', SD4_SD3, 'black'),
        this.getPlotlines('+2 SD', SD3_SD2, 'red'),
        this.getPlotlines('+1 SD', SD2_SD1, 'yellow'),
        this.getPlotlines('Median', SD1_nSD1, 'green'),
        this.getPlotlines('-1 SD', nSD1_nSD2, 'yellow'),
        this.getPlotlines('-2 SD', nSD2_nSD3, 'red'),
        this.getPlotlines('-3 SD', nSD3_nSD4, 'black'),
      ]
    },
    series: [
      this.getSeries('+3 SD', SD4_SD3, 'black'),
      this.getSeries('+2 SD', SD3_SD2, 'red'),
      this.getSeries('+1 SD', SD2_SD1, 'yellow'),
      this.getSeries('Median', SD1_nSD1, 'green'),
      this.getSeries('-1 SD', nSD1_nSD2, 'yellow'),
      this.getSeries('-2 SD', nSD2_nSD3, 'red'),
      this.getSeries('-3 SD', nSD3_nSD4, 'black'),
    ]
  };

  return (
    <div>
      <ReactHighcharts config={config} />
    </div>
  );
}
}
