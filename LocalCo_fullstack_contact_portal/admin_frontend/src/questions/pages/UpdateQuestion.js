import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./QuestionForm.css";

const UpdateQuestion = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedQuestion, setLoadedQuestion] = useState();
  const [loadedQuestionCustomer, setLoadedQuestionCustomer] = useState();
  const questionId = useParams().questionId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/questions/${questionId}`
        );
        setLoadedQuestion(responseData.question);
        setLoadedQuestionCustomer(responseData.question.customer);
        setFormData(
          {
            description: {
              value: responseData.question.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchQuestion();
  }, [sendRequest, questionId, setFormData]);

  const questionUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/questions/${questionId}`,
        "PATCH",
        JSON.stringify({
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/questions/customer/" + loadedQuestionCustomer);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedQuestion && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find question!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedQuestion && (
        <form className="question-form" onSubmit={questionUpdateSubmitHandler}>
          <Input
            id="description"
            element="textarea"
            label="Question/Comment"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid question."
            onInput={inputHandler}
            initialValue={loadedQuestion.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE QUESTION
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateQuestion;
