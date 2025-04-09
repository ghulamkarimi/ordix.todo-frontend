"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { NotificationService } from "@/service/NotificationService";
import { resetPasswordApi } from "@/feature/userSlice";

interface ChangePasswordProps {
  email: string;
  className?: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ email, className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      code: "", // Verifizierungscode hinzufügen
      new_password: "",
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required("Verifizierungscode ist erforderlich")
        .length(6, "Der Code muss 6-stellig sein"),
      new_password: Yup.string()
        .min(6, "Mindestens 6 Zeichen")
        .required("Passwort ist erforderlich"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await dispatch(
          resetPasswordApi({
            email,
            code: values.code,
            newPassword: values.new_password,
          })
        ).unwrap();

        NotificationService.success("Passwort erfolgreich geändert ✅");
      } catch (error: any) {
        NotificationService.error(error || "Fehler beim Zurücksetzen des Passworts");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={`space-y-6 ${className || ""}`}>
      <h3 className="text-2xl font-extrabold text-center text-gray-800">
        Neues Passwort festlegen
      </h3>

      <div className="relative">
        <input
          type="text"
          name="code"
          placeholder="Verifizierungscode"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
            formik.touched.code && formik.errors.code
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.code && formik.errors.code && (
          <p className="text-red-500 text-sm absolute left-0 top-full mt-1">
            {formik.errors.code}
          </p>
        )}
      </div>

      <div className="relative">
        <input
          type="password"
          name="new_password"
          placeholder="Neues Passwort"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
            formik.touched.new_password && formik.errors.new_password
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
          value={formik.values.new_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.new_password && formik.errors.new_password && (
          <p className="text-red-500 text-sm absolute left-0 top-full mt-1">
            {formik.errors.new_password}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z" />
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