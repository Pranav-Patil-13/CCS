import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import './ExitEvaluation.css';

import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { CircleCheckBig, Upload, FileText, Loader } from 'lucide-react';

var ratingLabels = {
  1: "Needs Improvement",
  2: "Below Expectations",
  3: "Meets Expectations",
  4: "Exceeds Expectations",
  5: "Outstanding"
};
const RatingSelector = ({ name, value, onChange }) => {
  return <div className=
  "rating-selector">{

    [1, 2, 3, 4, 5].map((rating) =>
    <button type=


    "button" className={
    `rating-dot ${value === rating ? "selected" : ""} ${value >= rating ? "filled" : ""}`} onClick={
    () => onChange(name, rating)} title={
    ratingLabels[rating]}>{
      rating}</button>



    )}{
    <span className=
    "rating-label">{
      value ? ratingLabels[value] : "Select rating"}</span>}</div>;



};
var ExitEvaluation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { submitEvaluation } = useData();
  const { user } = useAuth();
  const employeeName = searchParams.get("name") || "Employee";
  const employeeRole = searchParams.get("role") || "Role";
  const requestId = searchParams.get("id") || "";
  const assignedEmail = searchParams.get("hrEmail") || "";
  const isAppeal = searchParams.get("isAppeal") === "true";
  const appealReason = searchParams.get("appealReason") || "";
  const appealCount = parseInt(searchParams.get("appealCount") || "0", 10);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(
    !!(
    assignedEmail &&
    user?.email &&
    assignedEmail.toLowerCase() !== user.email.toLowerCase())

  );
  const [formData, setFormData] = useState({
    professionalism: 0,
    technicalCompetency: 0,
    reliability: 0,
    collaboration: 0,
    communication: 0,
    initiative: 0,
    exitReason: "",
    exitReasonDetail: "",
    wouldRehire: "",
    strengths: "",
    areasForGrowth: "",
    additionalComments: "",
    conductVerified: false,
    attendanceVerified: false,
    noIncidents: false,
    referenceLetterUrl: "",
    referenceLetterName: ""
  });
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const cloudName = "dfqyaawjv";
    const uploadPreset = "career_cred";
    const resourceType =
    file.type.startsWith("image/") ||
    file.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) ?
    "image" :
    "raw";
    setUploading(true);
    setUploadProgress(0);
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("upload_preset", uploadPreset);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              Math.round(progressEvent.loaded * 100 / progressEvent.total)
            );
          }
        }
      );
      setFormData((prev) => ({
        ...prev,
        referenceLetterUrl: response.data.secure_url,
        referenceLetterName: file.name
      }));
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      alert(
        "Cloudinary upload failed: " + (
        error.response?.data?.error?.message || error.message)
      );
    } finally {
      setUploading(false);
    }
  };
  const handleRatingChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight + 2}px`;
    }
  };
  const calculateOverallScore = () => {
    const filledRatings = [
    formData.professionalism,
    formData.technicalCompetency,
    formData.reliability,
    formData.collaboration,
    formData.communication,
    formData.initiative].
    filter((r) => r > 0);
    if (filledRatings.length === 0) return 0;
    const curvedRatings = filledRatings.map((r) => 10 * Math.pow(r / 5, 0.65));
    return (
    curvedRatings.reduce((a, b) => a + b, 0) / curvedRatings.length).
    toFixed(1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const evaluation = {
      ...formData,
      employeeName,
      employeeRole,
      requestId,
      overallScore: calculateOverallScore(),
      submittedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };
    try {
      await submitEvaluation(requestId, evaluation);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting evaluation:", err);
      alert("Failed to submit evaluation: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (submitted)
  return <div className=
  "exit-evaluation">{
    <div className=
    "evaluation-success">{

      <CircleCheckBig size={
      64} className=
      "success-icon" />}{

      <h2>Evaluation Submitted</h2>}{


      <p className=
      "text-secondary">The exit evaluation for {


        <strong>{
          employeeName}</strong>} has been recorded. Their credibility profile will be updated accordingly.</p>}{




      <div className=
      "success-score">{

        <span className=
        "score-label">Calculated Score</span>}{


        <span className=
        "score-number">{
          calculateOverallScore()}</span>}{

        <span className=
        "score-total">/10</span>}</div>}{




      <button className=
      "btn btn-secondary back-link" onClick={
      () => navigate("/company/reports")} style={
      { alignSelf: "flex-start" }}>Back to Evaluations</button>}</div>}</div>;





  return <div className=
  "exit-evaluation">{

    showWarningModal &&
    <div className=
    "warning-modal-overlay">{
      <div className=
      "warning-modal">{

        <h3 className=
        "warning-modal-title">Verification Assigned to Another Team Member</h3>}{


        <p className=
        "warning-modal-text">This request was originally sent to {


          <strong>{
            assignedEmail}</strong>}. Are you sure you want to continue evaluating this employee?</p>}{




        <div className=
        "warning-modal-actions">{

          <button type=
          "button" className=
          "btn btn-secondary" onClick={
          () => navigate("/company/requests")}>Go Back</button>}{


          <button type=
          "button" className=
          "btn btn-primary" onClick={
          () => setShowWarningModal(false)}>Yes, Continue</button>}</div>}</div>}</div>}{







    <button className=
    "btn btn-secondary back-link" onClick={
    () => navigate("/company/reports")} style={
    { alignSelf: "flex-start" }}>{

      <ArrowLeft size={16} />}{
      <span>Back to Evaluations</span>}</button>}{




    <div className=
    "evaluation-header">{
      <div>{

        <h1>Exit Evaluation</h1>}{


        <p className=
        "text-muted">Structured credibility assessment for departing employees.</p>}</div>}</div>}{






    <div className=
    "employee-context-card">{

      <div className=
      "context-avatar">{
        employeeName.
        split(" ").
        map((n) => n[0]).
        join("").
        toUpperCase().
        slice(0, 2)}</div>}{

      <div className=
      "context-info">{

        <h3>{
          employeeName}</h3>}{

        <p className=
        "text-secondary">{
          employeeRole}</p>}</div>}{



      <div className=
      "context-score-preview">{

        <span className=
        "preview-label">Projected Score</span>}{


        <span className=
        "preview-value">{
          calculateOverallScore() || "—"}</span>}{

        <span className=
        "preview-total">/10</span>}</div>}</div>}{






    isAppeal &&
    <div className=
    "appeal-context-card" style={
    {
      padding: "24px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      border: "1px solid var(--border-color)",
      marginBottom: "32px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
    }}>{

      <div style={
      {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px"
      }}>{

        <span className=
        "status-pill status-warning" style={
        { margin: 0 }}>Appeal Re-evaluation</span>}{


        <span className=
        "text-muted" style={
        { fontSize: "0.85rem" }}>Attempt {
          appealCount}/3</span>}</div>}{



      <h4 style={
      {
        marginBottom: "8px",
        fontSize: "1rem",
        color: "var(--text-color)"
      }}>Employee's Reason for Appeal</h4>}{


      <p className=
      "text-secondary" style={
      {
        fontStyle: "italic",
        margin: 0,
        lineHeight: 1.5,
        backgroundColor: "var(--background-color)",
        padding: "12px",
        borderRadius: "6px",
        borderLeft: "3px solid var(--primary-color)"
      }}>"{
        appealReason}"</p>}</div>}{



    appealCount >= 3 &&
    <div style={
    {
      padding: "16px",
      backgroundColor: "var(--warning-color)",
      color: "#fff",
      borderRadius: "8px",
      marginBottom: "32px",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }}>{

      <strong>⚠️ FINAL EVALUATION:</strong>} This is the 3rd and final allowed appeal for this employee. The resulting score will be locked permanently.</div>}{





    <form onSubmit={
    handleSubmit} className=
    "evaluation-form">{

      <section className=
      "eval-section">{

        <div className=
        "eval-section-header">{

          <span className=
          "section-number">01</span>}{


          <div>{

            <h2>Core Competency Assessment</h2>}{


            <p className=
            "text-muted">Rate the employee on each dimension. These ratings directly contribute to their Career Credibility Score.</p>}</div>}</div>}{







        <div className=
        "rating-grid">{

          <div className=
          "rating-item">{

            <div className=
            "rating-item-header">{

              <h4>Professionalism</h4>}{


              <p className=
              "text-muted">Conduct, ethics, and professional demeanor in the workplace.</p>}</div>}{





            <RatingSelector name=


            "professionalism" value={
            formData.professionalism} onChange={
            handleRatingChange} />}</div>}{




          <div className=
          "rating-item">{

            <div className=
            "rating-item-header">{

              <h4>Technical Competency</h4>}{


              <p className=
              "text-muted">Skill level, domain knowledge, and quality of work delivered.</p>}</div>}{





            <RatingSelector name=


            "technicalCompetency" value={
            formData.technicalCompetency} onChange={
            handleRatingChange} />}</div>}{




          <div className=
          "rating-item">{

            <div className=
            "rating-item-header">{

              <h4>Reliability</h4>}{


              <p className=
              "text-muted">Consistency, dependability, and follow-through on commitments.</p>}</div>}{





            <RatingSelector name=


            "reliability" value={
            formData.reliability} onChange={
            handleRatingChange} />}</div>}{




          <div className=
          "rating-item">{

            <div className=
            "rating-item-header">{

              <h4>Collaboration</h4>}{


              <p className=
              "text-muted">Teamwork, cross-functional cooperation, and peer relationships.</p>}</div>}{





            <RatingSelector name=


            "collaboration" value={
            formData.collaboration} onChange={
            handleRatingChange} />}</div>}{




          <div className=
          "rating-item">{

            <div className=
            "rating-item-header">{

              <h4>Communication</h4>}{


              <p className=
              "text-muted">Clarity, responsiveness, and effectiveness of communication.</p>}</div>}{





            <RatingSelector name=


            "communication" value={
            formData.communication} onChange={
            handleRatingChange} />}</div>}{




          <div className=
          "rating-item">{

            <div className=
            "rating-item-header">{

              <h4>Initiative & Growth</h4>}{


              <p className=
              "text-muted">Proactiveness, willingness to learn, and self-improvement.</p>}</div>}{





            <RatingSelector name=


            "initiative" value={
            formData.initiative} onChange={
            handleRatingChange} />}</div>}</div>}</section>}{








      <section className=
      "eval-section">{

        <div className=
        "eval-section-header">{

          <span className=
          "section-number">02</span>}{


          <div>{

            <h2>Exit Details</h2>}{


            <p className=
            "text-muted">Context around the employee's departure from the organization.</p>}</div>}</div>}{







        <div className=
        "form-fields">{

          <div className=
          "form-group">{

            <label htmlFor=
            "exitReason">Reason for Exit</label>}{


            <select id=
            "exitReason" name=
            "exitReason" className=
            "form-select" value={
            formData.exitReason} onChange={
            handleChange} required={
            true}>{

              <option value=


              "">Select a reason</option>}{



              <option value=


              "resignation">Voluntary Resignation</option>}{



              <option value=


              "better_opportunity">Better Opportunity</option>}{



              <option value=


              "relocation">Relocation</option>}{



              <option value=


              "career_change">Career Change</option>}{



              <option value=


              "personal">Personal Reasons</option>}{



              <option value=


              "end_of_contract">End of Contract</option>}{



              <option value=


              "mutual">Mutual Separation</option>}{



              <option value=


              "layoff">Organizational Restructuring</option>}{



              <option value=


              "termination">Performance-Based Termination</option>}</select>}</div>}{







          <div className=
          "form-group">{

            <label htmlFor=
            "exitReasonDetail">Additional Context</label>}{


            <textarea id=
            "exitReasonDetail" name=
            "exitReasonDetail" className=
            "form-textarea" placeholder=

            "Any additional context about the employee's departure..." rows={
            3} value={
            formData.exitReasonDetail} onChange={
            handleChange} />}</div>}{



          <div className=
          "form-group">{

            <label>Would You Rehire?</label>}{


            <div className=
            "radio-group">{

              <label className=


              "radio-option">{

                <input type=


                "radio" name=
                "wouldRehire" value=
                "yes" checked={
                formData.wouldRehire === "yes"} onChange={
                handleChange} />}{


                <span className=


                "radio-label">Yes, without hesitation</span>}</label>}{






              <label className=


              "radio-option">{

                <input type=


                "radio" name=
                "wouldRehire" value=
                "yes_with_reservations" checked={

                formData.wouldRehire ===
                "yes_with_reservations"} onChange={
                handleChange} />}{


                <span className=


                "radio-label">Yes, with some reservations</span>}</label>}{






              <label className=


              "radio-option">{

                <input type=


                "radio" name=
                "wouldRehire" value=
                "no" checked={
                formData.wouldRehire === "no"} onChange={
                handleChange} />}{


                <span className=


                "radio-label">No</span>}</label>}</div>}</div>}</div>}</section>}{














      <section className=
      "eval-section">{

        <div className=
        "eval-section-header">{

          <span className=
          "section-number">03</span>}{


          <div>{

            <h2>Qualitative Feedback</h2>}{


            <p className=
            "text-muted">These insights help build a more complete professional profile for the employee.</p>}</div>}</div>}{







        <div className=
        "form-fields">{

          <div className=
          "form-group">{

            <label htmlFor=
            "strengths">Key Strengths</label>}{


            <textarea id=
            "strengths" name=
            "strengths" className=
            "form-textarea" placeholder=

            "What were this employee's biggest professional strengths?" rows={
            3} value={
            formData.strengths} onChange={
            handleChange} />}</div>}{



          <div className=
          "form-group">{

            <label htmlFor=
            "areasForGrowth">Areas for Growth</label>}{


            <textarea id=
            "areasForGrowth" name=
            "areasForGrowth" className=
            "form-textarea" placeholder=

            "What areas could this employee improve in their career?" rows={
            3} value={
            formData.areasForGrowth} onChange={
            handleChange} />}</div>}{



          <div className=
          "form-group">{

            <label htmlFor=
            "additionalComments">Additional Comments</label>}{


            <textarea id=
            "additionalComments" name=
            "additionalComments" className=
            "form-textarea" placeholder=

            "Any other observations or context for future employers..." rows={
            3} value={
            formData.additionalComments} onChange={
            handleChange} />}</div>}{



          <div className=
          "form-group" style={
          { marginTop: "16px" }}>{

            <label>Exit Reference Document / Letter (PDF/Image)</label>}{



            <div style={
            {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "8px"
            }}>{

              <label className=


              "btn btn-secondary btn-small" style={
              {
                cursor: "pointer",
                margin: 0
              }}>{

                <Upload size={

                14} />} Upload File{


                <input type=


                "file" accept=
                "application/pdf,image/*" onChange={
                handleFileChange} style={
                { display: "none" }} disabled={
                uploading} />}</label>}{





              uploading &&
              <span style={


              {
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>Uploading ({


                uploadProgress}%)...</span>}{




              formData.referenceLetterName &&
              !uploading &&
              <span style={


              {
                fontSize: "0.8rem",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "500"
              }}>{

                <FileText size={

                14} />} {


                formData.referenceLetterName} (Uploaded)</span>}</div>}</div>}</div>}</section>}{












      <section className=
      "eval-section">{

        <div className=
        "eval-section-header">{

          <span className=
          "section-number">04</span>}{


          <div>{

            <h2>Verification & Compliance</h2>}{


            <p className=
            "text-muted">Confirm the following to complete the evaluation.</p>}</div>}</div>}{







        <div className=
        "verification-checklist">{

          <label className=
          "checkbox-item">{

            <input type=
            "checkbox" name=
            "conductVerified" checked={
            formData.conductVerified} onChange={
            handleChange} />}{

            <span className=
            "checkbox-label">I verify that this employee maintained professional conduct during their tenure.</span>}</label>}{





          <label className=
          "checkbox-item">{

            <input type=
            "checkbox" name=
            "attendanceVerified" checked={
            formData.attendanceVerified} onChange={
            handleChange} />}{

            <span className=
            "checkbox-label">I confirm the employment dates and role title are accurate.</span>}</label>}{





          <label className=
          "checkbox-item">{

            <input type=
            "checkbox" name=
            "noIncidents" checked={
            formData.noIncidents} onChange={
            handleChange} />}{

            <span className=
            "checkbox-label">There are no pending disciplinary actions or unresolved incidents involving this employee.</span>}</label>}</div>}</section>}{









      <div className=
      "evaluation-footer">{

        <p className=
        "disclaimer text-muted">This evaluation is confidential and will contribute to the employee's Career Credibility Score. All responses are subject to CCS verification standards.</p>}{



        <div className=
        "footer-actions">{

          <button type=
          "button" className=
          "btn btn-secondary" onClick={
          () => navigate("/company/reports")}>Cancel</button>}{


          <button type=
          "submit" className=
          "btn btn-primary" disabled={
          submitting || uploading}>{
            submitting ?
            <span style={
            {
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}>{

              <Loader size={


              16} className=
              "animate-spin" />}Submitting...</span> :





            "Submit Evaluation"}</button>}</div>}</div>}</form>}</div>;









};
//#endregion
export default ExitEvaluation;
