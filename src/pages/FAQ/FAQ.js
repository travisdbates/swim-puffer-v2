import React, { Component } from 'react';

import { Parallax } from 'react-parallax';

import Nav from '../nav/Nav';
import 'animate.css/animate.min.css';

import './FAQ.css';
import Collapsible from 'react-collapsible';

export default class Home extends Component {
  componentDidMount() {
    document.title = `Puffer Fish Swim Lessons`;
  }
  render() {
    const image =
      'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?auto=format&fit=cro' +
      'p&w=1950&q=80';

    return (
      <div className="outer">
        <Nav />
        <Parallax
          bgImage={image}
          blur={{
            min: -5,
            max: 5
          }}>
          <div
            style={{
              height: '90vh',
              backgroundColor: 'rgba(0, 0, 0, 0.35)'
            }}>
            <div className="sideBySide">
              <div className="divWelDiv">
                <div className="sideBySideL">
                  <span>FAQ / More Info</span>
                </div>
              </div>
            </div>
          </div>
        </Parallax>
        <div className="boxSpacing2">
          <div className="test">
            <span className="intro">
              Here you can find more information about swimming lessons and
              frequently asked questions.
            </span>
          </div>
        </div>
        <div className="meetInst">
          <span>FAQ</span>
        </div>
        <div>
          <div className="diagbottom" />
          <div
            style={{
              paddingTop: '50px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#2D6464'
            }}>
            <Collapsible trigger="How young can I start my child in swimming lessons?">
              <cp>We usually take children beginning at 18 months.</cp>
            </Collapsible>
            <Collapsible trigger="Do I need to get in the pool with my child?">
              <cp>
                No. Parents are not to get in the pool with their children. For
                beginner classes, parents are encouraged to sit on the deck next
                to their child to keep them both safe and comfortable.
              </cp>
            </Collapsible>
            <Collapsible trigger="Does my baby need to wear a swim diaper?">
              <cp>
                If your child is not potty trained, please keep him in a swim
                diaper. We also have restroom facilities in the pool area.
              </cp>
            </Collapsible>
            <Collapsible trigger="How many children will be in my child's class?">
              <cp>
                Each class has 4 children in it. We do our best to keep children
                at the same age and experience level in the same class.
              </cp>
            </Collapsible>
            <Collapsible trigger="When will I know what time my child's lesson is scheduled for?">
              <cp>
                You will be notified of your child's class time one to two weeks
                prior to the start day of that session.
              </cp>
            </Collapsible>
            <Collapsible trigger="What if I want my child to be the same class as his/her friend?">
              <cp>
                Please let us know the friend's name in the "Time
                Conflicts/Notes" section of the sign up form. We will do our
                best to accommodate both children.
              </cp>
            </Collapsible>
            <Collapsible trigger="What if I miss a class?">
              <cp>
                We do not offer extra classes for make-ups. We will, however,
                let you know if we have an opening during the day. You may
                choose to bring your child at that time for a make up.
              </cp>
            </Collapsible>
            <Collapsible trigger="Is the pool heated?">
              <cp>
                Yes. The pool is heated to a very comfortable temperature in
                April and May. After that, the heater is no longer needed.
              </cp>
            </Collapsible>
            <Collapsible trigger="How do I pay for classes?">
              <cp>
                You may bring money on the first day of class. We will provide
                envelopes.
              </cp>
            </Collapsible>
            <Collapsible trigger="​Can my child wear a rashguard in the pool?">
              <cp>
                Yes! In fact, we think that's best. If you do need to apply
                sunscreen to your child, please do so at least 15 minutes prior
                to getting in the pool. Otherwise, it just washes right off!
                Thanks for your help in keeping our pool clean. *After 3:30, the
                entire pool is shaded and sunscreen is not needed.
              </cp>
            </Collapsible>
            <Collapsible trigger="Where do I park?">
              <cp>
                Follow the parking signs. There is a parking lot around the back
                by the pool.
              </cp>
            </Collapsible>
            <Collapsible trigger="Can I share this info with my friends?">
              <cp>Of course! Thank you!</cp>
            </Collapsible>
          </div>
          <div className="diagbottomy" />
        </div>
        <div className="diagtopb">
          <span>MORE INFO</span>
        </div>
        <div
          style={{
            width: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'space-around',
            flexDirection: 'column',
            color: 'white',
            fontSize: '2em',
            fontWeight: '400',
            height: 'auto',
            padding: '50px 50px',
            backgroundColor: '#55b3b0',
            paddingLeft: '15vw',
            paddingRight: '15vw'
          }}>
          <span>&#9679; Click the login/signup button to get started.</span>
          <span style={{ marginTop: '20px' }}>
            &#9679; Once you've signed up you can register for swimming
            lessons/swim team prep.
          </span>
          <span style={{ marginTop: '20px' }}>
            &#9679; You can check back on your dashboard to see what you signed
            up for, and check your assigned times.
          </span>
        </div>
        <div className="diagbottomb" />
        <div>
          <div className="diagbottom" />
        </div>
        <div className="meetInst">
          <span>Help?</span>
        </div>
        <div>
          <div className="diagbottom" />
        </div>
        <div
          style={{
            paddingBottom: '5px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#2D6464',
            color: 'white',
            fontSize: '4vw'
          }}>
          Email us at&nbsp;
          <a
            href="mailto:swimpufferfish@gmail.com"
            style={{ textDecoration: 'none', color: 'white' }}>
            swimpufferfish@gmail.com
          </a>
          .
        </div>
        <div className="diagbottomy" />
        &#9400; 2019 Puffer Fish Swim Lessons | Website & Design by{' '}
        <a style={{ color: '#55B3B0', textDecoration: 'underline' }} href="/">
          TB Design
        </a>
      </div>
    );
  }
}
