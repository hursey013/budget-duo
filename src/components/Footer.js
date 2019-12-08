import React from 'react';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';

import { ReactComponent as Logo } from '../images/mark.svg';

const List = styled.ul`
  ${tw`list-reset`}

  li {
    ${tw`inline-block`}

    &:not(:last-child):after {
      content: '|';
      ${tw`px-2`}
    }
  }
`;

const Footer = () => (
  <footer>
    <div css={tw`text-center text-sm text-white`}>
      <Logo css={tw`w-6 h-6 mx-auto mb-2`} />
      <p css={tw`text-xs`}>
        A project by{' '}
        <a
          href="https://github.com/hursey013/"
          css={tw`text-white font-bold no-underline`}
        >
          @hursey013
        </a>{' '}
        and{' '}
        <a href="http://rtwell.com" css={tw`text-white font-bold no-underline`}>
          @rtwell
        </a>
      </p>
      <List>
        <li>
          <a href="mailto:hursey013@pm.me">Contact</a>
        </li>
        <li>
          <a href="https://github.com/hursey013/budget-duo">GitHub</a>
        </li>
      </List>
    </div>
  </footer>
);

export default Footer;
