"use client";

import { useState } from "react";
import CategoryLayout from "@/components/layout/CategoryLayout";
import { CATEGORY_META } from "@/lib/constants";
import ChartContainer from "@/components/charts/ChartContainer";
import AnalysisBlock from "@/components/charts/AnalysisBlock";
import MethodologyNote from "@/components/charts/MethodologyNote";
import Toggle from "@/components/ui/Toggle";
import SaidiSaifiChart from "@/components/charts/reliability/SaidiSaifiChart";
import ReserveMarginsChart from "@/components/charts/reliability/ReserveMarginsChart";
import DisturbanceEventsChart from "@/components/charts/reliability/DisturbanceEventsChart";
import type {
  DataEnvelope,
  SaidiSaifiPoint,
  ReserveMarginRegion,
  DisturbanceEvent,
} from "@/lib/data/types";

import saidiData from "../../../data/processed/reliability/saidi-saifi.json";
import reserveData from "../../../data/processed/reliability/reserve-margins.json";
import disturbanceData from "../../../data/processed/reliability/disturbance-events.json";

const meta = CATEGORY_META["reliability"];

export default function ReliabilityPage() {
  const [showMed, setShowMed] = useState(true);

  const saidi = saidiData as DataEnvelope<SaidiSaifiPoint[]>;
  const reserves = reserveData as DataEnvelope<ReserveMarginRegion[]>;
  const disturbances = disturbanceData as DataEnvelope<DisturbanceEvent[]>;

  return (
    <CategoryLayout
      title={meta.title}
      description={meta.description}
      chartLinks={[
        { id: "saidi-saifi", label: "SAIDI/SAIFI" },
        { id: "reserve-margins", label: "Reserve Margins" },
        { id: "disturbance-events", label: "Disturbance Events" },
      ]}
    >
      <div className="space-y-16">
        {/* R1: SAIDI/SAIFI */}
        <ChartContainer
          id="saidi-saifi"
          title="Distribution System Reliability (SAIDI/SAIFI)"
          source={saidi.source}
          chartAriaLabel="Line chart showing System Average Interruption Duration Index and System Average Interruption Frequency Index from 2013 to 2024, with toggle for including or excluding major event days."
          keyFinding={{ stat: "550 min", description: "Average annual outage duration including major events" }}
          analysisContent={
            <AnalysisBlock>
              <p>
                SAIDI and SAIFI are the standard metrics for distribution system
                reliability. SAIDI measures the average total duration of
                interruptions experienced by each customer per year, while SAIFI
                measures how frequently those interruptions occur.
              </p>
              <p>
                The gap between &ldquo;with Major Event Days&rdquo; and
                &ldquo;without Major Event Days&rdquo; reveals an important
                distinction. Excluding major events (typically severe weather)
                isolates baseline grid performance, which has shown a gradual
                upward trend. Including major events captures the full customer
                experience, which has become more volatile as extreme weather
                events have intensified.
              </p>
              <p>
                These trends reflect the combined effects of aging
                infrastructure, increased weather severity, vegetation
                management practices, and grid modernization investments.
                Different regions face different reliability challenges
                depending on their exposure to weather risks and the age of
                their distribution systems.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Data from EIA Form 861, which collects annual reliability
                metrics from U.S. electric distribution utilities. SAIDI is
                measured in minutes per customer per year; SAIFI in
                interruptions per customer per year.
              </p>
              <p>
                Major Event Days (MEDs) are defined using IEEE Standard 1366,
                which applies the 2.5-beta methodology to identify days with
                statistically unusual outage levels. The with/without MED toggle
                separates baseline performance from extreme weather impacts.
              </p>
              <p>
                The reporting population has expanded over time as more
                utilities submit Form 861 data, which may slightly affect trend
                comparisons. National figures represent population-weighted
                averages across reporting utilities.
              </p>
            </MethodologyNote>
          }
        >
          <div className="mb-4">
            <Toggle
              label="Include Major Event Days"
              checked={showMed}
              onChange={setShowMed}
            />
          </div>
          <SaidiSaifiChart
            data={saidi.data}
            showMajorEventDays={showMed}
          />
        </ChartContainer>

        {/* R2: Reserve Margins */}
        <ChartContainer
          id="reserve-margins"
          title="Planning Reserve Margins by Region"
          source={reserves.source}
          chartAriaLabel="Grouped bar chart showing current and forecast planning reserve margins for NERC assessment areas, with reference lines indicating minimum required levels."
          keyFinding={{ stat: "Declining", description: "Multiple regions face tightening reserve margins through 2028" }}
          analysisContent={
            <AnalysisBlock>
              <p>
                Planning reserve margins measure the cushion between available
                generating capacity and expected peak demand. When margins fall
                below reference levels, a region faces elevated risk of
                involuntary load shedding during peak conditions.
              </p>
              <p>
                Several regions show declining margins over the forecast period,
                driven by the combination of generation retirements (primarily
                coal and some older natural gas units), growing demand from data
                centers and electrification, and the pace of new resource
                additions. Regions with significant renewable additions must
                account for the difference between nameplate capacity and
                available capacity during peak demand periods.
              </p>
              <p>
                Reference levels vary by region based on resource mix and
                interconnection characteristics. Regions with higher shares of
                variable resources or limited interconnection capacity to
                neighboring areas typically require higher reference margins.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Data from NERC&apos;s Long-Term Reliability Assessment (LTRA),
                which projects reserve margins for each NERC assessment area
                using anticipated resources and demand forecasts.
              </p>
              <p>
                Reserve margin = (Available Resources - Peak Demand) / Peak
                Demand, expressed as a percentage. &ldquo;Available
                Resources&rdquo; accounts for expected unit deratings,
                maintenance outages, and capacity value of variable resources.
              </p>
              <p>
                Reference margin levels are set by each region&apos;s planning
                authority and vary based on loss-of-load probability targets
                (typically one event in ten years). NERC assessment areas do not
                precisely align with RTO/ISO boundaries.
              </p>
            </MethodologyNote>
          }
        >
          <ReserveMarginsChart data={reserves.data} />
        </ChartContainer>

        {/* R3: Disturbance Events */}
        <ChartContainer
          id="disturbance-events"
          title="Major Electric Disturbance Events"
          source={disturbances.source}
          chartAriaLabel="Stacked bar chart showing the number of major electric disturbance events by cause category from 2000 to 2024."
          keyFinding={{ stat: "3x increase", description: "Major disturbance events since 2000, driven by weather and cyber threats" }}
          analysisContent={
            <AnalysisBlock>
              <p>
                DOE&apos;s OE-417 system tracks mandatory reports of significant
                electric disturbances, including events caused by severe
                weather, equipment failure, cyberattacks, physical attacks, and
                fuel supply disruptions. The total number of reported events has
                increased substantially over the past two decades.
              </p>
              <p>
                Weather-related events remain the dominant cause of major
                disturbances and have trended upward. Cyber-related incidents,
                while still a smaller share, have grown consistently as threats
                to grid infrastructure have evolved. Physical attacks on
                substations and other grid assets have also increased.
              </p>
              <p>
                Part of the upward trend reflects expanded reporting
                requirements implemented after 2011, which broadened the
                categories and lowered thresholds for mandatory reporting. This
                should be considered when interpreting long-term trends.
              </p>
            </AnalysisBlock>
          }
          methodologyContent={
            <MethodologyNote>
              <p>
                Data from DOE Form OE-417, which requires electric utilities
                and balancing authorities to report significant electric
                incidents. Reporting thresholds include: loss of 500+ MW of
                firm load, system voltage reductions affecting 100,000+
                customers, and any cyber or physical security events.
              </p>
              <p>
                Cause categories are based on the primary reported cause of
                each event. Events with multiple causes are classified by the
                initiating factor. The &ldquo;Other&rdquo; category includes
                islanding events, public appeals for conservation, load
                shedding, and miscellaneous causes.
              </p>
              <p>
                Reporting requirements and categories have evolved over time.
                Pre-2011 data may not be directly comparable to later years due
                to changes in reporting thresholds. Cyber incidents may be
                underreported due to classification restrictions.
              </p>
            </MethodologyNote>
          }
        >
          <DisturbanceEventsChart data={disturbances.data} />
        </ChartContainer>
      </div>
    </CategoryLayout>
  );
}
