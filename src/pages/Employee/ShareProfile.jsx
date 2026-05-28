import { useState } from 'react';
import { Copy, Eye, Link as LinkIcon, Shield } from 'lucide-react';
import { useData } from '../../context/DataContext';

import { Check, Sparkles, CircleCheckBig, Link, Globe, CircleAlert, LoaderCircle, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

const CopyBtn = ({ text, id, small, copiedId, copyToClipboard }) => {
  const isCopied = copiedId === id;
  return <button type=
  "button" className={
  small ?
  "btn btn-ghost btn-small" :
  "btn btn-secondary btn-small"} onClick={
  () => copyToClipboard(text, id)} style={
  small ?
  {
    gap: "4px",
    padding: "2px 8px",
    fontSize: "0.75rem"
  } :
  {}}>{

    isCopied ?
    <Check size={
    small ? 12 : 14} /> :

    <Copy size={
    small ? 12 : 14} />}{

    isCopied ? "Copied!" : small ? "Copy Link" : "Copy"}</button>;


};
var ShareProfile = () => {
  const {
    employeeProfile,
    shareLinks,
    createShareLink,
    createGlobalLink,
    globalId,
    registeredCompanies,
    deleteShareLink,
    deleteGlobalLink
  } = useData();
  const [createdLink, setCreatedLink] = useState("");
  const [directDeliveredRecipient, setDirectDeliveredRecipient] = (0,
  useState)("");
  const [copiedId, setCopiedId] = useState(null);
  const [globalAccess, setGlobalAccess] = useState(
    "Full profile"
  );
  const [customGlobalId, setCustomGlobalId] = useState(
    globalId || ""
  );
  const [prevGlobalId, setPrevGlobalId] = useState(globalId);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(
    false
  );
  const [globalError, setGlobalError] = useState("");
  if (globalId !== prevGlobalId) {
    setPrevGlobalId(globalId);
    setCustomGlobalId(globalId || "");
  }
  const [recipientInput, setRecipientInput] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const copyToClipboard = useCallback(async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const docId = await createShareLink(
      {
        recipient: recipientInput,
        access: form.access.value,
        expires: form.expires.value
      },
      selectedCompanyId
    );
    if (selectedCompanyId) {
      setDirectDeliveredRecipient(recipientInput);
      setCreatedLink("");
    } else {
      setCreatedLink(`${window.location.origin}/share/${docId}`);
      setDirectDeliveredRecipient("");
    }
    form.reset();
    setRecipientInput("");
    setSelectedCompanyId(null);
  };
  const handleCreateGlobal = async () => {
    setIsLoadingGlobal(true);
    setGlobalError("");
    try {
      await createGlobalLink(globalAccess, customGlobalId);
    } catch (err) {
      setGlobalError(err.message || "Failed to create link.");
    } finally {
      setIsLoadingGlobal(false);
    }
  };
  const filteredSuggestions =
  recipientInput && registeredCompanies ?
  registeredCompanies.filter((c) =>
  c.name.toLowerCase().includes(recipientInput.toLowerCase())
  ) :
  [];
  return <div className=
  "page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>Share Profile</h1>}{


        <p className=
        "text-muted">Grant controlled access to your verified credibility profile.</p>}</div>}{





      <span className=
      "status-pill status-muted">{

        <Shield size={14} />} Current status: {

        employeeProfile.shareStatus}</span>}</div>}{




    <div className=
    "dashboard-grid">{

      <section className=
      "panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Create Access Link</h2>}{


            <p className=
            "text-muted">Choose what a recruiter or employer can inspect.</p>}</div>}</div>}{






        <form className=
        "form-card" onSubmit={
        handleSubmit}>{

          <div className=
          "form-group" style={
          { position: "relative" }}>{

            <label htmlFor=
            "recipient">Recipient or Company</label>}{


            <div style={
            {
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>{

              <input id=
              "recipient" name=
              "recipient" className=
              "form-input" placeholder=
              "e.g. IndieCode" value={
              recipientInput} onChange={
              (e) => {
                setRecipientInput(e.target.value);
                setSelectedCompanyId(null);
                setShowDropdown(true);
              }} onFocus={
              () => setShowDropdown(true)} onBlur={
              () =>
              setTimeout(() => setShowDropdown(false), 200)} required={
              true} autoComplete=
              "off" />}{

              selectedCompanyId &&
              <span className=


              "status-pill status-success" style={
              {
                flexShrink: 0,
                gap: "4px",
                background: "rgba(74, 222, 128, 0.1)",
                color: "#16a34a"
              }}>{

                <Sparkles size={

                12} />} CCS Partner</span>}</div>}{







            showDropdown &&
            filteredSuggestions.length > 0 &&
            <div className=
            "autocomplete-dropdown">{
              filteredSuggestions.map((company) =>
              <div className=


              "autocomplete-item" onClick={
              () => {
                setRecipientInput(company.name);
                setSelectedCompanyId(company.id);
                setShowDropdown(false);
              }}>{

                <div className=


                "company-info-suggest">{

                  <strong className=

                  "company-name-suggest">{
                    company.name}</strong>}{

                  company.domain &&
                  <span className=

                  "company-domain-suggest">{
                    company.domain}</span>}</div>}{




                <span className=


                "partner-badge-suggest">CCS Verified</span>}</div>







              )}</div>}</div>}{



          <div className=
          "split-form">{

            <div className=
            "form-group">{

              <label htmlFor=
              "access">Access Level</label>}{


              <select id=


              "access" name=
              "access" className=
              "form-select" defaultValue=
              "Full profile">{

                <option>Full profile</option>}{



                <option>Employment only</option>}{



                <option>Score summary only</option>}</select>}</div>}{








            <div className=
            "form-group">{

              <label htmlFor=
              "expires">Expires</label>}{


              <select id=


              "expires" name=
              "expires" className=
              "form-select" defaultValue=
              "30 days">{

                <option>7 days</option>}{



                <option>30 days</option>}{



                <option>90 days</option>}</select>}</div>}</div>}{










          directDeliveredRecipient &&
          <div className=
          "record-item" style={
          {
            background: "rgba(74, 222, 128, 0.05)",
            border: "1px solid rgba(74, 222, 128, 0.2)"
          }}>{

            <CircleCheckBig size={


            18} color=
            "#16a34a" />}{


            <div className=
            "record-main">{

              <div className=
              "record-title" style={
              { color: "#16a34a" }}>Profile Delivered</div>}{


              <div className=


              "record-meta">Your profile was sent directly to {


                directDeliveredRecipient}'s dashboard. No link needed.</div>}</div>}</div>}{








          createdLink &&
          <div className=
          "record-item">{

            <Link size={
            18} />}{

            <div className=
            "record-main">{

              <div className=
              "record-title">Access link created</div>}{


              <div className=
              "record-meta">{
                createdLink}</div>}</div>}{



            <CopyBtn text={
            createdLink} id=
            "__created__" copiedId={
            copiedId} copyToClipboard={
            copyToClipboard} />}</div>}{



          <button className=
          "btn btn-primary" type=
          "submit">Generate Secure Link</button>}</form>}</section>}{






      <aside className=
      "panel">{

        <div className=
        "panel-header">{

          <div>{

            <h2>Global Profile Link</h2>}{


            <p className=
            "text-muted">Permanent link to your public profile.</p>}</div>}{




          <Globe size={
          18} className=
          "text-muted" />}</div>}{



        <div className=
        "form-card">{

          <div className=
          "form-group">{

            <label htmlFor=
            "customGlobalId">Custom Link ID</label>}{


            <div className=
            "custom-input-wrapper">{

              <span className=
              "text-muted" style={
              { fontSize: "0.875rem" }}>/share/</span>}{


              <input id=
              "customGlobalId" className=
              "custom-input" value={
              customGlobalId} onChange={
              (e) => {
                setCustomGlobalId(
                  e.target.value.replace(/[^a-zA-Z0-9_-]/g, "")
                );
                setGlobalError("");
              }} placeholder=
              "e.g. janesmith" />}</div>}</div>}{





          <div className=
          "form-group">{

            <label htmlFor=
            "globalAccess">Access Level</label>}{


            <select id=
            "globalAccess" className=
            "form-select" value={
            globalAccess} onChange={
            (e) => setGlobalAccess(e.target.value)}>{

              <option>Full profile</option>}{



              <option>Employment only</option>}{



              <option>Score summary only</option>}</select>}</div>}{







          globalError &&
          <div className=
          "error-box">{

            <CircleAlert size={


            18} color=
            "#FA5252" />}{


            <div className=
            "error-text">{
              globalError}</div>}</div>}{



          <button className=
          "btn btn-primary" type=
          "button" onClick={
          handleCreateGlobal} disabled={
          isLoadingGlobal || !customGlobalId} style={
          {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}>{
            isLoadingGlobal ?
            <>{



              <LoaderCircle size={


              16} style={
              {
                animation: "spin 1s linear infinite"
              }} />}Verifying & Creating...</> :






            globalId ?
            "Update Global Link" :
            "Create Global Link"}</button>}</div>}</aside>}</div>}{







    <div style={
    { marginTop: "24px" }}>{
      <aside className=
      "panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Active Sharing</h2>}{


            <p className=
            "text-muted">Audit who can view your profile.</p>}</div>}</div>}{





        <div className=
        "record-list">{

          globalId &&
          !globalError &&
          <div className=


          "record-item">{

            <Globe size={
            18} />}{

            <div className=
            "record-main">{

              <div className=
              "record-title">Global Profile Link</div>}{


              <div className=


              "record-meta">{
                globalAccess} • Permanent link</div>}{


              <div className=
              "record-meta" style={
              { fontSize: "0.75rem" }}>{
                <CopyBtn text={

                `${window.location.origin}/share/${globalId}`} id=
                "__global__" small={
                true} copiedId={
                copiedId} copyToClipboard={
                copyToClipboard} />}</div>}</div>}{




            <div style={
            {
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>{

              <span className=


              "status-pill status-success">Active</span>}{



              <button className=


              "btn btn-ghost btn-small" onClick={
              async () => {
                if (
                confirm(
                  "Are you sure you want to delete your global profile link?"
                ))

                await deleteGlobalLink(globalId);
              }} title=
              "Delete global link" style={
              {
                padding: "4px",
                color: "#ef4444",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}>{
                <Trash2 size={
                16} />}</button>}</div>}</div>}{








          shareLinks.map((share) =>
          <div className=


          "record-item">{

            <Eye size={
            18} />}{

            <div className=
            "record-main">{

              <div className=
              "record-title">{
                share.recipient}</div>}{

              <div className=


              "record-meta">{

                share.access} • Expires {

                share.expires} • {

                share.views} views</div>}{




              share.isDirectShared ?
              <div className=


              "record-meta" style={
              {
                fontSize: "0.75rem",
                color: "#16a34a",
                fontWeight: 600
              }}>✓ Direct Delivered (Company Dashboard)</div> :




              <div className=


              "record-meta" style={
              { fontSize: "0.75rem" }}>{
                <CopyBtn text={

                `${window.location.origin}/share/${share.id}`} id={
                share.id} small={
                true} copiedId={
                copiedId} copyToClipboard={
                copyToClipboard} />}</div>}</div>}{





            <div style={
            {
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>{

              <span className={


              `status-pill ${share.status === "Active" ? "status-success" : "status-muted"}`}>{
                share.status}</span>}{


              <button className=


              "btn btn-ghost btn-small" onClick={
              async () => {
                if (
                confirm(
                  "Are you sure you want to revoke access and delete this link? This will instantly remove your profile from the company's candidate dashboard."
                ))

                await deleteShareLink(share.id);
              }} title=
              "Revoke access" style={
              {
                padding: "4px",
                color: "#ef4444",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}>{
                <Trash2 size={
                16} />}</button>}</div>}</div>








          )}</div>}</aside>}</div>}</div>;







};
//#endregion
export default ShareProfile;
