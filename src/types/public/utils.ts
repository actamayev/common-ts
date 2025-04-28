export type PipUUID = string & { readonly __brand: unique symbol }
export type SiteThemes = "light" | "dark"
export interface PipUUIDInterface {
	pipUUID: PipUUID
}
