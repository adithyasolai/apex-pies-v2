import React from "react";
import { Col, Row, Table } from "react-bootstrap";

export interface ApexPieTableProps {
  tableRows: Array<any>;
}

const tableHeadings = ["Sector", "Name", "Ticker", "%"];

export const ApexPieTable: React.FC<ApexPieTableProps> = ({ tableRows }) => {
  return (
    <Row className="bg-primary">
      {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
      <Col />
      <Col xs={12} md={6}>
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
      </Col>
      <Col />
    </Row>
  );
};
