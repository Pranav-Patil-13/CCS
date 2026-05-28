import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';
import './CompanyOverview.css';

const CompanyOverview = () => {
  const { employees, requests, candidateProfiles, activity } = useData();
  const navigate = useNavigate();
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const verifiedEmployees = employees.filter(
    (employee) => employee.status === "Verified"
  ).length;
  return <div className=
  "company-overview page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>Company Dashboard</h1>}{


        <p className=
        "text-muted">Operational view of verification activity, candidate access, and employee credibility records.</p>}</div>}{





      <div className=
      "page-actions">{

        <button className=
        "btn btn-secondary" onClick={
        () => navigate("/company/candidates")}>Review Candidates</button>}{


        <button className=
        "btn btn-primary" onClick={
        () => navigate("/company/requests")}>Open Queue {


          <ArrowRight size={
          16} />}</button>}</div>}</div>}{







    <div className=
    "metric-grid">{

      <div className=
      "metric-card">{

        <div className=
        "metric-label">Employee Records</div>}{


        <div className=
        "metric-value">{
          employees.length}</div>}{

        <div className=
        "metric-note">{
          verifiedEmployees} verified in network</div>}</div>}{



      <div className=
      "metric-card">{

        <div className=
        "metric-label">Pending Verifications</div>}{


        <div className=
        "metric-value">{
          pendingRequests}</div>}{

        <div className=
        "metric-note">Requires HR or manager action</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Shared Candidate Profiles</div>}{


        <div className=
        "metric-value">{
          candidateProfiles.length}</div>}{

        <div className=
        "metric-note">Permissioned access records</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Avg Credibility Score</div>}{


        <div className=
        "metric-value">8.4{


          <span className=
          "stat-suffix">/10</span>}</div>}{




        <div className=
        "metric-note">Company verified average</div>}</div>}</div>}{






    <div className=
    "dashboard-grid">{

      <section className=
      "panel">{

        <div className=
        "panel-header">{

          <div>{

            <h2>Priority Verification Queue</h2>}{


            <p className=
            "text-muted">Requests that need action before profiles can be updated.</p>}</div>}{





          <button className=
          "btn btn-secondary btn-small" onClick={
          () => navigate("/company/requests")}>View All</button>}</div>}{




        <div className=
        "table-container">{
          <table className=


          "data-table">{

            <thead>{
              <tr>{



                <th>Employee</th>}{



                <th>Role</th>}{



                <th>Stage</th>}{



                <th>Status</th>}{



                <th>Action</th>}</tr>}</thead>}{







            <tbody>{
              requests.slice(0, 4).map((req) =>
              <tr>{



                <td>{



                  <strong>{

                    req.name}</strong>}{

                  <div className=

                  "record-meta">{
                    req.company}</div>}{

                  <div className=

                  "record-meta text-muted" style={
                  {
                    fontSize: "0.75rem",
                    marginTop: "2px"
                  }}>{

                    <strong>To:</strong>} {




                    req.hrEmail}</div>}{


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

                  req.stage}</td>}{

                <td>{


                  <span className={

                  `status-pill ${req.status === "Verified" ? "status-success" : "status-warning"}`}>{

                    req.status === "Verified" ?
                    <ShieldCheck size={


                    14} /> :

                    <Clock size={

                    14} />}{

                    req.status}</span>}</td>}{




                <td>{


                  <button className=

                  "btn btn-secondary btn-small" onClick={
                  () =>
                  navigate("/company/requests")}>{

                    req.status === "Pending" ?
                    "Review" :
                    "Open"}</button>}</td>}</tr>







              )}</tbody>}</table>}</div>}</section>}{







      <aside className=
      "panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Live Activity</h2>}{


            <p className=
            "text-muted">Recent CCS workspace events.</p>}</div>}</div>}{





        <div className=
        "activity-list">{
          activity.map((item) =>
          <div className=


          "activity-item">{

            <span className=
            "activity-dot" />}{

            <div>{

              <div className=
              "record-title">{
                item.title}</div>}{

              <div className=
              "record-meta">{
                item.time}</div>}</div>}</div>







          )}</div>}</aside>}</div>}{





    <section className=
    "panel">{

      <div className=
      "panel-header">{
        <div>{

          <h2>Employee Network Health</h2>}{


          <p className=
          "text-muted">Snapshot of employee coverage and credibility state.</p>}</div>}</div>}{






      <div className=
      "table-container">{
        <table className=
        "data-table">{

          <thead>{
            <tr>{

              <th>Employee</th>}{


              <th>Role</th>}{


              <th>Department</th>}{


              <th>Score</th>}{


              <th>Status</th>}{


              <th>Risk</th>}</tr>}</thead>}{





          <tbody>{
            employees.map((employee) =>
            <tr>{



              <td>{

                <strong>{

                  employee.name}</strong>}{

                <div className=


                "record-meta">{
                  employee.email}</div>}</td>}{




              <td>{
                employee.role}</td>}{

              <td>{
                employee.department}</td>}{

              <td>{
                employee.score ?
                `${employee.score}/10` :
                "Pending"}</td>}{

              <td>{
                <span className={

                `status-pill ${employee.status === "Verified" ? "status-success" : "status-warning"}`}>{

                  <Users size={

                  14} />}{

                  employee.status}</span>}</td>}{



              <td>{
                employee.risk}</td>}</tr>





            )}</tbody>}</table>}</div>}</section>}</div>;








};
//#endregion
export default CompanyOverview;
