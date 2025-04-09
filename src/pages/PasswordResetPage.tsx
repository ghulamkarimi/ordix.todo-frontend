import ChangePassword from "@/components/menu/auth/ChangePassword";
import EmailForm from "@/components/menu/auth/Email";
import VerificationCode from "@/components/menu/auth/VerificationCode";
import { useState } from "react";

const PasswordResetPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(""); // Neu: Code speichern

  const stepTitles = ["E-Mail eingeben", "Code eingeben", "Passwort ändern"];

  const handleVerificationSuccess = (verifiedCode: string) => {
    setCode(verifiedCode); // Code speichern
    setStep(3);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-500"
   
    >
      <div
        className={`bg-white/90 p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-500 ${
          step === 3 ? "scale-105" : "scale-100"
        }`}
      >
        <div className="flex flex-col items-center mb-8 transition-all duration-300">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-20 h-20 mb-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
          />
          <h1 className="text-4xl font-extrabold text-gray-800">Passwort zurücksetzen</h1>
        </div>

        <div className="flex justify-between items-center mb-8">
          {stepTitles.map((title, index) => (
            <div key={index} className="text-center flex-1 transition-all">
              <div
                className={`w-10 h-10 rounded-full mx-auto transition-all duration-500 ${
                  step >= index + 1 ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
                } flex items-center justify-center`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-2 text-sm transition-all ${
                  step >= index + 1 ? "text-green-700" : "text-gray-500"
                }`}
              >
                {title}
              </p>
            </div>
          ))}
        </div>

        <div
          className="max-w-md w-full mx-auto transition-all duration-500"
          style={{
            opacity: step === 3 ? 1 : 0.9,
            transform: step === 3 ? "translateY(-10px)" : "translateY(0px)",
          }}
        >
          {step === 1 && (
            <EmailForm onNextStep={() => setStep(2)} setEmail={setEmail} className="transition-all" />
          )}
          {step === 2 && (
            <VerificationCode
              onNextStep={(code: string) => handleVerificationSuccess(code)} // Code übergeben
              email={email}
              className="transition-all"
            />
          )}
          {step === 3 && <ChangePassword email={email} code={code} />}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;