import Chart from "chart.js";


import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import Accounting from "./Accounting";
import {isAdmin} from "../actions/authActions";
import Extracts from "./Extracts";

const Index = (props) => {

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  return (
    <>
      {/*<Header />*/}
      {isAdmin() ? (
        <Accounting />
      ) : (
        <Extracts />
      )}

    </>
  );
};

export default Index;
