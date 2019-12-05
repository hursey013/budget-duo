import { convertLegacyExpenses, convertLegacyIncomes } from './shared';

const sample = {
  expenses: {
    '-LCeMf-6iddBAqgs3MSN': {
      cost: '86.00',
      item: 'Gym'
    },
    '-LCeMf-6iddBAqgs3MSP': {
      cost: '1848.32',
      item: 'Mortgage'
    },
    '-LCeMf-6iddBAqgs3MSQ': {
      cost: '200.00',
      item: 'Savings'
    }
  },
  incomes: {
    '-LCeMf-6iddBAqgs3MSK': {
      amount: '109980.00',
      name: 'You'
    },
    '-LCeMf-6iddBAqgs3MSL': {
      amount: '72100.00',
      name: 'Partner'
    }
  },
  split: 'income'
};

describe('convertLegacyExpenses()', () => {
  it('updates keys', () => {
    expect(
      convertLegacyExpenses(sample.expenses, sample.incomes)
    ).toStrictEqual({
      '-LCeMf-6iddBAqgs3MSN': {
        name: 'Gym',
        payer: '-LCeMf-6iddBAqgs3MSK',
        value: 86
      },
      '-LCeMf-6iddBAqgs3MSP': {
        name: 'Mortgage',
        payer: '-LCeMf-6iddBAqgs3MSK',
        value: 1848.32
      },
      '-LCeMf-6iddBAqgs3MSQ': {
        name: 'Savings',
        payer: '-LCeMf-6iddBAqgs3MSK',
        value: 200
      }
    });
  });

  it('handles different split values', () => {
    const object = {
      ...sample,
      expenses: {
        '-LCeMf-6iddBAqgs3MSN': {
          cost: '86.00',
          item: 'Gym',
          split: 1
        },
        '-LCeMf-6iddBAqgs3MSP': {
          cost: '1848.32',
          item: 'Mortgage',
          split: 0
        },
        '-LCeMf-6iddBAqgs3MSQ': {
          cost: '200.00',
          item: 'Savings'
        },
        '-LCeMf-6iddBAqgs3MSR': {
          cost: '49.99',
          item: 'Internet',
          split: '1'
        },
        '-LCeMf-6iddBAqgs3MSS': {
          cost: '75.00',
          item: 'Utilities',
          split: '0'
        }
      }
    };

    expect(
      convertLegacyExpenses(object.expenses, object.incomes)
    ).toStrictEqual({
      '-LCeMf-6iddBAqgs3MSN': {
        name: 'Gym',
        payer: '-LCeMf-6iddBAqgs3MSL',
        value: 86
      },
      '-LCeMf-6iddBAqgs3MSP': {
        name: 'Mortgage',
        payer: '-LCeMf-6iddBAqgs3MSK',
        value: 1848.32
      },
      '-LCeMf-6iddBAqgs3MSQ': {
        name: 'Savings',
        payer: '-LCeMf-6iddBAqgs3MSK',
        value: 200
      },
      '-LCeMf-6iddBAqgs3MSR': {
        name: 'Internet',
        payer: '-LCeMf-6iddBAqgs3MSL',
        value: 49.99
      },
      '-LCeMf-6iddBAqgs3MSS': {
        name: 'Utilities',
        payer: '-LCeMf-6iddBAqgs3MSK',
        value: 75
      }
    });
  });

  it('does not modify an object that has already been updated', () => {
    const object = {
      ...sample,
      expenses: {
        '-LCeMf-6iddBAqgs3MSN': {
          name: 'Gym',
          payer: '-LCeMf-6iddBAqgs3MSL',
          value: 86
        },
        '-LCeMf-6iddBAqgs3MSP': {
          name: 'Mortgage',
          payer: '-LCeMf-6iddBAqgs3MSK',
          value: 1848.32
        },
        '-LCeMf-6iddBAqgs3MSQ': {
          name: 'Savings',
          payer: '-LCeMf-6iddBAqgs3MSK',
          value: 200
        }
      }
    };

    expect(
      convertLegacyExpenses(object.expenses, object.incomes)
    ).toStrictEqual(object.expenses);
  });

  describe('convertLegacyIncomes()', () => {
    it('updates keys', () => {
      expect(convertLegacyIncomes(sample.incomes)).toStrictEqual({
        '-LCeMf-6iddBAqgs3MSK': {
          name: 'You',
          value: 109980
        },
        '-LCeMf-6iddBAqgs3MSL': {
          name: 'Partner',
          value: 72100
        }
      });
    });

    it('does not modify an object that has already been updated', () => {
      const object = {
        ...sample,
        incomes: {
          '-LCeMf-6iddBAqgs3MSK': {
            name: 'You',
            value: 109980
          },
          '-LCeMf-6iddBAqgs3MSL': {
            name: 'Partner',
            value: 72100
          }
        }
      };

      expect(convertLegacyIncomes(object.incomes)).toStrictEqual(
        object.incomes
      );
    });
  });
});
