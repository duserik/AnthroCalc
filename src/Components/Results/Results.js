import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';

import {wfl_boys} from '../../data/Centile_Tables/wfl_boys';
import {wfl_girls} from '../../data/Centile_Tables/wfl_girls';
import {wfa_girls} from '../../data/Centile_Tables/wfa_girls';
import {wfa_boys} from '../../data/Centile_Tables/wfa_boys';
import {lhfa_girls} from '../../data/Centile_Tables/lhfa_girls';
import {lhfa_boys} from '../../data/Centile_Tables/lhfa_boys';
import {bfa_boys} from '../../data/Centile_Tables/bfa_boys';
import {bfa_girls} from '../../data/Centile_Tables/bfa_girls';
import {hcfa_boys} from '../../data/Centile_Tables/hcfa_boys';
import {hcfa_girls} from '../../data/Centile_Tables/hcfa_girls';
import {acfa_boys} from '../../data/Centile_Tables/acfa_boys';
import {acfa_girls} from '../../data/Centile_Tables/acfa_girls';
import {tsfa_boys} from '../../data/Centile_Tables/tsfa_boys';
import {tsfa_girls} from '../../data/Centile_Tables/tsfa_girls';
import {ssfa_boys} from '../../data/Centile_Tables/ssfa_boys';
import {ssfa_girls} from '../../data/Centile_Tables/ssfa_girls';

import {wfl_boys_sd} from '../../data/SD_Tables/wfl_boys_sd';
import {wfl_girls_sd} from '../../data/SD_Tables/wfl_girls_sd';
import {wfa_girls_sd} from '../../data/SD_Tables/wfa_girls_sd';
import {wfa_boys_sd} from '../../data/SD_Tables/wfa_boys_sd';
import {lhfa_girls_sd} from '../../data/SD_Tables/lhfa_girls_sd';
import {lhfa_boys_sd} from '../../data/SD_Tables/lhfa_boys_sd';
import {bfa_boys_sd} from '../../data/SD_Tables/bfa_boys_sd';
import {bfa_girls_sd} from '../../data/SD_Tables/bfa_girls_sd';
import {hcfa_boys_sd} from '../../data/SD_Tables/hcfa_boys_sd';
import {hcfa_girls_sd} from '../../data/SD_Tables/hcfa_girls_sd';
import {acfa_boys_sd} from '../../data/SD_Tables/acfa_boys_sd';
import {acfa_girls_sd} from '../../data/SD_Tables/acfa_girls_sd';
import {tsfa_boys_sd} from '../../data/SD_Tables/tsfa_boys_sd';
import {tsfa_girls_sd} from '../../data/SD_Tables/tsfa_girls_sd';
import {ssfa_boys_sd} from '../../data/SD_Tables/ssfa_boys_sd';
import {ssfa_girls_sd} from '../../data/SD_Tables/ssfa_girls_sd';

import Plot from '../Plot/Plot';

import './Results.css';

export default class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plotdata: {},
      showplot: false,
      currentplot: '',
    }

    this.getWeightForLength = this.getWeightForLength.bind(this);
    this.getWeightForAge = this.getWeightForAge.bind(this);
    this.getLengthForAge = this.getLengthForAge.bind(this);
    this.getBMIForAge = this.getBMIForAge.bind(this);
    this.getHCForAge = this.getHCForAge.bind(this);
    this.getMUACForAge = this.getMUACForAge.bind(this);
    this.getTSForAge = this.getTSForAge.bind(this);
    this.getSSForAge = this.getSSForAge.bind(this);

    this.getColor = this.getColor.bind(this);
    this.getResultLine = this.getResultLine.bind(this);

    this.togglePlot = this.togglePlot.bind(this);

    this.getPlotdata = this.getPlotdata.bind(this);
    this.getPlot = this.getPlot.bind(this);
  }

  getWeightForLength() {
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
    let lowlms = wfl_boys[lowheight];
    let highlms = wfl_boys[maxheight];
    if (this.props.sex === 'female') {
      lowlms = wfl_girls[lowheight];
      highlms = wfl_girls[maxheight];
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
    let centile = this.getCentile(value);
    let color = this.getColor(value);

    return {
      value: value,
      centile: centile,
      color: color,
    }
  }

  getWeightForAge() {
    let sex = this.props.sex;
    let weight = this.props.weight;
    let age = this.props.age;

    // If patient has oedema, return -
    if (this.props.oedema) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, wfa_boys, wfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the weight
    let wfa = this.calcZscore(weight, LMS.L, LMS.M, LMS.S);

    return {
      value: wfa,
      centile: this.getCentile(wfa),
    }
  }

  getLengthForAge() {
    let sex = this.props.sex;
    let height = this.props.height;
    let age = this.props.age;

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, lhfa_boys, lhfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the height
    let lfa = this.calcZscore(height, LMS.L, LMS.M, LMS.S);

    return {
      value: lfa,
      centile: this.getCentile(lfa),
    }
  }

  getBMIForAge() {
    let sex = this.props.sex;
    let bmi = this.props.bmi;
    let age = this.props.age;

    // If patient has oedema, return -
    if (this.props.oedema) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, bfa_boys, bfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let bfa = this.calcZscore(bmi, LMS.L, LMS.M, LMS.S);

    return {
      value: bfa,
      centile: this.getCentile(bfa),
    }
  }

  getHCForAge() {
    let sex = this.props.sex;
    let hc = this.props.head;
    let age = this.props.age;

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, hcfa_boys, hcfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let hcfa = this.calcZscore(hc, LMS.L, LMS.M, LMS.S);

    return {
      value: hcfa,
      centile: this.getCentile(hcfa),
    }
  }

  getMUACForAge() {
    let sex = this.props.sex;
    let muac = this.props.muac;
    let age = this.props.age;

    // No data exists for ages below 91 days
    if (age < 91) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, acfa_boys, acfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let acfa = this.calcZscore(muac, LMS.L, LMS.M, LMS.S);

    return {
      value: acfa,
      centile: this.getCentile(acfa),
    }
  }

  getTSForAge() {
    let sex = this.props.sex;
    let ts = this.props.triceps;
    let age = this.props.age;

    // No data exists for ages below 91 days
    if (age < 91) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, tsfa_boys, tsfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let tsfa = this.calcZscore(ts, LMS.L, LMS.M, LMS.S);

    return {
      value: tsfa,
      centile: this.getCentile(tsfa),
    }
  }

  getSSForAge() {
    let sex = this.props.sex;
    let ss = this.props.subscapular;
    let age = this.props.age;

    // No data exists for ages below 91 days
    if (age < 91) {
      return '-';
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, age, ssfa_boys, ssfa_girls);

    // If getLMS() returned '-', data could not be retrieved
    if (LMS === '-') {
      return LMS;
    }

    // Calculate the zscore based on the lms values and the bmi
    let ssfa = this.calcZscore(ss, LMS.L, LMS.M, LMS.S);

    return {
      value: ssfa,
      centile: this.getCentile(ssfa),
    }
  }

  /**
  * Calculates the percentile based on the z-score value.
  * The calculations performed in this function are adapted from the Anthro 3.2.2.1 source code.
  * @param zscore
  */
  getCentile(zscore) {
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
  getLMS(sex, age, dataset_boys, dataset_girls) {
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
  getSDX(num, L, M, S) {
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
  calcZscore(y, L, M, S) {
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

  getColor(value) {
    if (Math.abs(value) > 3) {
      return 'black';
    }

    if (Math.abs(value) > 2) {
      return 'red';
    }

    if (Math.abs(value) > 1) {
      return 'yellow';
    }

    return 'green';
  }

  togglePlot(keyw) {
    // If user presses same plot button twice
    if (this.state.showplot && keyw === this.state.currentplot) {
      this.setState({
        showplot: false,
        currentplot: '',
      });
      return;
    }

    this.setState({
      showplot: true,
      currentplot: keyw,
    });
  }

  getPlot() {
    let plotdata = {};
    let currentplot = this.state.currentplot;

    if (this.props.oedema) {
      if (currentplot === 'wfl' || currentplot === 'wfa' || currentplot === 'mfa') {
        return plotdata;
      }
    }

    if (this.props.age === '-') {
      if (currentplot !== 'wfl') {
        return plotdata;
      }
    }

    if (this.props.age < 91) {
      if (currentplot === 'acfa' || currentplot === 'tsfa' || currentplot === 'ssfa') {
        return plotdata;
      }
    }

    if (this.state.currentplot === 'wfl') {
      plotdata = this.getPlotdata(wfl_boys_sd, wfl_girls_sd, this.props.height, this.props.weight, 'Height (cm)', 'Weight (kg)', 'Weight-for-length');
    }

    if (this.state.currentplot === 'wfa') {
      plotdata = this.getPlotdata(wfa_boys_sd, wfa_girls_sd, this.props.age, this.props.weight, 'Age (days)', 'Weight (kg)', 'Weight-for-age');
    }

    if (this.state.currentplot === 'lfa') {
      plotdata = this.getPlotdata(lhfa_boys_sd, lhfa_girls_sd, this.props.age, this.props.height, 'Age (days)', 'Height (cm)', 'Length-for-age');
    }

    if (this.state.currentplot === 'bfa') {
      plotdata = this.getPlotdata(bfa_boys_sd, bfa_girls_sd, this.props.age, this.props.bmi, 'Age (days)', 'BMI', 'BMI-for-age');
    }

    if (this.state.currentplot === 'hcfa') {
      plotdata = this.getPlotdata(hcfa_boys_sd, hcfa_girls_sd, this.props.age, this.props.head, 'Age (days)', 'Head Circumference (cm)', 'HC-for-age');
    }

    if (this.state.currentplot === 'acfa') {
      plotdata = this.getPlotdata(acfa_boys_sd, acfa_girls_sd, this.props.age, this.props.muac, 'Age (days)', 'MUAC', 'MUAC-for-age');
    }

    if (this.state.currentplot === 'tsfa') {
      plotdata = this.getPlotdata(tsfa_boys_sd, tsfa_girls_sd, this.props.age, this.props.triceps, 'Age (days)', 'BMI', 'TSF-for-age');
    }

    if (this.state.currentplot === 'ssfa') {
      plotdata = this.getPlotdata(ssfa_boys_sd, ssfa_girls_sd, this.props.age, this.props.subscapular, 'Age (days)', 'Subscapular Skinfold (cm)', 'SSF-for-age');
    }

    return plotdata;
  }

  getPlotdata(table1, table2, measurement1, measurement2, xtitle, ytitle, title) {
    let table = this.props.sex === 'male' ? table1 : table2;
    return {
      table: table,
      measurement1: measurement1,
      measurement2: measurement2,
      xtitle: xtitle,
      ytitle: ytitle,
      title: title,
    }
  }

  getResultLine(label, value, keyw) {
    return (
      <div className="resultline">
        <div className="rlabel">
          <p>{label}</p>
        </div>
        <div className="rbar">
          <LinearProgress
            mode="determinate"
            value={value.centile}
            color={this.getColor(value.value)}
            style={{
              height: '100%',
            }} />
        </div>
        <div className="rzscore">
          <p>{Math.round(value.value * 100) / 100}</p>
        </div>
        <div className="rchartbutton">
          <RaisedButton
            icon={<ActionAndroid />}
            onClick={() => this.togglePlot(keyw)}
            style={{
              height: '100%',
              width: '100%',
              minWidth: '20px',
            }} />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="results">
          <div className="resultsLeft">
            {this.getResultLine('Weight-for-length', this.getWeightForLength(), 'wfl')}
            {this.getResultLine('Weight-for-age', this.getWeightForAge(), 'wfa')}
            {this.getResultLine('Length-for-age', this.getLengthForAge(), 'lfa')}
            {this.getResultLine('BMI-for-age', this.getBMIForAge(), 'bfa')}
          </div>

          <div className="resultsRight">
            {this.getResultLine('HC-for-age', this.getHCForAge(), 'hcfa')}
            {this.getResultLine('MUAC-for-age', this.getMUACForAge(), 'acfa')}
            {this.getResultLine('TSF-for-age', this.getTSForAge(), 'tsfa')}
            {this.getResultLine('SSF-for-age', this.getSSForAge(), 'ssfa')}
          </div>
        </div>

        {this.state.showplot &&
        <Plot
          plotdata={this.getPlot()}
          showplot={this.state.showplot}
          />
        }
      </div>
    );
  }
}
