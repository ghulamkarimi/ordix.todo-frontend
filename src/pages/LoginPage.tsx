import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userLoginApi } from "@/feature/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(regexEmail, "Ungültige E-Mail-Adresse")
    .email("Ungültige E-Mail")
    .required("E-Mail ist erforderlich"),
  password: Yup.string()
    .matches(regexPassword, "Passwort muss mindestens 6 Zeichen lang sein und mindestens 1 Zahl enthalten")
    .min(6, "Mindestens 6 Zeichen")
    .required("Passwort ist erforderlich"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await dispatch(userLoginApi(values)).unwrap();
      localStorage.setItem("userId", response.user.id.toString());
      toast.success(response.message);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login fehlgeschlagen");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700">
                  E-Mail
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded mt-1"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
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
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              >
                {isSubmitting ? "Einloggen..." : "Einloggen"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
