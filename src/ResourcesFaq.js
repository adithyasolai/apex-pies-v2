import { Button } from "react-bootstrap";
import Collapsible from "react-collapsible";

const ResourcesFaq = () => {
  return (
    <div className="bg-primary vh-100 text-center" style={{paddingTop: "75px"}}>
      <h1> Resources/FAQs</h1>

      <br />

      <br />

      <Collapsible
        trigger={
          <Button 
            type="Submit" 
            variant="secondary" 
            size="lg"
          >
            Why is diversification important?
          </Button>
        }
        triggerClassName="collapsible"
        triggerOpenedClassName="collapsible"
      >
        <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
          <p className="display-4 fs-2 text-black" style={{ width: "100%" }}>
            Diversification is a technique that reduces risk by allocating
            investments among various financial instruments, industries and
            other categories. It aims to maximize return by investing in
            different areas that should each react differently to changes in
            market conditions.
          </p>
        </div>
      </Collapsible>

      <br />

      <Collapsible
        trigger={
          <Button 
            type="Submit" 
            variant="secondary" 
            size="lg"
          >
            What makes a stock risky?
          </Button>
        }
        triggerClassName="collapsible"
        triggerOpenedClassName="collapsible"
      >
        <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
          <p className="display-4 fs-2 text-black" style={{ width: "100%" }}>
            A stock is considered risky when it does not have a lot of earnings
            history. This is important because it proves to investors that the
            company has a history of generating cash for the business. Another
            aspect that makes a stock risky is the lack of time on the market.
            If the stock has recently gone public, it will be more volatile due
            to investors not knowing how the stock should be valued.
          </p>
        </div>
      </Collapsible>

      <br />

      <Collapsible
        trigger={
          <Button 
            type="Submit" 
            variant="secondary" 
            size="lg"
          >
            What is the S&P 500?
          </Button>
        }
        triggerClassName="collapsible"
        triggerOpenedClassName="collapsible"
      >
        <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
          <p className="display-4 fs-2 text-black" style={{ width: "100%" }}>
            The Standard and Poor's 500, or simply the S&P 500, is a stock
            market index tracking the performance of 500 large companies listed
            on stock exchanges in the United States. It is one of the most
            commonly followed equity indices.
          </p>
        </div>
      </Collapsible>
    </div>
  );
}

export default ResourcesFaq;
