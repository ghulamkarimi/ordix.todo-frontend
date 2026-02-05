"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { NotificationService } from "@/service/NotificationService";
import { resetPasswordApi } from "@/feature/userSlice";
import { useNavigate } from "react-router-dom";

interface ChangePasswordProps {
  email: string;
  code: string; // Code wird als Prop übergeben, nicht mehr als Eingabe
  className?: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  email,
  code,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false); // Für neues Passwort
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Für Passwort-Bestätigung
  const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.]).{6,}$/;

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      new_password: Yup.string()
        .min(6, "Mindestens 6 Zeichen")
        .matches(
          regexPassword,
          "Passwort muss mindestens 6 Zeichen lang sein und mindestens 1 Zahl enthalten",
        )
        .required("Passwort ist erforderlich"),
      confirm_password: Yup.string()
        .oneOf(
          [Yup.ref("new_password"), undefined],
          "Passwörter müssen übereinstimmen",
        )
        .matches(
          regexPassword,
          "Passwort muss mindestens 6 Zeichen lang sein und mindestens 1 Zahl enthalten",
        )
        .required("Passwort-Bestätigung ist erforderlich"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await dispatch(
          resetPasswordApi({
            email,
            code,
            newPassword: values.new_password,
          }),
        ).unwrap();

        NotificationService.success("Passwort erfolgreich geändert");
        setTimeout(() => navigate("/login"), 1000); // Nach Erfolg zur Login-Seite nach 1 Sekunde
      } catch (error: any) {
        NotificationService.error(
          error || "Fehler beim Zurücksetzen des Passworts",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`space-y-6 ${className || ""}`}
    >
      <h3 className="text-2xl font-extrabold text-center text-gray-800">
        Neues Passwort festlegen
      </h3>

      <div className="relative">
        <input
          type={showNewPassword ? "text" : "password"} // Dynamischer Typ basierend auf Zustand
          name="new_password"
          placeholder="Neues Passwort"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none pr-10 ${
            formik.touched.new_password && formik.errors.new_password
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
          value={formik.values.new_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          {showNewPassword ? "Hide" : "Show"}
        </button>
        {formik.touched.new_password && formik.errors.new_password && (
          <p className="text-red-500 text-sm absolute left-0 top-full mt-1">
            {formik.errors.new_password}
          </p>
        )}
      </div>

      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"} // Dynamischer Typ basierend auf Zustand
          name="confirm_password"
          placeholder="Passwort bestätigen"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none pr-10 ${
            formik.touched.confirm_password && formik.errors.confirm_password
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
          value={formik.values.confirm_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? "Hide" : "Show"}
        </button>
        {formik.touched.confirm_password && formik.errors.confirm_password && (
          <p className="text-red-500 text-sm absolute left-0 top-full mt-1">
            {formik.errors.confirm_password}
          </p>
        )}
      </div>

      <button
        type="submit" // Navigation nur nach erfolgreichem Submit
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"
              />
            </svg>
            Wird gespeichert...
          </span>
        ) : (
          "Passwort ändern"
        )}
      </button>
    </form>
  );
};

export default ChangePassword;
