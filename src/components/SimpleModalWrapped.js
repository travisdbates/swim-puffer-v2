import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: `translate(-${50}%, -${50}%)`
  };
}

const UPDATE_PARENT = gql`
  mutation UpdateParent(
    $email: String!
    $firstName: String!
    $lastName: String!
    $phone: String!
  ) {
    parentUpdate(
      email: $email
      firstName: $firstName
      lastName: $lastName
      phone: $phone
    ) {
      firstName
      lastName
      fullName
      email
      phone
    }
  }
`;

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none'
  }
});

class SimpleModal extends React.Component {
  state = {
    open: false,
    firstName: '',
    lastName: '',
    phone: ''
  };

  componentDidMount() {
    if (!this.props.parent) {
      this.setState({ open: true });
      return;
    }
    const { firstName = '', lastName = '', phone = '' } = this.props.parent;
    if (!this.props.parent || !firstName || !lastName || !phone) {
      this.setState({ open: true, firstName, lastName, phone });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, email } = this.props;
    const { firstName, lastName, phone } = this.state;
    return (
      <Mutation mutation={UPDATE_PARENT}>
        {(updateParent, { data }) => (
          <div>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.state.open}
              onClose={this.handleClose}>
              <div style={getModalStyle()} className={classes.paper}>
                <Typography variant="h6" id="modal-title">
                  Update your info
                </Typography>
                <Typography variant="h8" id="modal-title">
                  Please take a second to make sure we have the most up to date
                  information for you.
                </Typography>
                <Typography
                  style={{ marginTop: '15px' }}
                  variant="body1"
                  id="modal-title">
                  <TextField label="Email" value={email} disabled />
                </Typography>
                <Typography variant="body1" id="modal-title">
                  <TextField
                    label="First Name"
                    value={firstName}
                    name={firstName}
                    onChange={e => {
                      this.setState({
                        firstName: e.target.value
                      });
                    }}
                  />
                </Typography>
                <Typography variant="body1" id="modal-title">
                  <TextField
                    label="Last Name"
                    value={lastName}
                    name={lastName}
                    onChange={e => {
                      this.setState({
                        lastName: e.target.value
                      });
                    }}
                  />
                </Typography>
                <Typography variant="body1" id="modal-title">
                  <TextField
                    label="Phone"
                    value={phone}
                    name={phone}
                    onChange={e => {
                      this.setState({
                        phone: e.target.value
                      });
                    }}
                  />
                </Typography>
                <Button
                  disabled={!firstName || !lastName || !phone}
                  style={{ marginTop: '15px' }}
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    try {
                      await updateParent({
                        variables: { firstName, lastName, phone, email }
                      });
                      window.location.reload();
                      this.handleClose();
                    } catch (err) {
                      console.log(err);
                    }
                  }}>
                  Submit
                </Button>
              </div>
            </Modal>
          </div>
        )}
      </Mutation>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
