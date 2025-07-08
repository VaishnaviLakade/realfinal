import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AssignmentMarks from "./AssignmentMarks";
import UnitTestMarks from "./AssignmentMarks";
import AttendanceMarks from "./AttendanceMarks";
import TermWorkMarks from "./TermWorkMarks";

const DashboardLayout = () => {
  const [active, setActive] = useState("assignment");

  const renderComponent = () => {
    switch (active) {
      case "assignment":
        return <AssignmentMarks />;
      case "unitTest":
        return <UnitTestMarks />;
      case "attendance":
        return <AttendanceMarks />;
      case "termwork":
        return <TermWorkMarks />;
      default:
        return <AssignmentMarks />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar setActive={setActive} active={active} />
      <div className="content-area">{renderComponent()}</div>
    </div>
  );
};

export default DashboardLayout;
