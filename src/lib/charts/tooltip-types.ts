export interface TooltipPayloadEntry {
  color: string;
  name: string;
  value: number;
  dataKey: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
}
