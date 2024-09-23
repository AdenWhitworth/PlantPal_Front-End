import { WaterOccurrence } from "../AutoManualWaterTypes";

/**
 * Props for the Auto component.
 *
 * @interface AutoProps
 * @property {WaterOccurrence[]} waterOccurance - An array of water occurrence records, where each record contains date and occurrence count.
 */
export interface AutoProps {
    waterOccurance: WaterOccurrence[];
}