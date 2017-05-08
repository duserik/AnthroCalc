import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import {wfl_boys} from '../zscore_tables/wfl_boys';
import {wfl_girls} from '../zscore_tables/wfl_girls';
import {wfa_girls} from '../zscore_tables/wfa_girls';
import {wfa_boys} from '../zscore_tables/wfa_boys';
import {lhfa_girls} from '../zscore_tables/lhfa_girls';
import {lhfa_boys} from '../zscore_tables/lhfa_boys';
import {bfa_boys} from '../zscore_tables/bfa_boys';
import {bfa_girls} from '../zscore_tables/bfa_girls';
import {hcfa_boys} from '../zscore_tables/hcfa_boys';
import {hcfa_girls} from '../zscore_tables/hcfa_girls';
import {acfa_boys} from '../zscore_tables/acfa_boys';
import {acfa_girls} from '../zscore_tables/acfa_girls';
import {tsfa_boys} from '../zscore_tables/tsfa_boys';
import {tsfa_girls} from '../zscore_tables/tsfa_girls';
import {ssfa_boys} from '../zscore_tables/ssfa_boys';
import {ssfa_girls} from '../zscore_tables/ssfa_girls';

import './Results.css';

export default class Results extends React.Component {
  constructor(props) {
    super(props);

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

    // Adjust height if patient was measured standing
    if (!this.props.recumbent) {
      height += 0.7;
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
    let LMS = this.getLMS(sex, weight, age, wfa_boys, wfa_girls);

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

    // Adjust height if patient was measured standing
    if (!this.props.recumbent) {
      height += 0.7;
    }

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, height, age, lhfa_boys, lhfa_girls);

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
    let LMS = this.getLMS(sex, bmi, age, bfa_boys, bfa_girls);

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
    let hc = this.props.headCircumference;
    let age = this.props.age;

    // Get LMS values for the given parameters
    let LMS = this.getLMS(sex, hc, age, hcfa_boys, hcfa_girls);

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
    let LMS = this.getLMS(sex, muac, age, acfa_boys, acfa_girls);

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
    let LMS = this.getLMS(sex, ts, age, tsfa_boys, tsfa_girls);

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
    let LMS = this.getLMS(sex, ss, age, ssfa_boys, ssfa_girls);

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
  * @param y
  * @param age
  * @param dataset_boys
  * @param dataset_girls
  * @returns {*}
  */
  getLMS(sex, y, age, dataset_boys, dataset_girls) {
    // If sex, y or age are undefined, return -
    if (sex === undefined || y === undefined || age === '-') {
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

  getResultLine(label, value) {
    return (
      <div className="resultline">
        <div className="rlabel">
          {label}
        </div>
        <div className="rbar">
          <LinearProgress
            mode="determinate"
            value={value.centile}
            color={this.getColor(value.value)}
            style={{
              height: '10px',
            }} />
        </div>
        <div className="rzscore">
          {Math.round(value.value * 100) / 100}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="results">
        <div className="resultsLeft">
          {this.getResultLine('Weight-for-length', this.getWeightForLength())}
          {this.getResultLine('Weight-for-age', this.getWeightForAge())}
          {this.getResultLine('Length-for-age', this.getLengthForAge())}
          {this.getResultLine('BMI-for-age', this.getBMIForAge())}
        </div>

        <div className="resultsRight">
          {this.getResultLine('HC-for-age', this.getHCForAge())}
          {this.getResultLine('MUAC-for-age', this.getMUACForAge())}
          {this.getResultLine('TSF-for-age', this.getTSForAge())}
          {this.getResultLine('SSF-for-age', this.getSSForAge())}
        </div>
      </div>
    );
  }
}
