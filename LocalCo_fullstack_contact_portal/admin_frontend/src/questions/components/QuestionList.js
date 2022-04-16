import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import QuestionItem from './QuestionItem';
import './QuestionList.css';

const QuestionList = props => {
  if (props.items.length === 0) {
    return (
      <div className="question-list center">
        <Card>
          <h2>No questions found!</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="question-list">
      {props.items.map(question => (
        <QuestionItem
          key={question.id}
          id={question.id}
          customer={question.customer}
          submitted={question.submitted}
          description={question.description}
          onDelete={props.onDeletequestion}
        />
      ))}
    </ul>
  );
};

export default QuestionList;
