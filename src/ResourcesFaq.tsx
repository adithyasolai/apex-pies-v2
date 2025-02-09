import React from "react";
import { Button, Container } from "react-bootstrap";
import Collapsible from "react-collapsible";

import faqPairsJson from "./resources/faqPairs.json";
import { CenteredDivResponsive } from "./VisualComponents/ApexCenteredDiv";

interface FaqPair {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqPair> = ({ question, answer }) => (
  <Collapsible
    trigger={
      <Button type="submit" variant="secondary" size="lg">
        {question}
      </Button>
    }
    triggerClassName="collapsible"
    triggerOpenedClassName="collapsible"
  >
    <p className="display-6 fs-5 pt-2">{answer}</p>
  </Collapsible>
);

export const ResourcesFaq: React.FC = () => {
  // import question & answer text from JSON file.
  const faqPairs: FaqPair[] = faqPairsJson["FAQ Pairs"];

  return (
    <Container
      fluid
      className="bg-primary vh-100 text-center navbar-padding-top-extra"
    >
      <CenteredDivResponsive rowClassName="bg-primary">
        <h1 className="pb-2"> Resources/FAQs</h1>

        {faqPairs.map((faqPair: FaqPair, index: number) => (
          <React.Fragment key={index}>
            <FaqItem {...faqPair} />
            {index < faqPairs.length - 1 && <br />}
          </React.Fragment>
        ))}
      </CenteredDivResponsive>
    </Container>
  );
};
