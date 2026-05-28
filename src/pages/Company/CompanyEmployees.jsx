import { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import './CompanyEmployees.css';

const CompanyEmployees = () => {
  const { employees, addEmployee } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const handleAddEmployee = (e) => {
    e.preventDefault();
    addEmployee({
      name: e.target.name.value,
      email: e.target.email.value,
      role: e.target.role.value,
      department: e.target.department.value
    });
    setShowAddModal(false);
  };
  return <div className=
  "company-employees page-shell">{

    <div className=
    "page-header">{

      <div>{

        <h1>Employees</h1>}{


        <p className=
        "text-muted">Manage the organization network, invitations, and verified employee records.</p>}</div>}{





      <button className=
      "btn btn-primary" onClick={
      () => setShowAddModal(true)}>{

        <Plus size={16} />} Add Employee</button>}</div>}{





    <div className=
    "metric-grid">{

      <div className=
      "metric-card">{

        <div className=
        "metric-label">Total Employees</div>}{


        <div className=
        "metric-value">{
          employees.length}</div>}{

        <div className=
        "metric-note">In workspace registry</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Verified Records</div>}{


        <div className=
        "metric-value">{
          employees.filter(
            (employee) => employee.status === "Verified"
          ).length}</div>}{

        <div className=
        "metric-note">Source-confirmed profiles</div>}</div>}{




      <div className=
      "metric-card">{

        <div className=
        "metric-label">Pending Invites</div>}{


        <div className=
        "metric-value">{
          employees.filter(
            (employee) => employee.status === "Pending"
          ).length}</div>}{

        <div className=
        "metric-note">Awaiting confirmation</div>}</div>}</div>}{






    <div className=
    "panel">{

      <div className=
      "panel-header">{
        <div>{

          <h2>Employee Registry</h2>}{


          <p className=
          "text-muted">Mock registry prepared for future backend integration.</p>}</div>}</div>}{






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


              <th>Joined</th>}{


              <th>Action</th>}</tr>}</thead>}{





          <tbody>{
            employees.map((emp) =>
            <tr>{



              <td>{

                <div>{


                  <strong>{

                    emp.name}</strong>}</div>}{



                <div className=


                "text-muted" style={
                { fontSize: "0.75rem" }}>{
                  emp.email}</div>}</td>}{




              <td>{
                emp.role}</td>}{

              <td>{
                emp.department}</td>}{

              <td>{
                emp.score ? `${emp.score}/10` : "Pending"}</td>}{

              <td>{
                <span className={

                `status-pill ${emp.status === "Verified" ? "status-success" : "status-warning"}`}>{
                  emp.status}</span>}</td>}{


              <td>{
                emp.date}</td>}{

              <td>{
                <button className=

                "btn btn-secondary btn-small">View Profile</button>}</td>}</tr>







            )}</tbody>}</table>}</div>}</div>}{






    showAddModal &&
    <div className=
    "modal-overlay">{
      <div className=
      "modal-content">{

        <div className=
        "modal-header">{

          <h2>Invite Employee</h2>}{


          <button className=
          "btn-close" onClick={
          () => setShowAddModal(false)}>×</button>}</div>}{




        <form onSubmit={
        handleAddEmployee} className=
        "modal-body">{

          <div className=
          "form-group" style={
          { marginBottom: "16px" }}>{

            <label>Full Name</label>}{


            <input type=
            "text" name=
            "name" className=
            "form-input" required={
            true} />}</div>}{



          <div className=
          "form-group" style={
          { marginBottom: "16px" }}>{

            <label>Email Address</label>}{


            <input type=
            "email" name=
            "email" className=
            "form-input" required={
            true} />}</div>}{



          <div className=
          "form-group" style={
          { marginBottom: "24px" }}>{

            <label>Job Role</label>}{


            <input type=
            "text" name=
            "role" className=
            "form-input" required={
            true} />}</div>}{



          <div className=
          "form-group" style={
          { marginBottom: "24px" }}>{

            <label>Department</label>}{


            <input type=
            "text" name=
            "department" className=
            "form-input" placeholder=
            "Engineering" required={
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
            () => setShowAddModal(false)}>Cancel</button>}{


            <button type=
            "submit" className=
            "btn btn-primary">{

              <UserPlus size={

              16} />} Send Invite</button>}</div>}</form>}</div>}</div>}</div>;













};
//#endregion
export default CompanyEmployees;
