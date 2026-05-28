import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const { loginWithLinkedIn } = useAuth();
  const navigate = useNavigate();
  const calledRef = useRef(false);
  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (error) {
      console.error("LinkedIn authentication error:", error);
      alert(
        `LinkedIn sign-in failed: ${searchParams.get("error_description") || error}`
      );
      navigate("/login");
      return;
    }
    if (code && !calledRef.current) {
      calledRef.current = true;
      loginWithLinkedIn(code);
    }
  }, [searchParams, loginWithLinkedIn, navigate]);
  return <div style={
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    textAlign: "center",
    fontFamily: "Inter, sans-serif"
  }}>{

    <h2 style={
    {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#343A40",
      marginBottom: "0.5rem"
    }}>Verifying credential...</h2>}{


    <p style={
    {
      color: "#6C757D",
      fontSize: "0.875rem"
    }}>Exchanging secure tokens with LinkedIn. Please wait.</p>}</div>;




};
//#endregion
export default LinkedInCallback;
