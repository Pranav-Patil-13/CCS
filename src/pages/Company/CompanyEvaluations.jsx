import { useNavigate } from 'react-router-dom';
import { FileText, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

const CompanyEvaluations = () => {
  const { requests, evaluations } = useData();
  const navigate = useNavigate();
  const handleEvaluate = (req) => {
    navigate(
      `/company/evaluate?${new URLSearchParams({
        id: req.id,
        name: req.name || "Employee",
        role: req.role,
        hrEmail: req.hrEmail
      }).toString()}`
    );
  };
  return <div className=
  "company-evaluations page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>Evaluations</h1>}{


        <p className=
        "text-muted">Structured exit evaluations and completed credibility assessments.</p>}</div>}{





      <button className=
      "btn btn-primary" onClick={
      () => navigate("/company/requests")}>Open Request Queue</button>}</div>}{




    <div className=
    "metric-grid">{

      <div className=
      "metric-card">{

        <div className=
        "metric-label">Submitted Evaluations</div>}{


        <div className=
        "metric-value">{
          evaluations.length}</div>}{

        <div className=
        "metric-note">Captured in this mock session</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Pending Assessments</div>}{


        <div className=
        "metric-value">{
          requests.filter(
            (request) => request.status === "Pending"
          ).length}</div>}{

        <div className=
        "metric-note">Need manager input</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Average Submitted Score</div>}{


        <div className=
        "metric-value">{
          evaluations.length ?
          (
          evaluations.reduce(
            (sum, evaluation) =>
            sum + Number(evaluation.overallScore),
            0
          ) / evaluations.length).
          toFixed(1) :
          "—"}</div>}{

        <div className=
        "metric-note">Out of 10</div>}</div>}</div>}{






    <div className=
    "panel">{

      <div className=
      "panel-header">{
        <div>{

          <h2>Evaluation Queue</h2>}{


          <p className=
          "text-muted">Pending requests can be opened into the structured assessment form.</p>}</div>}</div>}{






      <div className=
      "table-container">{
        <table className=
        "data-table">{

          <thead>{
            <tr>{

              <th>Employee Name</th>}{


              <th>Role to Verify</th>}{


              <th>Status</th>}{


              <th>Date Requested</th>}{


              <th>Action</th>}</tr>}</thead>}{





          <tbody>{

            requests.map((req) =>
            <tr>{



              <td>{

                <strong>{

                  req.name || "Employee Name"}</strong>}{

                <div className=


                "record-meta text-muted" style={
                {
                  fontSize: "0.75rem",
                  marginTop: "2px"
                }}>{
                  <strong>To: {

                    req.hrEmail}</strong>}</div>}{



                req.status === "Verified" &&
                req.approvedBy &&
                <div className=


                "record-meta text-success" style={
                {
                  fontSize: "0.75rem",
                  marginTop: "2px"
                }}>Verified by: {


                  req.approvedBy.name}</div>}</td>}{





              <td>{
                req.role}</td>}{

              <td>{
                <span className={

                `status-pill ${req.status === "Verified" ? "status-success" : "status-warning"}`}>{

                  req.status === "Verified" ?
                  <ShieldCheck size={

                  14} /> :

                  <FileText size={

                  14} />}{

                  req.status}</span>}</td>}{



              <td>{
                req.date}</td>}{

              <td>{

                req.status === "Pending" ?
                <button className=


                "btn btn-primary btn-small" onClick={
                () => handleEvaluate(req)}>Evaluate</button> :



                <button className=



                "btn btn-secondary btn-small">View Record</button>}</td>}</tr>








            )}{
            requests.length === 0 &&
            <tr>{
              <td colSpan=


              "5" style={
              {
                textAlign: "center",
                padding: "32px"
              }} className=
              "text-muted">No verification requests found.</td>}</tr>}</tbody>}</table>}</div>}</div>}{











    <section className=
    "panel">{

      <div className=
      "panel-header">{
        <div>{

          <h2>Submitted Records</h2>}{


          <p className=
          "text-muted">Evaluations submitted during the current prototype session.</p>}</div>}</div>}{






      evaluations.length === 0 ?
      <div className=
      "empty-state">No submitted evaluations yet. Complete a pending request to populate this audit view.</div> :



      <div className=
      "record-list">{
        evaluations.map((evaluation) =>
        <div className=


        "record-item">{

          <ShieldCheck size={


          20} color=
          "#198754" />}{


          <div className=
          "record-main">{

            <div className=
            "record-title">{
              evaluation.employeeName}</div>}{

            <div className=


            "record-meta">{

              evaluation.employeeRole} • Submitted {

              evaluation.submittedAt}</div>}</div>}{





          <span className=
          "status-pill status-success">{
            evaluation.overallScore}/10</span>}</div>





        )}</div>}</section>}</div>;





};
//#endregion
export default CompanyEvaluations;
