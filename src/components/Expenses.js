import React from 'react';
import PropTypes from 'prop-types';
import tw from 'tailwind.macro';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import TransitionGroup from './TransitionGroup';

import { withFirebase } from './Firebase';
import { addExpense, updateExpense, deleteExpense } from '../actions/expenses';
import Button from './Inputs/Button';
import Label from './Label';
import Text from './Inputs/Text';
import Currency from './Inputs/Currency';
import Select from './Inputs/Select';

const Row = tw.div`flex items-center`;

const Expenses = ({
  incomes,
  expenses,
  split,
  firebase,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense
}) => {
  const handleAdd = () => {
    const key = firebase.key();
    const payer = Object.keys(incomes).sort()[0];

    onAddExpense({ key, payer });
  };

  const handleUpdate = (key, e) => {
    onUpdateExpense(key, {
      [e.target.name]: e.target.value
    });
  };

  const handleValueUpdate = (key, value) => {
    onUpdateExpense(key, { value });
  };

  const handleDelete = key => {
    onDeleteExpense(key);
  };

  const isAdhoc = split === 'adhoc';

  return (
    <>
      <h3 css={tw`text-white text-2xl font-normal mb-4`}>Monthly expenses</h3>
      <Row css={tw`-mx-2 mb-2`}>
        <Label css={isAdhoc ? tw`w-4/12 px-2` : tw`w-7/12 px-2`}>
          Description
        </Label>
        {isAdhoc && <Label css={tw`w-3/12 px-2`}>Payer</Label>}
        <Label css={tw`w-4/12 px-2 text-right mr-auto`}>Cost</Label>
      </Row>
      <TransitionGroup>
        {Object.keys(expenses)
          .sort()
          .map(key => (
            <Row css={tw`-mx-2 mb-4`} key={key}>
              <div css={isAdhoc ? tw`w-4/12 px-2` : tw`w-7/12 px-2`}>
                <Text
                  name="name"
                  onChange={e => handleUpdate(key, e)}
                  value={expenses[key].name}
                />
              </div>
              {isAdhoc && (
                <div css={tw`w-3/12 px-2`}>
                  <Select
                    name="payer"
                    options={Object.keys(incomes)
                      .sort()
                      .map(key => ({
                        name: incomes[key].name,
                        value: key
                      }))}
                    onChange={e => handleUpdate(key, e)}
                    value={expenses[key].payer}
                  />
                </div>
              )}
              <div css={tw`w-4/12 px-2`}>
                <Currency
                  onValueChange={values =>
                    handleValueUpdate(key, values.floatValue)
                  }
                  value={expenses[key].value}
                />
              </div>
              <div css={tw`w-1/12 px-1`}>
                {Object.keys(expenses).length > 1 && (
                  <button
                    title="Delete expense"
                    onClick={() => handleDelete(key)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      css={tw`text-teal fill-current w-4 h-4 hover:text-teal-light`}
                    />
                  </button>
                )}
              </div>
            </Row>
          ))}
      </TransitionGroup>
      <Button onClick={handleAdd} outline>
        <FontAwesomeIcon
          icon={faPlus}
          css={tw`text-teal fill-current w-3 h-3 mr-1`}
        />
        Add expense
      </Button>
    </>
  );
};

Expenses.propTypes = {
  expenses: PropTypes.object.isRequired,
  incomes: PropTypes.object.isRequired,
  split: PropTypes.string.isRequired,
  firebase: PropTypes.object.isRequired,
  onAddExpense: PropTypes.func.isRequired,
  onUpdateExpense: PropTypes.func.isRequired,
  onDeleteExpense: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onAddExpense: obj => dispatch(addExpense(obj)),
  onUpdateExpense: (key, obj) => {
    dispatch(updateExpense(key, obj));
  },
  onDeleteExpense: key => dispatch(deleteExpense(key))
});

const mapStateToProps = ({ incomes, expenses, split }) => ({
  incomes,
  expenses,
  split
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebase(Expenses));
