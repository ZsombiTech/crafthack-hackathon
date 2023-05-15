import React, { useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import { loginFields } from "../assets/formFields";

const fields = loginFields;
let fieldsState: any = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e: any) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col mt-12 border border-2 rounded-lg p-4">
        <Header
          heading="Login to your account"
          paragraph="Don't have an account yet? "
          linkName="Register"
          linkUrl="/register"
        />
        <form>
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={loginState[field.id]}
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
          Login
        </button>
      </div>
    </div>
  );
}
