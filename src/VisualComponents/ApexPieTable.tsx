import React from "react";
import { Table } from "react-bootstrap";
import { CenteredDivResponsive } from "./ApexCenteredDiv";

export interface ApexPieTableProps {
  tableRows: Array<any>;
}

const tableHeadings = ["Sector", "Name", "Ticker", "%"];

export const ApexPieTable: React.FC<ApexPieTableProps> = ({ tableRows }) => {
  return (
    <CenteredDivResponsive rowClassName="bg-primary">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {tableHeadings.map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(row).map((key, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </CenteredDivResponsive>
  );
};
