import React from 'react';

import {colors} from '../../data/colorcodes';
import * as datasets from '../../data/index';
import Plot from '../Plot/Plot';
import {Resultline} from './Resultline';

import './Results.css';

export default class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentplot: '',
    }
  }

  getWeightForLength = () => {
    let sex = this.props.sex;
    let weight = this.props.weight;
    let height = this.props.height;

    // If sex, weight or height are undefined, return -
    if (sex === undefined || weight === undefined || height === undefined) {
      return '-';
    }

    // If patient has oedema, return -
    if (this.props.oedema) {
      return '-';
    }

    // If the selected height is outside the specifications provided by WHO, return -
    if (height < 45 || height > 110) {
      return '-';
    }

    // Get the two closest applicable LMS value sets
    let lowheight = Math.floor(height * 10) / 10;
    let maxheight = Math.round((lowheight + 0.1) * 10) / 10;

    // Collect the two LMS values for either male or female
    let lowlms = datasets.wfl_boys[lowheight];
    let highlms = datasets.wfl_boys[maxheight];
    if (this.props.sex === 'female') {
      lowlms = datasets.wfl_girls[lowheight];
      highlms = datasets.wfl_girls[maxheight];
    }

    // Get the number of steps.
    // Example:
    //  given height: 55.32, low LMS = 55.3
    // (55.32 - 55.3) * 100 = 2
    let steps = Math.round((height - lowheight) * 100);

    // Interpolate value of numbers between given WHO LMS table values
    // Example:
    //  L at 55.3 = 4.6319, L at 53.4 = 4.6605, given height = 55.32
    //  4.6319 + ((4.6605 - 4.6319) / 10) * 2 = 4.63762
    let L = lowlms.L + (((highlms.L - lowlms.L) / 10) * steps);
    let M = lowlms.M + (((highlms.M - lowlms.M) / 10) * steps);
    let S = lowlms.S + (((highlms.S - lowlms.S) / 10) * steps);

    // Calculate the zscore based on the lms values and the weight
    let value = this.calcZscore(weight, L, M, S);

    return {
      value: value,
      centile: this.getCentile(value),
      color: this.getColor(value)
    }
  }

  getWeightForAge = () => {
    let sex = this.props.sex;
    let weight = this.props.weight;
    let age = this.props.age;

    // If patient has oedema, return -
    if (this.props.oedema) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, datasets.wfa_boys, datasets.wfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the weight
    let wfa = this.calcZscore(weight, LMS.L, LMS.M, LMS.S);

    return {
      value: wfa,
      centile: this.getCentile(wfa),
      color: this.getColor(wfa)
    }
  }

  getLengthForAge = () => {
    let sex = this.props.sex;
    let height = this.props.height;
    let age = this.props.age;

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, datasets.lhfa_boys, datasets.lhfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the height
    let lfa = this.calcZscore(height, LMS.L, LMS.M, LMS.S);

    return {
      value: lfa,
      centile: this.getCentile(lfa),
      color: this.getColor(lfa)
    }
  }

  getBMIForAge = () => {
    let sex = this.props.sex;
    let bmi = this.props.bmi;
    let age = this.props.age;

    // If patient has oedema, return -
    if (this.props.oedema) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, datasets.bfa_boys, datasets.bfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let bfa = this.calcZscore(bmi, LMS.L, LMS.M, LMS.S);

    return {
      value: bfa,
      centile: this.getCentile(bfa),
      color: this.getColor(bfa)
    }
  }

  getHCForAge = () => {
    let sex = this.props.sex;
    let hc = this.props.head;
    let age = this.props.age;

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, datasets.hcfa_boys, datasets.hcfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let hcfa = this.calcZscore(hc, LMS.L, LMS.M, LMS.S);

    return {
      value: hcfa,
      centile: this.getCentile(hcfa),
      color: this.getColor(hcfa)
    }
  }

  getMUACForAge = () => {
    let sex = this.props.sex;
    let muac = this.props.muac;
    let age = this.props.age;

    // No data exists for ages below 91 days
    if (age < 91) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, datasets.acfa_boys, datasets.acfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let acfa = this.calcZscore(muac, LMS.L, LMS.M, LMS.S);

    return {
      value: acfa,
      centile: this.getCentile(acfa),
      color: this.getColor(acfa)
    }
  }

  getTSForAge = () => {
    let sex = this.props.sex;
    let ts = this.props.triceps;
    let age = this.props.age;

    // No data exists for ages below 91 days
    if (age < 91) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, datasets.tsfa_boys, datasets.tsfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let tsfa = this.calcZscore(ts, LMS.L, LMS.M, LMS.S);

    return {
      value: tsfa,
      centile: this.getCentile(tsfa),
      color: this.getColor(tsfa)
    }
  }

  getSSForAge = () => {
    let sex = this.props.sex;
    let ss = this.props.subscapular;
    let age = this.props.age;

    // No data exists for ages below 91 days
    if (age < 91) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, datasets.ssfa_boys, datasets.ssfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let ssfa = this.calcZscore(ss, LMS.L, LMS.M, LMS.S);

    return {
      value: ssfa,
      centile: this.getCentile(ssfa),
      color: this.getColor(ssfa)
    }
  }

  /**
  * Calculates the percentile based on the z-score value.
  * The calculations performed in this function are adapted from the Anthro 3.2.2.1 source code.
  * @param zscore
  */
  getCentile = (zscore) => {
    let absoluteZscore = Math.abs(zscore);

    if (zscore === '-' || absoluteZscore > 3) {
      // disable percent
      return 0;
    }

    let k = 1 / (1 + 0.2316419 * absoluteZscore);
    let z = 1 / Math.sqrt(2 * Math.PI) * Math.exp(-Math.pow(absoluteZscore, 2) / 2);
    let a1 = 0.319381530;
    let a2 = -0.356563782;
    let a3 = 1.781477937;
    let a4 = -1.821255978;
    let a5 = 1.330274429;

    let centile = 1 - z * (a1 * k + a2 * Math.pow(k, 2) + a3 * Math.pow(k, 3) + a4 * Math.pow(k, 4) + a5 * Math.pow(k, 5));

    if (zscore > 0) {
      return Math.round((centile * 100) * 100) / 100;
    }

    return Math.round((100 - centile * 100) * 100) / 100;
  }

  /**
  * Collects LMS values from the chosen zscore-tables.
  * @param sex
  * @param age
  * @param dataset_boys
  * @param dataset_girls
  * @returns {*}
  */
  getLMS = (sex, age, dataset_boys, dataset_girls) => {
    // If sex, y or age are undefined, return -
    if (sex === undefined || age === '-') {
      return '-';
    }

    // Round the age to the nearest integer
    age = Math.round(age);

    // Check if age exceeds data limit
    if (age > 1856) {
      return '-';
    }

    // Get LMS values from age based on sex
    let LMS = dataset_boys[age];
    if (this.props.sex === 'female') {
      LMS = dataset_girls[age];
    }

    return LMS;
  }

  /**
  * Calculates SD2pos, SD3pos, SD2neg, and SD3neg for Z-score calculations. Based on WHO child growth standard
  * formulas. Takes a num value of 2, 3, -2, or -3, and LMS values as parameters. Returns the calculated number.
  * @param num
  * @param L
  * @param M
  * @param S
  * @returns {number}
  */
  getSDX = (num, L, M, S) => {
    return M * Math.pow((1 + L * S * num), (1 / L));
  }

  /**
  * Calculates Zscore values based on formulas from WHO Child Growth Standards chapter 7 page 302.
  * Returns the calculated zscore.
  * @param y
  * @param L
  * @param M
  * @param S
  * @returns {number}
  */
  calcZscore = (y, L, M, S) => {
    let zscore = (Math.pow((y / M), L) - 1) / (S * L);

    if (zscore < -3) {
      let sd3neg = this.getSDX(-3, L, M, S);
      let sd2neg = this.getSDX(-2, L, M, S);
      return (-3) + ((y - sd3neg) / (sd2neg - sd3neg));
    }

    if (zscore > 3) {
      let sd3pos = this.getSDX(3, L, M, S);
      let sd2pos = this.getSDX(2, L, M, S);
      return 3 + ((y - sd3pos) / (sd3pos - sd2pos));
    }

    return zscore;
  }

  getColor = (value) => {
    if (Math.abs(value) > 3) {
      return colors.black;
    }

    if (Math.abs(value) > 2) {
      return colors.red;
    }

    if (Math.abs(value) > 1) {
      return colors.yellow;
    }

    return colors.green;
  }

  togglePlot = (keyw) => {
    // If user presses same plot button twice, close it
    if (keyw === this.state.currentplot) {
      this.setState({
        currentplot: '',
      });
      return;
    }

    this.setState({
      currentplot: keyw,
    });
  }

  getPlot = () => {
    let currentplot = this.state.currentplot;
    let age = this.props.age;

    if (this.props.oedema) {
      if (currentplot === 'wfl' || currentplot === 'wfa' || currentplot === 'mfa') {
        return;
      }
    }

    if (age === '-' || this.props.unknownBirthDate) {
      if (currentplot !== 'wfl') {
        return;
      }
    }

    if (age < 91) {
      if (currentplot === 'acfa' || currentplot === 'tsfa' || currentplot === 'ssfa') {
        return;
      }
    }

    let map = new Map();
    map.set('wfl', this.getPlotdata(false, datasets.wfl_boys_sd, datasets.wfl_girls_sd, this.props.height, this.props.weight, 'Height (cm)', 'Weight (kg)', 'Weight-for-length'));
    map.set('wfa', this.getPlotdata(true, datasets.wfa_boys_sd, datasets.wfa_girls_sd, age, this.props.weight, 'Age (months)', 'Weight (kg)', 'Weight-for-age'));
    map.set('lfa', this.getPlotdata(true, datasets.lhfa_boys_sd, datasets.lhfa_girls_sd, age, this.props.height, 'Age (months)', 'Height (cm)', 'Length-for-age'));
    map.set('bfa', this.getPlotdata(true, datasets.bfa_boys_sd, datasets.bfa_girls_sd, age, this.props.bmi, 'Age (months)', 'BMI', 'BMI-for-age'));
    map.set('acfa', this.getPlotdata(true, datasets.acfa_boys_sd, datasets.acfa_girls_sd, age, this.props.muac, 'Age (months)', 'MUAC', 'MUAC-for-age'));
    map.set('hcfa', this.getPlotdata(true, datasets.hcfa_boys_sd, datasets.hcfa_girls_sd, age, this.props.head, 'Age (months)', 'Head Circumference (cm)', 'HC-for-age'));
    map.set('tsfa', this.getPlotdata(true, datasets.tsfa_boys_sd, datasets.tsfa_girls_sd, age, this.props.triceps, 'Age (months)', 'BMI', 'TSF-for-age'));
    map.set('ssfa', this.getPlotdata(true, datasets.ssfa_boys_sd, datasets.ssfa_girls_sd, age, this.props.subscapular, 'Age (months)', 'Subscapular Skinfold (cm)', 'SSF-for-age'));

    return map.get(currentplot);
  }

  getPlotdata = (agebased,table1, table2, measurement1, measurement2, xtitle, ytitle, title) => {
    let table = this.props.sex === 'male' ? table1 : table2;
    return {
      table: table,
      measurement1: measurement1,
      measurement2: measurement2,
      xtitle: xtitle,
      ytitle: ytitle,
      title: title,
      agebased: agebased,
    }
  }

  render() {
    let plot = this.getPlot();
    let showplot = (plot !== undefined);

    return (
      <div>
        <div className="results">
          <div className="resultsLeft">
            <Resultline
              label='Weight-for-length'
              getValues={this.getWeightForLength}
              keyword='wfl'
              togglePlot={this.togglePlot}
              />
            <Resultline
              label='Weight-for-age'
              getValues={this.getWeightForAge}
              keyword='wfa'
              togglePlot={this.togglePlot}
              />
            <Resultline
              label='Length-for-age'
              getValues={this.getLengthForAge}
              keyword='lfa'
              togglePlot={this.togglePlot}
              />
            <Resultline
              label='BMI-for-age'
              getValues={this.getBMIForAge}
              keyword='bfa'
              togglePlot={this.togglePlot}
              />
          </div>

          <div className="resultsRight">
            <Resultline
              label='HC-for-age'
              getValues={this.getHCForAge}
              keyword='hcfa'
              togglePlot={this.togglePlot}
              />
            <Resultline
              label='MUAC-for-age'
              getValues={this.getMUACForAge}
              keyword='acfa'
              togglePlot={this.togglePlot}
              />
            <Resultline
              label='TSF-for-age'
              getValues={this.getTSForAge}
              keyword='tsfa'
              togglePlot={this.togglePlot}
              />
            <Resultline
              label='SSF-for-age'
              getValues={this.getSSForAge}
              keyword='ssfa'
              togglePlot={this.togglePlot}
              />
          </div>
        </div>

        {showplot &&
        <Plot
          plotdata={plot}
          />
        }
      </div>
    );
  }
}
