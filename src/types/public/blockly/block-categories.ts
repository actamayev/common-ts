export type BlocklyCategoryName =
  | "Screen"
  | "Motors"
  | "LED"
  | "Speaker"
  | "Buttons"
  | SensorCategoryName
  | LogicCategoryName

export type ParentCategoryName =
  | "Sensors"
  | "Logic"

export type SensorCategoryName =
  | "IR Sensors"
  | "Distance Sensors"
  | "Motion Sensor"
  | "Color Sensor"

export type LogicCategoryName =
  | "Variables"
  | "Conditionals"
  | "Math"
  | "Loops"
  | "Start"

export type CategoryName = BlocklyCategoryName | ParentCategoryName
