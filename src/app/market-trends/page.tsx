"use client";

import CategoryLayout from "@/components/layout/CategoryLayout";
import { CATEGORY_META } from "@/lib/constants";
import ChartContainer from "@/components/charts/ChartContainer";
import AnalysisBlock from "@/components/charts/AnalysisBlock";
import MethodologyNote from "@/components/charts/MethodologyNote";
import dynamic from "next/dynamic";

const GasElectricityChart = dynamic(() => import("@/components/charts/market-trends/GasElectricityChart"), { ssr: false });
const LcoeChart = dynamic(() => import("@/components/charts/market-trends/LcoeChart"), { ssr: false });
const DemandGrowthChart = dynamic(() => import("@/components/charts/market-trends/DemandGrowthChart"), { ssr: false });
import type {
  DataEnvelope,
  GasElectricityCorrelationPoint,
  LcoeEntry,
  DemandGrowthPoint,
} from "@/lib/data/types";

import gasData from "../../../data/processed/market-trends/gas-electricity-correlation.json";
import lcoeData from "../../../data/processed/market-trends/lcoe.json";
import demandData from "../../../data/processed/market-trends/demand-growth.json";

const meta = CATEGORY_META["market-trends"];

export default function MarketTrendsPage() {
  const gas = gasData as DataEnvelope<GasElectricityCorrelationPoint[]>;
  const lcoe = lcoeData as DataEnvelope<LcoeEntry[]>;
  const demand = demandData as DataEnvelope<DemandGrowthPoint[]>;

  return (
    <CategoryLayout
      title={meta.title}
      description={meta.description}
      chartLinks={[
        { id: "gas-electricity-correlation", label: "Gas-Electricity Price" },
        { id: "lcoe", label: "LCOE Comparison" },
        { id: "demand-growth", label: "Demand Growth" },
      ]}
    >
      <div className="space-y-16">
        {/* M1: Gas-Electricity Correlation */}
        <ChartContainer
          staggerIndex={0}
          id="gas-electricity-correlation"
          title="Natural Gas & Electricity Price Correlation"
          source={gas.source}
          chartAriaLabel="Dual-axis line chart showing Henry Hub natural gas prices and average retail electricity prices from 2001 to 2024."
          description="Henry Hub gas prices spiked to $6-9/MMBtu in 2005-2008, fell to $2-4 during the shale era, spiked again to $6.45 in 2022, and returned to $2.28 in 2024. Electricity prices track gas with a lag due to contracts and rate-setting."
          keyFinding={{ stat: "$2.28", description: "Henry Hub gas price (2024), driving electricity market dynamics" }}
          dataTable={{
            caption: "Natural gas and retail electricity prices by year",
            headers: ["Year", "Henry Hub ($/MMBtu)", "Retail Elec. (¢/kWh)"],
            rows: gas.data.map((d) => [d.year, d.henryHub, d.retailElectricity]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                Natural gas is the marginal fuel in most U.S. electricity
                markets, meaning gas-fired generators typically set the
                wholesale price of electricity during many hours of the year.
                As a result, movements in natural gas prices are the primary
                driver of short-term electricity price changes.
              </p>
              <p>
                The relationship is visible but imperfect. The 2005-2008 period
                of high gas prices ($6-9/MMBtu) drove electricity prices
                upward. The shale gas revolution then pushed gas prices to
                historic lows ($2-4/MMBtu) from 2012-2020, contributing to
                relatively stable electricity prices. The 2022 gas price spike
                to $6.45/MMBtu produced a corresponding electricity price
                increase.
              </p>
              <p>
                Electricity prices respond to gas prices with a lag due to
                long-term fuel contracts, rate case timing, and the
                contribution of non-gas costs (transmission, distribution,
                capital recovery). As renewable generation displaces gas at the
                margin in more hours, the gas-electricity price linkage may
                weaken over time, though this effect varies significantly by
                region.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Henry Hub spot price from EIA Natural Gas data, representing
                the benchmark U.S. natural gas price at the Louisiana pipeline
                hub. Annual averages are used for trend visibility. Regional
                gas prices may differ due to pipeline basis differentials.
              </p>
              <p>
                Retail electricity prices from EIA Electric Power Monthly,
                representing revenue-weighted national averages across all
                sectors. Wholesale electricity prices (not shown) track gas
                prices more closely than retail prices.
              </p>
            </MethodologyNote>
          }
        >
          <GasElectricityChart data={gas.data} />
        </ChartContainer>

        {/* M2: LCOE */}
        <ChartContainer
          staggerIndex={1}
          id="lcoe"
          title="Levelized Cost of Energy by Technology"
          source={lcoe.source}
          chartAriaLabel="Grouped bar chart comparing the levelized cost of electricity for different generation technologies across three time periods: 2015, 2020, and current estimates."
          description="Solar PV LCOE has fallen roughly 65% since 2015. Onshore wind has declined about 50%. Battery storage dropped from $140/MWh to about $62/MWh. Natural gas combined cycle remains competitive but is now more expensive than unsubsidized solar and wind on a pure LCOE basis."
          keyFinding={{ stat: "-65%", description: "Solar PV levelized cost decline since 2015" }}
          dataTable={{
            caption: "Levelized cost of energy by technology in $/MWh",
            headers: ["Technology", "2015 ($/MWh)", "2020 ($/MWh)", "Current ($/MWh)"],
            rows: lcoe.data.map((d) => [d.technology, d.vintage2015 ?? "—", d.vintage2020 ?? "—", d.vintageCurrent]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                The levelized cost of energy (LCOE) estimates the
                all-in cost of building and operating a new power plant over
                its financial life, expressed per unit of electricity generated.
                Dramatic cost declines in solar PV, onshore wind, and battery
                storage have reshaped the competitive landscape for new
                generation investment.
              </p>
              <p>
                Utility-scale solar LCOE has fallen by roughly 65% since 2015,
                and onshore wind by about 50%. Battery storage costs have
                declined even more steeply, from $140/MWh in 2020 to
                approximately $62/MWh today. Combined cycle natural gas
                remains cost-competitive but is now more expensive than solar
                and wind on a pure LCOE basis.
              </p>
              <p>
                LCOE has important limitations as a comparison tool. It does
                not capture integration costs (transmission, storage, grid
                balancing) for variable resources, nor does it reflect the
                value differences between dispatchable and non-dispatchable
                generation. Nuclear and gas plants can produce electricity on
                demand, while wind and solar output depends on weather
                conditions. A complete cost comparison requires supplementing
                LCOE with system-level analysis.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                LCOE estimates from EIA Annual Energy Outlook. Values represent
                the projected total system levelized cost (capital, fuel, O&M,
                financing) for plants entering service in the AEO projection
                year. All values in 2023 dollars per MWh.
              </p>
              <p>
                EIA LCOE does not include federal or state tax credits unless
                noted. Actual project costs vary based on location, resource
                quality, interconnection costs, and financing terms.
              </p>
              <p>
                Private estimates (Lazard LCOE Analysis, BloombergNEF) exist
                and may differ from EIA due to different assumptions about
                cost of capital, capacity factors, equipment costs, and policy
                incentives. These alternative estimates generally show similar
                directional trends.
              </p>
            </MethodologyNote>
          }
        >
          <LcoeChart data={lcoe.data} />
        </ChartContainer>

        {/* M3: Demand Growth */}
        <ChartContainer
          staggerIndex={2}
          id="demand-growth"
          title="Electricity Demand Growth Drivers"
          source={demand.source}
          chartAriaLabel="Stacked area chart showing historical electricity demand from 2010 to 2023 and projected demand growth from 2024 to 2030 broken down by driver: data centers, electric vehicles, building electrification, and manufacturing onshoring."
          description="U.S. electricity demand was nearly flat from 2010 to 2023 at around 4,000 TWh. Projections show potential growth to 4,500+ TWh by 2030, driven primarily by data centers and AI workloads, followed by EV adoption and building electrification."
          keyFinding={{ stat: "AI + EVs", description: "Converging demand drivers may end two decades of flat electricity consumption" }}
          dataTable={{
            caption: "Electricity demand growth by driver in TWh",
            headers: ["Year", "Baseline (TWh)", "Data Centers", "EVs", "Electrification", "Onshoring"],
            rows: demand.data.map((d) => [d.year, d.baselineDemand, d.dataCenters ?? "—", d.evs ?? "—", d.electrification ?? "—", d.onshoring ?? "—"]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                After nearly two decades of flat electricity demand (2000-2020),
                the U.S. is entering a period of potentially significant load
                growth. Multiple demand drivers are converging: data center
                expansion driven by AI workloads, electric vehicle adoption,
                building electrification (heat pumps), and reshoring of
                manufacturing capacity.
              </p>
              <p>
                Data center demand is the most uncertain and potentially largest
                growth driver. AI training and inference workloads consume
                substantially more electricity than traditional computing.
                Projections for data center electricity demand vary widely
                across forecasters, with some estimating 300-500+ TWh of
                additional demand by 2030.
              </p>
              <p>
                The projected demand growth creates significant planning
                challenges. New generation, transmission, and distribution
                infrastructure requires years of lead time to build. The
                resource mix chosen to serve new demand will have long-lasting
                implications for emissions, reliability, and costs. This chart
                clearly separates historical data from projections, which are
                subject to substantial uncertainty.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Historical demand (2010-2023) represents actual electricity
                generation from EIA data. Projected values (2024-2030) are
                derived from EIA Annual Energy Outlook 2024 Reference Case,
                supplemented by EIA Short-Term Energy Outlook.
              </p>
              <p>
                Growth driver decomposition is approximate. &ldquo;Baseline
                Demand&rdquo; represents projected demand from existing
                end-uses. Incremental drivers (data centers, EVs,
                electrification, onshoring) are additive estimates from
                various EIA and DOE sources. The actual magnitude and timing
                of each driver is subject to significant uncertainty.
              </p>
              <p>
                Projection uncertainty is highest for data center demand,
                which depends on AI adoption rates, efficiency improvements,
                and geographic concentration of new facilities. Other
                forecasters (utilities, ISOs, private analysts) may project
                substantially different growth trajectories.
              </p>
            </MethodologyNote>
          }
        >
          <DemandGrowthChart data={demand.data} />
        </ChartContainer>
      </div>
    </CategoryLayout>
  );
}
