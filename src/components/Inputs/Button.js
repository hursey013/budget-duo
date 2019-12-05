import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import styled from 'styled-components/macro';

const Button = styled.button`
  ${tw`rounded py-2 px-4 bg-teal no-underline text-blue border-2 border-transparent hover:bg-teal-light`}

  ${props =>
    props.outline &&
    tw`text-teal border-2 border-teal bg-transparent flex items-center hover:border-teal-light hover:text-teal-light font-bold hover:bg-transparent`}
`;

Button.propTypes = {
  outline: PropTypes.bool
};

export default Button;
