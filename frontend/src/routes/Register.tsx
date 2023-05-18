import React, { useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import { signupFields } from "../assets/helpers/formFields";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/user";

const fields = signupFields;
let fieldsState: any = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Register() {
  const navigate = useNavigate();
  const [registerState, setRegisterState] = useState(fieldsState);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    setRegisterState({ ...registerState, [e.target.id]: e.target.value });
  };

  const handleRegister = async () => {
    if (
      !registerState.fullname ||
      !registerState.email ||
      !registerState.password ||
      !registerState.confirmpassword
    )
      return alert("Please fill all the fields");

    if (registerState.password !== registerState.confirmpassword)
      return alert("Passwords do not match");

    setIsLoading(true);

    const response = await register(
      registerState.fullname,
      registerState.email,
      registerState.password
    );

    document.cookie = `token=${response.data.token}`;
    navigate("/");
    setIsLoading(false);
    window.location.reload();
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col rounded-lg px-6 md:px-16 py-5 m-4 bg-dark-lightest w-full md:w-1/3">
        <Header heading="Register your account" />
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
        <div className="flex justify-center items-center mt-4">
          <div className="flex justify-center items-center flex-col">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <button
                className="bg-accent px-4 py-2 rounded-lg text-white font-semibold w-28"
                onClick={handleRegister}
              >
                Register
              </button>
            )}
            <Link to="/login" className="text-secondary font-bold text-sm mt-1">
              Or login to account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
