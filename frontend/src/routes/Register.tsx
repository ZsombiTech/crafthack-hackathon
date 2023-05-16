import React, { useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import { signupFields } from "../assets/formFields";
import ReactiveButton from "reactive-button";

const fields = signupFields;
let fieldsState: any = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Register() {
  const [registerState, setRegisterState] = useState(fieldsState);
  const [submitState, setSubmitState] = useState("idle");

  const handleChange = (e: any) => {
    setRegisterState({ ...registerState, [e.target.id]: e.target.value });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col mt-12 border border-2 rounded-lg p-10 m-4">
        <Header
          heading="Regiser to your account"
          paragraph="Already have an account? "
          linkName="Login"
          linkUrl="/login"
        />
        <form>
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={registerState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}
        </form>
        <ReactiveButton
          buttonState={submitState}
          type="submit"
          animation={false}
          idleText="Register"
          onClick={() => {
            setSubmitState("loading");
            setTimeout(() => {
              setSubmitState("success");
            }, 2000);
          }}
          color="primary"
          className="mt-5"
          rounded
        />
      </div>
    </div>
  );
}
