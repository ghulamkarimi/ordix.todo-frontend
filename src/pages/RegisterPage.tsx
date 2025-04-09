import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "@/store";
import { userRegisterApi } from "@/feature/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  // Mindestens 6 Zeichen, mindestens 1 Buchstabe und 1 Zahl

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Benutzername ist erforderlich"),
    email: Yup.string()
      .matches(regexEmail, "Ungültige E-Mail-Adresse")
      .email("Ungültige E-Mail")
      .required("E-Mail ist erforderlich"),
    password: Yup.string()
      .matches(
        regexPassword,
        "Passwort muss mindestens 6 Zeichen lang sein und mindestens 1 Zahl enthalten"
      )
      .min(6, "Mind. 6 Zeichen")
      .required("Passwort ist erforderlich"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const result = await dispatch(userRegisterApi(values));

    if (userRegisterApi.fulfilled.match(result)) {
      toast.success(result.payload.message);
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Registrieren</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          <div>
            <label htmlFor="username">Benutzername</label>
            <Field
              name="username"
              type="text"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="email">E-Mail</label>
            <Field
              name="email"
              type="email"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
          <label htmlFor="password">Passwort</label>
          <div className="relative">
            <Field
              name="password"
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <ErrorMessage
            name="password"
            component="div"
            className="text-red-500 text-sm"
          />
          </div>

          <button
          onClick={()=> navigate("/login")}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Registrieren
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterPage;
