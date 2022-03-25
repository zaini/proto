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
import { Assignment, UserAssignmentSubmissionDataRow } from "../../gql-types";

type Props = {
  assignment: Assignment;
  userAssignmentSubmissionData: UserAssignmentSubmissionDataRow[];
};

const AssignmentStatisticCharts = ({
  assignment,
  userAssignmentSubmissionData,
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

    userAssignmentSubmissionData.forEach(({ userAssignmentSubmission }) => {
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
        avgMark: value.attempts
          ? parseFloat((value.totalMarks / value.attempts).toFixed(2))
          : 0,
      };
    });

    setData(Object.values(problemStats));
  }, [userAssignmentSubmissionData]);

  return (
    <>
      <BarChart
        width={650}
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
        <XAxis dataKey="problem" interval={0} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="attempts" fill="#3d9afc" />
        <Bar dataKey="fails" stackId="a" fill="#eb3939" />
        <Bar dataKey="solves" stackId="a" fill="#3cab73" />
      </BarChart>

      <BarChart
        width={650}
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
        <XAxis dataKey="problem" interval={0} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgMark" fill="#399fa1" />
      </BarChart>
    </>
  );
};

export default AssignmentStatisticCharts;
