import React from 'react';

import "../css/QuizTables.css";
// creating a mapper from column names to the actual quiz object fields from db, this can allow us to access e.g. quiz.title
// but with more user firendly column names e.g. quiz title or Quiz Title etc.
const defaultColumnMapper = {
  'title': 'title',
  'creator': 'createdBy.username', // use createdBy.username if populated, check if deleted username works.
  'status': 'status',
  'play count': 'stats.playCount',
  'average score': 'stats.averageScore',
};

function QuizTable({ quizzes = [], columns = [], actionComponents = [] }) {
  return (
    <div className = "tableContainer">
      <table className = "quizTable">
        <thead>
          <tr >{/* adding in the column heading's text from the columns array, also adding in keys to help react render it faster */}
            {columns.map((col, idx) => (
              <th key={`col-${idx}`}  scope="col">{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {quizzes.map((quiz) => (

            <tr key={quiz._id}>
              {columns.map((colName, colIdx) => {
                // creating a row + column key per cell to make react render it faster if one of the cell changes.
                const key = `row-${quiz._id}-col-${colIdx}`;
                const renderCell = actionComponents[colIdx];

                if (typeof renderCell === 'function') {// sometimes I want to pass in buttons or other components into cells
                  // instead of plain text, so this allow's us to render them inside the cell itself.
                  return <td className = "action" key={key}>{renderCell(quiz)}</td>;
                }

                // Map column name to quiz field key (so we can access the quiz object's fields without using exact names e.g. quiz.title)
                // (bad for user interface if we used quiz.title instead of 'Quiz Title')
                const propertyPath = defaultColumnMapper[colName.toLowerCase()] || colName.toLowerCase().replace(/\s+/g, '');
                
                // Helper to safely access nested values
                const getNested = (obj, path) =>
                  path.split('.').reduce((acc, part) => acc && acc[part], obj);

                let value = getNested(quiz, propertyPath);
                if (colName.toLowerCase() === 'creator') {
                  // Fallback if username missing or falsy (e.g. deleted user)
                  value = value || 'deleted user';
                }
                value = value ?? '';
                return <td  key={key}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuizTable;
