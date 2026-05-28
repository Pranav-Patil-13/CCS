import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Users, UserPlus, ShieldAlert, Key, Mail, Check, Loader2 } from 'lucide-react';
import './HRManagement.css';

import { LoaderCircle } from 'lucide-react';

const HRManagement = () => {
  const { hrMembers, provisionHRAccount, workspaceOwner } = useData();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const isOwner = user?.companyRole === "owner";
  const handleAddHR = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    try {
      await provisionHRAccount(firstName, lastName, email, password);
      setSuccess(true);
      e.target.reset();
      setTimeout(() => setSuccess(false), 4e3);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
        "Failed to create HR account. Ensure the email is not already registered."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return <div className=
  "hr-management page-shell">{

    <div className=
    "page-header">{
      <div>{

        <h1>Workspace Access Control</h1>}{


        <p className=
        "text-muted">Manage HR team members and configure platform access permissions.</p>}</div>}</div>}{






    <div className=
    "hr-grid">{

      <section className=
      "panel hr-roster-panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Active HR Team</h2>}{


            <p className=
            "text-muted">List of representatives with access to this workspace.</p>}</div>}</div>}{






        <div className=
        "hr-list">{

          <div className=
          "hr-member-item owner-item">{

            <div className=
            "member-avatar">{

              user?.companyRole === "owner" ?
              user.initials :
              workspaceOwner?.initials || "OWN"}</div>}{

            <div className=
            "member-info">{

              <h3>{

                user?.companyRole === "owner" ?
                user.name :
                workspaceOwner?.name || "Workspace Owner"}</h3>}{

              <p className=
              "text-secondary">{

                user?.companyRole === "owner" ?
                user.email :
                workspaceOwner?.email || "Primary Account"}</p>}</div>}{



            <span className=
            "role-badge badge-owner">Owner</span>}</div>}{




          hrMembers.length === 0 ?
          <div className=
          "empty-team text-center text-muted">{

            <Users size={
            24} style={
            {
              marginBottom: "0.5rem",
              opacity: 0.5
            }} />}{

            <p>No additional HR representatives provisioned yet.</p>}</div> :





          hrMembers.map((member) =>
          <div className=


          "hr-member-item">{

            <div className=


            "member-avatar">{
              member.initials}</div>}{


            <div className=


            "member-info">{

              <h3>{

                member.name}</h3>}{

              <p className=


              "text-secondary">{
                member.email}</p>}</div>}{





            <span className=


            "role-badge badge-hr">HR Agent</span>}</div>







          )}</div>}</section>}{




      <section className=
      "panel hr-provision-panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Provision New HR Account</h2>}{


            <p className=
            "text-muted">Create auth credentials directly for your HR agents.</p>}</div>}</div>}{






        !isOwner ?
        <div className=
        "permission-lock">{

          <ShieldAlert size={
          40} className=
          "lock-icon" />}{

          <h3>Owner Access Only</h3>}{


          <p className=
          "text-secondary text-center">Only the workspace owner can provision new HR credentials. Please contact your administrator.</p>}</div> :





        <form onSubmit={
        handleAddHR} className=
        "provision-form">{

          error &&
          <div className=
          "alert alert-danger">{
            error}</div>}{

          success &&
          <div className=

          "alert alert-success d-flex align-items-center gap-2">{

            <Check size={
            16} />} HR account provisioned successfully!</div>}{




          <div className=
          "form-row">{

            <div className=
            "form-group">{

              <label htmlFor=


              "firstName">First Name</label>}{



              <input type=


              "text" id=
              "firstName" required={
              true} className=
              "form-input" />}</div>}{




            <div className=
            "form-group">{

              <label htmlFor=


              "lastName">Last Name</label>}{



              <input type=


              "text" id=
              "lastName" required={
              true} className=
              "form-input" />}</div>}</div>}{






          <div className=
          "form-group">{

            <label htmlFor=
            "email">Work Email</label>}{


            <div className=
            "input-with-icon">{

              <Mail className=


              "input-icon" size={
              16} />}{


              <input type=


              "email" id=
              "email" placeholder=
              "hr.agent@company.com" required={
              true} className=
              "form-input" />}</div>}</div>}{






          <div className=
          "form-group">{

            <label htmlFor=
            "password">Temporary Password</label>}{


            <div className=
            "input-with-icon">{

              <Key className=
              "input-icon" size={
              16} />}{

              <input type=


              "password" id=
              "password" placeholder=
              "Min 6 characters" required={
              true} className=
              "form-input" />}</div>}{




            <p className=
            "field-hint">Provide these credentials to your HR agent for log in.</p>}</div>}{





          <button type=
          "submit" disabled={
          isLoading} className=
          "btn btn-primary btn-full btn-provision">{
            isLoading ?
            <>{



              <LoaderCircle size={


              16} className=
              "animate-spin" />} Creating Account...</> :






            <>{



              <UserPlus size={

              16} />} Provision Credentials</>}</button>}</form>}</section>}</div>}</div>;














};
//#endregion
export default HRManagement;
