import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await API.get(`/auth/verify/${token}`);
        setStatus("success");
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        {status === "loading" && <p>Verifying your email...</p>}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Email Verified ✅
            </h2>
            <p className="mb-6">You can now login to your account.</p>
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-red-500">
              Verification Failed ❌
            </h2>
            <p className="mb-6">The verification link is invalid or expired.</p>
            <button
              className="btn btn-outline btn-primary w-full"
              onClick={() => navigate("/register")}
            >
              Back to Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
