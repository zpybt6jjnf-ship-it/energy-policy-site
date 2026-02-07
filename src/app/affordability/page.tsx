"use client";

import { useState } from "react";
import CategoryLayout from "@/components/layout/CategoryLayout";
import { CATEGORY_META } from "@/lib/constants";
import ChartContainer from "@/components/charts/ChartContainer";
import AnalysisBlock from "@/components/charts/AnalysisBlock";
import MethodologyNote from "@/components/charts/MethodologyNote";
import Toggle from "@/components/ui/Toggle";
import dynamic from "next/dynamic";

const RetailPriceChart = dynamic(() => import("@/components/charts/affordability/RetailPriceChart"), { ssr: false });
const StatePriceChart = dynamic(() => import("@/components/charts/affordability/StatePriceChart"), { ssr: false });
const HouseholdSpendingChart = dynamic(() => import("@/components/charts/affordability/HouseholdSpendingChart"), { ssr: false });
import type {
  DataEnvelope,
  RetailPricePoint,
  StatePriceEntry,
  HouseholdSpendingPoint,
} from "@/lib/data/types";

import retailData from "../../../data/processed/affordability/retail-prices.json";
import stateData from "../../../data/processed/affordability/state-prices.json";
import spendingData from "../../../data/processed/affordability/household-spending.json";

const meta = CATEGORY_META["affordability"];

export default function AffordabilityPage() {
  const [adjustForInflation, setAdjustForInflation] = useState(false);

  const retail = retailData as DataEnvelope<RetailPricePoint[]>;
  const states = stateData as DataEnvelope<StatePriceEntry[]>;
  const spending = spendingData as DataEnvelope<HouseholdSpendingPoint[]>;

  return (
    <CategoryLayout
      title={meta.title}
      description={meta.description}
      chartLinks={[
        { id: "retail-prices", label: "Retail Prices" },
        { id: "state-prices", label: "State Comparison" },
        { id: "household-spending", label: "Household Spending" },
      ]}
    >
      <div className="space-y-16">
        {/* A1: Retail Prices */}
        <ChartContainer
          staggerIndex={0}
          id="retail-prices"
          title="Retail Electricity Price Trends by Sector"
          source={retail.source}
          chartAriaLabel="Multi-line chart showing average retail electricity prices for residential, commercial, and industrial sectors from 2001 to 2024, with toggle for nominal versus inflation-adjusted dollars."
          description="Residential rates have risen from about 9 cents per kWh in 2001 to over 16 cents in 2024. Commercial rates follow a similar trajectory. Industrial rates remain lowest at roughly 8 cents. When adjusted for inflation, real price increases are more modest."
          keyFinding={{ stat: "13.1¢/kWh", description: "National average retail electricity price, all sectors, 2024" }}
          dataTable={{
            caption: "Average retail electricity prices by sector in cents per kWh",
            headers: ["Year", "Residential (¢)", "Commercial (¢)", "Industrial (¢)", "All Sectors (¢)"],
            rows: retail.data.map((d) => [d.year, d.residential, d.commercial, d.industrial, d.allSectors]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                Retail electricity prices have risen in nominal terms across all
                sectors since 2001. Residential customers consistently pay the
                highest rates, reflecting the cost of low-voltage distribution
                infrastructure and smaller load factors. Industrial customers
                pay the lowest rates due to high-voltage delivery and large,
                predictable loads.
              </p>
              <p>
                When adjusted for inflation, the picture is more nuanced.
                Real electricity prices were relatively stable or declining
                through the mid-2010s as low natural gas prices offset other
                cost increases. The 2021-2022 period saw notable real price
                increases driven by rising fuel costs and supply chain pressures.
              </p>
              <p>
                Electricity prices reflect a complex set of inputs including
                fuel costs, capital investment in generation and transmission,
                regulatory cost recovery, renewable energy incentives, and
                demand patterns. No single factor explains the overall trend.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Prices from EIA Electric Power Monthly, Table 5.6.A, which
                reports revenue-weighted average retail electricity prices by
                state and sector. National averages weight each state by
                electricity sales volume.
              </p>
              <p>
                Inflation adjustment uses the BLS Consumer Price Index for All
                Urban Consumers (CPI-U), rebased to 2024 dollars. This reflects
                general purchasing power changes, not electricity-specific cost
                drivers.
              </p>
              <p>
                Sector definitions follow EIA conventions: Residential includes
                single- and multi-family dwellings; Commercial includes offices,
                retail, and institutional buildings; Industrial includes
                manufacturing and mining operations.
              </p>
            </MethodologyNote>
          }
        >
          <div className="mb-4">
            <Toggle
              label="Adjust for inflation (2024 dollars)"
              checked={adjustForInflation}
              onChange={setAdjustForInflation}
            />
          </div>
          <RetailPriceChart
            data={retail.data}
            adjustForInflation={adjustForInflation}
          />
        </ChartContainer>

        {/* A2: State Prices */}
        <ChartContainer
          staggerIndex={1}
          id="state-prices"
          title="State-Level Electricity Price Comparison"
          source={states.source}
          chartAriaLabel="Horizontal bar chart showing average electricity prices for all 50 states and DC, sorted from highest to lowest, with a reference line at the national average."
          description="Hawaii has the highest electricity prices at over 30 cents per kWh. The lowest prices are in states like Louisiana and Washington around 10 cents. The national average is approximately 13 cents per kWh."
          keyFinding={{ stat: "3:1 ratio", description: "Price variation across U.S. states, from lowest to highest" }}
          dataTable={{
            caption: "State-level average electricity prices compared to national average",
            headers: ["State", "Price (¢/kWh)", "Nat'l Avg (¢/kWh)"],
            rows: states.data.map((d) => [d.state, d.price, d.nationalAverage]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                Electricity prices vary by more than three-to-one across U.S.
                states. The highest-price states tend to be island states
                (Hawaii, reliant on imported fuel), New England states (limited
                pipeline capacity, older infrastructure), and states with
                aggressive renewable portfolio standards or high living costs.
              </p>
              <p>
                The lowest-price states generally benefit from abundant local
                energy resources: Pacific Northwest hydropower, Appalachian coal,
                Gulf Coast natural gas, or Great Plains wind. Regulatory
                structure (vertically integrated utilities vs. restructured
                markets) also influences pricing.
              </p>
              <p>
                These differences have significant policy implications. States
                with low electricity prices may face different political
                dynamics around energy transition costs than high-price states
                where efficiency gains can offset investment costs.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                State-level prices from EIA Electric Power Monthly, reflecting
                the most recent full calendar year of data. Prices are
                revenue-weighted averages across all customer sectors
                (residential, commercial, industrial).
              </p>
              <p>
                The national average reference line represents the
                sales-weighted mean across all states. Individual state
                averages may mask significant intra-state variation between
                utilities, rate classes, and regions.
              </p>
            </MethodologyNote>
          }
        >
          <StatePriceChart data={states.data} />
        </ChartContainer>

        {/* A3: Household Spending */}
        <ChartContainer
          staggerIndex={2}
          id="household-spending"
          title="Electricity as Share of Household Spending"
          source={spending.source}
          chartAriaLabel="Line chart showing electricity expenditure as a percentage of total household spending from 2003 to 2023."
          description="Electricity spending as a share of household expenditure has remained relatively stable between 1.4% and 1.9% over two decades, with modest fluctuations tied to fuel price swings and weather patterns."
          keyFinding={{ stat: "~1.6%", description: "Average share of household spending on electricity" }}
          dataTable={{
            caption: "Electricity as share of household spending with CPI indices",
            headers: ["Year", "Elec. Share (%)", "CPI Electricity", "CPI All Items"],
            rows: spending.data.map((d) => [d.year, d.electricityShare, d.cpiElectricity, d.cpiAllItems]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                Electricity typically represents between 1.4% and 1.9% of
                average household expenditure. This share has been relatively
                stable over the past two decades despite nominal price
                increases, partly because household incomes have also risen and
                energy efficiency improvements have reduced per-household
                consumption.
              </p>
              <p>
                National averages mask significant variation in energy burden.
                Lower-income households spend a substantially higher share of
                income on electricity, sometimes exceeding 5-10%. Geographic
                variation in both prices and climate-driven usage further
                widens the distribution.
              </p>
              <p>
                The relative stability of the average electricity spending share
                is a meaningful finding: it suggests that, in aggregate,
                electricity costs have not outpaced broader household spending
                growth, though this does not address distributional effects
                across income levels.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Electricity share of spending derived from the BLS Consumer
                Expenditure Survey, which tracks detailed household spending
                patterns for a representative sample of U.S. households.
              </p>
              <p>
                CPI indices shown for context: CPI-Electricity and
                CPI-All Items (base period 1982-84 = 100) illustrate relative
                price trends. The electricity spending share reflects both
                price changes and consumption changes.
              </p>
              <p>
                This metric captures average household spending. Energy burden
                analysis by income quintile (not shown) would reveal
                significantly higher electricity spending shares for
                lower-income households.
              </p>
            </MethodologyNote>
          }
        >
          <HouseholdSpendingChart data={spending.data} />
        </ChartContainer>
      </div>
    </CategoryLayout>
  );
}
