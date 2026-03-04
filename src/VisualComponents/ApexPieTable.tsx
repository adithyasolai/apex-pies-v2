import React from "react";
import clsx from "clsx";
import { CenteredDivResponsive } from "./ApexCenteredDiv";

export interface ApexPieTableProps {
  tableRows: Array<any>;
}

const tableHeadings = ["Sector", "Name", "Ticker", "%"];

export const ApexPieTable: React.FC<ApexPieTableProps> = ({ tableRows }) => {
  return (
    <CenteredDivResponsive rowClassName="bg-cream">
      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {tableHeadings.map((heading, index) => (
              <th
                key={index}
                className="border border-gray-300 px-3 py-2 text-left font-semibold"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={clsx(
                rowIndex % 2 === 0 ? "bg-cream" : "bg-white",
                "hover:bg-sky/20 transition-colors"
              )}
            >
              {Object.keys(row).map((key, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className="border border-gray-300 px-3 py-2"
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CenteredDivResponsive>
  );
};
