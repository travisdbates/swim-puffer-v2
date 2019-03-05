import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { timeHelper } from './timeHelper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

function ParentChildTable(props) {
  const { classes, data } = props;
  if (!data[0].length > 0) {
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          Oops! No kiddos have been signed up yet!
        </Table>
      </Paper>
    );
  }
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Child Name</TableCell>
            <TableCell align="right">Session Preference</TableCell>
            <TableCell align="right">Time Preference</TableCell>
            <TableCell align="right">Session Assigned</TableCell>
            <TableCell align="right">Time Assigned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data[0].map(row => (
            <TableRow hover key={row.firstName + row.sessionPreference}>
              <TableCell component="th" scope="row">
                {row.firstName}
              </TableCell>
              <TableCell align="right">{row.sessionPreference}</TableCell>
              <TableCell align="right">
                {timeHelper(row.timePreference)}
                {/* {row.timePreference} */}
              </TableCell>
              <TableCell align="right">
                {row.sessionAssigned ? row.sessionAssigned : 'N/A'}
              </TableCell>
              <TableCell align="right">
                {row.timeAssigned ? row.timeAssigned : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

ParentChildTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ParentChildTable);
