import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const Login = () => {
  const { login } = useAuth();
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    login(email, password);
  };
  const handleLinkedInLogin = () => {
    const clientId = "77iuznd76f5szs";
    const redirectUri = encodeURIComponent(
      window.location.origin + "/auth/linkedin/callback"
    );
    const scope = encodeURIComponent("openid profile email");
    const state = Math.random().toString(36).substring(2);
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  };
  return <div className=
  "auth-form-container">{

    <div className=
    "auth-form-header">{

      <span className=
      "auth-form-kicker">Secure access</span>}{


      <h2 className=
      "auth-title">Welcome back</h2>}{


      <p className=
      "auth-subtitle text-muted">Log in to your CCS workspace.</p>}</div>}{




    <div className=
    "linkedin-section">{
      <button onClick={
      handleLinkedInLogin} type=
      "button" className=
      "btn btn-full btn-linkedin">{

        <svg viewBox=
        "0 0 24 24" width=
        "18" height=
        "18" fill=
        "currentColor">{
          <path d=
          "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}</svg>}Continue with LinkedIn (Employee)</button>}</div>}{






    <div className=
    "divider">OR COMPANY ADMIN</div>}{


    <form className=
    "auth-form" onSubmit={
    handleLogin}>{

      <div className=
      "form-group">{

        <label htmlFor=
        "email">Work Email</label>}{


        <input type=
        "email" id=
        "email" className=
        "form-input" placeholder=
        "name@company.com" autoComplete=
        "email" required={
        true} />}</div>}{



      <div className=
      "form-group">{

        <label htmlFor=
        "password">Password</label>}{


        <input type=
        "password" id=
        "password" className=
        "form-input" placeholder=
        "••••••••" autoComplete=
        "current-password" required={
        true} />}</div>}{



      <div className=
      "form-actions">{
        <button type=
        "button" className=
        "forgot-password">Forgot password?</button>}</div>}{



      <button type=
      "submit" className=
      "btn btn-primary btn-full">{

        <LogIn size={18} />}Log In</button>}</form>}{





    <div className=
    "auth-footer">{
      <p className=
      "text-secondary">Don't have an account? {


        <Link to=
        "/signup">Sign up</Link>}</p>}</div>}</div>;







};
//#endregion
export default Login;
