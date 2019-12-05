import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import 'styled-components/macro';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { ThreeBounce } from 'styled-spinkit';
import { withTheme } from 'styled-components';

import { withFirebase } from './Firebase';
import { isDirty, isSaving } from '../actions/session';
import Button from './Inputs/Button';

const Save = ({ firebase, state, onDirty, onSaving, theme }) => {
  const { expenses, incomes, split, session } = state;

  const handleSave = () => {
    onSaving(true);

    firebase
      .user(session.authUser.uid)
      .set({
        expenses,
        incomes,
        split,
        lastSaved: firebase.timestamp()
      })
      .then(onDirty(false))
      .then(
        setTimeout(function() {
          onSaving(false);
        }, 500)
      );
  };

  return (
    <Button css={tw`inline-block mr-2 w-auto sm:w-24`} onClick={handleSave}>
      {session.isSaving ? (
        <ThreeBounce color={theme.colors.blue} css={tw`my-0 mx-auto`} />
      ) : (
        <>
          <FontAwesomeIcon
            icon={faSave}
            css={tw`fill-current w-4 h-4 mr-0 sm:mr-2`}
          />
          <span css={tw`hidden sm:inline-block`}>Save</span>
        </>
      )}
    </Button>
  );
};

Save.propTypes = {
  state: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  onDirty: PropTypes.func.isRequired,
  onSaving: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  onDirty: value => dispatch(isDirty(value)),
  onSaving: value => dispatch(isSaving(value))
});

const mapStateToProps = state => ({
  state
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebase(withTheme(Save)));
