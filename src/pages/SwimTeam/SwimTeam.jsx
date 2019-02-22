import React, { Component } from 'react';
import Nav from '../nav/Nav';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import './SwimTeam.css';

export default class SwimTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      times: null,
      userAddedTimes: [],
      timesIndex: [],
      cost: 0,
      open: false,
      loading: false,
      userData: null,
      stopen: true
    };
  }

  componentDidMount() {
    axios.get('/auth/me').then(res => {
      console.log(res);
      res.data === false ? window.location.replace('/') : null;
      this.setState({ userData: res.data });
    });
    console.log(this.props);
    axios.get('/api/swimteamtimes').then(response => {
      console.log(JSON.stringify(response.data));

      let a13 = response.data.filter(time => time.date === '13th');
      let a14 = response.data.filter(time => time.date === '14th');
      let a20 = response.data.filter(time => time.date === '20th');
      let a21 = response.data.filter(time => time.date === '21st');
      let a27 = response.data.filter(time => time.date === '27th');
      let a28 = response.data.filter(time => time.date === '28th');
      let m4 = response.data.filter(time => time.date === '4th');
      let m5 = response.data.filter(time => time.date === '5th');
      console.log(a13);
      console.log(a14);
      console.log(a20);
      console.log(a21);
      console.log(a27);
      console.log(a28);
      console.log(m4);
      console.log(m5);
      this.setState({
        times: response.data,
        a13,
        a14,
        a20,
        a21,
        a27,
        a28,
        m4,
        m5
      });
      console.log('State', this.state);
    });
  }

  addTime = time => {
    console.log(time);
    let temp = this.state.userAddedTimes;
    let tempIndex = this.state.timesIndex;
    let tempCost = this.state.cost;
    console.log('Time id: ', time.id);
    console.log('TempIndex: ', tempIndex);
    console.log('Time Index: ', tempIndex.indexOf(time.id));
    let index = tempIndex.indexOf(time.id);
    index === -1
      ? (tempIndex.push(time.id), temp.push(time.id), (tempCost += 25))
      : (tempIndex.splice(index, 1), temp.splice(index, 1), (tempCost -= 25));
    this.setState({
      userAddedTimes: temp,
      timesIndex: tempIndex,
      cost: tempCost
    });
    console.log('User added times: ', this.state.userAddedTimes);
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCloseST = () => {
    this.setState({ stopen: false });
  };

  submitSwimTeam = paid => {
    let sessions = { sessions: this.state.userAddedTimes };
    this.setState({ loading: true });
    console.log('Sessions: ', sessions);
    console.log('Submitting Swim Team');
    axios
      .post('/api/email/swimteam', {
        userAddedTimes: this.state.userAddedTimes,
        email: this.state.userData.email
      })
      .then(response => {
        console.log(response);
      });

    axios
      .post(`/api/swimteam/signup/${this.props.user.email}/${paid}`, sessions)
      .then(res => {
        console.log(res);
        axios.get('/api/swimteamtimes').then(response => {
          console.log(response.data);

          let a13 = response.data.filter(time => time.date === '13th');
          let a14 = response.data.filter(time => time.date === '14th');
          let a20 = response.data.filter(time => time.date === '20th');
          let a21 = response.data.filter(time => time.date === '21st');
          let a27 = response.data.filter(time => time.date === '27th');
          let a28 = response.data.filter(time => time.date === '28th');
          let m4 = response.data.filter(time => time.date === '4th');
          let m5 = response.data.filter(time => time.date === '5th');
          console.log(a13);
          console.log(a14);
          console.log(a20);
          console.log(a21);
          console.log(a27);
          console.log(a28);
          console.log(m4);
          console.log(m5);
          this.setState({
            times: response.data,
            a13,
            a14,
            a20,
            a21,
            a27,
            a28,
            m4,
            m5
          });
          this.setState({
            times: null,
            userAddedTimes: [],
            timesIndex: [],
            cost: 0,
            open: false,
            loading: false
          });
          this.handleClose();
        });
      });
  };

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
      // <Checkout
      //   name={'Power Road Pufferfish'}
      //   description={'Pay for your swim team prep classes'}
      //   // amount={this.state.cost.reduce((p, v) => p + v)}
      //   amount={1}
      //   img={
      //     'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Circle-icons-water.svg/2000px-Circle-icons-water.svg.png'
      //   }
      //   submitSwimTeam={this.submitSwimTeam}
      //   email={this.props.user ? this.props.user.email : null}
      //   close={this.handleClose}
      // />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={() => this.submitSwimTeam(false)}
      />
    ];
    const actionsst = [
      <FlatButton
        label="Okay!"
        primary={true}
        onClick={() => this.handleCloseST()}
      />
    ];
    return (
      <div>
        <Nav />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '12px',
            overflowX: 'scroll'
          }}>
          <div className="dateContainer">
            <div className="dateTitle">
              <span>April 13th</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              {this.state.a13 !== undefined
                ? this.state.a13.map(time => {
                    return time.taken === false ? (
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '.54s',
                          backgroundColor:
                            this.state.timesIndex.indexOf(time.id) !== -1
                              ? 'rgba(85, 179, 176, .34)'
                              : null,
                          color:
                            this.state.timesIndex === time.id ? 'white' : null
                        }}
                        className="timeValid">
                        <button
                          onClick={() => this.addTime(time)}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    ) : (
                      <div className="timeInvalid">
                        <button
                          style={{
                            cursor: 'not-allowed',
                            color: 'lightgrey'
                          }}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="dateContainer">
            <div className="dateTitle">
              <span>April 14t</span>h
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              {this.state.a14 !== undefined
                ? this.state.a14.map(time => {
                    return time.taken === false ? (
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '.54s',
                          backgroundColor:
                            this.state.timesIndex.indexOf(time.id) !== -1
                              ? 'rgba(85, 179, 176, .34)'
                              : null,
                          color:
                            this.state.timesIndex === time.id ? 'white' : null
                        }}
                        className="timeValid">
                        <button
                          onClick={() => this.addTime(time)}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    ) : (
                      <div className="timeInvalid">
                        <button
                          style={{
                            cursor: 'not-allowed',
                            color: 'lightgrey'
                          }}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="dateContainer">
            <div className="dateTitle">
              <span>April 20t</span>h
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              {this.state.a20 !== undefined
                ? this.state.a20.map(time => {
                    return time.taken === false ? (
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '.54s',
                          backgroundColor:
                            this.state.timesIndex.indexOf(time.id) !== -1
                              ? 'rgba(85, 179, 176, .34)'
                              : null,
                          color:
                            this.state.timesIndex === time.id ? 'white' : null
                        }}
                        className="timeValid">
                        <button
                          onClick={() => this.addTime(time)}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    ) : (
                      <div className="timeInvalid">
                        <button
                          style={{
                            cursor: 'not-allowed',
                            color: 'lightgrey'
                          }}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="dateContainer">
            <div className="dateTitle">
              <span>April 21s</span>t
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              {this.state.a21 !== undefined
                ? this.state.a21.map(time => {
                    return time.taken === false ? (
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '.54s',
                          backgroundColor:
                            this.state.timesIndex.indexOf(time.id) !== -1
                              ? 'rgba(85, 179, 176, .34)'
                              : null,
                          color:
                            this.state.timesIndex === time.id ? 'white' : null
                        }}
                        className="timeValid">
                        <button
                          onClick={() => this.addTime(time)}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    ) : (
                      <div className="timeInvalid">
                        <button
                          style={{
                            cursor: 'not-allowed',
                            color: 'lightgrey'
                          }}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="dateContainer">
            <div className="dateTitle">
              <span>April 27t</span>h
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              {this.state.a27 !== undefined
                ? this.state.a27.map(time => {
                    return time.taken === false ? (
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '.54s',
                          backgroundColor:
                            this.state.timesIndex.indexOf(time.id) !== -1
                              ? 'rgba(85, 179, 176, .34)'
                              : null,
                          color:
                            this.state.timesIndex === time.id ? 'white' : null
                        }}
                        className="timeValid">
                        <button
                          onClick={() => this.addTime(time)}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    ) : (
                      <div className="timeInvalid">
                        <button
                          style={{
                            cursor: 'not-allowed',
                            color: 'lightgrey'
                          }}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="dateContainer">
            <div className="dateTitle">
              <span>April 28t</span>h
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              {this.state.a28 !== undefined
                ? this.state.a28.map(time => {
                    return time.taken === false ? (
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '.54s',
                          backgroundColor:
                            this.state.timesIndex.indexOf(time.id) !== -1
                              ? 'rgba(85, 179, 176, .34)'
                              : null,
                          color:
                            this.state.timesIndex === time.id ? 'white' : null
                        }}
                        className="timeValid">
                        <button
                          onClick={() => this.addTime(time)}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    ) : (
                      <div className="timeInvalid">
                        <button
                          style={{
                            cursor: 'not-allowed',
                            color: 'lightgrey'
                          }}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="dateContainer">
            <div className="dateTitle">
              <span>May 4th</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              {this.state.m4 !== undefined
                ? this.state.m4.map(time => {
                    return time.taken === false ? (
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '.54s',
                          backgroundColor:
                            this.state.timesIndex.indexOf(time.id) !== -1
                              ? 'rgba(85, 179, 176, .34)'
                              : null,
                          color:
                            this.state.timesIndex === time.id ? 'white' : null
                        }}
                        className="timeValid">
                        <button
                          onClick={() => this.addTime(time)}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    ) : (
                      <div className="timeInvalid">
                        <button
                          style={{
                            cursor: 'not-allowed',
                            color: 'lightgrey'
                          }}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div className="dateContainer">
            <div className="dateTitle">
              <span>May 5th</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
              {this.state.m5 !== undefined
                ? this.state.m5.map(time => {
                    return time.taken === false ? (
                      <div
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: '.54s',
                          backgroundColor:
                            this.state.timesIndex.indexOf(time.id) !== -1
                              ? 'rgba(85, 179, 176, .34)'
                              : null,
                          color:
                            this.state.timesIndex === time.id ? 'white' : null
                        }}
                        className="timeValid">
                        <button
                          onClick={() => this.addTime(time)}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    ) : (
                      <div className="timeInvalid">
                        <button
                          style={{
                            cursor: 'not-allowed',
                            color: 'lightgrey'
                          }}
                          className="timeButton">
                          {time.month + ' ' + time.date}
                          <br />
                          {time.time}
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(85, 179, 176, 0.634)',
            borderRadius: '50%',
            color: 'white',
            position: 'fixed',
            right: '7.5px',
            bottom: '75px',
            fontSize: '16px',
            fontWeight: '200',
            outline: 'none',
            fontFamily: 'Oswald, sans-serif',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <span>${this.state.cost}</span>
        </div>
        <button
          style={{
            width: '65px',
            height: '65px',
            backgroundColor: '#55b3b0',
            borderRadius: '50%',
            color: 'white',
            position: 'fixed',
            right: '5px',
            bottom: '5px',
            fontSize: '16px',
            fontWeight: '200',
            outline: 'none',
            fontFamily: 'Oswald, sans-serif',
            border: 'none'
          }}
          onClick={this.handleOpen}>
          SUBMIT
        </button>
        <Dialog
          title="Reserve your times"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}>
          Click submit to reserve your times, or cancel to go back and make a
          change.{' '}
          {this.state.cost > 0
            ? 'Your total for this reservation will be $' +
              this.state.cost +
              ', and you may be charged a cancellation fee if you cancel your reservation.'
            : null}
        </Dialog>
        <Dialog
          title="Swim Team Prep"
          actions={actionsst}
          modal={false}
          open={this.state.stopen}
          onRequestClose={this.handleCloseST}>
          Please keep in mind that for swim team prep, your child must be able
          to swim on his/her own, as an instructor may not always be in the
          pool.
        </Dialog>
      </div>
    );
  }
}
