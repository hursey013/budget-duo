import { createGlobalStyle } from 'styled-components';
import tw from 'tailwind.macro';

const GlobalStyle = createGlobalStyle`
  body {
    background: ${props => props.theme.colors.teal.dark};
    background: linear-gradient(
      145deg,
      ${props => props.theme.colors.teal.dark} 0%,
      ${props => props.theme.colors.blue} 100%
    );

    ${tw`bg-fixed bg-no-repeat font-sans font-normal leading-normal text-grey h-full`}
  }
`;

export default GlobalStyle;
