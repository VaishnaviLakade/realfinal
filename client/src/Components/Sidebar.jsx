import React from "react";

const Sidebar = ({ setActive, active }) => {
  return (
    <div className="sidebar">
      <h3>Dashboard</h3>
      <ul>
        <li
          onClick={() => setActive("assignment")}
          className={active === "assignment" ? "active" : ""}
        >
          Assignment Marks
        </li>
        <li
          onClick={() => setActive("unitTest")}
          className={active === "unitTest" ? "active" : ""}
        >
          Unit Test Marks
        </li>
        <li
          onClick={() => setActive("attendance")}
          className={active === "attendance" ? "active" : ""}
        >
          Attendance Marks
        </li>
        <li
          onClick={() => setActive("termwork")}
          className={active === "termwork" ? "active" : ""}
        >
          Calculate Termwork
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
