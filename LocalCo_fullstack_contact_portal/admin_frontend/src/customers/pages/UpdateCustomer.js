import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_BOOL,
    VALIDATOR_EMAIL,
  } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./CustomerForm.css";

const UpdateCustomer = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCustomer, setLoadedCustomer] = useState();
  const customerId = useParams().customerId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      phone: {
        value: "",
        isValid: false,
      },
      newsletter: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/customers/${customerId}`
        );

        setLoadedCustomer(responseData.customer);
        setFormData(
          {
            name: {
              value: responseData.customer.name,
              isValid: true,
            },
            email: {
              value: responseData.customer.email,
              isValid: true,
            },
            phone: {
              value: responseData.customer.phone,
              isValid: true,
            },
            newsletter: {
              value: responseData.customer.newsletter,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchCustomer();
  }, [sendRequest, customerId, setFormData]);

  const customerUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/customers/${customerId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          phone: formState.inputs.phone.value,
          newsletter: formState.inputs.newsletter.value,
        }),
        { "Content-Type": "application/json" }
      );
      history.push("/customers");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedCustomer && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find customer!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedCustomer && (
        <form className="customer-form" onSubmit={customerUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Full Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedCustomer.name}
            initialValid={true}
          />
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
            initialValue={loadedCustomer.email}
            initialValid={true}
          />
          <Input
            id="phone"
            element="input"
            type="text"
            label="Phone Number"
            validators={[
              VALIDATOR_REQUIRE(),
              VALIDATOR_MINLENGTH(10),
              VALIDATOR_MAXLENGTH(10),
            ]}
            errorText="Please enter a valid phone number."
            onInput={inputHandler}
            initialValue={loadedCustomer.phone}
            initialValid={true}
          />
          <Input
            id="newsletter"
            element="input"
            type="text"
            label="Subscribe to Newsletter (true / false)"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_BOOL()]}
            errorText="Please enter a true or false."
            onInput={inputHandler}
            initialValue={loadedCustomer.newsletter}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE CUSTOMER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateCustomer;
