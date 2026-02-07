"use client";

import CategoryLayout from "@/components/layout/CategoryLayout";
import { CATEGORY_META } from "@/lib/constants";
import ChartContainer from "@/components/charts/ChartContainer";
import AnalysisBlock from "@/components/charts/AnalysisBlock";
import MethodologyNote from "@/components/charts/MethodologyNote";
import CumulativeLandChart from "@/components/charts/land-use/CumulativeLandChart";
import PowerDensityChart from "@/components/charts/land-use/PowerDensityChart";
import type {
  DataEnvelope,
  CumulativeLandPoint,
  PowerDensityEntry,
} from "@/lib/data/types";

import cumulativeLandData from "../../../data/processed/land-use/cumulative-land.json";
import powerDensityData from "../../../data/processed/land-use/power-density.json";

const meta = CATEGORY_META["land-use"];

export default function LandUsePage() {
  const cumulativeLand = cumulativeLandData as DataEnvelope<CumulativeLandPoint[]>;
  const powerDensity = powerDensityData as DataEnvelope<PowerDensityEntry[]>;

  return (
    <CategoryLayout title={meta.title} description={meta.description}>
      <div className="space-y-16">
        {/* L2: Cumulative Land Committed */}
        <ChartContainer
          id="cumulative-land"
          title="Cumulative Land Committed to Energy Infrastructure"
          source={cumulativeLand.source}
          chartAriaLabel="Stacked area chart showing cumulative land committed to energy infrastructure by source from 2000 to 2024, measured in thousand acres."
          analysisContent={
            <AnalysisBlock>
              <p>
                Every energy source requires land. The cumulative footprint of
                U.S. energy infrastructure has grown steadily, driven primarily
                by the expansion of wind and solar capacity. Hydroelectric
                reservoirs remain the single largest land commitment, reflecting
                decades of dam construction, though no significant new
                hydroelectric capacity has been added recently.
              </p>
              <p>
                Wind and solar land commitments have grown rapidly since 2010,
                reflecting their increasing share of new capacity additions.
                However, the comparison involves important nuances: wind farms
                allow agricultural co-use on the vast majority of their leased
                area (typically only 1-3% of the total lease area is physically
                occupied by turbines and roads), while solar installations
                generally preclude other ground-level uses during operation.
              </p>
              <p>
                Coal land commitments have declined slightly as plants retire,
                though site remediation timelines mean land is not immediately
                returned to other uses. Natural gas plant footprints continue to
                grow modestly with new combined-cycle construction. Nuclear
                plants occupy relatively little land given their output, but
                these figures exclude uranium mining and enrichment facilities.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Land use estimates are derived from NREL&apos;s published
                per-megawatt land use factors applied to EIA capacity data.
                Total land area (not just direct footprint) is used for
                consistency across technologies.
              </p>
              <p>
                For wind, &ldquo;total area&rdquo; includes the full lease
                boundary, most of which remains available for agriculture or
                other uses. For hydro, reservoir surface area is included.
                These methodological choices mean raw acreage comparisons
                across technologies should be interpreted with caution.
              </p>
              <p>
                Rooftop solar is excluded because it does not consume additional
                ground area. Fuel extraction land (coal mines, gas wells,
                uranium mines) is excluded for all technologies to maintain
                comparability at the generation-facility level.
              </p>
            </MethodologyNote>
          }
        >
          <CumulativeLandChart data={cumulativeLand.data} />
        </ChartContainer>

        {/* L3: Power Density */}
        <ChartContainer
          id="power-density"
          title="Power Density by Generation Technology"
          source={powerDensity.source}
          chartAriaLabel="Horizontal bar chart comparing power density in watts per square meter across eight generation technologies, with error bars showing the range of estimates."
          analysisContent={
            <AnalysisBlock>
              <p>
                Power density measures how much electricity a technology
                generates per unit of land area, providing a normalized way to
                compare land efficiency across generation types. Higher values
                mean more power from less land.
              </p>
              <p>
                Nuclear and natural gas combined-cycle plants have the highest
                power densities, generating hundreds of watts per square meter
                of plant footprint. Coal plants are somewhat lower due to larger
                fuel handling and ash storage requirements. These thermal plants
                concentrate energy production in compact facilities.
              </p>
              <p>
                Wind and solar have significantly lower power densities,
                reflecting the diffuse nature of the energy resources they
                harvest. This is a real trade-off in siting decisions,
                particularly in regions where land availability or competing
                uses (agriculture, habitat) constrain development. However,
                power density alone does not capture the full picture: wind
                allows land co-use, solar can be deployed on marginal land, and
                neither technology requires fuel extraction land.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Power density is calculated as average annual generation (in
                watts) divided by total land area (in square meters). Median
                values represent the central estimate from NREL&apos;s survey
                of U.S. installations; ranges reflect site-to-site variation
                driven by capacity factor, technology vintage, and layout.
              </p>
              <p>
                Wind power density uses total lease area. If only the direct
                footprint (turbine pads, roads, substations) were used, wind
                power density would be roughly 10-50x higher. This
                methodological choice significantly affects the comparison.
              </p>
              <p>
                Hydroelectric power density varies enormously depending on
                whether a facility uses a large reservoir or a run-of-river
                design. The wide range reflects this variation across the U.S.
                hydro fleet.
              </p>
            </MethodologyNote>
          }
        >
          <PowerDensityChart data={powerDensity.data} />
        </ChartContainer>
      </div>
    </CategoryLayout>
  );
}
