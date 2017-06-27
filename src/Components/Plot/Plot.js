import React from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
HighchartsMore(ReactHighcharts.Highcharts);

import {colors} from '../../data/colorcodes';

export default class Plot extends React.Component {
  getSeries = (type, label, data, color) => {
    return {
      type: type,
      name: label,
      data: data,
      lineWidth: 1,
      color: color,
      animation: false,
      fillOpacity: 1,
      enableMouseTracking: false,
      marker: {
        radius: 0
      },
    };
  }

  getPlotlines = (label, data, color) => {
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

  getConfig = () => {
    let table = this.props.plotdata.table;

    /*
    Collects area ranges for each standard deviation set.
    Skips over every 10 values to reduce draw time.
    Example:
      SD4 to SD3 covers the area between the values of SD4 and SD3
      SD1 to nSD1 covers the area between the values of SD1 and SD1neg
      etc
    */
    let SD4_SD3 = [];
    let SD3_SD2 = [];
    let SD2_SD1 = [];
    let SD1_nSD1 = [];
    let nSD1_nSD2 = [];
    let nSD2_nSD3 = [];
    let nSD3_nSD4 = [];
    let SD0 = [];
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
      SD0.push([Number(num), obj.SD0]);
    }

    // if chart is based on age, divide days by 30.25 to get months
    let formatdivider = this.props.plotdata.agebased ? 30.25 : 1;

    return {
      title: {
        text: this.props.plotdata.title,
        floating: true,
        align: 'left',
        x: 90,
      },
      chart: {
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
        gridLineWidth: 1,
        tickInterval: formatdivider,
        labels:
        {
          formatter: function() {
            return Math.round(this.value / formatdivider);
          }
        },
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
          this.getPlotlines('+3 SD', SD4_SD3, colors.black),
          this.getPlotlines('+2 SD', SD3_SD2, colors.red),
          this.getPlotlines('+1 SD', SD2_SD1, colors.yellow),
          this.getPlotlines('Median', SD1_nSD1, colors.green),
          this.getPlotlines('-1 SD', nSD1_nSD2, colors.yellow),
          this.getPlotlines('-2 SD', nSD2_nSD3, colors.red),
          this.getPlotlines('-3 SD', nSD3_nSD4, colors.black),
        ]
      },
      series: [
        this.getSeries('arearange', '+3 SD', SD4_SD3, colors.black),
        this.getSeries('arearange', '+2 SD', SD3_SD2, colors.red),
        this.getSeries('arearange', '+1 SD', SD2_SD1, colors.yellow),
        this.getSeries('arearange', '+1 SD', SD1_nSD1, colors.green),
        this.getSeries('arearange', '-1 SD', nSD1_nSD2, colors.yellow),
        this.getSeries('arearange', '-2 SD', nSD2_nSD3, colors.red),
        this.getSeries('arearange', '-3 SD', nSD3_nSD4, colors.black),
        this.getSeries('line', 'Median', SD0, colors.black),
      ]
    };
  }

  render() {
    return (
      <div>
        <ReactHighcharts config={this.getConfig()} />
      </div>
    )
  }
}
