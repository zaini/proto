import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Assignment, UserAssignmentSubmission } from "../../gql-types";

type Props = {
  assignment: Assignment;
  userAssignmentSubmissions: UserAssignmentSubmission[];
};

const AssignmentStatisticCharts = ({
  assignment,
  userAssignmentSubmissions,
}: Props) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    let problemStats = Object.fromEntries(
      assignment.problems.map((problem) => [
        `#${problem.id} ${problem.specification.title}`,
        {
          problem: `#${problem.id} ${problem.specification.title}`,
          attempts: 0,
          fails: 0,
          solves: 0,
          totalMarks: 0,
          avgMark: 0,
        },
      ])
    );

    userAssignmentSubmissions.forEach((userAssignmentSubmission) => {
      const assignmentSubmissions =
        userAssignmentSubmission.assignmentSubmissions;

      assignmentSubmissions.forEach((assignmentSubmission) => {
        const problem = assignmentSubmission.problem;
        const problemKey = `#${problem.id} ${problem.specification.title}`;
        if (assignmentSubmission.submission) {
          problemStats[problemKey].attempts += 1;
          problemStats[problemKey].fails += assignmentSubmission.submission
            .passed
            ? 0
            : 1;
          problemStats[problemKey].solves += assignmentSubmission.submission
            .passed
            ? 1
            : 0;
          problemStats[problemKey].totalMarks += assignmentSubmission.mark
            ? assignmentSubmission.mark
            : 0;
        }
      });
    });

    Object.entries(problemStats).map(([key, value]) => {
      problemStats[key] = {
        ...value,
        avgMark: value.totalMarks,
      };
    });

    setData(Object.values(problemStats));
  }, [userAssignmentSubmissions]);

  return (
    <>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="problem" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="attempts" fill="#3d9afc" />
        <Bar dataKey="fails" stackId="a" fill="#eb3939" />
        <Bar dataKey="solves" stackId="a" fill="#3cab73" />
      </BarChart>

      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="problem" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgMark" fill="#399fa1" />
      </BarChart>
    </>
  );
};

export default AssignmentStatisticCharts;
