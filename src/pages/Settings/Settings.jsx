import { Bell, Building2, KeyRound, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const isCompany = user?.role === "company";
  return <div className=
  "page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>Settings</h1>}{


        <p className=
        "text-muted">Manage account, security, notifications, and compliance defaults.</p>}</div>}{





      <button className=
      "btn btn-primary">Save Changes</button>}</div>}{




    <div className=
    "dashboard-grid">{

      <section className=
      "panel">{

        <div className=
        "panel-header">{

          <div>{

            <h2>{
              isCompany ?
              "Organization Profile" :
              "Personal Profile"}</h2>}{

            <p className=
            "text-muted">Mock settings for the current account.</p>}</div>}{




          isCompany ?
          <Building2 size={
          22} /> :

          <UserCog size={
          22} />}</div>}{



        <div className=
        "form-card">{

          <div className=
          "split-form">{

            <div className=
            "form-group">{

              <label htmlFor=
              "name">{
                isCompany ?
                "Workspace Name" :
                "Full Name"}</label>}{

              <input id=
              "name" className=
              "form-input" defaultValue={
              user?.name || ""} />}</div>}{



            <div className=
            "form-group">{

              <label htmlFor=
              "email">Account Email</label>}{


              <input id=
              "email" className=
              "form-input" defaultValue={
              user?.email || ""} />}</div>}</div>}{





          <div className=
          "form-group">{

            <label htmlFor=
            "policy">Default Verification Policy</label>}{


            <select id=
            "policy" className=
            "form-select" defaultValue=
            "Consent required">{

              <option>Consent required</option>}{



              <option>Manual approval</option>}{



              <option>Internal records only</option>}</select>}</div>}</div>}</section>}{











      <aside className=
      "panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Controls</h2>}{


            <p className=
            "text-muted">Prototype toggles for product behavior.</p>}</div>}</div>}{





        <div className=
        "record-list">{

          <label className=
          "record-item">{

            <ShieldCheck size={
            18} />}{

            <div className=
            "record-main">{

              <div className=
              "record-title">Require consent before profile access</div>}{


              <div className=
              "record-meta">Enabled for all candidate profile views.</div>}</div>}{





            <input type=
            "checkbox" defaultChecked={
            true} />}</label>}{



          <label className=
          "record-item">{

            <Bell size={
            18} />}{

            <div className=
            "record-main">{

              <div className=
              "record-title">Email workflow notifications</div>}{


              <div className=
              "record-meta">Send updates for requests, shares, and evaluations.</div>}</div>}{





            <input type=
            "checkbox" defaultChecked={
            true} />}</label>}{



          <label className=
          "record-item">{

            <KeyRound size={
            18} />}{

            <div className=
            "record-main">{

              <div className=
              "record-title">Audit log retention</div>}{


              <div className=
              "record-meta">Keep access logs for compliance review.</div>}</div>}{




            <input type=
            "checkbox" defaultChecked={
            true} />}</label>}</div>}</aside>}</div>}</div>;











};
//#endregion
export default Settings;
