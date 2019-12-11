import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { withFirebase } from './Firebase';
import * as ROUTES from '../constants/routes';
import { ReactComponent as Logo } from '../images/logo.svg';
import Button from './Inputs/Button';
import Save from './Save';
import TransitionGroup from './TransitionGroup';

const Text = tw.span`hidden lg:inline-block mr-2 italic text-white`;

const NavigationAuth = ({ firebase, isDirty }) => (
  <div>
    <TransitionGroup>
      {isDirty ? <Text key={isDirty}>You have unsaved changes!</Text> : null}
    </TransitionGroup>
    <Save />
    <Button onClick={firebase.signOut} outline css={tw`inline-block`}>
      <FontAwesomeIcon
        icon={faSignOutAlt}
        css={tw`fill-current w-4 h-4 sm:hidden`}
      />
      <span css={tw`hidden sm:inline-block`}>Sign out</span>
    </Button>
  </div>
);

const NavigationNonAuth = () => (
  <div>
    <Text>Sign in to save</Text>
    <Button as={Link} to={ROUTES.SIGN_IN} css={tw`inline-block`}>
      Sign in
    </Button>
  </div>
);

const Header = ({ session, firebase }) => (
  <header css={tw`mb-4 lg:mb-8 flex items-center justify-between`}>
    <h1>
      <Link to={ROUTES.HOME}>
        <Logo />
      </Link>
    </h1>
    {session.authUser ? (
      <NavigationAuth firebase={firebase} isDirty={session.isDirty} />
    ) : (
      <NavigationNonAuth />
    )}
  </header>
);

Header.propTypes = {
  session: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired
};

const mapStateToProps = ({ session }) => ({
  session
});

export default connect(mapStateToProps)(withFirebase(Header));
