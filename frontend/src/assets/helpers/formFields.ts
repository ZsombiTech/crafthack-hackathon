const loginFields = [
  {
    labelText: "Email",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password",
  },
];

const signupFields = [
  {
    labelText: "Full name",
    labelFor: "full-name",
    id: "fullname",
    name: "fullname",
    type: "text",
    autoComplete: "fullname",
    isRequired: true,
    placeholder: "Full name",
  },
  {
    labelText: "Email address",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password",
  },
  {
    labelText: "Confirm Password",
    labelFor: "confirmpassword",
    id: "confirmpassword",
    name: "confirmpassword",
    type: "password",
    autoComplete: "confirmpassword",
    isRequired: true,
    placeholder: "Confirm Password",
  },
];

export { loginFields, signupFields };
