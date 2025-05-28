import mongoose, { Schema, models, model } from "mongoose";

const timesheetSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  clockIn: { type: Date },
  clockOut: { type: Date },
});

export const Timesheet =
  models.Timesheet || model("Timesheet", timesheetSchema);
