import React from 'react';
import Results from '../Results/Results';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import './Calculator.css';

import {Inputfield} from './Inputfield'

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

      head: 45,
      muac: 15,
      triceps: 8,
      subscapular: 7,
    };
  }

  setSex = sex => {
    this.setState({
      sex: sex,
    });
  }

  setDateOfVisit = date => {
    this.setState({
      dateOfVisit: date,
    });
  }

  setDateOfBirth = date => {
    if (date > this.state.dateOfVisit) {
      this.setState({
        dateOfBirth: this.state.dateOfVisit,
      });
      return;
    }

    this.setState({
      dateOfBirth: date,
    });
  }

  randomDateOfBirth = () => {
    if (this.state.dateOfBirth === undefined || this.state.dateOfVisit === undefined) {
      return;
    }

    let year = this.state.dateOfBirth.getFullYear();
    let month = this.state.dateOfBirth.getMonth();

    let visityear = this.state.dateOfVisit.getFullYear();
    let visitmonth = this.state.dateOfVisit.getMonth();
    let visitday = this.state.dateOfVisit.getDate();

    let daysInMonth = new Date(year, month, 0).getDate() - 1;

    let maxDay = daysInMonth;
    if (year === visityear && month === visitmonth) {
      maxDay = visitday;
    }

    let day = Math.floor(Math.random() * maxDay) + 1;
    let newDate = new Date(year, month, day);

    this.setDateOfBirth(newDate);
  }

  unknownDateOfBirth = () => {
    this.setState({
      unknownBirthDate: !this.state.unknownBirthDate,
    });
  }

  setRecumbentStatus = () =>{
    let height = Number(this.state.height);
    if (this.state.recumbent) {
      height += 0.7;
    } else {
      height -= 0.7;
    }

    this.setState({
      recumbent: !this.state.recumbent,
      height: height,
    });
  }

  setOedemaStatus = () => {
    this.setState({
      oedema: !this.state.oedema,
    });
  }

  setWeight = (event, value) => {
    this.setState({
      weight: Number(value),
    });
  }

  setHeight = (event, value) => {
    this.setState({
      height: Number(value),
    });
  }

  setHeadCircumference = (event, value) => {
    this.setState({
      head: Number(value),
    });
  }

  setMUAC = (event, value) => {
    this.setState({
      muac: Number(value),
    });
  }

  setTriceps = (event, value) => {
    this.setState({
      triceps: Number(value),
    });
  }

  setSubscapular= (event, value) => {
    this.setState({
      subscapular: Number(value),
    });
  }

  getBmi = () => {
    let weight = this.state.weight;
    let height = this.state.height;

    if (weight === undefined || height === undefined || this.state.oedema) {
      return '-';
    }

    return Math.round(weight / Math.pow(height / 100, 2) * 100) / 100;
  }

  getAge = () => {
    if (this.state.dateOfBirth === undefined || this.state.dateOfVisit === undefined || this.state.unknownBirthDate) {
      return '-';
    }

    return (this.state.dateOfVisit - this.state.dateOfBirth) / 1000 / 60 / 60 / 24;
  }

  getAgeText = () => {
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

  render() {
    return (
      <div className="calculator">
        <div className="patient">
          <div className="patientInfo">
            <div className="patientText">
              Patient Information
            </div>

            <Divider />

            <div className="splitter">
              <div className="leftSide">
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
              </div>

              <div className="rightSide">
                <div className="optionbuttons">
                  <div className="sex">
                    <RaisedButton
                      label="female"
                      style={{marginLeft: 12}}
                      primary={this.state.sex === 'female'}
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

                  <div className="inputbox">
                    BMI: {this.getBmi()}
                  </div>

                  <div className="inputbox">
                    Age: {this.getAgeText()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="patientMeasurements">
            <div className="patientText">
              Measurements
            </div>

            <Divider />

            <div className="splitter">
              <div className="leftSide">
                <Inputfield
                  label='Weight (kg):'
                  id='weightfield'
                  value={this.state.weight}
                  setValue={this.setWeight}
                  />
                <Inputfield
                  label='Length/Height (cm):'
                  id='heightfield'
                  value={this.state.height}
                  setValue={this.setHeight}
                  />
                <Inputfield
                  label='Head circumference (cm):'
                  id='headfield'
                  value={this.state.head}
                  setValue={this.setHeadCircumference}
                  />
              </div>

              <div className="rightSide">
                <Inputfield
                  label='MUAC (cm):'
                  id='muacfield'
                  value={this.state.muac}
                  setValue={this.setMUAC}
                  />
                <Inputfield
                  label='Triceps skinfold (mm):'
                  id='tricepsfield'
                  value={this.state.triceps}
                  setValue={this.setTriceps}
                  />
                <Inputfield
                  label='Subscapular skinfold (mm):'
                  id='subscapularfield'
                  value={this.state.subscapular}
                  setValue={this.setSubscapular}
                  />
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <Results
          sex={this.state.sex}
          age={this.getAge()}
          bmi={this.getBmi()}
          recumbent={this.state.recumbent}
          oedema={this.state.oedema}
          unknownBirthDate={this.state.unknownBirthDate}

          weight={this.state.weight}
          height={this.state.height}
          head={this.state.head}
          muac={this.state.muac}
          triceps={this.state.triceps}
          subscapular={this.state.subscapular}
          />
      </div>
    );
  }
}
