import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Award, TrendingUp, Sparkles, Check, Shield, CircleCheckBig, FileCheck, Users, Building2, Lock } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const goToCompanySignup = () => navigate("/signup?role=company");
  const goToEmployeeSignup = () => navigate("/signup?role=employee");
  return <div className=
  "landing-page">{

    <section className=
    "hero-section">{
      <div className=
      "container hero-container">{

        <div className=
        "hero-content">{

          <span className=
          "hero-badge">{

            <Sparkles size={
            15} />}Trusted career records for modern hiring teams</span>}{




          <h1 className=
          "hero-title">The trust layer for modern hiring.</h1>}{


          <p className=
          "hero-subtitle">CCS provides organizations with a consent-based network for employment verification, credibility insights, and trusted hiring intelligence.</p>}{



          <div className=
          "hero-actions">{

            <button onClick={
            goToCompanySignup} className=
            "btn btn-primary">Register Organization {


              <ArrowRight size={

              17} />}</button>}{



            <button onClick={
            goToEmployeeSignup} className=
            "btn btn-secondary">Claim Your Identity</button>}</div>}{




          <div className=
          "hero-trust-row" aria-label=
          "Platform highlights">{

            <span>{

              <Check size={
              15} />} HR verified</span>}{




            <span>{

              <Check size={
              15} />} Candidate consent</span>}{




            <span>{

              <Check size={
              15} />} Private by design</span>}</div>}</div>}{








        <div className=
        "hero-visual" aria-label=
        "CCS platform preview">{
          <div className=
          "product-frame">{

            <div className=
            "product-toolbar">{

              <div className=
              "window-controls">{

                <span />}{



                <span />}{



                <span />}</div>}{





              <div className=
              "toolbar-status">{

                <Shield size={
                14} />} Live verification</div>}</div>}{






            <div className=
            "product-grid">{

              <aside className=
              "profile-panel">{

                <div className=
                "avatar-placeholder">PS</div>}{


                <h3>Priya Sharma</h3>}{


                <p>Senior Software Engineer</p>}{


                <div className=
                "profile-score">{

                  <span>9.4</span>}{



                  <small>Career score</small>}</div>}</aside>}{







              <div className=
              "insight-panel">{

                <div className=
                "insight-header">{

                  <div>{



                    <span>Employment record</span>}{



                    <strong>2 verified roles</strong>}</div>}{






                  <span className=


                  "verified-pill">{

                    <CircleCheckBig size={

                    13} />} Verified ID</span>}</div>}{







                <div className=
                "timeline-list">{

                  <div className=


                  "timeline-row">{

                    <span className=

                    "timeline-dot verified" />}{

                    <div>{


                      <strong>TechCorp Inc.</strong>}{



                      <p>Senior Software Engineer - 2024 - 2026</p>}</div>}{






                    <span>HR verified</span>}</div>}{






                  <div className=


                  "timeline-row">{

                    <span className=

                    "timeline-dot verified" />}{

                    <div>{


                      <strong>Innovate LLC</strong>}{



                      <p>Software Engineer - 2022 - 2024</p>}</div>}{






                    <span>HR verified</span>}</div>}</div>}{








                <div className=
                "score-breakdown">{

                  <div>{



                    <span>Reliability</span>}{



                    <strong>96%</strong>}</div>}{






                  <div>{



                    <span>Performance</span>}{



                    <strong>91%</strong>}</div>}{






                  <div>{



                    <span>Conduct</span>}{



                    <strong>98%</strong>}</div>}</div>}</div>}</div>}</div>}</div>}</div>}</section>}{


















    <section className=
    "logo-strip" aria-label=
    "Product capabilities">{
      <div className=
      "container logo-strip-inner">{

        <span>Employment verification</span>}{


        <span>Structured evaluations</span>}{


        <span>Background screening</span>}{


        <span>Portable credentials</span>}</div>}</section>}{





    <section className=
    "problem-section">{
      <div className=
      "container">{

        <div className=
        "section-header">{

          <span className=
          "section-kicker">Why it matters</span>}{


          <h2>Hiring still runs on claims, calls, and guesswork.</h2>}{



          <p>CCS replaces scattered reference checks with a private source-of-truth for verified employment credibility.</p>}</div>}{





        <div className=
        "problem-comparison-grid">{

          <div className=
          "comparison-card broken">{

            <div className=
            "card-icon">{
              <Briefcase size={

              22} />}</div>}{


            <h3>Before CCS</h3>}{


            <ul className=
            "comparison-list">{

              <li>Unverified resumes create avoidable hiring risk</li>}{



              <li>Manual checks slow recruiting teams for weeks</li>}{



              <li>Informal references introduce bias and inconsistency</li>}{



              <li>Performance context disappears when employees move</li>}</ul>}</div>}{







          <div className=
          "comparison-card resolved">{

            <div className=
            "card-icon">{
              <Shield size={

              22} />}</div>}{


            <h3>With CCS</h3>}{


            <ul className=
            "comparison-list">{

              <li>HR-confirmed histories reduce credential inflation</li>}{



              <li>Consent-based access accelerates candidate screening</li>}{



              <li>Structured evaluations create comparable insight</li>}{



              <li>Professionals keep a trusted record they can reuse</li>}</ul>}</div>}</div>}</div>}</section>}{












    <section className=
    "overview-section">{
      <div className=
      "container">{

        <div className=
        "section-header">{

          <span className=
          "section-kicker">Platform</span>}{


          <h2>Built like infrastructure, not a public review board.</h2>}{



          <p>Every workflow is designed around verified source data, employee consent, and structured professional context.</p>}</div>}{





        <div className=
        "pillars-grid">{

          <div className=
          "pillar-card">{

            <div className=
            "pillar-icon">{
              <Lock size={

              20} />}</div>}{


            <h3>Consent-First Access</h3>}{


            <p>Employees own their profile. Companies see records only when a candidate grants permission.</p>}</div>}{





          <div className=
          "pillar-card">{

            <div className=
            "pillar-icon">{
              <FileCheck size={

              20} />}</div>}{


            <h3>Structured Assessment</h3>}{


            <p>Manager feedback is captured through defined dimensions instead of loose, subjective comments.</p>}</div>}{





          <div className=
          "pillar-card">{

            <div className=
            "pillar-icon">{
              <Award size={

              20} />}</div>}{


            <h3>Portable Reputation</h3>}{


            <p>Verified roles, achievements, and milestones follow professionals across their career.</p>}</div>}</div>}</div>}</section>}{










    <section className=
    "workflow-section">{
      <div className=
      "container workflow-grid">{

        <div className=
        "workflow-copy">{

          <span className=
          "section-kicker">Workflow</span>}{


          <h2>Three steps from request to trusted record.</h2>}{


          <p>Simple enough for candidates, controlled enough for enterprise HR, and structured enough for recruiting decisions.</p>}</div>}{





        <div className=
        "steps-container">{

          <div className=
          "step-item">{

            <div className=
            "step-number">01</div>}{


            <div className=
            "step-content">{

              <h3>Request & Invite</h3>}{


              <p>Employees request verification for past roles, or companies invite team members directly.</p>}</div>}</div>}{







          <div className=
          "step-item">{

            <div className=
            "step-number">02</div>}{


            <div className=
            "step-content">{

              <h3>Verify & Evaluate</h3>}{


              <p>HR confirms role details and managers submit structured exit evaluations.</p>}</div>}</div>}{







          <div className=
          "step-item">{

            <div className=
            "step-number">03</div>}{


            <div className=
            "step-content">{

              <h3>Share With Control</h3>}{


              <p>Candidates share verified credentials with employers through permissioned access.</p>}</div>}</div>}</div>}</div>}</section>}{












    <section className=
    "metrics-section">{
      <div className=
      "container metrics-container">{

        <div className=
        "metric-item">{

          <div className=
          "metric-val">90%</div>}{


          <div className=
          "metric-label">Reduction in reference check time</div>}</div>}{




        <div className=
        "metric-item">{

          <div className=
          "metric-val">70%</div>}{


          <div className=
          "metric-label">Lower background screening costs</div>}</div>}{




        <div className=
        "metric-item">{

          <div className=
          "metric-val">100%</div>}{


          <div className=
          "metric-label">HR-verified employment histories</div>}</div>}</div>}</section>}{







    <section className=
    "benefits-section">{
      <div className=
      "container benefit-split">{

        <div className=
        "benefit-text">{

          <span className=
          "section-kicker">For employers</span>}{


          <h2>Hire faster without lowering the evidence bar.</h2>}{


          <p>CCS helps recruiting and HR teams confirm candidate history, compare structured performance signals, and reduce manual screening cycles.</p>}{



          <div className=
          "benefit-bullet">{

            <div className=
            "bullet-icon">{
              <TrendingUp size={

              17} />}</div>}{


            <div>{

              <h4>Reduce time-to-hire</h4>}{


              <p>Verify candidate work histories and performance context before the final interview loop.</p>}</div>}</div>}{







          <div className=
          "benefit-bullet">{

            <div className=
            "bullet-icon">{
              <Users size={

              17} />}</div>}{


            <div>{

              <h4>Prevent resume fraud</h4>}{


              <p>Make decisions from verified employment data instead of self-reported claims.</p>}</div>}</div>}</div>}{









        <div className=
        "benefit-graphic">{
          <div className=
          "graphic-box screening-box">{

            <div className=
            "graphic-header">{

              <h4>Screening velocity</h4>}{


              <span>Live comparison</span>}</div>}{




            <div className=
            "graphic-chart">{

              <div className=
              "chart-row">{

                <span className=
                "chart-label">Standard verification</span>}{


                <div className=
                "chart-bar-container">{

                  <div className=


                  "chart-bar slow" style={
                  { width: "100%" }} />}{


                  <span className=


                  "chart-time">14 days</span>}</div>}</div>}{







              <div className=
              "chart-row">{

                <span className=
                "chart-label">CCS verification</span>}{


                <div className=
                "chart-bar-container">{

                  <div className=


                  "chart-bar fast" style={
                  { width: "14%" }} />}{


                  <span className=


                  "chart-time">Instant</span>}</div>}</div>}</div>}{









            <div className=
            "screening-summary">{

              <Building2 size={
              18} />}{

              <span>Candidate cleared for final review</span>}</div>}</div>}</div>}</div>}</section>}{










    <section className=
    "benefits-section employee-benefits">{
      <div className=
      "container benefit-split reverse">{

        <div className=
        "benefit-graphic">{
          <div className=
          "graphic-box milestones-box">{

            <div className=
            "graphic-header">{

              <h4>Verified milestones</h4>}{


              <span>Employee owned</span>}</div>}{




            <div className=
            "milestone-list">{

              <div className=
              "milestone-card">{

                <div className=
                "milestone-badge-icon">{
                  <Award size={
                  18} />}</div>}{

                <div>{

                  <h5>Top 10% Contributor</h5>}{



                  <p>TechCorp Inc. - verified by 3 reviewers</p>}</div>}</div>}{







              <div className=
              "milestone-card">{

                <div className=
                "milestone-badge-icon">{
                  <CircleCheckBig size={

                  18} />}</div>}{


                <div>{

                  <h5>Reliability Milestone</h5>}{



                  <p>100% project delivery record verified</p>}</div>}</div>}</div>}</div>}</div>}{












        <div className=
        "benefit-text">{

          <span className=
          "section-kicker">For professionals</span>}{


          <h2>Own a career record that travels with you.</h2>}{


          <p>Your work history should not be trapped in closed HR systems. CCS gives you verified proof of roles, achievements, and performance signals.</p>}{



          <div className=
          "benefit-bullet">{

            <div className=
            "bullet-icon">{
              <Award size={

              17} />}</div>}{


            <div>{

              <h4>Portable work history</h4>}{


              <p>Consolidate verified roles, milestones, and achievements in one professional profile.</p>}</div>}</div>}{







          <div className=
          "benefit-bullet">{

            <div className=
            "bullet-icon">{
              <Briefcase size={

              17} />}</div>}{


            <div>{

              <h4>Accelerate applications</h4>}{


              <p>Share pre-verified credentials with hiring managers and avoid background-check delays.</p>}</div>}</div>}</div>}</div>}</section>}{












    <section className=
    "cta-section">{
      <div className=
      "container cta-container">{

        <span className=
        "section-kicker">Get started</span>}{


        <h2>Build trust into every career move.</h2>}{


        <p>Join the private ecosystem where performance is verified, privacy is preserved, and hiring decisions move faster.</p>}{



        <div className=
        "cta-actions">{

          <button onClick={
          goToCompanySignup} className=
          "btn btn-primary">Register Organization {


            <ArrowRight size={
            17} />}</button>}{



          <button onClick={
          goToEmployeeSignup} className=
          "btn btn-secondary">Claim Your Profile</button>}</div>}</div>}</section>}</div>;









};
//#endregion
export default Landing;
