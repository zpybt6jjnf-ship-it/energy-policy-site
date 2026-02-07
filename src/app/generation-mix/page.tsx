"use client";

import CategoryLayout from "@/components/layout/CategoryLayout";
import { CATEGORY_META } from "@/lib/constants";
import ChartContainer from "@/components/charts/ChartContainer";
import AnalysisBlock from "@/components/charts/AnalysisBlock";
import MethodologyNote from "@/components/charts/MethodologyNote";
import GenerationBySourceChart from "@/components/charts/generation-mix/GenerationBySourceChart";
import CapacityChangesChart from "@/components/charts/generation-mix/CapacityChangesChart";
import RegionalMixChart from "@/components/charts/generation-mix/RegionalMixChart";
import type {
  DataEnvelope,
  GenerationBySourcePoint,
  CapacityChangeEntry,
  RegionalMixEntry,
} from "@/lib/data/types";

import generationData from "../../../data/processed/generation-mix/generation-by-source.json";
import capacityData from "../../../data/processed/generation-mix/capacity-changes.json";
import regionalData from "../../../data/processed/generation-mix/regional-mix.json";

const meta = CATEGORY_META["generation-mix"];

export default function GenerationMixPage() {
  const generation = generationData as DataEnvelope<GenerationBySourcePoint[]>;
  const capacity = capacityData as DataEnvelope<CapacityChangeEntry[]>;
  const regional = regionalData as DataEnvelope<RegionalMixEntry[]>;

  return (
    <CategoryLayout
      title={meta.title}
      description={meta.description}
      chartLinks={[
        { id: "generation-by-source", label: "Generation by Source" },
        { id: "capacity-changes", label: "Capacity Changes" },
        { id: "regional-mix", label: "Regional Mix" },
      ]}
    >
      <div className="space-y-16">
        {/* G1: Generation by Source */}
        <ChartContainer
          id="generation-by-source"
          title="U.S. Electricity Generation by Source"
          source={generation.source}
          chartAriaLabel="Stacked area chart showing U.S. electricity generation by fuel source from 1990 to 2024, measured in terawatt-hours."
          analysisContent={
            <AnalysisBlock>
              <p>
                The U.S. electricity generation mix has undergone a fundamental
                transformation since 1990. Coal&apos;s share has fallen from
                roughly half of total generation to approximately 15%, displaced
                primarily by natural gas and, increasingly, by wind and solar.
                Natural gas surpassed coal as the leading generation source
                around 2016.
              </p>
              <p>
                Nuclear generation has remained relatively stable, providing
                around 775-810 TWh annually. Hydroelectric output fluctuates
                with water availability. Wind and solar have grown from
                negligible shares to a combined 24% of total generation in 2024,
                with solar growth accelerating rapidly in recent years.
              </p>
              <p>
                Total generation has grown modestly over this period, reflecting
                population growth offset by energy efficiency gains. The
                composition change has been far more dramatic than the total
                output change, a pattern driven by both market forces (low
                natural gas prices, declining renewable costs) and policy
                (emissions regulations, renewable portfolio standards, tax
                incentives).
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Generation data from EIA Monthly Energy Review, Table 7.2a,
                reporting net generation (gross generation minus station use)
                by energy source. Values are annual totals in terawatt-hours
                (TWh).
              </p>
              <p>
                &ldquo;Solar&rdquo; includes both utility-scale and estimated
                small-scale (rooftop) generation where reported. Small-scale
                solar estimation methodology has improved over time, which may
                affect apparent growth trends.
              </p>
              <p>
                &ldquo;Other&rdquo; includes biomass (wood, waste),
                geothermal, and other minor sources. Petroleum includes
                petroleum liquids and petroleum coke used in electricity
                generation.
              </p>
            </MethodologyNote>
          }
        >
          <GenerationBySourceChart data={generation.data} />
        </ChartContainer>

        {/* G2: Capacity Changes */}
        <ChartContainer
          id="capacity-changes"
          title="Capacity Additions & Retirements by Fuel"
          source={capacity.source}
          chartAriaLabel="Diverging bar chart showing nameplate capacity additions above the zero line and retirements below the zero line, by fuel type, from 2002 to 2024."
          analysisContent={
            <AnalysisBlock>
              <p>
                The pattern of capacity investment tells the forward-looking
                story of the energy transition. Natural gas dominated new
                capacity additions in the early 2000s, while coal additions
                effectively ceased after 2014. Wind installations accelerated
                through the 2010s, and solar capacity additions have grown
                explosively, becoming the dominant source of new capacity in
                recent years.
              </p>
              <p>
                On the retirement side, coal plant closures have been the
                dominant feature, with major waves of retirements in 2012, 2015,
                and 2018. These retirements reflect both economic factors (coal
                plants becoming uncompetitive against gas and renewables) and
                regulatory drivers (environmental compliance costs).
              </p>
              <p>
                Battery storage, captured in &ldquo;Other,&rdquo; has emerged
                as a significant and rapidly growing category of capacity
                additions since 2020. The ratio of nameplate capacity to
                actual energy delivered differs significantly across
                technologies due to capacity factor differences.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Data from EIA Form 860, which reports annual capacity additions
                and retirements by generator. Values represent nameplate
                capacity in gigawatts (GW).
              </p>
              <p>
                Nameplate capacity reflects the maximum rated output of a
                generator, not its typical output. Capacity factors vary widely:
                nuclear (~93%), gas combined cycle (~55-60%), wind (~30-40%),
                solar (~20-27%). Direct comparison of nameplate additions
                across technologies does not reflect equivalent energy
                contribution.
              </p>
              <p>
                &ldquo;Other&rdquo; includes battery storage, biomass,
                geothermal, and other technologies. Battery storage has become
                the largest component of this category in recent years.
              </p>
            </MethodologyNote>
          }
        >
          <CapacityChangesChart data={capacity.data} />
        </ChartContainer>

        {/* G3: Regional Mix */}
        <ChartContainer
          id="regional-mix"
          title="Regional Generation Mix Comparison"
          source={regional.source}
          chartAriaLabel="100 percent stacked horizontal bar chart comparing the electricity generation mix across 9 U.S. regions, showing each source as a percentage of total regional generation."
          analysisContent={
            <AnalysisBlock>
              <p>
                The U.S. electricity system is not a single grid but a patchwork
                of regional systems with radically different generation mixes.
                The Pacific Northwest derives over half its electricity from
                hydropower. The Great Plains (SPP) gets 36% from wind. New
                England relies heavily on natural gas. The Midwest (MISO) still
                generates 30% from coal. California leads in solar generation
                share.
              </p>
              <p>
                These regional differences are critical for policy analysis.
                Electrification of transportation or heating has very different
                emissions implications depending on the local generation mix.
                A region with low-carbon generation makes EVs and heat pumps
                more effective at reducing emissions than a coal-heavy region.
              </p>
              <p>
                Regional mixes also create different reliability and economic
                dynamics. Regions dependent on a single fuel source face
                concentration risk, while diversified portfolios may be more
                resilient to fuel price shocks or supply disruptions.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Regional generation shares from EPA eGRID, which provides
                plant-level generation and emissions data aggregated to
                subregions, NERC regions, and other geographic units.
              </p>
              <p>
                Regions shown are approximations of major ISO/RTO territories
                and NERC regions. Actual jurisdictional boundaries do not
                always align with these geographic aggregations.
              </p>
              <p>
                Shares represent net generation within each region. Electricity
                imports and exports between regions are not captured in these
                percentages, which means a region&apos;s consumption mix may
                differ from its generation mix.
              </p>
            </MethodologyNote>
          }
        >
          <RegionalMixChart data={regional.data} />
        </ChartContainer>
      </div>
    </CategoryLayout>
  );
}
