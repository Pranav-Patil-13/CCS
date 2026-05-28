import { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

import { TriangleAlert } from 'lucide-react';

const VerificationRequests = () => {
  const {
    requests,
    requestVerification,
    submitAppeal,
    registeredCompanies = []
  } = useData();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showAppealModal, setShowAppealModal] = useState(
    false
  );
  const [selectedRequest, setSelectedRequest] = useState(
    null
  );
  const [now] = useState(() => Date.now());
  const [companySelection, setCompanySelection] = useState(
    ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(
    false
  );
  const [role, setRole] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const handleOpenRequestModal = () => {
    setCompanySelection("");
    setSearchQuery("");
    setShowSuggestions(false);
    setRole("");
    setHrEmail("");
    setErrorMsg("");
    setShowModal(true);
  };
  const getCooldownDays = (lastEvaluatedAt, nowTime) => {
    if (!lastEvaluatedAt) return 0;
    const diffDays =
    (nowTime - (
    lastEvaluatedAt.toDate ?
    lastEvaluatedAt.toDate().getTime() :
    lastEvaluatedAt.seconds * 1e3)) / (
    1e3 * 60 * 60 * 24);
    return Math.max(0, 14 - Math.floor(diffDays));
  };
  const checkDuplicate = (companyName, email) => {
    const inputDomain = email.split("@")[1]?.toLowerCase();
    const inputCompanyClean = companyName.trim().toLowerCase();
    for (const req of requests) {
      const reqCompanyClean = (req.company || "").trim().toLowerCase();
      const reqDomain = (
      req.hrEmailDomain ||
      req.hrEmail?.split("@")[1] ||
      "").
      toLowerCase();
      const reqEmail = (req.hrEmail || "").toLowerCase();
      const companyMatches = reqCompanyClean === inputCompanyClean;
      const domainMatches =
      reqDomain && inputDomain && reqDomain === inputDomain;
      const emailMatches = reqEmail && email.toLowerCase() === reqEmail;
      if (companyMatches || domainMatches || emailMatches) {
        if (req.status === "Pending")
        return {
          blocked: true,
          reason: `You already have a pending verification request for ${req.company || companyName}.`
        };else
        if (req.status === "Verified") {
          const cooldown = getCooldownDays(req.lastEvaluatedAt, now);
          if (cooldown > 0)
          return {
            blocked: true,
            reason: `A verified record already exists for ${req.company || companyName}. Please wait ${cooldown} days for the appeal cooldown to expire or request re-evaluation on your existing record.`
          };else

          return {
            blocked: true,
            reason: `A verified record already exists for ${req.company || companyName}. Please use the existing record to request re-evaluation.`
          };
        }
      }
    }
    return { blocked: false };
  };
  const filteredSuggestions =
  searchQuery.trim() === "" ?
  [] :
  registeredCompanies.
  filter(
    (c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.domain.toLowerCase().includes(searchQuery.toLowerCase())
  ).
  slice(0, 5);
  const handleSelectSuggestion = (company) => {
    setCompanySelection(company.id);
    setSearchQuery(company.name);
    setHrEmail(`hr@${company.domain}`);
    setShowSuggestions(false);
    setErrorMsg("");
  };
  const handleCustomCompanyChange = (val) => {
    setSearchQuery(val);
    setCompanySelection("other");
    setShowSuggestions(true);
    setErrorMsg("");
  };
  const handleRequest = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const finalCompanyName = searchQuery.trim();
    if (!finalCompanyName) {
      setErrorMsg("Please enter a company name.");
      return;
    }
    const emailInput = hrEmail.trim();
    const inputDomain = emailInput.split("@")[1]?.toLowerCase();
    if (!emailInput || !inputDomain) {
      setErrorMsg("Please enter a valid HR email.");
      return;
    }
    let targetDomain = "";
    let activeSelection = companySelection;
    const selectedComp = registeredCompanies.find(
      (c) => c.id === companySelection
    );
    if (
    selectedComp &&
    selectedComp.name.toLowerCase() === finalCompanyName.toLowerCase())

    targetDomain = selectedComp.domain;else
    {
      const exactMatch = registeredCompanies.find(
        (c) => c.name.toLowerCase() === finalCompanyName.toLowerCase()
      );
      if (exactMatch) {
        activeSelection = exactMatch.id;
        targetDomain = exactMatch.domain;
      } else activeSelection = "other";
    }
    if (targetDomain && inputDomain !== targetDomain.toLowerCase()) {
      setErrorMsg(
        `For ${finalCompanyName}, the HR email must match the company domain: @${targetDomain}`
      );
      return;
    }
    if (activeSelection === "other") {
      const matchedRegComp = registeredCompanies.find(
        (c) => c.domain.toLowerCase() === inputDomain
      );
      if (matchedRegComp) {
        setErrorMsg(
          `The domain @${inputDomain} is registered for "${matchedRegComp.name}". Please select "${matchedRegComp.name}" from the suggestions.`
        );
        return;
      }
    }
    const dupCheck = checkDuplicate(finalCompanyName, emailInput);
    if (dupCheck.blocked) {
      setErrorMsg(dupCheck.reason);
      return;
    }
    requestVerification({
      name: user?.name || "Sarah Jenkins",
      company: finalCompanyName,
      role: role.trim(),
      hrEmail: emailInput
    });
    setShowModal(false);
  };
  const handleAppealSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    submitAppeal(selectedRequest, e.target.reason.value);
    setShowAppealModal(false);
    setSelectedRequest(null);
  };
  return <div className=
  "verification-requests page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>My Verifications</h1>}{


        <p className=
        "text-muted">Track company responses and request new employment verification records.</p>}</div>}{





      <button className=
      "btn btn-primary" onClick={
      handleOpenRequestModal}>{

        <Plus size={16} />} Request Verification</button>}</div>}{





    <div className=
    "metric-grid">{

      <div className=
      "metric-card">{

        <div className=
        "metric-label">Total Requests</div>}{


        <div className=
        "metric-value">{
          requests.length}</div>}{

        <div className=
        "metric-note">Across all employers</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Pending</div>}{


        <div className=
        "metric-value">{
          requests.filter(
            (request) => request.status === "Pending"
          ).length}</div>}{

        <div className=
        "metric-note">Waiting on company action</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Verified</div>}{


        <div className=
        "metric-value">{
          requests.filter(
            (request) => request.status === "Verified"
          ).length}</div>}{

        <div className=
        "metric-note">Added to profile record</div>}</div>}</div>}{






    <div className=
    "panel">{

      <div className=
      "panel-header">{
        <div>{

          <h2>Request Timeline</h2>}{


          <p className=
          "text-muted">Every request is visible to the matching company-side queue in this mock app.</p>}</div>}</div>}{






      <div className=
      "table-container">{
        <table className=
        "data-table">{

          <thead>{
            <tr>{

              <th>Company</th>}{


              <th>Role</th>}{


              <th>Stage</th>}{


              <th>HR Contact</th>}{


              <th>Status</th>}{


              <th>Date Requested</th>}{


              <th>Action</th>}</tr>}</thead>}{





          <tbody>{
            requests.map((req) => {
              const appealCount = req.appealCount || 0;
              let actionContent = null;
              if (req.status === "Verified") {
                const cooldown = getCooldownDays(
                  req.lastEvaluatedAt,
                  now
                );
                if (appealCount >= 3)
                actionContent = <div className=

                "text-muted" style={
                {
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>{

                  <Lock size={
                  12} />} Final Evaluation Locked</div>;else




                if (cooldown > 0)
                actionContent = <div className=

                "text-muted" style={
                { fontSize: "0.8rem" }}>Appeal available in {


                  cooldown} day{

                  cooldown !== 1 ? "s" : ""}</div>;else



                actionContent = <div style={

                {
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}>{

                  <button className=


                  "btn btn-secondary btn-small" onClick={
                  () => {
                    setSelectedRequest(req);
                    setShowAppealModal(true);
                  }}>Request Re-evaluation</button>}{



                  appealCount === 2 &&
                  <div className=


                  "text-warning" style={
                  {
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "2px"
                  }}>{

                    <TriangleAlert size={

                    10} />} Final Appeal Attempt</div>}</div>;







              }
              return <tr>{



                <td>{
                  <strong>{

                    req.company || "Company Name"}</strong>}</td>}{


                <td>{
                  req.role}</td>}{

                <td>{
                  req.stage}</td>}{

                <td>{
                  req.hrEmail || "On file"}</td>}{

                <td>{
                  <span className={

                  `status-pill ${req.status === "Verified" ? "status-success" : "status-warning"}`}>{
                    req.status}</span>}</td>}{


                <td>{
                  req.date}</td>}{

                <td>{
                  actionContent}</td>}</tr>;





            })}</tbody>}</table>}</div>}</div>}{






    showModal &&
    <div className=
    "modal-overlay">{
      <div className=
      "modal-content" style={
      { overflow: "visible" }}>{

        <div className=
        "modal-header">{

          <h2>Request Verification</h2>}{


          <button className=
          "btn-close" onClick={
          () => setShowModal(false)}>×</button>}</div>}{




        <form onSubmit={
        handleRequest} className=
        "modal-body" style={
        { overflow: "visible" }}>{

          errorMsg &&
          <div className=
          "alert alert-danger" style={
          {
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>{

            <TriangleAlert size={


            16} style={
            { flexShrink: 0 }} />}{


            <span>{
              errorMsg}</span>}</div>}{



          <div className=
          "form-group" style={
          {
            marginBottom: "16px",
            position: "relative"
          }}>{

            <label>Company Name</label>}{


            <input type=
            "text" className=
            "form-input" placeholder=
            "Type company name (e.g. CapOasis)..." value={
            searchQuery} onChange={
            (e) =>
            handleCustomCompanyChange(e.target.value)} onFocus={
            () => setShowSuggestions(true)} onBlur={
            () => {
              setTimeout(() => setShowSuggestions(false), 200);
            }} required={
            true} autoComplete=
            "off" />}{

            showSuggestions &&
            searchQuery.trim() !== "" &&
            <div style={
            {
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#ffffff",
              border: "1px solid var(--color-border-soft)",
              borderRadius: "8px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              zIndex: 1e3,
              marginTop: "4px",
              maxHeight: "220px",
              overflowY: "auto"
            }}>{

              filteredSuggestions.map((comp) =>
              <div style={


              {
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.9rem",
                transition: "background-color 0.2s"
              }} onMouseDown={
              () =>
              handleSelectSuggestion(comp)} onMouseEnter={
              (e) =>
              e.currentTarget.style.backgroundColor =
              "#f8fafc"} onMouseLeave={
              (e) =>
              e.currentTarget.style.backgroundColor =
              "#ffffff"}>{

                <span style={


                {
                  fontWeight: 550,
                  color: "var(--color-dark)"
                }}>{
                  comp.name}</span>}{


                <span style={


                {
                  fontSize: "0.8rem",
                  color: "var(--color-text-secondary)"
                }}>{
                  comp.domain}</span>}</div>






              )}{
              <div style={


              {
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "#0e7490",
                fontWeight: 500,
                backgroundColor: "#f0fdfa"
              }} onMouseDown={
              () => {
                setCompanySelection("other");
                setShowSuggestions(false);
              }} onMouseEnter={
              (e) =>
              e.currentTarget.style.backgroundColor =
              "#e6fffa"} onMouseLeave={
              (e) =>
              e.currentTarget.style.backgroundColor =
              "#f0fdfa"}>Use unlisted: "{


                searchQuery}" (Invite them)</div>}</div>}</div>}{








          <div className=
          "form-group" style={
          { marginBottom: "16px" }}>{

            <label>Job Role</label>}{


            <input type=
            "text" name=
            "role" className=
            "form-input" placeholder=
            "e.g. Software Engineer" value={
            role} onChange={
            (e) => setRole(e.target.value)} required={
            true} />}</div>}{



          <div className=
          "form-group" style={
          { marginBottom: "24px" }}>{

            <label>HR Contact Email</label>}{


            <input type=
            "email" name=
            "hrEmail" className=
            "form-input" placeholder=
            "hr@company.com" value={
            hrEmail} onChange={
            (e) => {
              setHrEmail(e.target.value);
              setErrorMsg("");
            }} required={
            true} />}{

            companySelection &&
            companySelection !== "other" &&
            <p className=
            "field-hint" style={
            {
              fontSize: "0.8rem",
              marginTop: "4px",
              color: "var(--color-text-secondary)"
            }}>Must end with {


              <strong>@{




                registeredCompanies.find(
                  (c) => c.id === companySelection
                )?.domain}</strong>}</p>}</div>}{







          <div style={
          {
            display: "flex",
            gap: "16px",
            justifyContent: "flex-end"
          }}>{

            <button type=
            "button" className=
            "btn btn-secondary" onClick={
            () => setShowModal(false)}>Cancel</button>}{


            <button type=
            "submit" className=
            "btn btn-primary">{

              <Send size={
              16} />} Send Request</button>}</div>}</form>}</div>}</div>}{











    showAppealModal &&
    selectedRequest &&
    <div className=
    "modal-overlay">{
      <div className=
      "modal-content">{

        <div className=
        "modal-header">{

          <h2>Request Re-evaluation</h2>}{


          <button className=
          "btn-close" onClick={
          () => setShowAppealModal(false)}>×</button>}</div>}{




        <form onSubmit={
        handleAppealSubmit} className=
        "modal-body">{

          <p className=
          "text-muted" style={
          { marginBottom: "16px" }}>You are requesting a re-evaluation for your role as {


            <strong>{
              selectedRequest.role}</strong>} at {


            <strong>{
              selectedRequest.company}</strong>}.</p>}{




          <div className=
          "form-group" style={
          { marginBottom: "24px" }}>{

            <label>Reason for Appeal</label>}{


            <textarea name=
            "reason" className=
            "form-input" style={
            {
              width: "100%",
              minHeight: "80px",
              padding: "12px",
              resize: "vertical"
            }} placeholder=

            "Explain why you are requesting a re-evaluation (e.g. resolved past conflict, updated performance review)." required={
            true} />}</div>}{



          <div style={
          {
            display: "flex",
            gap: "16px",
            justifyContent: "flex-end"
          }}>{

            <button type=
            "button" className=
            "btn btn-secondary" onClick={
            () => setShowAppealModal(false)}>Cancel</button>}{


            <button type=
            "submit" className=
            "btn btn-primary">{

              <Send size={
              16} />} Submit Appeal</button>}</div>}</form>}</div>}</div>}</div>;













};
//#endregion
export default VerificationRequests;
