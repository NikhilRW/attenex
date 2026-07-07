import * as v from "valibot";

export const locationSnapshotSchema = v.object({
  lat: v.number(),
  lng: v.number(),
  accuracy: v.number(),
});
