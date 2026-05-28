import { CheckCircle, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

import { ChevronDown, Plus, CircleCheckBig, CircleQuestionMark, ChevronUp, X, TriangleAlert, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const CustomSelect = ({
  value,
  onChange,
  options,
  isOpen,
  setIsOpen,
  placeholder
}) => {
  return <div className=
  "custom-select-wrapper">{

    <button type=
    "button" className=
    "custom-select-trigger" onClick={
    () => setIsOpen(!isOpen)}>{

      <span>{
        value || placeholder}</span>}{

      <ChevronDown size={
      16} className={
      `text-muted chevron${isOpen ? " chevron--open" : ""}`} />}</button>}{



    isOpen &&
    <>{



      <div className=
      "custom-select-backdrop" onClick={
      () => setIsOpen(false)} />}{

      <div className=
      "custom-select-dropdown">{
        options.map((opt) =>
        <div className={


        `custom-select-option${value === opt ? " selected" : ""}`} onClick={
        () => {
          onChange(opt);
          setIsOpen(false);
        }}>{
          opt}</div>



        )}</div>}</>}</div>;






};
var EmploymentHistory = () => {
  const {
    employmentHistory,
    requests,
    evaluations,
    addManualEmployment,
    requestVerification,
    registeredCompanies = []
  } = useData();
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [manualStep, setManualStep] = useState(1);
  const monthsList = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"];

  const yearsList = Array.from({ length: 47 }, (_, i) => String(2026 - i));
  const [manualCompany, setManualCompany] = useState("");
  const [manualRole, setManualRole] = useState("");
  const [startMonth, setStartMonth] = useState("Jan");
  const [startYear, setStartYear] = useState("2026");
  const [endMonth, setEndMonth] = useState("Jan");
  const [endYear, setEndYear] = useState("2026");
  const [manualIsCurrent, setManualIsCurrent] = useState(
    false
  );
  const [startMonthOpen, setStartMonthOpen] = useState(false);
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);
  const [manualDept, setManualDept] = useState("");
  const [manualSummary, setManualSummary] = useState("");
  const [verifyCompanySelection, setVerifyCompanySelection] = (0,
  useState)("");
  const [verifySearchQuery, setVerifySearchQuery] = useState(
    ""
  );
  const [showVerifySuggestions, setShowVerifySuggestions] = (0,
  useState)(false);
  const [verifyRole, setVerifyRole] = useState("");
  const [verifyHrEmail, setVerifyHrEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);else
    setExpandedId(id);
  };
  const handleOpenAddEmployment = () => {
    setErrorMsg("");
    setModalType("select");
  };
  const handleSelectManual = () => {
    setManualCompany("");
    setManualRole("");
    setStartMonth("Jan");
    setStartYear("2026");
    setEndMonth("Jan");
    setEndYear("2026");
    setManualIsCurrent(false);
    setStartMonthOpen(false);
    setStartYearOpen(false);
    setEndMonthOpen(false);
    setEndYearOpen(false);
    setManualDept("");
    setManualSummary("");
    setErrorMsg("");
    setManualStep(1);
    setModalType("manual");
  };
  const handleManualNextStep1 = () => {
    if (!manualCompany.trim() || !manualRole.trim()) {
      setErrorMsg("Please enter both Company Name and Job Role.");
      return;
    }
    setErrorMsg("");
    setManualStep(2);
  };
  const handleManualNextStep2 = () => {
    if (!manualIsCurrent) {
      const startIndex = monthsList.indexOf(startMonth);
      const endIndex = monthsList.indexOf(endMonth);
      const startYr = parseInt(startYear);
      const endYr = parseInt(endYear);
      if (endYr < startYr || endYr === startYr && endIndex < startIndex) {
        setErrorMsg("End date cannot be before start date.");
        return;
      }
    }
    setErrorMsg("");
    setManualStep(3);
  };
  const handleSelectVerify = () => {
    setVerifyCompanySelection("");
    setVerifySearchQuery("");
    setVerifyRole("");
    setVerifyHrEmail("");
    setErrorMsg("");
    setModalType("verify");
  };
  const getCooldownDays = (lastEvaluatedAt) => {
    if (!lastEvaluatedAt) return 0;
    const evaluatedTime = lastEvaluatedAt.toDate ?
    lastEvaluatedAt.toDate().getTime() :
    lastEvaluatedAt.seconds * 1e3;
    const diffDays = (Date.now() - evaluatedTime) / (1e3 * 60 * 60 * 24);
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
          const cooldown = getCooldownDays(req.lastEvaluatedAt);
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
  verifySearchQuery.trim() === "" ?
  [] :
  registeredCompanies.
  filter(
    (c) =>
    c.name.toLowerCase().includes(verifySearchQuery.toLowerCase()) ||
    c.domain.toLowerCase().includes(verifySearchQuery.toLowerCase())
  ).
  slice(0, 5);
  const handleSelectSuggestion = (comp) => {
    setVerifyCompanySelection(comp.id);
    setVerifySearchQuery(comp.name);
    setVerifyHrEmail(`hr@${comp.domain}`);
    setShowVerifySuggestions(false);
    setErrorMsg("");
  };
  const handleCustomCompanyChange = (val) => {
    setVerifySearchQuery(val);
    setVerifyCompanySelection("other");
    setShowVerifySuggestions(true);
    setErrorMsg("");
  };
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualCompany.trim() || !manualRole.trim()) {
      setErrorMsg("Please fill in all required fields (Company, Role).");
      return;
    }
    const periodString = manualIsCurrent ?
    `${startMonth} ${startYear} - Present` :
    `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
    try {
      await addManualEmployment({
        company: manualCompany.trim(),
        role: manualRole.trim(),
        period: periodString,
        department: manualDept.trim(),
        summary: manualSummary.trim()
      });
      setModalType(null);
    } catch (err) {
      setErrorMsg("Failed to save manual record. Please try again.");
      console.error(err);
    }
  };
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const finalCompanyName = verifySearchQuery.trim();
    if (!finalCompanyName) {
      setErrorMsg("Please enter a company name.");
      return;
    }
    const emailInput = verifyHrEmail.trim();
    const inputDomain = emailInput.split("@")[1]?.toLowerCase();
    if (!emailInput || !inputDomain) {
      setErrorMsg("Please enter a valid HR email.");
      return;
    }
    let targetDomain = "";
    let activeSelection = verifyCompanySelection;
    const selectedComp = registeredCompanies.find(
      (c) => c.id === verifyCompanySelection
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
    try {
      await requestVerification({
        name: user?.name || "Professional User",
        company: finalCompanyName,
        role: verifyRole.trim(),
        hrEmail: emailInput
      });
      setModalType(null);
    } catch (err) {
      setErrorMsg("Failed to send verification request.");
      console.error(err);
    }
  };
  return <div className=
  "page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>Employment History</h1>}{


        <p className=
        "text-muted">Your portable verified work record and pending employment claims.</p>}</div>}{





      <div className=
      "page-actions">{

        <button className=
        "btn btn-secondary" onClick={
        () => window.print()}>Download PDF</button>}{


        <button className=
        "btn btn-primary" onClick={
        handleOpenAddEmployment}>{

          <Plus size={
          16} />} Add Employment</button>}</div>}</div>}{








    <div className=
    "dashboard-grid">{

      <section className=
      "panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Employment Record</h2>}{


            <p className=
            "text-muted">Verified credentials and self-declared roles.</p>}</div>}</div>}{





        <div className=
        "record-list">{
          employmentHistory.map((record) => {
            const evalData = evaluations?.find(
              (e) =>
              e.companyId === record.companyId &&
              e.employeeRole === record.role
            );
            const isExpanded = expandedId === record.id;
            const isVerified = record.status === "Verified";
            return <div className={


            `record-item record-item--expandable ${isExpanded ? "expanded" : ""}`} onClick={
            () => toggleExpand(record.id)}>{

              <div className=
              "record-item-row">{

                isVerified ?
                <CircleCheckBig size={


                20} color=
                "#198754" /> :


                <CircleQuestionMark size={


                20} color=
                "#f59e0b" />}{


                <div className=


                "record-main record-main--flex">{

                  <div className=


                  "record-title">{
                    record.role}</div>}{


                  <div className=


                  "record-meta">{

                    record.company} • {

                    record.period}</div>}{



                  record.summary &&
                  <p className=


                  "record-meta record-summary">{
                    record.summary}</p>}{


                  <div className=


                  "evaluation-tags">{
                    record.tags.map((tag) =>
                    <span className={



                    isVerified ?
                    "tag" :
                    "tag tag-muted"}>{
                      tag}</span>



                    )}</div>}</div>}{





                isVerified ?
                <span className=



                "status-pill status-success record-score">{
                  record.score}/10</span> :


                <div className=


                "record-actions">{
                  <button className=

                  "btn btn-secondary btn-small" onClick={
                  (e) => {
                    e.stopPropagation();
                    setVerifySearchQuery(record.company);
                    setVerifyRole(record.role);
                    const match = registeredCompanies.find(
                      (c) =>
                      c.name.toLowerCase() ===
                      record.company.toLowerCase()
                    );
                    if (match) {
                      setVerifyCompanySelection(match.id);
                      setVerifyHrEmail(
                        `hr@${match.domain}`
                      );
                    } else {
                      setVerifyCompanySelection("other");
                      setVerifyHrEmail("");
                    }
                    setErrorMsg("");
                    setModalType("verify");
                  }}>Request Verification</button>}</div>}{




                isExpanded ?
                <ChevronUp size={


                20} className=
                "text-muted expand-icon" /> :


                <ChevronDown size={


                20} className=
                "text-muted expand-icon" />}</div>}{




              isExpanded &&
              isVerified &&
              evalData &&
              <div className=
              "eval-card">{

                <h4 className=


                "eval-card-title">Evaluation Details</h4>}{



                <div className=


                "eval-grid">{

                  <div>{


                    <span className=

                    "eval-label">Technical Skills</span>}{


                    <div className=

                    "eval-value">{

                      evalData.technicalCompetency * 2}/10</div>}</div>}{





                  <div>{


                    <span className=

                    "eval-label">Reliability</span>}{


                    <div className=

                    "eval-value">{

                      evalData.reliability * 2}/10</div>}</div>}{





                  <div>{


                    <span className=

                    "eval-label">Collaboration</span>}{


                    <div className=

                    "eval-value">{

                      evalData.collaboration * 2}/10</div>}</div>}{





                  <div>{


                    <span className=

                    "eval-label">Professionalism</span>}{


                    <div className=

                    "eval-value">{

                      evalData.professionalism * 2}/10</div>}</div>}</div>}{








                evalData.strengths &&
                <div className=


                "eval-section">{

                  <span className=

                  "eval-label">Strengths</span>}{


                  <p className=

                  "eval-text">{
                    evalData.strengths}</p>}</div>}{




                evalData.areasForGrowth &&
                <div className=


                "eval-section">{

                  <span className=

                  "eval-label">Areas for Growth</span>}{


                  <p className=

                  "eval-text">{
                    evalData.areasForGrowth}</p>}</div>}{




                evalData.additionalComments &&
                <div className=


                "eval-section">{

                  <span className=

                  "eval-label">Additional Remarks</span>}{


                  <p className=

                  "eval-text">{
                    evalData.additionalComments}</p>}</div>}</div>}{






              isExpanded &&
              isVerified &&
              !evalData &&
              <div className=
              "eval-card">{
                <p className=

                "text-muted">No detailed evaluation data is available for this record.</p>}</div>}{




              isExpanded &&
              !isVerified &&
              <div className=
              "eval-card">{
                <p className=

                "text-muted">Self-declared roles do not have exit evaluations. Submit a verification request to request feedback from your previous employer.</p>}</div>}</div>;








          })}</div>}</section>}{



      <aside className=
      "panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Pending Claims</h2>}{


            <p className=
            "text-muted">Requests you have sent to HR teams.</p>}</div>}</div>}{





        <div className=
        "record-list">{
          requests.
          filter((request) => request.status === "Pending").
          map((request) =>
          <div className=


          "record-item">{

            <Clock size={
            18} color=
            "#856404" />}{

            <div className=
            "record-main">{

              <div className=


              "record-title">{
                request.company}</div>}{


              <div className=


              "record-meta">{

                request.role} • {

                request.stage}</div>}</div>}</div>









          )}</div>}</aside>}</div>}{





    modalType === "select" &&
    <div className=
    "modal-overlay">{
      <div className=
      "modal-content" style={
      { maxWidth: "480px" }}>{

        <div className=
        "modal-header">{

          <h2>Add Employment</h2>}{


          <button className=
          "modal-close" onClick={
          () => setModalType(null)}>{
            <X size={
            20} />}</button>}</div>}{




        <div className=
        "modal-body modal-body--gap">{

          <p className=
          "text-muted modal-body-desc">Select how you want to add this employment record to your profile.</p>}{



          <div onClick={
          handleSelectManual} className=
          "option-card">{

            <h3 className=
            "option-card-title">{

              <CircleQuestionMark size={


              18} color=
              "#f59e0b" />} Self-Declared Role</h3>}{





            <p className=
            "text-muted option-card-desc">Add past or unlisted jobs manually to your timeline instantly. No HR verification required. Visible on public profile as Self-Declared.</p>}</div>}{





          <div onClick={
          handleSelectVerify} className=
          "option-card">{

            <h3 className=
            "option-card-title">{

              <CircleCheckBig size={


              18} color=
              "#198754" />} Request Verification</h3>}{





            <p className=
            "text-muted option-card-desc">Send an official request to a company's HR contact. Verified entries display performance ratings and exit evaluation scores.</p>}</div>}</div>}</div>}</div>}{










    modalType === "manual" &&
    <div className=
    "modal-overlay">{
      <div className=
      "modal-content" style={
      { maxWidth: "500px" }}>{

        <div className=
        "modal-header">{

          <h2>Add Self-Declared Role</h2>}{


          <button className=
          "modal-close" onClick={
          () => setModalType(null)}>{
            <X size={
            20} />}</button>}</div>}{




        <form onSubmit={
        handleManualSubmit} className=
        "modal-body modal-body--gap">{

          <div className=
          "steps-container">{

            <div className=
            "steps-track">{

              <div className={
              `steps-track-step${manualStep >= 1 ? " active" : ""}`} />}{

              <div className={
              `steps-track-step${manualStep >= 2 ? " active" : ""}`} />}{

              <div className={
              `steps-track-step${manualStep >= 3 ? " active" : ""}`} />}</div>}{



            <div className=
            "steps-label">{

              <span>{

                manualStep === 1 && "Step 1: Role Basics"}{
                manualStep === 2 && "Step 2: Timeline & Team"}{
                manualStep === 3 && "Step 3: Description"}</span>}{


              <span>{
                manualStep} of 3</span>}</div>}</div>}{





          errorMsg &&
          <div className=
          "alert alert-danger">{

            <TriangleAlert size={

            15} />} {


            <span>{
              errorMsg}</span>}</div>}{



          manualStep === 1 &&
          <div className=
          "form-step">{

            <div className=
            "form-group">{

              <label>Company Name *</label>}{



              <input type=


              "text" className=
              "form-input" placeholder=
              "e.g. Acme Corp" value={
              manualCompany} onChange={
              (e) =>
              setManualCompany(e.target.value)} required={
              true} />}</div>}{




            <div className=
            "form-group">{

              <label>Job Role *</label>}{



              <input type=


              "text" className=
              "form-input" placeholder=
              "e.g. Senior Frontend Engineer" value={
              manualRole} onChange={
              (e) => setManualRole(e.target.value)} required={
              true} />}</div>}{




            <div className=
            "form-actions-row">{

              <button type=


              "button" className=
              "btn btn-secondary" onClick={
              () => setModalType("select")}>Back</button>}{



              <button type=


              "button" className=
              "btn btn-primary" onClick={
              handleManualNextStep1}>Next</button>}</div>}</div>}{







          manualStep === 2 &&
          <div className=
          "form-step">{

            <div className=
            "form-row-duo">{

              <div className=


              "form-group">{

                <label>Start Month *</label>}{



                <CustomSelect value={


                startMonth} onChange={
                setStartMonth} options={
                monthsList} isOpen={
                startMonthOpen} setIsOpen={
                setStartMonthOpen} placeholder=
                "Month" />}</div>}{





              <div className=


              "form-group">{

                <label>Start Year *</label>}{



                <CustomSelect value={


                startYear} onChange={
                setStartYear} options={
                yearsList} isOpen={
                startYearOpen} setIsOpen={
                setStartYearOpen} placeholder=
                "Year" />}</div>}</div>}{







            <div className=
            "checkbox-row">{

              <input type=


              "checkbox" id=
              "manualIsCurrent" checked={
              manualIsCurrent} onChange={
              (e) =>
              setManualIsCurrent(e.target.checked)} />}{


              <label htmlFor=


              "manualIsCurrent">I currently work here</label>}</div>}{





            !manualIsCurrent &&
            <div className=
            "form-row-duo">{

              <div className=


              "form-group">{

                <label>End Month *</label>}{



                <CustomSelect value={


                endMonth} onChange={
                setEndMonth} options={
                monthsList} isOpen={
                endMonthOpen} setIsOpen={
                setEndMonthOpen} placeholder=
                "Month" />}</div>}{





              <div className=


              "form-group">{

                <label>End Year *</label>}{



                <CustomSelect value={


                endYear} onChange={
                setEndYear} options={
                yearsList} isOpen={
                endYearOpen} setIsOpen={
                setEndYearOpen} placeholder=
                "Year" />}</div>}</div>}{







            <div className=
            "form-group">{

              <label>Department (Optional)</label>}{



              <input type=


              "text" className=
              "form-input" placeholder=
              "e.g. Engineering" value={
              manualDept} onChange={
              (e) => setManualDept(e.target.value)} />}</div>}{




            <div className=
            "form-actions-row">{

              <button type=


              "button" className=
              "btn btn-secondary" onClick={
              () => setManualStep(1)}>Back</button>}{



              <button type=


              "button" className=
              "btn btn-primary" onClick={
              handleManualNextStep2}>Next</button>}</div>}</div>}{







          manualStep === 3 &&
          <div className=
          "form-step">{

            <div className=
            "form-group">{

              <label>Job Description / Summary (Optional)</label>}{






              <textarea className=


              "form-input form-textarea" placeholder=

              "Describe your role, responsibilities, and achievements..." value={
              manualSummary} onChange={
              (e) =>
              setManualSummary(e.target.value)} />}</div>}{




            <div className=
            "form-actions-row">{

              <button type=


              "button" className=
              "btn btn-secondary" onClick={
              () => setManualStep(2)}>Back</button>}{



              <button type=


              "submit" className=
              "btn btn-primary">Save Role</button>}</div>}</div>}</form>}</div>}</div>}{












    modalType === "verify" &&
    <div className=
    "modal-overlay">{
      <div className=
      "modal-content modal-content--visible" style={
      { maxWidth: "520px" }}>{

        <div className=
        "modal-header">{

          <h2>Request Verification</h2>}{


          <button className=
          "modal-close" onClick={
          () => setModalType(null)}>{
            <X size={
            20} />}</button>}</div>}{




        <form onSubmit={
        handleVerifySubmit} className=
        "modal-body modal-body--visible modal-body--gap">{

          errorMsg &&
          <div className=
          "alert alert-danger">{

            <TriangleAlert size={

            15} />} {


            <span>{
              errorMsg}</span>}</div>}{



          <div className=
          "form-group form-group--relative">{

            <label>Company Name *</label>}{


            <input type=
            "text" className=
            "form-input" placeholder=
            "Type company name (e.g. CapOasis)..." value={
            verifySearchQuery} onChange={
            (e) =>
            handleCustomCompanyChange(e.target.value)} onFocus={
            () => setShowVerifySuggestions(true)} onBlur={
            () => {
              setTimeout(
                () => setShowVerifySuggestions(false),
                200
              );
            }} required={
            true} autoComplete=
            "off" />}{

            showVerifySuggestions &&
            verifySearchQuery.trim() !== "" &&
            <div className=
            "verify-suggestions">{

              filteredSuggestions.map((comp) =>
              <div className=


              "suggestion-item" onMouseDown={
              () =>
              handleSelectSuggestion(comp)}>{

                <span className=


                "suggestion-name">{
                  comp.name}</span>}{


                <span className=


                "suggestion-domain">{
                  comp.domain}</span>}</div>






              )}{
              <div className=



              "suggestion-item suggestion-unlisted" onMouseDown={
              () => {
                setVerifyCompanySelection("other");
                setShowVerifySuggestions(false);
              }}>Use unlisted: "{


                verifySearchQuery}" (Invite them)</div>}</div>}</div>}{








          <div className=
          "form-group">{

            <label>Job Role *</label>}{


            <input type=
            "text" className=
            "form-input" placeholder=
            "e.g. Software Engineer" value={
            verifyRole} onChange={
            (e) => setVerifyRole(e.target.value)} required={
            true} />}</div>}{



          <div className=
          "form-group">{

            <label>HR Contact Email *</label>}{


            <input type=
            "email" className=
            "form-input" placeholder=
            "hr@company.com" value={
            verifyHrEmail} onChange={
            (e) => {
              setVerifyHrEmail(e.target.value);
              setErrorMsg("");
            }} required={
            true} />}{

            verifyCompanySelection &&
            verifyCompanySelection !== "other" &&
            <p className=
            "field-hint">Must end with {


              <strong>@{




                registeredCompanies.find(
                  (c) => c.id === verifyCompanySelection
                )?.domain}</strong>}</p>}</div>}{







          <div className=
          "form-actions-row">{

            <button type=
            "button" className=
            "btn btn-secondary" onClick={
            () => setModalType("select")}>Back</button>}{


            <button type=
            "submit" className=
            "btn btn-primary">{

              <Send size={
              15} />} Send Request</button>}</div>}</form>}</div>}</div>}</div>;













};
//#endregion
export default EmploymentHistory;
