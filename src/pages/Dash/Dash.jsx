import React, { Component } from 'react';

import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import { orderBy } from 'lodash';
import { gql } from 'graphql';
import MediaQuery from 'react-responsive';

import './Dash.css';

import LessonSignUp from '../SignUp/LessonSignUp.jsx';

export default class Dash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      new_notice: false,
      lessonOpen: false,
      children: [],
      display: 'open',
      displaySwimLessons: true,
      swimTeamSignups: [],
      swimAmount: 0
    };
  }

  componentDidMount() {
    // Redirect if not logged in

    // axios.get('/auth/me').then(response => {
    //   response.data
    //     ? this.setState({
    //         new_notice: response.data.new_notice
    //       })
    //     : window.location.replace('/');
    //   axios
    //     .get(`/api/swimteamsignups/${response.data.email}`)
    //     .then(response => {
    //       let temp = orderBy(response.data, ['id'], ['asc']);
    //       this.setState({ swimTeamSignups: temp });
    //     });
    // });

    this.props.user
      ? (document.title = `${
          this.props.user.first_name
        }'s Dashboard | Pufferfish Swim Lessons`)
      : (document.title = `Dashboard | Pufferfish Swim Lessons`);

    this.setState({
      children: this.props.children
    });
  }

  componentWillReceiveProps(newProps) {
    newProps.user
      ? (document.title = `${
          newProps.user.first_name
        }'s Dashboard | Pufferfish Swim Lessons`)
      : (document.title = `Dashboard | Pufferfish Swim Lessons`);

    this.setState({
      children: newProps.children
    });
  }

  handleDisplay = () => {
    this.state.display === 'open'
      ? this.setState({
          display: 'close'
        })
      : this.setState({
          display: 'open'
        });
  };

  dontShowAgain = () => {
    //Just worked on this to not show the modal again
    axios.put(`/api/user/newnotice/${this.props.user.email}`);
    this.setState({ new_notice: false });
  };

  lessonHandleOpen = () => {
    this.setState({ lessonOpen: true });
  };

  handleNoticeClose = () => {
    this.setState({ new_notice: false });
  };

  handleSignClose = () => {
    this.setState({ lessonOpen: false });
  };

  toClose = () => {
    this.state.lessonOpen ? (
      this.setState({
        lessonOpen: false
      })
    ) : (
      <Link to={'/dash'} />
    );
    axios
      .get(`/api/user/getchildren/${this.props.user.email}`)
      .then(response => {
        this.setState({
          children: orderBy(response.data, ['first_name'], ['asc'])
        });
      });
  };

  handleSetSwim = () => {
    this.setState({ displaySwimLessons: true });
  };

  handleSwimTeam = () => {
    this.setState({ displaySwimLessons: false });
  };

  calcAmountSwim = () => {
    let prices = [110, 80, 80, 75, 80];
    let notPaid = [];
    let amount = 0;
    //map to get unpaid children
    this.props.children
      ? this.props.children.map((child, i) => {
          if (!child.paid) notPaid.push(child);
        })
      : null;
    //map unpaid children for total
    notPaid.map((child, i) => {
      amount += prices[child.session_id - 1];
    });
    return amount;
  };

  calcAmountTeam = () => {
    let price = 25;
    // this method will be very simillar to the calAmountSwim method
    //I didnt not do it because of lack of test data
  };

  updateError = data => {
    alert(
      'there was a problem saving your payment to the database, please call 800-111-1111. your payment went through but was not saved. We want to make sure you do not get charge twice for this transaction'
    );
  };

  updatePayment = paid => {
    //update kids table - paid column.
    axios
      .put('/api/update/paid', { email: this.props.user.email })
      .then(response => {
        //get the new updates from db
        axios
          .get(`/api/user/getchildren/${this.props.user.email}`)
          .then(response => {
            this.setState({
              children: orderBy(response.data, ['first_name'], ['asc'])
            });
          });
      })
      .catch(this.updateError);
  };

  render() {
    const actions = [
      <FlatButton
        label="Don't show again"
        primary={true}
        keyboardFocused={false}
        onClick={this.dontShowAgain}
      />,

      <FlatButton
        label="Got it!"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleNoticeClose}
      />
    ];

    const signUpActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleSignClose}
      />
    ];
    const customContentStyle = {
      width: '95%',
      height: '95%'
    };

    return (
      <div className="dash-container">
        <MediaQuery minWidth={1224}>
          <div
            className={`diagtop-${this.state.display}`}
            onClick={() => this.lessonHandleOpen()}>
            <span>Sign up for sessions</span>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={1223.9}>
          <Link to="/mobilesignup">
            <div className={`diagtop-${this.state.display}`}>
              <span style={{ height: '50px' }}>sign up for sessions</span>
            </div>
          </Link>
        </MediaQuery>

        <div
          className={`diagbottom-${this.state.display}`}
          onClick={() => this.handleDisplay()}>
          <span>View your reservations</span>
        </div>
        <div
          style={{
            backgroundColor: '#2D6464',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '25px',
            alignItems: 'center',
            marginTop: '-1px'
          }}>
          <button
            style={{
              backgroundColor: this.state.displaySwimLessons
                ? '#55B3B0'
                : 'white',
              cursor: this.state.displaySwimLessons ? null : 'pointer',
              color: this.state.displaySwimLessons ? 'white' : 'lightgrey',
              fontFamily: 'Oswald, sans-serif',
              border: 'none',
              padding: '15px',
              borderTopLeftRadius: '25px',
              borderBottomLeftRadius: '25px',
              outline: 'none'
            }}
            onClick={this.handleSetSwim}>
            Swim Lessons
          </button>
          <button
            style={{
              backgroundColor: this.state.displaySwimLessons
                ? 'white'
                : '#55B3B0',
              cursor: this.state.displaySwimLessons ? 'pointer' : null,
              color: this.state.displaySwimLessons ? 'lightgrey' : 'white',
              fontFamily: 'Oswald, sans-serif',
              border: 'none',
              padding: '15px',
              borderTopRightRadius: '25px',
              borderBottomRightRadius: '25px',
              outline: 'none'
            }}
            onClick={this.handleSwimTeam}>
            Swim Team Classes
          </button>
        </div>
        {this.state.displaySwimLessons ? (
          <div className="dashMain">
            <div className="children-header">
              <h3>Name</h3>
              <h3>Age</h3>
              <h3>Session Dates</h3>
              <h3>Days</h3>
              <h3>Time</h3>
              <h3>Paid</h3>
            </div>

            {this.state.children
              ? this.state.children.map((child, index) => {
                  return (
                    <div className="children-info" key={`child${index}`}>
                      <span>{child.first_name}</span>
                      <span>{child.age}</span>
                      <span>
                        {child.session_id} | {child.session_dates}
                      </span>
                      <span>{child.session_days}</span>
                      <span>
                        {child.time === null || child.email_sent === false
                          ? 'Pending'
                          : child.time}
                      </span>
                      <span>{child.paid ? 'Yes' : 'No'}</span>
                    </div>
                  );
                })
              : null}

            {/* <Checkout
              style={{ width: '100px' }}
              name={'Power Road Pufferfish'}
              description={'Pay for your swim lessons!'}
              amount={this.calcAmountSwim()}
              img={'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Circle-icons-water.svg/2000px-Circle-icons-water.svg.png'}
              updatePayment={this.updatePayment}
              email={this.props.user ? this.props.user.email : null}
            /> */}
          </div>
        ) : (
          <div className="dashMain">
            <div className="children-header">
              <h3>Month</h3>
              <h3>Day</h3>
              <h3>Date</h3>
              <h3>Time</h3>
              <h3>Paid</h3>
            </div>

            {this.state.children
              ? this.state.swimTeamSignups.map((signup, index) => {
                  return (
                    <div className="children-info" key={`child${index}`}>
                      <span>{signup.month}</span>
                      <span>{signup.day}</span>
                      <span>{signup.date}</span>
                      <span>{signup.time}</span>
                      <span>{signup.paid ? 'Yes' : 'No'}</span>
                    </div>
                  );
                })
              : null}

            {/* <Checkout
                style={{ width: '100px' }}
                name={'Power Road Pufferfish'}
                description={'Pay for your swim team!'}
                amount={this.state.amount}
                img={'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Circle-icons-water.svg/2000px-Circle-icons-water.svg.png'}
                updatePayment={this.updatePayment}
                email={this.props.user ? this.props.user.email : null}
              /> */}
          </div>
        )}

        <Dialog
          title="Hey there!"
          actions={actions}
          modal={false}
          open={this.state.new_notice}
          onRequestClose={this.handleClose}>
          Looks like you haven't been here before. Once you've signed up for a
          class you can check back here to see the status of your sign-up and
          see your children's assigned classes and times!
        </Dialog>
        <Dialog
          title="Swim Lesson Sign Up"
          actions={signUpActions}
          modal={true}
          contentStyle={customContentStyle}
          open={this.state.lessonOpen}>
          <LessonSignUp
            mobile={true}
            toClose={this.toClose}
            user={this.props.user}
          />
        </Dialog>
      </div>
    );
  }
}
