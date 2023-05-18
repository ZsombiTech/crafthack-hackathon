import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import { loginFields } from "../assets/helpers/formFields";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../redux/actions/userAction";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/user";

const fields = loginFields;
let fieldsState: any = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e: any) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleLogin = async () => {
    if (!loginState.email || !loginState.password)
      return alert("Please fill all the fields");

    const response = await login(loginState.email, loginState.password);

    document.cookie = `token=${response.data.token}`;
    navigate("/");
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col mt-12 rounded-lg px-6 md:px-16 py-5 m-4 bg-dark-lightest">
        <Header heading="Let’s login to your CraftSphere account first" />
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
        <div className="flex justify-center items-center mt-4">
          <div className="flex justify-center items-center flex-col">
            <button
              className="bg-accent px-4 py-2 rounded-lg text-white font-semibold w-28"
              onClick={handleLogin}
            >
              Login
            </button>
            <Link
              to="/register"
              className="text-secondary font-bold text-sm mt-1"
            >
              Or create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
