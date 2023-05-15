import React, { useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import { signupFields } from "../assets/formFields";

const fields = signupFields;
let fieldsState: any = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Register() {
  const [registerState, setRegisterState] = useState(fieldsState);

  const handleChange = (e: any) => {
    setRegisterState({ ...registerState, [e.target.id]: e.target.value });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col mt-12 border border-2 rounded-lg p-4">
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
        <button className="mt-4 text-base bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Register
        </button>
      </div>
    </div>
  );
}
