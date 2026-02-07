import Link from "next/link";

export default function MethodologyPage() {
  return (
    <article className="max-w-3xl py-8 space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Methodology & Data Sources
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Transparency is foundational to this project. This page documents our
          data sourcing standards, editorial principles, and the specific
          government datasets that underpin every chart on this site.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Data Sourcing Standards
        </h2>
        <ul className="space-y-3 text-sm text-muted leading-relaxed list-disc ml-5">
          <li>
            <strong className="text-foreground">Government primary sources only.</strong>{" "}
            Every data point comes from U.S. federal government agencies: the
            Energy Information Administration (EIA), Environmental Protection
            Agency (EPA), North American Electric Reliability Corporation
            (NERC), Department of Energy (DOE), and Bureau of Labor Statistics
            (BLS).
          </li>
          <li>
            <strong className="text-foreground">No industry or advocacy data.</strong>{" "}
            We do not use data from utilities, trade associations, advocacy
            organizations, or think tanks, even credible ones. Where private
            estimates exist (such as Lazard LCOE or BloombergNEF), we note
            their existence in methodology sections but do not chart them.
          </li>
          <li>
            <strong className="text-foreground">Projections are clearly labeled.</strong>{" "}
            Any data that represents a forecast, projection, or estimate
            (as opposed to measured historical values) is explicitly labeled
            as such in both the chart and the analysis text.
          </li>
          <li>
            <strong className="text-foreground">Known limitations are disclosed.</strong>{" "}
            Every chart includes a methodology note documenting data quality
            issues, coverage limitations, and changes in reporting methodology
            that may affect interpretation.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Editorial Principles
        </h2>
        <ol className="space-y-3 text-sm text-muted leading-relaxed list-decimal ml-5">
          <li>
            <strong className="text-foreground">Show data, not conclusions.</strong>{" "}
            Analysis text explains what the data shows and provides context.
            We do not advocate for specific policies or regulatory approaches.
          </li>
          <li>
            <strong className="text-foreground">Present multiple interpretations.</strong>{" "}
            Where reasonable people can draw different conclusions from the
            same data, we acknowledge both perspectives.
          </li>
          <li>
            <strong className="text-foreground">Use neutral language.</strong>{" "}
            We use &ldquo;generation sources&rdquo; rather than
            &ldquo;clean/dirty energy,&rdquo; &ldquo;variable renewable&rdquo;
            rather than &ldquo;intermittent,&rdquo; and similar neutral
            framing throughout.
          </li>
          <li>
            <strong className="text-foreground">Contextualize without attributing single causes.</strong>{" "}
            Energy system changes are multi-causal. We describe contributing
            factors without implying that any single factor is solely
            responsible for observed trends.
          </li>
          <li>
            <strong className="text-foreground">Include countervailing data.</strong>{" "}
            When presenting a positive trend, we note relevant trade-offs or
            countervailing considerations. Honest analysis requires
            acknowledging complexity.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Primary Data Sources
        </h2>
        <div className="space-y-4">
          {[
            {
              agency: "Energy Information Administration (EIA)",
              datasets: [
                "Monthly Energy Review (generation by source)",
                "Electric Power Monthly (retail prices, state prices)",
                "Form EIA-860 (capacity additions & retirements)",
                "Form EIA-861 (distribution reliability SAIDI/SAIFI)",
                "CO2 Emissions from Energy Consumption",
                "Henry Hub Natural Gas Spot Price",
                "Annual Energy Outlook (LCOE, demand projections)",
              ],
              url: "https://www.eia.gov",
            },
            {
              agency: "Environmental Protection Agency (EPA)",
              datasets: [
                "eGRID (regional generation mix, emissions intensity)",
                "Clean Air Markets Program Data - CAMPD (SO2, NOx)",
                "Greenhouse Gas Inventory (CO2 verification)",
              ],
              url: "https://www.epa.gov",
            },
            {
              agency: "North American Electric Reliability Corporation (NERC)",
              datasets: [
                "Long-Term Reliability Assessment (reserve margins)",
              ],
              url: "https://www.nerc.com",
            },
            {
              agency: "Department of Energy (DOE)",
              datasets: [
                "OE-417 Electric Disturbance Events",
              ],
              url: "https://www.energy.gov",
            },
            {
              agency: "National Renewable Energy Laboratory (NREL)",
              datasets: [
                "Land-Use Requirements for Solar Power Plants in the United States",
                "Wind Energy Land Use Synthesis",
                "Land Use by Electricity Generation Technology",
              ],
              url: "https://www.nrel.gov",
            },
            {
              agency: "Bureau of Labor Statistics (BLS)",
              datasets: [
                "Consumer Price Index (CPI-U, inflation adjustment)",
                "Consumer Expenditure Survey (household spending shares)",
              ],
              url: "https://www.bls.gov",
            },
          ].map((source) => (
            <div
              key={source.agency}
              className="rounded-lg border border-border bg-white p-4"
            >
              <h3 className="font-semibold text-foreground text-sm">
                {source.agency}
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-muted list-disc ml-4">
                {source.datasets.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Citation Format
        </h2>
        <div className="rounded-lg border border-border bg-card-bg p-4 text-sm font-mono text-muted">
          <p>Source: [Agency], [Dataset/Form] ([Year]).</p>
          <p>URL: [link]. Accessed: [date].</p>
        </div>
        <p className="mt-3 text-sm text-muted">
          Every chart on this site includes a source citation following this
          format, linking directly to the dataset used.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Chart Design Decisions
        </h2>
        <ul className="space-y-3 text-sm text-muted leading-relaxed list-disc ml-5">
          <li>
            <strong className="text-foreground">Colorblind-safe palette.</strong>{" "}
            All charts use an Okabe-Ito derived color palette designed to be
            distinguishable under protanopia, deuteranopia, and tritanopia.
          </li>
          <li>
            <strong className="text-foreground">Consistent axis ranges.</strong>{" "}
            Y-axes start at zero unless there is a specific analytical reason
            not to (documented in the methodology note).
          </li>
          <li>
            <strong className="text-foreground">Interactive tooltips.</strong>{" "}
            Hovering over data points reveals exact values, reducing the need
            to estimate from axis positions.
          </li>
          <li>
            <strong className="text-foreground">Export capability.</strong>{" "}
            Chart data can be downloaded as CSV for use in
            presentations, reports, or further analysis.
          </li>
        </ul>
      </section>

      <section className="border-t border-border pt-8">
        <p className="text-sm text-muted">
          Questions about our methodology or data sources?{" "}
          Each chart&apos;s expandable &ldquo;Methodology & Data Notes&rdquo;
          section provides chart-specific documentation. For broader questions,
          explore the category pages:{" "}
          <Link href="/reliability" className="text-accent hover:underline">
            Reliability
          </Link>
          ,{" "}
          <Link href="/affordability" className="text-accent hover:underline">
            Affordability
          </Link>
          ,{" "}
          <Link href="/generation-mix" className="text-accent hover:underline">
            Generation Mix
          </Link>
          ,{" "}
          <Link href="/environmental" className="text-accent hover:underline">
            Environmental
          </Link>
          ,{" "}
          <Link href="/market-trends" className="text-accent hover:underline">
            Market Trends
          </Link>
          ,{" "}
          <Link href="/land-use" className="text-accent hover:underline">
            Land Use
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
