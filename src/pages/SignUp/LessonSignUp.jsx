import React, { Component } from 'react';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Nav from '../nav/Nav.jsx';
import MediaQuery from 'react-responsive';
import axios from 'axios';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import './SignUp.css';

/**
 * Horizontal steppers are ideal when the contents of one step depend on an earlier step.
 * Avoid using long step names in horizontal steppers.
 *
 * Linear steppers require users to complete one step in order to move on to the next.
 */

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loading: false,
      userData: null,
      finished: false,
      stepIndex: 0,
      width: 1001,
      height: 0,
      error: false,
      age: null,
      ageError: false,
      name: null,
      nameError: false,
      session: [],
      sessionError: false,
      time: [],
      timeError: false,
      timeErrorArray: [],
      timeNotes: [],
      cost: [0],
      sessions: [
        {
          name: 'Session 1',
          dates: 'April 10 - May 3',
          length: '12 Lessons',
          days: 'T | W | Th',
          cost: '110'
        },
        {
          name: 'Session 2',
          dates: 'May 7 - May 17',
          length: '8 Lessons',
          days: 'M | T | W | Th',
          cost: '80'
        },
        {
          name: 'Session 3',
          dates: 'May 29 - June 14',
          length: '9 Lessons',
          days: 'T | W | Th',
          cost: '80'
        },
        {
          name: 'Session 4',
          dates: 'June 18 - June 28',
          length: '8 Lessons',
          days: 'M | T | W | Th',
          cost: '75'
        },
        {
          name: 'Session 5',
          dates: 'Aug 7 - Aug 23',
          length: '9 Lessons',
          days: 'T | W | Th',
          cost: '80'
        }
      ]
    };
  }

  componentDidMount() {
    axios.get('/auth/me').then(res => {
      console.log(res);
      this.setState({ userData: res.data });
    });
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    document.title = `Sign Up | Pufferfish Swim Lessons`;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3
    });
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1
      });
    }
  };

  handleChange = (event, index, value) =>
    this.setState({ age: value, ageError: false });

  handleSessionChange = index => {
    let temp = [...this.state.session];
    let timeErrorTemp = [...this.state.timeErrorArray];
    let time = [...this.state.time];
    let num = temp.indexOf(index + 1);

    if (3 <= this.state.age && this.state.age <= 5 && index <= 1) {
      this.setState({ open: true });
    }
    let cost = [...this.state.cost];
    num === -1
      ? (temp.push(index + 1),
        timeErrorTemp.push(true),
        time.push(''),
        cost.push(parseInt(this.state.sessions[index].cost, 10)))
      : (temp.splice(num, 1),
        timeErrorTemp.splice(num, 1),
        time.splice(num, 1),
        cost.splice(num, 1));

    this.setState({
      session: temp.sort(),
      sessionError: false,
      timeErrorArray: timeErrorTemp,
      time: time,
      cost: cost
    });
    console.log('Session(s): ', this.state.session);
    console.log('Time error: ', this.state.timeErrorArray);
    console.log('Costs: ', this.state.cost);
  };
  handleTimeChange = (value, index) => {
    console.log('value: ', value);
    console.log(index);
    let temp = [...this.state.time];
    let num = 0;

    if (value === '9:00 AM - 11:30 AM') {
      num = 1;
    } else if (value === '11:30 AM - 3:30 PM') {
      num = 2;
    } else if (value === '3:30 PM - 5:30 PM') {
      num = 3;
    }

    temp[index] = num;

    let timeErrorTemp = [...this.state.timeErrorArray];

    timeErrorTemp[index] = false;

    this.setState({ time: temp, timeErrorArray: timeErrorTemp });
    console.log(this.state.time);
  };

  handleTimeNotesChange = (event, index) => {
    console.log('Time Notes Value: ', event.target.value);
    console.log('Index: ', index);
    let temp = [...this.state.timeNotes];
    temp[index] = event.target.value;
    this.setState({ timeNotes: temp });
  };

  handleNameChange = (event, value) =>
    value === ''
      ? this.setState({ name: null })
      : this.setState({ name: value, nameError: false });

  submitChildAndSession = paid => {
    this.setState({ loading: true });
    console.log(this.state.userData);
    let data = {
      first_name: this.state.name,
      age: this.state.age,
      parent_email: this.state.userData.email
    };

    axios.post(`/api/child/create/${paid}`, data).then(response => {
      console.log(response);
      let signupInfo = {
        kid_id: response.data[0].id,
        sessions: this.state.session,
        time: this.state.time,
        timeNotes: this.state.timeNotes
      };
      axios.post('/api/child/signup', signupInfo).then(response => {
        this.setState({ loading: false });
        console.log(response);
        document.location.href.includes('dash')
          ? this.props.toClose()
          : window.location.replace(
              `${window.location.protocol}//${window.location.host}/dash`
            );

        axios.post('/api/email/signup', this.state).then(email_response => {
          console.log('email response', email_response);
        });
      });
    });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  testFunc = () => {
    let flag = false;
    this.state.time.map(times => {
      if (times === '') flag = true;
    });
    return flag;
  };

  renderStepActions(step) {
    const { stepIndex } = this.state;
    const contentStyle = {
      margin: '0px 0px'
    };
    return (
      <div style={contentStyle}>
        <div>
          <div
            style={{
              marginTop: 12
            }}>
            {stepIndex !== 0 ? (
              <FlatButton
                label="Back"
                onClick={this.handlePrev}
                style={{
                  marginRight: 12
                }}
              />
            ) : null}
            <RaisedButton
              label={
                stepIndex === 4
                  ? 'Submit'
                  : stepIndex === 0
                  ? 'Swim Lessons (FULL)'
                  : 'Next'
              }
              primary={true}
              style={{ margin: '5px' }}
              onClick={() =>
                stepIndex === 0
                  ? this.handleNext()
                  : (stepIndex === 1 && this.state.age === null) ||
                    this.state.name === null
                  ? (this.state.age === null
                      ? this.setState({ ageError: true })
                      : null,
                    this.state.name === null
                      ? this.setState({ nameError: true })
                      : null)
                  : stepIndex === 2 && this.state.session.length === 0
                  ? this.setState({ sessionError: true })
                  : stepIndex === 3 && this.testFunc()
                  ? this.setState({ timeError: true })
                  : stepIndex === 4
                  ? this.submitChildAndSession(false)
                  : this.handleNext()
              }
            />
            {stepIndex === 0 ? (
              <RaisedButton
                label="Swim Team Prep"
                primary={true}
                onClick={() => window.location.replace('/swimteam')}
                style={{ marginLeft: '5px' }}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  isDisabled = (s, t) => {
    if (s === 1 && t === 1) {
      return true;
    } else if (s === 1 && t === 3) {
      return true;
    }
    if (s === 2 && t === 1) {
      return true;
    } else if (s === 2 && t === 3) {
      return true;
    }
    if (s === 3 && t === 1) {
      return true;
    } else return false;
  };

  render() {
    const { finished, stepIndex } = this.state;
    const actions = [
      <FlatButton label="Okay!" primary={true} onClick={this.handleClose} />
    ];
    return (
      <div
        style={{
          width: '95%',
          margin: '1% 2%'
        }}>
        {this.state.loading ? (
          <div
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.568)',
              left: 0,
              top: 0,
              display: 'flex',
              width: '100%',
              height: '100%',
              zIndex: '1999',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {' '}
            <RefreshIndicator
              size={40}
              left={10}
              top={0}
              status="loading"
              style={{
                display: 'inline-block',
                position: 'relative'
              }}
            />{' '}
          </div>
        ) : null}

        <MediaQuery maxWidth={1224}>
          {this.props.mobile ? null : <Nav />}
        </MediaQuery>
        <Stepper
          activeStep={stepIndex}
          orientation="vertical"
          style={{ overflow: 'scroll' }}>
          <Step>
            <StepLabel>Swim Lesson/Swim Team Prep</StepLabel>
            <StepContent>
              What do you need to sign up for?
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Child Info</StepLabel>
            <StepContent>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'flex-start'
                }}>
                <TextField
                  value={this.state.name}
                  onChange={this.handleNameChange}
                  hintText="Child's First Name"
                  errorText={
                    this.state.nameError ? 'This field is required' : null
                  }
                />
                <SelectField
                  style={{
                    marginBottom: '10px'
                  }}
                  errorText={
                    this.state.ageError ? 'This field is required' : null
                  }
                  floatingLabelText="Age"
                  value={this.state.age}
                  onChange={this.handleChange}>
                  <MenuItem value={1} primaryText="1" />
                  <MenuItem value={1.5} primaryText="18 mos" />
                  <MenuItem value={2} primaryText="2" />
                  <MenuItem value={3} primaryText="3" />
                  <MenuItem value={4} primaryText="4" />
                  <MenuItem value={5} primaryText="5" />
                  <MenuItem value={6} primaryText="6" />
                  <MenuItem value={7} primaryText="7" />
                  <MenuItem value={8} primaryText="8" />
                  <MenuItem value={9} primaryText="9" />
                  <MenuItem value={10} primaryText="10" />
                  <MenuItem value={11} primaryText="11" />
                  <MenuItem value={12} primaryText="12" />
                  <MenuItem value={13} primaryText="13" />
                  <MenuItem value={14} primaryText="14" />
                  <MenuItem value={15} primaryText="15" />
                  <MenuItem value={16} primaryText="16" />
                  <MenuItem value={17} primaryText="17" />
                  <MenuItem value={18} primaryText="18" />
                </SelectField>
                {this.renderStepActions(1)}
              </div>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Session</StepLabel>
            <StepContent>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginBottom: '50px'
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      width: '100%',
                      color: 'rgba(0, 0, 0, .39)',
                      flexWrap: 'wrap'
                    }}>
                    {this.state.sessions.map((session, index) => {
                      return index < 3 ? (
                        <Paper
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100px',
                            margin: '5px',
                            fontFamily: 'Oswald, sans-serif',
                            padding: '5px',
                            transition: '.54s',
                            backgroundColor: 'rgba(178, 100, 84, .34)',
                            color: '#8c8c8c'
                          }}>
                          <span
                            style={{
                              fontWeight: '700'
                            }}>
                            {session.name}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            {session.dates}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            {session.days}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            {session.length}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            ${session.cost}
                          </span>
                          {index <= 1 && (
                            <span
                              style={{ fontWeight: '200', fontSize: '.7em' }}>
                              Includes $5 heating fee
                            </span>
                          )}
                        </Paper>
                      ) : (
                        <Paper
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100px',
                            margin: '5px',
                            fontFamily: 'Oswald, sans-serif',
                            padding: '5px',
                            transition: '.54s',
                            backgroundColor:
                              this.state.session.indexOf(index + 1) !== -1
                                ? 'rgba(85, 179, 176, .34)'
                                : null,
                            color:
                              this.state.session === index + 1 ? 'white' : null
                          }}
                          onClick={() => this.handleSessionChange(index)}>
                          <span
                            style={{
                              fontWeight: '700'
                            }}>
                            {session.name}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            {session.dates}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            {session.days}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            {session.length}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            ${session.cost}
                          </span>
                          {index <= 1 && (
                            <span
                              style={{ fontWeight: '200', fontSize: '.7em' }}>
                              Includes $5 heating fee
                            </span>
                          )}
                        </Paper>
                      );
                    })}
                  </div>
                </div>
                {this.state.sessionError ? (
                  <span
                    style={{
                      color: 'rgb(244, 67, 54)',
                      fontFamily: 'Roboto, sans-serif',
                      marginLeft: '23px',
                      fontSize: '12px'
                    }}>
                    Please click on a session.
                  </span>
                ) : null}
              </div>
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Time Preference</StepLabel>
            <StepContent>
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'flex-start'
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      width: '100%',
                      color: 'rgba(0, 0, 0, .39)',
                      flexWrap: 'wrap'
                    }}>
                    {this.state.session.map((session, index) => {
                      return (
                        <div
                          style={{
                            height: 'auto',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                          }}>
                          {console.log(session)}
                          <SelectField
                            errorText={
                              this.state.timeErrorArray[index] &&
                              this.state.timeError
                                ? 'This field is required'
                                : null
                            }
                            floatingLabelText={`Sesion ${session} Time Preference`}
                            value={this.state.time[index]}
                            onChange={e =>
                              this.handleTimeChange(e.target.outerText, index)
                            }
                            style={{ fontSize: '.6em' }}>
                            <MenuItem
                              value={1}
                              disabled={this.isDisabled(session, 1)}
                              primaryText="9:00 AM - 11:30 AM"
                              style={{
                                fontSize: '.6em',
                                color: `${
                                  this.isDisabled(session, 1) ? '#ba9a9a' : null
                                }`
                              }}
                            />
                            <MenuItem
                              value={2}
                              disabled={this.isDisabled(session, 2)}
                              primaryText="11:30 AM - 3:30 PM"
                              style={{
                                fontSize: '.6em',
                                color: `${
                                  this.isDisabled(session, 2) ? '#ba9a9a' : null
                                }`
                              }}
                            />
                            <MenuItem
                              value={3}
                              disabled={this.isDisabled(session, 3)}
                              primaryText="3:30 PM - 5:30 PM"
                              style={{
                                fontSize: '.6em',
                                color: `${
                                  this.isDisabled(session, 3) ? '#ba9a9a' : null
                                }`
                              }}
                            />
                          </SelectField>
                          <TextField
                            style={{ fontSize: '.6em' }}
                            value={this.state.timeNotes[index]}
                            onChange={e => this.handleTimeNotesChange(e, index)}
                            hintText={`Session ${session} Time Conflicts/Notes?`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {this.renderStepActions(3)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Summary</StepLabel>
            <StepContent>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginBottom: '50px'
                }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    width: '100%',
                    color: 'rgba(0, 0, 0, .39)',
                    flexWrap: 'wrap'
                  }}>
                  Name: {this.state.name}
                  <br />
                  Age: {this.state.age}
                  <br />
                  Total Cost: ${this.state.cost.reduce((p, v) => p + v)}
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {this.state.session.map((sessionSign, index) => {
                      return (
                        <Paper
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '155px',
                            margin: '5px',
                            fontFamily: 'Oswald, sans-serif',
                            padding: '5px',
                            transition: '.54s'
                          }}>
                          <span
                            style={{
                              fontWeight: '700'
                            }}>
                            Session: {sessionSign}
                          </span>
                          <span
                            style={{
                              fontWeight: '200'
                            }}>
                            Time:{' '}
                            {this.state.time[index] === 1
                              ? '9:00 AM - 11:30 AM'
                              : this.state.time[index] === 2
                              ? '11:30 AM - 3:30 PM'
                              : '3:30 PM - 5:30 PM'}
                          </span>
                        </Paper>
                      );
                    })}
                  </div>
                  You'll receive a notification once your time has been
                  assigned.
                </div>
              </div>
              {this.renderStepActions(4)}
            </StepContent>
          </Step>
        </Stepper>
        <Dialog
          title="Heads Up!"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}>
          Based on your child's age, and the session you've selected, keep in
          mind they may have preschool or kindergarten during the selected
          session.
        </Dialog>
      </div>
    );
  }
}

export default SignUp;
