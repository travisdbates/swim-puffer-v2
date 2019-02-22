import React, { Component } from 'react';
import './Admin.css';
import axios from 'axios';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { Table } from 'reactstrap';
import { orderBy } from 'lodash';
import logo from '../../assets/PufferSwimLogo1.svg';
import ReactTooltip from 'react-tooltip';
export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allChildren: null,
      activeSession: 1,
      displaySession: null,
      aZ: false,
      times: null,
      displayTimes: null,
      swimTeam: null
    };
  }

  componentDidMount() {
    // Check for allowed emails here
    // *****
    // *****
    // -----------------------------
    axios.get('/api/admin/getall').then(response => {
      console.log(response.data);
      let defaultSession = response.data.filter(
        child => child.session_id === 1
      );
      this.setState({
        allChildren: response.data,
        displaySession: defaultSession
      });
    });
    axios.get('/api/admin/gettimes').then(response => {
      let defaultTime = orderBy(
        response.data.filter(time => {
          return time.session.search('Session 1') !== -1;
        }),
        ['time'],
        ['asc']
      );
      console.log(response.data);
      this.setState({ times: response.data, displayTimes: defaultTime });
    });
    axios.get('/api/admin/swimteam').then(response => {
      console.log(response.data);
      this.setState({ swimTeam: response.data });
    });
  }

  setSession = session => {
    if (session === 6) {
      this.setState({ activeSession: 6 });
      return;
    }
    let temp = this.state.allChildren.filter(
      child => child.session_id === session
    );

    let timeTemp = orderBy(
      this.state.times.filter(time => {
        return time.session.search(`Session ${session}`) !== -1;
      }),
      ['time'],
      ['asc']
    );
    this.setState({
      activeSession: session,
      displaySession: temp,
      displayTimes: timeTemp
    });
  };

  sorter = type => {
    let temp = this.state.displaySession;
    console.log('Temp: ', temp[0][type]);
    console.log('Type: ', type);
    if (type === 'childfirst') {
      temp.sort((a, b) => {
        console.log('got here');
        console.log(a[type].toUpperCase());
        var nameA = a[type].toUpperCase(); // ignore upper and lowercase
        var nameB = b[type].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      });
    } else {
      temp.sort((a, b) => {
        return this.state.aZ ? a[type] - b[type] : b[type] - a[type];
      });
    }
    console.log('Afte sort: ', temp);
    this.setState({ displaySession: temp, aZ: !this.state.aZ });
  };

  assignTime = (event, id, age, index) => {
    console.log('Time id: ', event.target.value);
    console.log('Child Session id: ', id);
    console.log('Child Age: ', age);
    axios
      .post(`/api/admin/assigntime/${id}/${event.target.value}`)
      .then(responseAssign => {
        console.log('1: Assigning time');
        let temp = this.state.displaySession;
        temp[index].assigntime = responseAssign.data[0].assigntime;
        this.setState({ displaySession: temp });
        axios
          .post(
            `/api/admin/timeslot/${responseAssign.data[0].assigntime}/${age}`
          )
          .then(responseSlot => {
            console.log('2: Changin time slot');
            axios.get('/api/admin/gettimes').then(responseTimes => {
              console.log('3: Resetting times');
              let defaultTime = orderBy(
                responseTimes.data.filter(time => {
                  return (
                    time.session.search(
                      `Session ${this.state.activeSession}`
                    ) !== -1
                  );
                }),
                ['time'],
                ['asc']
              );
              this.setState({
                times: responseTimes.data,
                displayTimes: defaultTime
              });
            });

            console.log(responseSlot);
          });
        console.log(responseAssign);
      });
  };

  sendEmail = child => {
    if (child.assigntime) {
      let time = this.state.times[child.assigntime - 1];
      axios
        .post('api/email/assigned', { child, time })
        .then(emailResponse => {
          console.log(emailResponse);
          axios
            .put('/api/admin/email', child)
            .then(response => {
              console.log(response);
              let setIndex = 0;
              for (let i = 0; i < this.state.allChildren.length; i++) {
                if (
                  JSON.stringify(child) ===
                  JSON.stringify(this.state.allChildren[i])
                ) {
                  setIndex = i;
                }
              }
              this.state.allChildren[setIndex].email_sent = true;
              this.state.allChildren[setIndex];

              this.setState({
                allChildren: this.state.allChildren
              });
            })
            .catch(err => {
              alert(
                'uh oh, looks like the email sent but the database didnt get updated, if issue continues please contact your developer!'
              );
            });
        })
        .catch(error => {
          alert(
            'woops, sorry! there was an error, if issue continues please contact your developer!',
            error
          );
        });
    } else {
      alert('sorry, looks like you have not assigned a time yet');
    }
  };

  render() {
    console.log('admin state', this.state);
    const activeButtonStyle = {
      backgroundColor: 'white',
      color: '#2D6464',
      width: 'auto',
      height: 'auto',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: '.34s',
      border: '#2D6464 1px solid',
      fontFamily: 'Oswald, sans-serif',
      textTransform: 'uppercase',
      marginLeft: '2vw',
      outline: 'none',

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    };
    return (
      <div className="adminContent">
        <adminheader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img className="title" src={logo} alt="Pufferfish Swim School" />
            <span style={{ fontSize: '2em', marginLeft: '2vw' }}>Admin</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '5vw'
            }}>
            Session Select:
            <button
              className="sessionSelect"
              onClick={() => this.setSession(1)}
              style={this.state.activeSession === 1 ? activeButtonStyle : null}>
              1
            </button>
            <button
              className="sessionSelect"
              onClick={() => this.setSession(2)}
              style={this.state.activeSession === 2 ? activeButtonStyle : null}>
              2
            </button>
            <button
              className="sessionSelect"
              onClick={() => this.setSession(3)}
              style={this.state.activeSession === 3 ? activeButtonStyle : null}>
              3
            </button>
            <button
              className="sessionSelect"
              onClick={() => this.setSession(4)}
              style={this.state.activeSession === 4 ? activeButtonStyle : null}>
              4
            </button>
            <button
              className="sessionSelect"
              onClick={() => this.setSession(5)}
              style={this.state.activeSession === 5 ? activeButtonStyle : null}>
              5
            </button>
            <button
              className="sessionSelect"
              onClick={() => this.setSession(6)}
              style={this.state.activeSession === 6 ? activeButtonStyle : null}>
              ST
            </button>
          </div>
        </adminheader>
        <div className="assignmentAndTime">
          {this.state.activeSession === 6 ? (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div
                style={{
                  width: '90vw',
                  height: '80vh',
                  color: 'black',
                  backgroundColor: 'white',
                  overflowY: 'scroll'
                }}>
                <Table striped>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Day</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Parent Email</th>
                      <th>Name</th>
                      <th>Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.swimTeam !== null ? (
                      this.state.swimTeam.map((session, index) => {
                        return (
                          <tr>
                            <th scope="row">{session.month}</th>
                            <td>{session.day}</td>
                            <td>{session.date}</td>
                            <td>{session.time}</td>
                            <td>{session.parent_email}</td>
                            <td>
                              {session.first_name} {session.last_name}
                            </td>
                            <td>{session.paid ? 'Yes' : 'No'}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <RefreshIndicator />
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="assignment">
              <Table striped>
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Id</th>
                    <th
                      tyle={{ cursor: 'pointer' }}
                      onClick={() => this.sorter('childfirst')}>
                      Child Name
                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.sorter('age')}>
                      Age
                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.sorter('time_id')}>
                      Time Request
                    </th>
                    <th>Parent Name</th>
                    <th>Parent Email</th>
                    <th>Paid?</th>
                    <th>Time Assign.</th>
                    <th>Conflicts</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.displaySession !== null ? (
                    this.state.displaySession.map((child, index) => {
                      return (
                        <tr>
                          <th scope="row">
                            {new Date(child.time).toLocaleDateString({
                              timeZone: '	America/Phoenix'
                            })}
                            &nbsp;
                            {new Date(child.time).toLocaleTimeString()}
                          </th>
                          <td>{child.sessionassignmentid}</td>
                          <td>{child.childfirst}</td>
                          <td>{child.age}</td>
                          <td> {child.time_id}</td>
                          <td>{child.first_name + ' ' + child.last_name}</td>
                          <td>{child.email}</td>
                          <td
                            style={
                              child.paid ? { color: 'green' } : { color: 'red' }
                            }>
                            {child.paid ? 'Yes' : 'No'}
                          </td>
                          <td>
                            <select
                              value={
                                child.assigntime !== null
                                  ? child.assigntime
                                  : ''
                              }
                              onChange={e =>
                                this.assignTime(
                                  e,
                                  child.sessionassignmentid,
                                  child.age,
                                  index
                                )
                              }>
                              <option />
                              {this.state.times !== null
                                ? this.state.displayTimes.map((time, index) => {
                                    return (
                                      <option value={time.id}>
                                        {time.time} - {time.side}{' '}
                                        {time.spots_available <= 0
                                          ? '(FULL)'
                                          : ''}
                                      </option>
                                    );
                                  })
                                : null}
                            </select>
                          </td>
                          <td>
                            {child.notes !== null ? (
                              <div>
                                <a
                                  data-tip={child.notes}
                                  style={
                                    child.notes !== null
                                      ? { color: 'red', cursor: 'pointer' }
                                      : null
                                  }>
                                  Yes
                                </a>
                                <ReactTooltip
                                  place="left"
                                  type="dark"
                                  effect="solid"
                                />
                              </div>
                            ) : (
                              'No'
                            )}
                          </td>
                          <td
                            className="send-email"
                            onClick={() => this.sendEmail(child)}
                            style={
                              child.email_sent
                                ? {
                                    color: 'green',
                                    border: '1px solid green',
                                    padding: '1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }
                                : {
                                    color: 'red',
                                    border: '1px solid red',
                                    padding: '1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }
                            }>
                            {child.email_sent ? 'Sent' : 'Send'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <RefreshIndicator />
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {this.state.activeSession === 6 ? null : (
            <div className="times">
              <Table striped>
                <thead>
                  <tr>
                    <th>Time Slot</th>
                    <th>Side</th>
                    <th>Age</th>
                    <th>Time</th>
                    <th># Left</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.times !== null ? (
                    this.state.displayTimes.map((time, index) => {
                      return (
                        <tr>
                          <th scope="row">{time.session}</th>
                          <td>{time.side}</td>
                          <td>{time.age === null ? 'N/A' : time.age}</td>
                          <td>{time.time}</td>
                          <td>{time.spots_available}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <RefreshIndicator />
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    );
  }
}
