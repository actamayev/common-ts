export type BlocklyCategoryName =
  | "Screen"
  | "Button"
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
