"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux"; 
import { NotificationService } from "@/service/NotificationService";
import { AppDispatch } from "@/store";
import { verifyResetCodeApi } from "@/feature/userSlice";

interface VerificationCodeFormProps {
  onNextStep: () => void;
  email: string;
  className?: string;
}

const VerificationCode: React.FC<VerificationCodeFormProps> = ({
  onNextStep,
  email,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { verificationCode: "" },
    validationSchema: Yup.object({
      verificationCode: Yup.string()
        .required("Verifizierungscode ist erforderlich")
        .matches(/^\d{6}$/, "Der Code muss 6-stellig sein"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await dispatch(
          verifyResetCodeApi({
            email,
            code: values.verificationCode,
          })
        ).unwrap();
        NotificationService.success("Verifizierung erfolgreich!");
        onNextStep(); // ➡ Zum Schritt 3: Passwort ändern
      } catch (error: any) {
        NotificationService.error(
          error.message || "Ungültiger Verifizierungscode."
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
        Verifizierungscode
      </h3>
      <p className="text-center text-gray-600 mb-4">
        Bitte gib den Code ein, den wir an{" "}
        <span className="font-semibold">{email}</span> gesendet haben.
      </p>

      <input
        type="text"
        name="verificationCode"
        placeholder="6-stelliger Code"
        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none transition-all duration-300 ${
          formik.touched.verificationCode && formik.errors.verificationCode
            ? "border-red-500"
            : "border-gray-300 focus:border-blue-500"
        }`}
        value={formik.values.verificationCode}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.verificationCode && formik.errors.verificationCode && (
        <p className="text-red-500 text-sm">{formik.errors.verificationCode}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
      >
        {isSubmitting ? "Überprüfung läuft..." : "Weiter"}
      </button>
    </form>
  );
};

export default VerificationCode;
