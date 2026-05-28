import { Eye, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PublicProfile from '../Public/PublicProfile';

const CandidateProfiles = () => {
  const { candidateProfiles } = useData();
  const [selectedShareId, setSelectedShareId] = useState(
    null
  );
  if (selectedShareId)
  return <div className=
  "page-shell">{

    <button className=
    "btn btn-secondary" onClick={
    () => setSelectedShareId(null)} style={
    { alignSelf: "flex-start" }}>{

      <ArrowLeft size={
      16} />}{

      <span>Back to Candidates</span>}</button>}{




    <PublicProfile shareId={
    selectedShareId} embedded={
    true} />}</div>;



  return <div className=
  "page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>Shared Candidate Profiles</h1>}{


        <p className=
        "text-muted">Permissioned credibility profiles shared with your hiring team.</p>}</div>}{





      <div className=
      "page-actions">{

        <button className=
        "btn btn-secondary">Invite Candidate</button>}{


        <button className=
        "btn btn-primary">Request Access</button>}</div>}</div>}{






    <div className=
    "dashboard-grid">{

      <section className=
      "panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Candidate Access</h2>}{


            <p className=
            "text-muted">Access is controlled by employee consent and expiry rules.</p>}</div>}</div>}{






        <div className=
        "table-container">{
          <table className=


          "data-table">{

            <thead>{
              <tr>{



                <th>Candidate</th>}{



                <th>Score</th>}{



                <th>Status</th>}{



                <th>Expires</th>}{



                <th>Flags</th>}{



                <th>Action</th>}</tr>}</thead>}{







            <tbody>{
              candidateProfiles.map((candidate) =>
              <tr>{



                <td>{



                  <strong>{

                    candidate.name}</strong>}{

                  <div className=

                  "record-meta">{
                    candidate.role}</div>}</td>}{




                <td>{

                  candidate.score}/10</td>}{

                <td>{


                  <span className={

                  `status-pill ${candidate.status === "Access granted" ? "status-success" : "status-warning"}`}>{

                    candidate.status === "Access granted" ?
                    <ShieldCheck size={


                    14} /> :

                    <LockKeyhole size={


                    14} />}{

                    candidate.status}</span>}</td>}{




                <td>{

                  candidate.expires}</td>}{

                <td>{

                  candidate.flags}</td>}{

                <td>{


                  <button className=

                  "btn btn-secondary btn-small" onClick={
                  () => {
                    if (candidate.shareLinkId)
                    setSelectedShareId(
                      candidate.shareLinkId
                    );else

                    alert(
                      "This candidate's profile access link is not available."
                    );
                  }}>{

                    <Eye size={

                    14} />} Open</button>}</td>}</tr>










              )}</tbody>}</table>}</div>}</section>}{







      <aside className=
      "panel">{

        <div className=
        "panel-header">{
          <div>{

            <h2>Access Policy</h2>}{


            <p className=
            "text-muted">Default controls for candidate profile reviews.</p>}</div>}</div>}{






        <div className=
        "record-list">{

          <div className=
          "record-item">{
            <div className=


            "record-main">{

              <div className=
              "record-title">Candidate consent required</div>}{


              <div className=
              "record-meta">Profiles cannot be opened until the candidate grants access.</div>}</div>}</div>}{







          <div className=
          "record-item">{
            <div className=


            "record-main">{

              <div className=
              "record-title">30 day default expiry</div>}{


              <div className=
              "record-meta">Hiring teams lose access automatically after the review window.</div>}</div>}</div>}{







          <div className=
          "record-item">{
            <div className=


            "record-main">{

              <div className=
              "record-title">Audit trail enabled</div>}{


              <div className=
              "record-meta">Candidate profile views are tracked for compliance.</div>}</div>}</div>}</div>}</aside>}</div>}</div>;















};
//#endregion
export default CandidateProfiles;
