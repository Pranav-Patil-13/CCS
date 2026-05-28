import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Building2, Globe, ArrowRight, Loader2 } from 'lucide-react';
import './CompanyOnboarding.css';

import { LoaderCircle } from 'lucide-react';

const CompanyOnboarding = () => {
  const { registerCompanyWorkspace } = useData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const name = e.target.companyName.value.trim();
    const domain = e.target.domain.value.trim();
    try {
      await registerCompanyWorkspace(name, domain);
      navigate("/company/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
        "Failed to register company workspace. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return <div className=
  "onboarding-page-container">{
    <div className=
    "onboarding-card">{

      <div className=
      "onboarding-header">{

        <div className=
        "icon-wrapper">{
          <Building2 size={
          32} className=
          "building-icon" />}</div>}{


        <h1>Set up your Company Workspace</h1>}{


        <p className=
        "text-secondary text-center">Create a secure, centralized hub for your HR team to verify credentials and submit evaluations.</p>}</div>}{





      error &&
      <div className=
      "alert alert-danger" style={
      { marginBottom: "1.5rem" }}>{
        error}</div>}{

      <form onSubmit={
      handleSubmit} className=
      "onboarding-form">{

        <div className=
        "form-group">{

          <label htmlFor=
          "companyName">Company Name</label>}{


          <div className=
          "input-with-icon">{

            <Building2 className=
            "input-icon" size={
            18} />}{

            <input type=
            "text" id=
            "companyName" placeholder=
            "e.g. IndieCode Software Solutions" required={
            true} className=
            "form-input" />}</div>}</div>}{





        <div className=
        "form-group">{

          <label htmlFor=
          "domain">Company Domain / Website</label>}{


          <div className=
          "input-with-icon">{

            <Globe className=
            "input-icon" size={
            18} />}{

            <input type=
            "text" id=
            "domain" placeholder=
            "e.g. indiecode.in" required={
            true} className=
            "form-input" />}</div>}{



          <p className=
          "field-hint">This domain will be used to help identify evaluations and candidate requests linked to your company.</p>}</div>}{





        <button type=
        "submit" className=
        "btn btn-primary btn-full btn-onboarding" disabled={
        isLoading}>{
          isLoading ?
          <>{



            <LoaderCircle size={


            18} className=
            "animate-spin" />}Setting up workspace...</> :






          <>Initialize Workspace{




            <ArrowRight size={

            18} />}</>}</button>}</form>}</div>}</div>;










};
//#endregion
export default CompanyOnboarding;
