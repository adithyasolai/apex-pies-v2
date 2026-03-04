import React, { useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

import faqPairsJson from "./resources/faqPairs.json";
import { CenteredDivResponsive } from "./VisualComponents/ApexCenteredDiv";

interface FaqPair {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqPair> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-3 bg-sky text-white rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
      >
        <span>{question}</span>
        <ChevronDown
          className={clsx(
            "transition-transform duration-200 shrink-0",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="pt-2 text-base text-gray-800 px-2">{answer}</p>
      )}
    </div>
  );
};

export const ResourcesFaq: React.FC = () => {
  const faqPairs: FaqPair[] = faqPairsJson["FAQ Pairs"];

  return (
    <div className="w-full min-h-screen bg-cream text-center pt-navbar-extra">
      <CenteredDivResponsive rowClassName="bg-cream">
        <h1 className="pb-2">Resources/FAQs</h1>

        {faqPairs.map((faqPair: FaqPair, index: number) => (
          <React.Fragment key={index}>
            <FaqItem {...faqPair} />
            {index < faqPairs.length - 1 && <br />}
          </React.Fragment>
        ))}
      </CenteredDivResponsive>
    </div>
  );
};
