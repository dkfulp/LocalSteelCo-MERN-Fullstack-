import React, { useEffect, useState } from 'react';

import QuestionList from '../components/QuestionList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Questions = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedQuestions, setLoadedQuestions] = useState();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/questions/'
        );

        setLoadedQuestions(responseData.questions);
      } catch (err) {}
    };
    fetchQuestions();
  }, [sendRequest]);

  const questionDeletedHandler = deletedQuestionId => {
    setLoadedQuestions(prevQuestions =>
        prevQuestions.filter(question => question.id !== deletedQuestionId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedQuestions && <QuestionList items={loadedQuestions} onDeleteQuestion={questionDeletedHandler} />}
    </React.Fragment>
  );
};

export default Questions;
