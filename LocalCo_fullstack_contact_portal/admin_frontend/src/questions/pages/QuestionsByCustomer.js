import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import QuestionList from '../components/QuestionList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import CustomerCard from '../components/CustomerCard';

const QuestionsByCustomer = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedQuestions, setLoadedQuestions] = useState();
  const [loadedCustomer, setLoadedCustomer] = useState();

  const customerId = useParams().customerId;

  useEffect(() => {
    const fetchQuestionsByCustomer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/questions/customer/${customerId}`
        );

        setLoadedQuestions(responseData.questions);
      } catch (err) {}
    };
    fetchQuestionsByCustomer();
  }, [sendRequest, customerId]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/customers/${customerId}`
        );

        setLoadedCustomer(responseData.customer);
      } catch (err) {}
    };
    fetchCustomer();
  }, [sendRequest, customerId]);

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
      {!isLoading && loadedCustomer && <CustomerCard item={loadedCustomer} />}
      {!isLoading && loadedQuestions && <QuestionList items={loadedQuestions} onDeleteQuestion={questionDeletedHandler} />}
    </React.Fragment>
  );
};

export default QuestionsByCustomer;
