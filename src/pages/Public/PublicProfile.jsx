import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, getDoc, getDocs, collection, query, where, updateDoc, increment } from 'firebase/firestore';
import { Briefcase, FileText, Shield, CircleX, Eye, Download, CircleCheckBig, Star, Building2, TrendingUp, Award, CircleAlert, X } from 'lucide-react';

const PublicProfile = ({ shareId: propShareId, embedded = false }) => {
  const params = useParams();
  const shareId = propShareId || params.shareId;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let employeeId;
        let access = "Full profile";
        let isGlobal = false;
        let shareData = null;
        let shareLinkError = false;
        try {
          const shareDoc = await getDoc(doc(db, "shareLinks", shareId));
          if (shareDoc.exists()) shareData = shareDoc.data();
        } catch {
          shareLinkError = true;
        }
        if (shareData) {
          if (shareData.status !== "Active") {
            setError("This share link has expired or been deactivated.");
            setLoading(false);
            return;
          }
          await updateDoc(doc(db, "shareLinks", shareId), {
            views: increment(1)
          });
          employeeId = shareData.employeeId;
          access = shareData.access;
        } else
        try {
          const globalDoc = await getDoc(doc(db, "globalLinks", shareId));
          if (!globalDoc.exists()) {
            if (shareLinkError)
            setError(
              "This profile link is restricted to the company it was shared with. Please log in as a company member to view it."
            );else

            setError(
              "Profile not found. Please check the URL and try again."
            );
            setLoading(false);
            return;
          }
          const globalData = globalDoc.data();
          employeeId = globalData.userId;
          access = globalData.access || "Full profile";
          isGlobal = true;
        } catch {
          setError("Profile not found or access denied.");
          setLoading(false);
          return;
        }
        const userDoc = await getDoc(doc(db, "users", employeeId));
        if (!userDoc.exists()) {
          setError("Profile not found.");
          setLoading(false);
          return;
        }
        const userData = userDoc.data();
        const companySnap = await getDocs(collection(db, "companies"));
        const companyMap = {};
        companySnap.forEach((docSnap) => {
          companyMap[docSnap.id] = docSnap.data().name;
        });
        const employeesSnap = await getDocs(
          query(
            collection(db, "employees"),
            where("email", "in", [
            userData.email.toLowerCase(),
            userData.email]
            )
          )
        );
        const employmentHistory = [];
        employeesSnap.forEach((d) => {
          const empData = d.data();
          employmentHistory.push({
            id: d.id,
            ...empData,
            companyName:
            companyMap[empData.companyId] ||
            empData.company ||
            "External Org"
          });
        });
        const evalsSnap = await getDocs(
          query(
            collection(db, "evaluations"),
            where("employeeEmail", "in", [
            userData.email.toLowerCase(),
            userData.email]
            )
          )
        );
        const evaluations = [];
        evalsSnap.forEach((d) => {
          evaluations.push({
            id: d.id,
            ...d.data()
          });
        });
        let score = 0;
        let scoreLabel = "No Score";
        const verifiedHistory = employmentHistory.filter(
          (h) => h.status === "Verified"
        );
        if (verifiedHistory.length > 0) {
          const total = verifiedHistory.reduce(
            (sum, h) => sum + (parseFloat(h.score) || 0),
            0
          );
          score = parseFloat((total / verifiedHistory.length).toFixed(1));
          if (score >= 8.5) scoreLabel = "Excellent";else
          if (score >= 7.5) scoreLabel = "Very Good";else
          if (score >= 6) scoreLabel = "Good";else
          if (score > 0) scoreLabel = "Needs Improvement";
        }
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
        const avgCollaboration = calculateCurvedMetric(
          evaluations,
          "collaboration"
        );
        const avgCommunication = calculateCurvedMetric(
          evaluations,
          "communication"
        );
        const avgInitiative = calculateCurvedMetric(evaluations, "initiative");
        setProfile({
          name: userData.name,
          email: userData.email,
          initials: userData.initials,
          photoUrl: userData.photoUrl,
          score,
          scoreLabel,
          access,
          employmentHistory,
          evaluations,
          recipient: isGlobal ? "Global Link" : "Share Link",
          avgProfessionalism,
          avgTechnical,
          avgDelivery,
          avgCollaboration,
          avgCommunication,
          avgInitiative,
          verificationConfidence:
          verifiedHistory.length > 0 ? 90 + verifiedHistory.length * 2 : 0
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          "Failed to load profile. Please check the link and try again."
        );
        setLoading(false);
      }
    };
    fetchProfile();
  }, [shareId]);
  if (loading)
  return <div className={
  embedded ? "pp-embedded" : "pp-page"}>{

    !embedded &&
    <header className=
    "pp-header">{
      <div className=
      "pp-header-inner">{
        <Link to=
        "/" className=
        "pp-logo">{

          <Shield size={
          20} />}{

          <span>CCS</span>}</Link>}</div>}</header>}{






    <main className=
    "pp-main">{
      <div className=
      "pp-loading">{

        <div className=
        "pp-spinner" />}{

        <p>Loading verified profile...</p>}</div>}</main>}</div>;







  if (error)
  return <div className={
  embedded ? "pp-embedded" : "pp-page"}>{

    !embedded &&
    <header className=
    "pp-header">{
      <div className=
      "pp-header-inner">{
        <Link to=
        "/" className=
        "pp-logo">{

          <Shield size={
          20} />}{

          <span>CCS</span>}</Link>}</div>}</header>}{






    <main className=
    "pp-main">{
      <div className=
      "pp-error">{

        <div className=
        "pp-error-icon">{
          <CircleX size={
          48} />}</div>}{


        <h2>Profile Unavailable</h2>}{


        <p>{
          error}</p>}{

        <Link to=
        "/" className=
        "pp-btn pp-btn-primary">Go to CCS</Link>}</div>}</main>}</div>;







  if (!profile) return null;
  const showFull = profile.access === "Full profile";
  const showEmployment = showFull || profile.access === "Employment only";
  const showScore = showFull || profile.access === "Score summary only";
  return <div className={
  embedded ? "pp-embedded" : "pp-page"}>{

    !embedded &&
    <header className=
    "pp-header">{
      <div className=
      "pp-header-inner">{

        <Link to=
        "/" className=
        "pp-logo">{

          <Shield size={
          20} />}{

          <span>CCS</span>}</Link>}{




        <div className=
        "pp-header-right">{

          <span className=
          "pp-access-badge">{

            <Eye size={
            13} />}Shared with {


            profile.recipient}</span>}{


          !embedded &&
          <button className=
          "pp-btn pp-btn-outline" onClick={
          () => window.print()}>{

            <Download size={
            14} />} PDF</button>}</div>}</div>}</header>}{









    <main className=
    "pp-main">{
      <div className=
      "pp-container">{

        <div className=
        "pp-card pp-profile-card animate-fade-in-up delay-1">{

          <div className=
          "pp-profile-left">{

            <div className=
            "pp-avatar" style={
            profile.photoUrl ?
            {
              backgroundImage: `url(${profile.photoUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            } :
            {}}>{
              !profile.photoUrl && profile.initials}</div>}{

            <div className=
            "pp-profile-meta">{

              <h1 className=
              "pp-name">{
                profile.name}</h1>}{

              <p className=
              "pp-email">{
                profile.email}</p>}{

              <div className=
              "pp-badges">{

                <span className=


                "pp-badge pp-badge-verified">{

                  <CircleCheckBig size={

                  13} />} Verified Identity</span>}{





                profile.score >= 8 &&
                <span className=


                "pp-badge pp-badge-top">{

                  <Star size={

                  13} />} Top Performer</span>}</div>}</div>}</div>}{











          showScore &&
          <div className=
          "pp-profile-right">{
            <div className=


            "pp-gauge">{

              <svg viewBox=
              "0 0 120 70" className=
              "pp-gauge-svg">{

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
                "9" className=
                "pp-gauge-fill-animated" style={
                {
                  "--target-dashoffset":
                  157.08 * (1 - profile.score / 10)
                }} strokeLinecap=
                "round" />}</svg>}{




              <div className=
              "pp-gauge-value">{
                profile.score}</div>}{

              <div className=
              "pp-gauge-label">{
                profile.scoreLabel}</div>}{

              <p className=
              "pp-score-caption">Credibility Score</p>}</div>}</div>}</div>}{








        (showScore || showEmployment) &&
        <div className=
        "pp-stats animate-fade-in-up delay-2">{

          showScore &&
          <div className=
          "pp-stat">{

            <div className=
            "pp-stat-value">{
              profile.verificationConfidence}%</div>}{

            <div className=
            "pp-stat-label">Verification Confidence</div>}</div>}{




          showEmployment &&
          <div className=
          "pp-stat">{

            <div className=
            "pp-stat-value">{
              profile.employmentHistory.filter(
                (h) => h.status === "Verified"
              ).length}</div>}{

            <div className=
            "pp-stat-label">Verified Roles</div>}</div>}{




          showScore &&
          <div className=
          "pp-stat">{

            <div className=
            "pp-stat-value">{
              profile.evaluations.length}</div>}{

            <div className=
            "pp-stat-label">Performance Reviews</div>}</div>}</div>}{






        showEmployment &&
        profile.employmentHistory.length > 0 &&
        <div className=
        "pp-content-grid">{

          <div className=
          "pp-content-main animate-fade-in-up delay-3">{

            <div className=
            "pp-card pp-section">{

              <div className=
              "pp-section-head">{

                <Briefcase size={

                18} />}{

                <h2>Employment History</h2>}{



                <span className=


                "pp-section-badge">{

                  profile.employmentHistory.filter(
                    (h) => h.status === "Verified"
                  ).length} verified</span>}</div>}{






              <div className=
              "pp-timeline">{
                profile.employmentHistory.map(
                  (record, i) =>
                  <div className={


                  `pp-tl-item ${i === profile.employmentHistory.length - 1 ? "pp-tl-last" : ""}`}>{

                    <div className=

                    "pp-tl-marker">{
                      <div className=

                      "pp-tl-dot" style={
                      {
                        backgroundColor:
                        record.status === "Verified" ?
                        "#111827" :
                        "#ced4da",
                        boxShadow:
                        record.status === "Verified" ?
                        "0 0 0 2px #ffffff, 0 0 0 4px #e2e6ea" :
                        "none"
                      }} />}</div>}{


                    <div className=

                    "pp-tl-card">{

                      <div className=

                      "pp-tl-top">{

                        <div className=

                        "pp-tl-company-icon">{
                          <Building2 size={


                          16} />}</div>}{


                        <div className=

                        "pp-tl-info">{

                          <h3>{


                            record.role}</h3>}{

                          <p className=



                          "pp-tl-sub">{

                            record.companyName ||
                            record.company ||
                            "External Org"} · {

                            record.date}</p>}</div>}{





                        showScore &&
                        record.status === "Verified" &&
                        <div className=



                        "pp-tl-score">{

                          record.score}{
                          <span>/10</span>}</div>}</div>}{









                      <div className=

                      "pp-tl-tags">{

                        record.status === "Verified" ?
                        <>{




                          <span className=




                          "pp-tag pp-tag-verified">{

                            <CircleCheckBig size={


                            11} />} Source Verified</span>}{





                          record.risk === "Low" &&
                          <span className=




                          "pp-tag pp-tag-safe">Low Risk</span>}</> :







                        <span className=



                        "pp-tag" style={
                        {
                          background: "#eef2ff",
                          color: "#4f46e5",
                          border:
                          "1px solid #c7d2fe"
                        }}>Self-Declared</span>}{



                        record.referenceLetterUrl &&
                        record.status === "Verified" &&
                        <button onClick={



                        () =>
                        setViewingDoc({
                          referenceLetterUrl:
                          record.referenceLetterUrl,
                          referenceLetterName:
                          record.referenceLetterName
                        })} className=
                        "pp-tag" style={
                        {
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          border:
                          "1px solid #bfdbfe",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          textDecoration: "none",
                          marginLeft: "4px",
                          cursor: "pointer"
                        }}>{

                          <FileText size={


                          11} />} Reference Document</button>}</div>}</div>}</div>













                )}</div>}</div>}{



            showScore &&
            <div className=
            "pp-card pp-section" style={
            { marginTop: "24px" }}>{

              <div className=


              "pp-section-head" style={
              { marginBottom: "16px" }}>{

                <TrendingUp size={

                18} />}{

                <h2>Detailed Performance Trend</h2>}{



                <span className=


                "text-muted" style={
                {
                  fontSize: "0.875rem",
                  fontWeight: "normal"
                }}>Chronological score trajectory</span>}</div>}{







              profile.employmentHistory.filter(
                (r) => r.status === "Verified"
              ).length > 1 ?
              <div style={


              {
                marginTop: "16px",
                background: "#fafafa",
                border: "1px solid #f0f1f3",
                borderRadius: "12px",
                padding: "16px"
              }}>{
                <div style={

                {
                  width: "100%",
                  height: "120px"
                }}>{
                  <svg viewBox=

                  "0 0 500 120" preserveAspectRatio=
                  "none" style={
                  {
                    width: "100%",
                    height: "100%"
                  }}>{

                    <defs>{

                      <linearGradient id=



                      "trendGradPublic" x1=
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
                      const revVerified = [
                      ...profile.employmentHistory.filter(
                        (r) => r.status === "Verified"
                      )].
                      reverse();
                      const points = revVerified.map(
                        (rec, index) => {
                          return {
                            x:
                            index / (
                            revVerified.length -
                            1) *
                            440 +
                            30,
                            y:
                            100 -
                            (rec.score || 0) / 10 *
                            80,
                            score: rec.score,
                            label: (
                            rec.companyName ||
                            "External").
                            split(" ")[0]
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
                        "url(#trendGradPublic)" />}{


                        <path d={



                        pathD} fill=
                        "none" stroke=
                        "#111827" strokeWidth=
                        "2.5" strokeLinecap=
                        "round" strokeLinejoin=
                        "round" />}{


                        points.map((p, idx) =>
                        <g>{




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

                          "middle" fill=
                          "#111827" style={
                          {
                            fontSize:
                            "10px",
                            fontWeight:
                            "bold"
                          }}>{
                            p.score}</text>}{


                          <text x={



                          p.x} y=
                          "116" textAnchor=

                          "middle" fill=
                          "#868e96" style={
                          {
                            fontSize: "9px",
                            fontWeight:
                            "500"
                          }}>{
                            p.label}</text>}</g>






                        )}</>;



                    })()}</svg>}</div>}</div> :





              profile.employmentHistory.filter(
                (r) => r.status === "Verified"
              ).length === 1 ?
              <div style={


              {
                padding: "20px",
                background: "#fafafa",
                border: "1px solid #f0f1f3",
                borderRadius: "12px",
                textAlign: "center",
                marginTop: "16px"
              }}>{

                <CircleCheckBig size={



                28} style={
                {
                  color: "#16a34a",
                  marginBottom: "6px",
                  margin: "0 auto"
                }} />}{


                <h3 style={

                {
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "2px",
                  marginTop: "6px"
                }}>Baseline Score Established</h3>}{



                <p style={

                {
                  fontSize: "0.8rem",
                  color: "#666",
                  maxWidth: "420px",
                  margin: "0 auto",
                  lineHeight: "1.4"
                }}>A baseline credibility score of {


                  <strong>{


                    profile.employmentHistory.filter(
                      (r) =>
                      r.status === "Verified"
                    )[0].score || 0}</strong>} has been set. Once additional verified roles are added, the timeline trend will plot here.</p>}</div> :







              <div style={


              {
                padding: "20px",
                background: "#fafafa",
                border: "1px solid #f0f1f3",
                borderRadius: "12px",
                textAlign: "center",
                marginTop: "16px"
              }}>{
                <p style={

                {
                  fontSize: "0.8rem",
                  color: "#666"
                }}>No verified evaluations found.</p>}</div>}</div>}{







            <div className=
            "pp-card pp-section" style={
            { marginTop: "24px" }}>{

              <div className=
              "pp-section-head" style={
              { marginBottom: "16px" }}>{

                <Shield size={

                18} />}{

                <h2>Verification Integrity Log</h2>}{



                <span className=


                "text-muted" style={
                {
                  fontSize: "0.875rem",
                  fontWeight: "normal"
                }}>Cryptographic signatures & enterprise credentials</span>}</div>}{






              <div style={
              {
                marginTop: "16px",
                overflowX: "auto"
              }}>{
                <table style={

                {
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.875rem"
                }}>{

                  <thead>{


                    <tr style={

                    {
                      borderBottom: "1px solid #e4e7ec",
                      textAlign: "left"
                    }}>{

                      <th style={

                      {
                        padding: "12px 8px",
                        color:
                        "var(--color-text-secondary)",
                        fontWeight: 600
                      }}>Record Reference</th>}{


                      <th style={

                      {
                        padding: "12px 8px",
                        color:
                        "var(--color-text-secondary)",
                        fontWeight: 600
                      }}>Sign-off Authority</th>}{


                      <th style={

                      {
                        padding: "12px 8px",
                        color:
                        "var(--color-text-secondary)",
                        fontWeight: 600
                      }}>Verification Date</th>}</tr>}</thead>}{






                  <tbody>{


                    profile.employmentHistory.
                    filter((r) => r.status === "Verified").
                    map((record) =>
                    <tr style={



                    {
                      borderBottom: "1px solid #f1f5f9"
                    }}>{

                      <td style={

                      { padding: "12px 8px" }}>{

                        <div style={



                        {
                          fontWeight: 600,
                          color:
                          "var(--color-dark)"
                        }}>{
                          record.role}</div>}{


                        <div style={



                        {
                          fontSize: "0.8rem",
                          color:
                          "var(--color-text-secondary)"
                        }}>{

                          record.companyName}</div>}</td>}{




                      <td style={

                      { padding: "12px 8px" }}>{

                        <div style={



                        {
                          fontWeight: 500
                        }}>{

                          record.verifiedBy ||
                          "HR Representative"}</div>}{


                        record.verifierEmail &&
                        <div style={



                        {
                          fontSize: "0.8rem",
                          color:
                          "var(--color-text-secondary)"
                        }}>{

                          record.verifierEmail}</div>}</td>}{




                      <td style={

                      {
                        padding: "12px 8px",
                        color:
                        "var(--color-text-secondary)"
                      }}>{

                        record.verifiedAt ||
                        record.date}</td>}</tr>





                    )}</tbody>}</table>}</div>}</div>}{







            profile.employmentHistory.filter(
              (r) => r.status === "Verified" && r.referenceLetterUrl
            ).length > 0 &&
            <div className=
            "pp-card pp-section" style={
            { marginTop: "24px" }}>{

              <div className=


              "pp-section-head" style={
              { marginBottom: "16px" }}>{

                <FileText size={

                18} />}{

                <h2>Verified Documents & Reference Letters</h2>}{






                <span className=


                "text-muted" style={
                {
                  fontSize: "0.875rem",
                  fontWeight: "normal"
                }}>Official contract and exit attachments</span>}</div>}{







              <div style={
              {
                marginTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>{
                profile.employmentHistory.
                filter(
                  (r) =>
                  r.status === "Verified" &&
                  r.referenceLetterUrl
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
                      <FileText size={


                      16} />}</div>}{


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

                        record.companyName})</div>}</div>}</div>}{








                  <button className=


                  "btn btn-secondary btn-small" style={
                  {
                    margin: 0,
                    padding: "6px 12px",
                    minHeight: "30px",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }} onClick={
                  () =>
                  setViewingDoc({
                    referenceLetterUrl:
                    record.referenceLetterUrl,
                    referenceLetterName:
                    record.referenceLetterName
                  })}>View Document</button>}</div>






                )}</div>}</div>}</div>}{





          showScore &&
          <div className=
          "pp-content-side animate-fade-in-up delay-4">{

            <div className=
            "pp-card pp-section">{

              <div className=


              "pp-section-head">{

                <TrendingUp size={

                18} />}{

                <h2>Trust Metrics</h2>}</div>}{






              <div className=
              "pp-metrics">{
                [
                {
                  name: "Professionalism",
                  val: profile.avgProfessionalism
                },
                {
                  name: "Technical Skills",
                  val: profile.avgTechnical
                },
                {
                  name: "Reliability",
                  val: profile.avgDelivery
                },
                {
                  name: "Collaboration",
                  val: profile.avgCollaboration
                },
                {
                  name: "Communication",
                  val: profile.avgCommunication
                },
                {
                  name: "Initiative",
                  val: profile.avgInitiative
                }].
                map(({ name, val }) =>
                <div className=


                "pp-metric">{

                  <div className=

                  "pp-metric-top">{

                    <span className=

                    "pp-metric-name">{
                      name}</span>}{

                    <span className=

                    "pp-metric-val">{
                      val}/10</span>}</div>}{



                  <div className=

                  "pp-metric-bar">{
                    <div className=

                    "pp-metric-fill" style={
                    {
                      width: `${val / 10 * 100}%`
                    }} />}</div>}</div>






                )}</div>}</div>}{



            <div className=
            "pp-card pp-section pp-summary-card">{

              <div className=


              "pp-section-head">{

                <Award size={

                18} />}{

                <h2>Summary</h2>}</div>}{






              <p className=
              "pp-summary-text">{

                profile.name} has {

                <strong>{



                  profile.employmentHistory.length} verified role{

                  profile.employmentHistory.length !== 1 ?
                  "s" :
                  ""}</strong>} with a credibility score of {




                <strong>{

                  profile.score}/10</strong>} across {


                profile.evaluations.length} performance evaluation{

                profile.evaluations.length !== 1 ? "s" : ""}.</p>}</div>}</div>}</div>}{









        showEmployment &&
        profile.employmentHistory.length === 0 &&
        <div className=
        "pp-card pp-empty animate-fade-in-up delay-2">{

          <CircleAlert size={
          28} />}{

          <h3>No employment records yet</h3>}{


          <p>This candidate does not have any verified employment records to display.</p>}</div>}{





        <div className=
        "pp-footer">{

          <Shield size={
          14} />}{

          <span>Powered by {


            <strong>Career Credibility Score</strong>} — Verified professional credentials</span>}</div>}</div>}</main>}{










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
export default PublicProfile;
