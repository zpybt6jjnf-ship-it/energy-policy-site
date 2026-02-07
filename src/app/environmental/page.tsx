"use client";

import CategoryLayout from "@/components/layout/CategoryLayout";
import { CATEGORY_META } from "@/lib/constants";
import ChartContainer from "@/components/charts/ChartContainer";
import AnalysisBlock from "@/components/charts/AnalysisBlock";
import MethodologyNote from "@/components/charts/MethodologyNote";
import dynamic from "next/dynamic";

const Co2EmissionsChart = dynamic(() => import("@/components/charts/environmental/Co2EmissionsChart"), { ssr: false });
const EmissionsIntensityChart = dynamic(() => import("@/components/charts/environmental/EmissionsIntensityChart"), { ssr: false });
const CriteriaPollutantsChart = dynamic(() => import("@/components/charts/environmental/CriteriaPollutantsChart"), { ssr: false });
import type {
  DataEnvelope,
  Co2EmissionsPoint,
  EmissionsIntensityEntry,
  CriteriaPollutantPoint,
} from "@/lib/data/types";

import co2Data from "../../../data/processed/environmental/co2-emissions.json";
import intensityData from "../../../data/processed/environmental/emissions-intensity.json";
import pollutantData from "../../../data/processed/environmental/criteria-pollutants.json";

const meta = CATEGORY_META["environmental"];

export default function EnvironmentalPage() {
  const co2 = co2Data as DataEnvelope<Co2EmissionsPoint[]>;
  const intensity = intensityData as DataEnvelope<EmissionsIntensityEntry[]>;
  const pollutants = pollutantData as DataEnvelope<CriteriaPollutantPoint[]>;

  return (
    <CategoryLayout
      title={meta.title}
      description={meta.description}
      chartLinks={[
        { id: "co2-emissions", label: "CO2 Emissions" },
        { id: "emissions-intensity", label: "Emissions Intensity" },
        { id: "criteria-pollutants", label: "Criteria Pollutants" },
      ]}
    >
      <div className="space-y-16">
        {/* E1: CO2 Emissions */}
        <ChartContainer
          staggerIndex={0}
          id="co2-emissions"
          title="Power Sector CO2 Emissions Trajectory"
          source={co2.source}
          chartAriaLabel="Combined area and line chart showing total power sector CO2 emissions in million metric tons and per-capita emissions from 1990 to 2024."
          description="Power sector CO2 emissions peaked at about 2,400 MMT in 2005 and have declined 42% to roughly 1,340 MMT in 2024. Per-capita emissions have declined even more steeply due to population growth."
          keyFinding={{ stat: "-42%", description: "Power sector CO2 emissions decline from 2005 peak" }}
          dataTable={{
            caption: "Power sector CO2 emissions total and per capita",
            headers: ["Year", "Total (MMT)", "Per Capita (tons)"],
            rows: co2.data.map((d) => [d.year, d.totalMmt, d.perCapitaTons]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                Power sector CO2 emissions peaked around 2,400 million metric
                tons in 2005 and have since declined by approximately 42% to
                about 1,340 MMT in 2024. This represents the single largest
                source of U.S. emissions reductions over the past two decades.
              </p>
              <p>
                The decline reflects multiple concurrent factors: the shift from
                coal to natural gas generation (which emits roughly half the CO2
                per MWh), rapid growth of zero-emission wind and solar
                generation, improved energy efficiency reducing electricity
                demand growth, and some effect of state renewable portfolio
                standards and federal tax incentives.
              </p>
              <p>
                Per-capita emissions have declined even more steeply than total
                emissions due to population growth. However, if electricity
                demand grows significantly due to data centers, EVs, and
                electrification, maintaining the downward emissions trajectory
                will depend on the carbon intensity of new generation resources.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Total CO2 emissions from EIA&apos;s CO2 Emissions from Energy
                Consumption dataset, covering combustion emissions from
                electricity generation. This uses a production-based accounting
                method (emissions at the point of combustion).
              </p>
              <p>
                Per-capita values calculated using Census Bureau mid-year
                population estimates. Life-cycle emissions (including upstream
                methane from natural gas production, manufacturing emissions for
                solar panels, etc.) are not included in these figures.
              </p>
              <p>
                These figures cover the electric power sector only and do not
                include direct emissions from transportation, industry,
                buildings, or agriculture.
              </p>
            </MethodologyNote>
          }
        >
          <Co2EmissionsChart data={co2.data} />
        </ChartContainer>

        {/* E2: Emissions Intensity */}
        <ChartContainer
          staggerIndex={1}
          id="emissions-intensity"
          title="Emissions Intensity (CO2/MWh) by Region"
          source={intensity.source}
          chartAriaLabel="Horizontal bar chart showing CO2 emissions intensity in pounds per megawatt-hour for 26 eGRID subregions, sorted from highest to lowest, with prior year comparison."
          description="Emissions intensity ranges from over 1,200 lbs CO2/MWh in coal-heavy Upper Midwest regions to under 250 lbs CO2/MWh in hydro-rich Pacific Northwest and nuclear-heavy regions. Nearly all regions have reduced intensity over the past five years."
          keyFinding={{ stat: "5:1 range", description: "Carbon intensity varies dramatically across U.S. regions" }}
          dataTable={{
            caption: "CO2 emissions intensity by eGRID subregion",
            headers: ["Region", "Code", "Current (lbs/MWh)", "Prior (lbs/MWh)"],
            rows: intensity.data.map((d) => [d.region, d.regionCode, d.intensity, d.priorIntensity ?? "—"]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                Carbon intensity of electricity generation varies by more than
                five-to-one across U.S. regions. The highest-intensity regions
                (over 1,200 lbs CO2/MWh) are those with large coal fleet shares,
                primarily in the Upper Midwest and parts of the Great Plains.
                The lowest-intensity regions benefit from high hydro (Pacific
                Northwest, upstate New York) or nuclear (Southeast) shares.
              </p>
              <p>
                Nearly all regions have reduced their emissions intensity over
                the past five years, reflecting the same coal-to-gas and
                renewable substitution trends visible at the national level.
                However, the pace of improvement varies significantly. Some
                coal-heavy regions have seen 10-15% intensity reductions, while
                already-clean regions have less room for improvement.
              </p>
              <p>
                These regional intensity differences are directly relevant to
                electrification policy. Switching vehicles or heating from
                fossil fuels to electricity reduces emissions only if the
                electricity is cleaner than the direct combustion it replaces.
                In high-intensity regions, the emissions benefit of
                electrification may be limited until the generation mix
                continues to evolve.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Emissions intensity data from EPA eGRID, which calculates
                output-based emission rates (lbs CO2/MWh) for each eGRID
                subregion. Intensity = total CO2 emissions / total net
                generation within the subregion.
              </p>
              <p>
                eGRID subregions are defined by EPA based on grid
                interconnections and do not align precisely with state or ISO
                boundaries. Some states span multiple subregions with very
                different intensity values.
              </p>
              <p>
                Current values reflect eGRID2022 (2022 generation data); prior
                values reflect eGRID2018 (2018 data). There is typically a
                two-year lag between the data year and eGRID publication.
              </p>
            </MethodologyNote>
          }
        >
          <EmissionsIntensityChart data={intensity.data} />
        </ChartContainer>

        {/* E3: Criteria Pollutants */}
        <ChartContainer
          staggerIndex={2}
          id="criteria-pollutants"
          title="Criteria Pollutant Trends (SO2 & NOx)"
          source={pollutants.source}
          chartAriaLabel="Dual-line chart showing SO2 and NOx emissions from power plants in thousand tons from 1995 to 2024."
          description="SO2 emissions have declined 95% from 11.2 million tons in 1995 to about 520 thousand tons in 2024. NOx emissions have declined 92% over the same period. Both trends reflect scrubber installations, cap-and-trade programs, and the coal-to-gas shift."
          keyFinding={{ stat: "-95%", description: "SO2 emissions reduction since 1995, a major public health success" }}
          dataTable={{
            caption: "Power sector SO2 and NOx emissions in thousand tons",
            headers: ["Year", "SO2 (k tons)", "NOx (k tons)"],
            rows: pollutants.data.map((d) => [d.year, d.so2ThousandTons, d.noxThousandTons]),
          }}
          analysisContent={
            <AnalysisBlock>
              <p>
                Power sector SO2 emissions have declined by approximately 95%
                since 1995, from 11.2 million tons to about 520 thousand tons.
                NOx emissions have declined by approximately 92% over the same
                period. These are among the most dramatic pollution reduction
                achievements in U.S. environmental history.
              </p>
              <p>
                The reductions reflect the combined effects of the Clean Air
                Act&apos;s Title IV acid rain program (a cap-and-trade system
                for SO2), the Cross-State Air Pollution Rule (CSAPR) for both
                SO2 and NOx, widespread installation of flue gas
                desulfurization (scrubbers) and selective catalytic reduction
                (SCR) systems, and the ongoing shift from coal to gas and
                renewable generation.
              </p>
              <p>
                These pollutant reductions have produced substantial public
                health benefits, including reduced acid rain, improved
                visibility in national parks, and lower rates of respiratory
                illness in communities near power plants. The cap-and-trade
                approach to SO2 reduction is frequently cited as a successful
                model for market-based environmental regulation.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                SO2 and NOx emissions data from EPA&apos;s Clean Air Markets
                Program Data (CAMPD), which collects continuous emissions
                monitoring data from power plants subject to federal
                cap-and-trade programs.
              </p>
              <p>
                Data covers sources subject to the Acid Rain Program (Title IV
                of the Clean Air Act) and the Cross-State Air Pollution Rule
                (CSAPR). Coverage is comprehensive for large fossil fuel-fired
                power plants but does not include all small generators.
              </p>
              <p>
                NOx values represent annual totals. Ozone-season NOx budgets
                (May-September) are regulated separately and may show different
                trends than annual totals.
              </p>
            </MethodologyNote>
          }
        >
          <CriteriaPollutantsChart data={pollutants.data} />
        </ChartContainer>
      </div>
    </CategoryLayout>
  );
}
