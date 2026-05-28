import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

import { useState } from 'react';

const Signup = () => {
  const { signup } = useAuth();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(
    searchParams.get("role") === "company" ? "company" : "employee"
  );
  const handleSignup = (e) => {
    e.preventDefault();
    if (role === "employee") return;
    signup({
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      role: "company",
      password: e.target.password.value
    });
  };
  const handleLinkedInSignup = () => {
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

    <h2 className=
    "auth-title">Create your account</h2>}{


    <p className=
    "auth-subtitle text-muted">Join the professional trust network</p>}{


    <div className=
    "form-group" style={
    { marginBottom: "1.5rem" }}>{

      <label htmlFor=
      "role">Account Type</label>}{


      <select id=
      "role" className=
      "form-select" value={
      role} onChange={
      (e) => setRole(e.target.value)} required={
      true}>{

        <option value=
        "employee">Employee</option>}{


        <option value=
        "company">Company HR/Admin</option>}</select>}</div>}{






    role === "employee" ?
    <div style={
    {
      textAlign: "center",
      padding: "1rem 0"
    }}>{

      <p style={
      {
        fontSize: "0.875rem",
        color: "#6C757D",
        marginBottom: "1.5rem"
      }}>Employees must sign up using their verified LinkedIn profiles to guarantee uniqueness and prevent duplicate career scores.</p>}{



      <button onClick={
      handleLinkedInSignup} type=
      "button" className=
      "btn btn-full" style={
      {
        backgroundColor: "#0077B5",
        color: "#FFFFFF",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem",
        borderRadius: "0.375rem",
        fontWeight: 600,
        cursor: "pointer"
      }}>{

        <svg viewBox=
        "0 0 24 24" width=
        "18" height=
        "18" fill=
        "currentColor">{
          <path d=


          "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}</svg>}Sign up with LinkedIn</button>}</div> :








    <form className=
    "auth-form" onSubmit={
    handleSignup}>{

      <div className=
      "form-row">{

        <div className=
        "form-group">{

          <label htmlFor=
          "firstName">First Name</label>}{


          <input type=
          "text" id=
          "firstName" className=
          "form-input" required={
          true} />}</div>}{



        <div className=
        "form-group">{

          <label htmlFor=
          "lastName">Last Name</label>}{


          <input type=
          "text" id=
          "lastName" className=
          "form-input" required={
          true} />}</div>}</div>}{





      <div className=
      "form-group">{

        <label htmlFor=
        "email">Work Email</label>}{


        <input type=
        "email" id=
        "email" className=
        "form-input" placeholder=
        "name@company.com" required={
        true} />}</div>}{



      <div className=
      "form-group">{

        <label htmlFor=
        "password">Password</label>}{


        <input type=
        "password" id=
        "password" className=
        "form-input" placeholder=
        "••••••••" required={
        true} />}</div>}{



      <button type=
      "submit" className=
      "btn btn-primary btn-full">Create Account</button>}</form>}{




    <div className=
    "auth-footer">{
      <p className=
      "text-secondary">Already have an account? {


        <Link to=
        "/login">Log in</Link>}</p>}</div>}</div>;







};
//#endregion
export default Signup;
