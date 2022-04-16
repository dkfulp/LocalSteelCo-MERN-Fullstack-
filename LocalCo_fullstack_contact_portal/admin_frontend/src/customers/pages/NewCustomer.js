import React from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
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

const NewCustomer = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
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

  const history = useHistory();

  const customerSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const customerCheck = await sendRequest(
        `http://localhost:5000/api/customers/email/check/${formState.inputs.email.value}`
      );

      if (!customerCheck) {
        await sendRequest(
          "http://localhost:5000/api/customers/add",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            phone: formState.inputs.phone.value,
            newsletter: formState.inputs.newsletter.value,
          }),
          { "Content-Type": "application/json" }
        );
      }

      history.push("/customers");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="customer-form" onSubmit={customerSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="name"
          element="input"
          type="text"
          label="Full Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <Input
          id="email"
          element="input"
          type="text"
          label="Email"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email."
          onInput={inputHandler}
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
        />
        <Input
          id="newsletter"
          element="input"
          type="text"
          label="Subscribe to Newsletter (true / false)"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_BOOL()]}
          errorText="Please enter a true or false."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD CUSTOMER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewCustomer;
