import React from 'react';
import Results from '../Results/Results';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import './Calculator.css';

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sex: 'female',
      dateOfVisit: new Date(),
      dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      unknownBirthDate: false,
      recumbent: true,
      oedema: false,
      weight: 9,
      height: 73,

      headCircumference: 45,
      muac: 15,
      triceps: 8,
      subscapular: 7,
    };

    this.setSex = this.setSex.bind(this);
    this.setDateOfVisit = this.setDateOfVisit.bind(this);
    this.setDateOfBirth = this.setDateOfBirth.bind(this);
    this.randomDateOfBirth = this.randomDateOfBirth.bind(this);
    this.unknownDateOfBirth = this.unknownDateOfBirth.bind(this);
    this.setRecumbentStatus = this.setRecumbentStatus.bind(this);
    this.setOedemaStatus = this.setOedemaStatus.bind(this);
    this.setWeight = this.setWeight.bind(this);
    this.setHeight = this.setHeight.bind(this);

    this.setHeadCircumference = this.setHeadCircumference.bind(this);
    this.setMUAC = this.setMUAC.bind(this);
    this.setTriceps = this.setTriceps.bind(this);
    this.setSubscapular = this.setSubscapular.bind(this);
  }

  setSex(sex) {
    this.setState({
      sex: sex,
    });
  }

  setDateOfVisit(date) {
    this.setState({
      dateOfVisit: date,
    });
  }

  setDateOfBirth(date) {
    this.setState({
      dateOfBirth: date,
    });
  }

  randomDateOfBirth() {
    if (this.state.dateOfBirth === undefined) {
      return;
    }

    let year = this.state.dateOfBirth.getFullYear();
    let month = this.state.dateOfBirth.getMonth();
    let daysInMonth = new Date(year, month, 0).getDate();
    let day = Math.floor(Math.random() * (daysInMonth - 1)) + 1;
    let newDate = new Date(year, month, day);

    // prevent setting a random date higher than the date of visit

    this.setState({
      dateOfBirth: newDate,
    });
  }

  unknownDateOfBirth() {
    this.setState({
      unknownBirthDate: !this.state.unknownBirthDate,
    });
  }

  setRecumbentStatus() {
    this.setState({
      recumbent: !this.state.recumbent,
    });
  }

  setOedemaStatus() {
    this.setState({
      oedema: !this.state.oedema,
    });
  }

  setWeight(event) {
    // to-do: check if input actually is number
    //        limit max number of decimals to 2
    let weight = parseFloat(event.target.value);
    weight = Math.round(weight * 100) / 100;
    this.setState({
      weight: weight,
    });
  }

  setHeight(event) {
    // to-do: check if input actually is number
    //        limit max number of decimals to 2
    let height = parseFloat(event.target.value);
    height = Math.round(height * 100) / 100;
    this.setState({
      height: height,
    });
  }

  setHeadCircumference(event) {
    // to-do: check if input actually is number
    //        limit max number of decimals to 2
    let headCircumference = parseFloat(event.target.value);
    headCircumference = Math.round(headCircumference * 100) / 100;
    this.setState({
      headCircumference: headCircumference,
    });
  }

  setMUAC(event) {
    // to-do: check if input actually is number
    //        limit max number of decimals to 2
    let muac = parseFloat(event.target.value);
    muac = Math.round(muac * 100) / 100;
    this.setState({
      muac: muac,
    });
  }

  setTriceps(event) {
    // to-do: check if input actually is number
    //        limit max number of decimals to 2
    let triceps = parseFloat(event.target.value);
    triceps = Math.round(triceps * 100) / 100;
    this.setState({
      triceps: triceps,
    });
  }

  setSubscapular(event) {
    // to-do: check if input actually is number
    //        limit max number of decimals to 2
    let subscapular = parseFloat(event.target.value);
    subscapular = Math.round(subscapular * 100) / 100;
    this.setState({
      subscapular: subscapular,
    });
  }

  getBmi() {
    if (this.state.weight === undefined || this.state.height === undefined || this.state.oedema) {
      return '-';
    }

    // Add 0.7 cm if patient was measured while standing (if under x months)
    let height = this.state.height;
    if (!this.state.recumbent) {
      height = this.state.height + 0.7;
    }

    return Math.round(this.state.weight / Math.pow(height / 100, 2) * 100) / 100;
  }

  getAge() {
    if (this.state.dateOfBirth === undefined || this.state.dateOfVisit === undefined || this.state.unknownBirthDate) {
      return '-';
    }

    return (this.state.dateOfVisit - this.state.dateOfBirth) / 1000 / 60 / 60 / 24;
  }

  getAgeText() {
    let age = this.getAge();

    if (age === '-') {
      return age;
    }

    age = Math.floor(age / 30.25);

    if (age === 1) {
      return age + ' month';
    }

    return age + ' months';
  }

  formatDate(date) {
    return new Intl.DateTimeFormat().format(date);
  }

  render() {
    return (
      <div className="calculator">
        <div className="patient">
          <div className="patientInfo">
            <div className="patientText">
              Patient Information
            </div>

            <Divider />

            <div className="dateOfVisit">
              Date of visit:
              <DatePicker
                hintText="Choose a date"
                container="inline"
                autoOk={true}
                mode="landscape"
                firstDayOfWeek={0}
                value={this.state.dateOfVisit}
                onChange={(event, date) => this.setDateOfVisit(date)}
                />
            </div>

            <div className="dateOfBirth">
              Date of birth:
              <DatePicker
                hintText="Choose a date"
                container="inline"
                autoOk={true}
                mode="landscape"
                firstDayOfWeek={0}
                value={this.state.dateOfBirth}
                onChange={(event, date) => this.setDateOfBirth(date)}
                disabled={this.state.unknownBirthDate}
                />
              <RaisedButton
                label="approximate"
                style={{marginLeft: 12}}
                onClick={() => this.randomDateOfBirth()}
                />
              <RaisedButton
                label="unknown"
                style={{margin: 0}}
                secondary={this.state.unknownBirthDate}
                onClick={() => this.unknownDateOfBirth()}
                />
            </div>

            <Divider />

            <div className="sex">
              <div className="text">
                Sex:
              </div>
              <RaisedButton
                label="female"
                style={{marginLeft: 12}}
                secondary={this.state.sex === 'female'}
                onClick={() => this.setSex('female')}
                />
              <RaisedButton
                label="male"
                style={{margin: 0}}
                primary={this.state.sex === 'male'}
                onClick={() => this.setSex('male')}
                />
            </div>

            <div className="measurement">
              <div className="text">
                Measured:
              </div>
              <RaisedButton
                label="recumbent"
                style={{marginLeft:12}}
                primary={this.state.recumbent}
                onClick={() => this.setRecumbentStatus()}
                />
              <RaisedButton
                label="standing"
                style={{margin: 0}}
                primary={!this.state.recumbent}
                onClick={() => this.setRecumbentStatus()}
                />
            </div>

            <div className="oedema">
              <div className="text">
                Oedema:
              </div>
              <RaisedButton
                label="no oedema"
                style={{marginLeft: 12}}
                primary={!this.state.oedema}
                onClick={() => this.setOedemaStatus()}
                />
              <RaisedButton
                label="oedema"
                style={{margin: 0}}
                secondary={this.state.oedema}
                onClick={() => this.setOedemaStatus()}
                />
            </div>
          </div>

          <div className="patientMeasurements">
            <div className="patientText">
              Measurements
            </div>

            <Divider />

            <div className="splitter">
              <div className="leftSide">
                <div className="inputbox">
                  Weight (kg): STYLE THIS INPUT
                  <input
                    type="number"
                    name="height"
                    value={this.state.weight}
                    step="0.01"
                    onChange={this.setWeight}
                    />
                </div>

                <div className="inputbox">
                  Length/Height (cm): STYLE THIS INPUT
                  <input
                    type="number"
                    name="height"
                    value={this.state.height}
                    step="0.01"
                    onChange={this.setHeight}
                    />
                </div>

                <div className="inputbox">
                  Head circumference (cm):
                  <input
                    type="number"
                    name="head"
                    value={this.state.headCircumference}
                    step="0.01"
                    onChange={this.setHeadCircumference}
                    />
                </div>

                <div className="inputbox">
                  BMI: {this.getBmi()}
                </div>

                <div className="inputbox">
                  Age: {this.getAgeText()}
                </div>
              </div>

              <div className="rightSide">
                <div className="inputbox">
                  MUAC (cm):
                  <input
                    type="number"
                    name="muac"
                    value={this.state.muac}
                    step="0.01"
                    onChange={this.setMUAC}
                    />
                </div>

                <div className="inputbox">
                  Triceps skinfold (mm):
                  <input
                    type="number"
                    name="triceps"
                    value={this.state.triceps}
                    step="0.01"
                    onChange={this.setTriceps}
                    />
                </div>

                <div className="inputbox">
                  Subscapular skinfold (mm):
                  <input
                    type="number"
                    name="subscapular"
                    value={this.state.subscapular}
                    step="0.01"
                    onChange={this.setSubscapular}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Results
          sex={this.state.sex}
          age={this.getAge()}
          bmi={this.getBmi()}
          recumbent={this.state.recumbent}
          oedema={this.state.oedema}
          weight={this.state.weight}
          height={this.state.height}

          headCircumference={this.state.headCircumference}
          muac={this.state.muac}
          triceps={this.state.triceps}
          subscapular={this.state.subscapular}
          />
      </div>
    );
  }
}
