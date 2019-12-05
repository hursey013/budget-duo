import React from 'react';
import tw from 'tailwind.macro';
import 'styled-components/macro';

export const OPTIONS = [
  {
    name: 'Based on income',
    value: 'income',
    description:
      'The amount you and your partner owe for shared expenses is proportional to the total income you each contribute to your household.'
  },
  {
    name: '50/50 split',
    value: 'half',
    description: (
      <>
        Your shared expenses are split in half for you and your partner.{' '}
        <span css={tw`italic`}>
          When using this method your income is irrelevant.
        </span>
      </>
    )
  },
  {
    name: 'Grab bag method',
    value: 'adhoc',
    description: (
      <>
        Designate who will be responsible for each bill using the dropdown menu
        next to each expense.{' '}
        <span css={tw`italic`}>
          When using this method your income is irrelevant.
        </span>
      </>
    )
  }
];
