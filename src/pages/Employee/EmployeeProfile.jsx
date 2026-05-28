import { useNavigate } from 'react-router-dom';
import { Link2, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import './EmployeeProfile.css';

import { useState, useEffect } from 'react';
import { Download, Briefcase, CircleCheckBig, TrendingUp, Share2, ArrowUpRight, ArrowLeft, FileText, X } from 'lucide-react';

const EmployeeProfile = () => {
  const { employeeProfile, employmentHistory, shareLinks, evaluations } =
  useData();
  const navigate = useNavigate();
  const [viewingDoc, setViewingDoc] = useState(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setViewingDoc(null);
    };
    if (viewingDoc) window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewingDoc]);
  const calculateCurvedMetric = (evals, fieldName) => {
    if (!evals || evals.length === 0) return 0;
    const curvedSum = evals.reduce((sum, e) => {
      const val = parseFloat(e[fieldName] || 0);
      return sum + (val > 0 ? 10 * Math.pow(val / 5, 0.65) : 0);
    }, 0);
    return parseFloat((curvedSum / evals.length).toFixed(1));
  };
  const avgProfessionalism = calculateCurvedMetric(
    evaluations,
    "professionalism"
  );
  const avgTechnical = calculateCurvedMetric(
    evaluations,
    "technicalCompetency"
  );
  const avgDelivery = calculateCurvedMetric(evaluations, "reliability");
  const avgCollaboration = calculateCurvedMetric(evaluations, "collaboration");
  const avgCommunication = calculateCurvedMetric(evaluations, "communication");
  const avgInitiative = calculateCurvedMetric(evaluations, "initiative");
  const score = employeeProfile.score || 0;
  const scoreAngle = score / 10 * 157.08;
  const activeShares = shareLinks.filter((s) => s.status === "Active").length;
  return <div className=
  "ep-shell">{

    <div className=
    "ep-header animate-ep delay-ep-1">{

      <div>{

        <p className=
        "ep-header-kicker">Dashboard</p>}{


        <h1 className=
        "ep-header-title">My Credibility Profile</h1>}</div>}{




      <div className=
      "ep-header-actions">{

        <button className=
        "btn btn-secondary" onClick={
        () => window.print()}>{

          <Download size={
          15} />}Download PDF</button>}{




        <button className=
        "btn btn-secondary" onClick={
        () => navigate("/employee/history")}>{

          <Briefcase size={
          15} />}View History</button>}{




        <button className=
        "btn btn-primary" onClick={
        () => navigate("/employee/share")}>{

          <Link2 size={
          15} />}Share Profile</button>}</div>}</div>}{








    <div className=
    "ep-hero animate-ep delay-ep-1">{

      <div className=
      "ep-hero-identity">{

        <div className=
        "ep-avatar" style={
        employeeProfile.photoUrl ?
        {
          backgroundImage: `url(${employeeProfile.photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        } :
        {}}>{
          !employeeProfile.photoUrl && employeeProfile.initials}</div>}{

        <div className=
        "ep-identity-meta">{

          <h2 className=
          "ep-name">{
            employeeProfile.name}</h2>}{

          <p className=
          "ep-email">{
            employeeProfile.email}</p>}{

          <div className=
          "ep-badges">{

            <span className=
            "ep-badge ep-badge-verified">{

              <CircleCheckBig size={

              12} />} Verified Identity</span>}{




            score >= 8 &&
            <span className=
            "ep-badge ep-badge-top">Top Performer</span>}</div>}</div>}</div>}{








      <div className=
      "ep-score-block">{

        <div className=
        "ep-gauge">{

          <svg viewBox=
          "0 0 120 70" className=
          "ep-gauge-svg">{

            <path d=
            "M10 60 A50 50 0 0 1 110 60" fill=
            "none" stroke=
            "#F1F3F5" strokeWidth=
            "9" strokeLinecap=
            "round" />}{

            <path d=
            "M10 60 A50 50 0 0 1 110 60" fill=
            "none" stroke=
            "#111827" strokeWidth=
            "9" strokeLinecap=
            "round" className=
            "ep-gauge-fill" style={
            { "--gauge-target": 157.08 - scoreAngle }} />}</svg>}{



          <div className=
          "ep-gauge-value">{
            score}</div>}{

          <div className=
          "ep-gauge-label">{
            employeeProfile.scoreLabel || "No Score"}</div>}</div>}{



        <p className=
        "ep-score-caption">Credibility Score</p>}</div>}</div>}{






    <div className=
    "ep-stat-row animate-ep delay-ep-2">{

      <div className=
      "ep-stat-card">{

        <div className=
        "ep-stat-icon ep-stat-icon--conf">{
          <TrendingUp size={

          16} />}</div>}{


        <div className=
        "ep-stat-body">{

          <div className=
          "ep-stat-value">{

            employeeProfile.verificationConfidence || 0}%</div>}{



          <div className=
          "ep-stat-label">Verification Confidence</div>}</div>}</div>}{






      <div className=
      "ep-stat-card">{

        <div className=
        "ep-stat-icon ep-stat-icon--roles">{
          <Briefcase size={

          16} />}</div>}{


        <div className=
        "ep-stat-body">{

          <div className=
          "ep-stat-value">{
            employmentHistory.filter(
              (r) => r.status === "Verified"
            ).length}</div>}{

          <div className=
          "ep-stat-label">Verified Roles</div>}</div>}</div>}{






      <div className=
      "ep-stat-card">{

        <div className=
        "ep-stat-icon ep-stat-icon--share">{
          <Share2 size={
          16} />}</div>}{


        <div className=
        "ep-stat-body">{

          <div className=
          "ep-stat-value">{
            activeShares}</div>}{

          <div className=
          "ep-stat-label">Active Shares</div>}</div>}</div>}</div>}{








    <div className=
    "ep-content-grid">{

      <div className=
      "ep-main-col">{

        <div className=
        "ep-panel animate-ep delay-ep-3">{

          <div className=
          "ep-panel-header">{

            <div>{

              <h2 className=
              "ep-panel-title">Employment History</h2>}{


              <p className=
              "ep-panel-sub">Source-verified and self-declared work records</p>}</div>}{





            <button className=
            "btn btn-secondary btn-small" onClick={
            () => navigate("/employee/history")}>Manage {


              <ArrowUpRight size={

              13} />}</button>}</div>}{





          employmentHistory.length > 0 ?
          <div className=
          "ep-timeline">{
            employmentHistory.map((record) =>
            <div className=


            "ep-tl-item">{

              <div className=


              "ep-tl-dot" style={
              {
                backgroundColor:
                record.status === "Verified" ?
                "#111827" :
                "#ced4da",
                boxShadow:
                record.status === "Verified" ?
                "0 0 0 2px #e2e6ea" :
                "none"
              }} />}{


              <div className=


              "ep-tl-card">{

                <div className=

                "ep-tl-top">{

                  <div className=

                  "ep-tl-info">{

                    <h3 className=

                    "ep-tl-role">{
                      record.role}</h3>}{

                    <p className=

                    "ep-tl-company">{

                      record.company} · {

                      record.period}</p>}</div>}{




                  record.status === "Verified" &&
                  <div className=

                  "ep-tl-score">{

                    record.score || 0}{
                    <span>/10</span>}</div>}</div>}{








                <div className=

                "ep-tl-tags">{
                  record.tags.map((tag) =>
                  <span className={




                  record.status === "Verified" ?
                  "ep-tag ep-tag-green" :
                  "ep-tag"} style={

                  record.status === "Verified" ?
                  {} :
                  {
                    background: "#eef2ff",
                    color: "#4f46e5",
                    border:
                    "1px solid #c7d2fe"
                  }}>{

                    record.status === "Verified" ?
                    <CircleCheckBig size={


                    10} /> :

                    null} {

                    tag}</span>




                  )}</div>}</div>}</div>








            )}</div> :

          <div className=
          "ep-empty">{

            <Briefcase size={

            28} />}{

            <p>No verified records yet. Request verification from a previous employer.</p>}{



            <button className=


            "btn btn-primary btn-small" onClick={
            () => navigate("/employee/history")}>Request Verification</button>}</div>}</div>}{







        <div className=
        "ep-panel animate-ep delay-ep-3" style={
        { marginTop: "16px" }}>{

          <div className=
          "ep-panel-header">{
            <div>{



              <h2 className=
              "ep-panel-title">Detailed Performance Trend</h2>}{


              <p className=
              "ep-panel-sub">Chronological score trajectory across exit evaluations</p>}</div>}</div>}{







          (() => {
            const verified = employmentHistory.filter(
              (r) => r.status === "Verified"
            );
            if (verified.length > 1)
            return <div className=


            "ep-trend-container">{
              <div className=


              "ep-trend-chart-wrapper">{
                <svg className=

                "ep-trend-svg" viewBox=
                "0 0 500 120" preserveAspectRatio=
                "none">{

                  <defs>{


                    <linearGradient id=



                    "trendGrad" x1=
                    "0" y1=
                    "0" x2=
                    "0" y2=
                    "1">{

                      <stop offset=

                      "0%" stopColor=
                      "#111827" stopOpacity=
                      "0.12" />}{

                      <stop offset=

                      "100%" stopColor=
                      "#111827" stopOpacity=
                      "0.00" />}</linearGradient>}</defs>}{






                  <line x1=


                  "0" y1=
                  "20" x2=
                  "500" y2=
                  "20" stroke=
                  "#f1f3f5" strokeWidth=
                  "1" strokeDasharray=
                  "4,4" />}{


                  <line x1=


                  "0" y1=
                  "60" x2=
                  "500" y2=
                  "60" stroke=
                  "#f1f3f5" strokeWidth=
                  "1" strokeDasharray=
                  "4,4" />}{


                  <line x1=


                  "0" y1=
                  "100" x2=
                  "500" y2=
                  "100" stroke=
                  "#f1f3f5" strokeWidth=
                  "1" strokeDasharray=
                  "4,4" />}{


                  (() => {
                    const revVerified = [...verified].reverse();
                    const points = revVerified.map(
                      (rec, index) => {
                        return {
                          x:
                          index / (revVerified.length - 1) *
                          440 +
                          30,
                          y: 100 - (rec.score || 0) / 10 * 80,
                          score: rec.score,
                          label: rec.company.split(" ")[0]
                        };
                      }
                    );
                    const pathD = points.reduce(
                      (acc, p, i) =>
                      i === 0 ?
                      `M ${p.x} ${p.y}` :
                      `${acc} L ${p.x} ${p.y}`,
                      ""
                    );
                    return <>{




                      <path d={

                      `${pathD} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`} fill=
                      "url(#trendGrad)" />}{

                      <path d={

                      pathD} fill=
                      "none" stroke=
                      "#111827" strokeWidth=
                      "2.5" strokeLinecap=
                      "round" strokeLinejoin=
                      "round" />}{

                      points.map((p, idx) =>
                      <g className=



                      "ep-trend-dot-group">{

                        <circle cx={



                        p.x} cy={
                        p.y} r=
                        "5" fill=
                        "#111827" stroke=
                        "#ffffff" strokeWidth=
                        "2" />}{


                        <text x={



                        p.x} y={
                        p.y - 12} textAnchor=
                        "middle" className=

                        "ep-trend-node-text" fill=
                        "#111827" style={
                        {
                          fontSize: "10px",
                          fontWeight: "bold"
                        }}>{
                          p.score}</text>}{


                        <text x={



                        p.x} y=
                        "116" textAnchor=
                        "middle" className=

                        "ep-trend-node-label" fill=
                        "#868e96" style={
                        {
                          fontSize: "9px",
                          fontWeight: "500"
                        }}>{
                          p.label}</text>}</g>






                      )}</>;



                  })()}</svg>}</div>}</div>;else






            if (verified.length === 1)
            return <div className=


            "ep-empty ep-empty--sm" style={
            {
              padding: "24px 20px",
              background: "#fafafa",
              border: "1px solid #f0f1f3",
              borderRadius: "12px"
            }}>{

              <ShieldCheck size={


              28} style={
              {
                color: "#16a34a",
                opacity: 1,
                marginBottom: "4px"
              }} />}{


              <h3 style={
              {
                fontSize: "0.9rem",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "2px"
              }}>Baseline Score Established</h3>}{


              <p style={
              {
                fontSize: "0.8rem",
                color: "#666",
                maxWidth: "420px",
                margin: "0 auto",
                lineHeight: "1.4"
              }}>You've set a baseline credibility score of {


                <strong>{

                  verified[0].score || 0}</strong>} at {


                verified[0].company}! Once you add and verify additional employment history, your chronological performance trend line will appear here.</p>}</div>;else







            return <div className=


            "ep-empty ep-empty--sm">{

              <ShieldCheck size={

              28} />}{

              <p>Verify records to begin tracking your performance growth trajectory.</p>}</div>;






          })()}</div>}{


        <div className=
        "ep-panel ep-audit-section animate-ep delay-ep-4" style={
        { marginTop: "16px" }}>{

          <div className=
          "ep-panel-header">{
            <div>{



              <h2 className=
              "ep-panel-title">Verification Integrity Log</h2>}{


              <p className=
              "ep-panel-sub">Cryptographic record signatures and enterprise check credentials</p>}</div>}</div>}{







          employmentHistory.filter((r) => r.status === "Verified").
          length > 0 ?
          <div className=
          "ep-audit-table-wrapper">{
            <table className=


            "ep-audit-table">{

              <thead>{


                <tr>{


                  <th>Record Reference</th>}{



                  <th>Sign-off Authority</th>}{



                  <th>Verification Date</th>}</tr>}</thead>}{







              <tbody>{


                employmentHistory.
                filter((r) => r.status === "Verified").
                map((record) =>
                <tr>{




                  <td>{


                    <div className=


                    "ep-audit-cell-role">{
                      record.role}</div>}{

                    <div className=


                    "ep-audit-cell-company">{
                      record.company}</div>}</td>}{



                  <td>{


                    <div className=


                    "ep-audit-authority-name">{

                      record.verifiedBy ||
                      "HR Administration"}</div>}{

                    record.verifierEmail &&
                    <div className=




                    "ep-audit-authority-email">{

                      record.verifierEmail}</div>}</td>}{




                  <td>{


                    record.verifiedAt ||
                    record.period.split(" · ")[1] ||
                    record.period}</td>}</tr>





                )}</tbody>}</table>}</div> :






          <div className=
          "ep-empty">{

            <ShieldCheck size={

            28} />}{

            <p>No verified signatures recorded yet. Signatures appear once an employment record is verified.</p>}</div>}</div>}{







        <div className=
        "ep-panel animate-ep delay-ep-4" style={
        { marginTop: "16px" }}>{

          <div className=
          "ep-panel-header">{
            <div>{



              <h2 className=
              "ep-panel-title">Verified Documents & Reference Letters</h2>}{


              <p className=
              "ep-panel-sub">Official reference letters, contracts, and credential attachments</p>}</div>}</div>}{







          employmentHistory.filter(
            (r) => r.status === "Verified" && r.referenceLetterUrl
          ).length > 0 ?
          <div style={
          {
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>{
            employmentHistory.
            filter(
              (r) =>
              r.status === "Verified" && r.referenceLetterUrl
            ).
            map((record) =>
            <div style={


            {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              background: "#fafafa",
              border: "1px solid #f0f1f3",
              borderRadius: "12px"
            }}>{

              <div style={


              {
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>{

                <div style={

                {
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>{
                  <ArrowLeft size={

                  16} style={
                  {
                    transform: "rotate(135deg)"
                  }} />}</div>}{


                <div>{


                  <div style={

                  {
                    fontSize: "0.88rem",
                    fontWeight: "700",
                    color: "#111827"
                  }}>{

                    record.referenceLetterName ||
                    "Reference_Letter.pdf"}</div>}{

                  <div style={

                  {
                    fontSize: "0.78rem",
                    color: "#868e96",
                    marginTop: "1px"
                  }}>Issued by {


                    record.verifiedBy} ({

                    record.company})</div>}</div>}</div>}{








              <button className=


              "btn btn-secondary btn-small" style={
              {
                margin: 0,
                padding: "6px 12px",
                minHeight: "30px"
              }} onClick={
              () =>
              setViewingDoc({
                referenceLetterUrl:
                record.referenceLetterUrl,
                referenceLetterName:
                record.referenceLetterName
              })}>View Document</button>}</div>







            )}</div> :

          <div className=
          "ep-empty ep-empty--sm">{

            <ArrowLeft size={


            28} style={
            {
              transform: "rotate(135deg)",
              opacity: 0.3
            }} />}{


            <p>No verified exit documents or contracts attached yet.</p>}</div>}</div>}</div>}{









      <div className=
      "ep-side-col">{

        <div className=
        "ep-panel animate-ep delay-ep-4">{

          <div className=
          "ep-panel-header">{
            <div>{



              <h2 className=
              "ep-panel-title">Trust Metrics</h2>}{


              <p className=
              "ep-panel-sub">Based on exit evaluations</p>}</div>}</div>}{






          <div className=
          "ep-metrics">{
            [
            {
              label: "Professionalism",
              value: avgProfessionalism
            },
            {
              label: "Technical Skills",
              value: avgTechnical
            },
            {
              label: "Reliability",
              value: avgDelivery
            },
            {
              label: "Collaboration",
              value: avgCollaboration
            },
            {
              label: "Communication",
              value: avgCommunication
            },
            {
              label: "Initiative",
              value: avgInitiative
            }].
            map(({ label, value }) =>
            <div className=


            "ep-metric">{

              <div className=


              "ep-metric-row">{

                <span className=


                "ep-metric-name">{
                  label}</span>}{


                <span className=


                "ep-metric-val">{

                  value}{
                  <span className=

                  "ep-metric-max">/10</span>}</span>}</div>}{








              <div className=
              "ep-metric-track">{
                <div className=

                "ep-metric-fill" style={
                { "--fill-width": `${value * 10}%` }} />}</div>}</div>






            )}</div>}</div>}{



        <div className=
        "ep-panel animate-ep delay-ep-4" style={
        { marginTop: "16px" }}>{

          <div className=
          "ep-panel-header">{

            <div>{

              <h2 className=
              "ep-panel-title">Consent & Sharing</h2>}{


              <p className=
              "ep-panel-sub">Active profile access links</p>}</div>}{




            <button className=
            "btn btn-secondary btn-small" onClick={
            () => navigate("/employee/share")}>Manage</button>}</div>}{




          <div className=
          "ep-share-list">{

            shareLinks.slice(0, 3).length > 0 ?
            shareLinks.slice(0, 3).map((share) =>
            <div className=


            "ep-share-item">{

              <div className=


              "ep-share-icon">{
                <ShieldCheck size={

                15} />}</div>}{



              <div className=


              "ep-share-meta">{

                <div className=

                "ep-share-name">{
                  share.recipient}</div>}{

                <div className=

                "ep-share-detail">{

                  share.access} · {

                  <span className={


                  share.status === "Active" ?
                  "ep-status-active" :
                  "ep-status-inactive"}>{
                    share.status}</span>}</div>}</div>}</div>










            ) :
            <div className=
            "ep-empty ep-empty--sm">{
              <p>No active shares. Share your profile with companies.</p>}</div>}</div>}</div>}</div>}</div>}{












    viewingDoc &&
    <div className=
    "doc-modal-overlay" onClick={
    () => setViewingDoc(null)}>{
      <div className=
      "doc-modal-container" onClick={
      (e) => e.stopPropagation()}>{

        <div className=
        "doc-modal-header">{

          <div className=
          "doc-modal-title-area">{

            <FileText size={
            18} />}{

            <h3 className=
            "doc-modal-title">{

              viewingDoc.referenceLetterName ||
              "Reference_Document.pdf"}</h3>}{

            <span className=
            "doc-modal-badge">{
              (viewingDoc.referenceLetterName || "").
              toLowerCase().
              match(/\.(pdf)$/) ?
              "PDF Document" :
              "Image"}</span>}</div>}{



          <button className=
          "doc-modal-close-btn" onClick={
          () => setViewingDoc(null)} title=
          "Close (Esc)">{
            <X size={
            20} />}</button>}</div>}{




        <div className=
        "doc-modal-content">{
          (viewingDoc.referenceLetterName || "").
          toLowerCase().
          match(/\.(jpg|jpeg|png|webp|gif)$/) ?
          <div className=
          "doc-modal-img-container">{
            <img src={


            viewingDoc.referenceLetterUrl} alt={
            viewingDoc.referenceLetterName} className=
            "doc-modal-img" />}</div> :



          <iframe src={
          viewingDoc.referenceLetterUrl} title={
          viewingDoc.referenceLetterName} className=
          "doc-modal-iframe" />}</div>}</div>}</div>}</div>;







};
//#endregion
export default EmployeeProfile;
