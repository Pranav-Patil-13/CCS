import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Clock, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

const VerificationQueue = () => {
  const { requests } = useData();
  const navigate = useNavigate();
  const sortedRequests = [...requests].sort((a, b) => {
    const timeA = a.createdAt?.seconds ?
    a.createdAt.seconds * 1e3 + (a.createdAt.nanoseconds / 1e6 || 0) :
    a.createdAt ?
    new Date(a.createdAt).getTime() :
    new Date(a.date || 0).getTime() || 0;
    return (
      (b.createdAt?.seconds ?
      b.createdAt.seconds * 1e3 + (b.createdAt.nanoseconds / 1e6 || 0) :
      b.createdAt ?
      new Date(b.createdAt).getTime() :
      new Date(b.date || 0).getTime() || 0) - timeA);

  });
  const pending = sortedRequests.filter(
    (request) => request.status === "Pending"
  );
  const openEvaluation = (request) => {
    const params = new URLSearchParams({
      id: request.id,
      name: request.name,
      role: request.role,
      hrEmail: request.hrEmail
    });
    if (request.isAppeal) params.append("isAppeal", "true");
    if (request.appealReason)
    params.append("appealReason", request.appealReason);
    if (request.appealCount)
    params.append("appealCount", request.appealCount.toString());
    navigate(`/company/evaluate?${params.toString()}`);
  };
  return <div className=
  "page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>Verification Requests</h1>}{


        <p className=
        "text-muted">Review employment claims, validate role data, and complete manager assessments.</p>}</div>}{





      <div className=
      "page-actions">{

        <span className=
        "status-pill status-warning">{

          <Clock size={
          14} />} {


          pending.length} pending</span>}{



        <button className=
        "btn btn-secondary">Export Queue</button>}</div>}</div>}{






    <div className=
    "metric-grid">{

      <div className=
      "metric-card">{

        <div className=
        "metric-label">Open Requests</div>}{


        <div className=
        "metric-value">{
          pending.length}</div>}{

        <div className=
        "metric-note">Across HR and manager review</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Verified This Month</div>}{


        <div className=
        "metric-value">{
          requests.filter(
            (request) => request.status === "Verified"
          ).length}</div>}{

        <div className=
        "metric-note">Records added to CCS</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">SLA Health</div>}{


        <div className=
        "metric-value">94%</div>}{


        <div className=
        "metric-note">Requests handled within policy</div>}</div>}</div>}{






    <section className=
    "panel">{

      <div className=
      "panel-header">{
        <div>{

          <h2>Review Queue</h2>}{


          <p className=
          "text-muted">Prioritized by candidate timeline and request age.</p>}</div>}</div>}{






      <div className=
      "table-container">{
        <table className=
        "data-table">{

          <thead>{
            <tr>{

              <th>Candidate</th>}{


              <th>Company</th>}{


              <th>Role</th>}{


              <th>Stage</th>}{


              <th>Priority</th>}{


              <th>Action</th>}</tr>}</thead>}{





          <tbody>{
            sortedRequests.map((request) =>
            <tr>{



              <td>{

                <strong>{

                  request.name}</strong>}{

                <div className=


                "record-meta">{
                  request.date}</div>}{


                <div className=


                "record-meta text-muted" style={
                {
                  fontSize: "0.75rem",
                  marginTop: "2px"
                }}>{
                  <strong>To: {

                    request.hrEmail}</strong>}</div>}{



                request.status === "Verified" &&
                request.approvedBy &&
                <div className=


                "record-meta text-success" style={
                {
                  fontSize: "0.75rem",
                  marginTop: "2px"
                }}>Verified by: {


                  request.approvedBy.name} ({

                  request.approvedBy.email})</div>}</td>}{






              <td>{
                request.company}</td>}{

              <td>{
                request.role}</td>}{

              <td>{

                <span className={


                `status-pill ${request.status === "Verified" ? "status-success" : "status-info"}`}>{

                  request.status === "Verified" ?
                  <ShieldCheck size={

                  14} /> :

                  <ClipboardCheck size={


                  14} />}{

                  request.stage}</span>}{



                request.isAppeal &&
                <div className=


                "text-warning" style={
                {
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginTop: "6px"
                }}>Appeal (Attempt {


                  request.appealCount}/3)</div>}</td>}{






              <td>{
                request.priority}</td>}{

              <td>{

                request.status === "Pending" ?
                <button className=


                "btn btn-primary btn-small" onClick={
                () => openEvaluation(request)}>Evaluate</button> :



                <button className=


                "btn btn-secondary btn-small">View Record</button>}</td>}</tr>








            )}</tbody>}</table>}</div>}</section>}</div>;








};
//#endregion
export default VerificationQueue;
