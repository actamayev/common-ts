import * as Blockly from "blockly"
import { ToolboxItem } from "../types/public"
import { BlockNames } from "../types/public/blockly/blockly"

/**
 * Creates a flyout toolbox with specific blocks (no categories)
 */
export function createFlyoutToolbox<T extends BlockNames = BlockNames>(
	blocks: T[],
): Blockly.utils.toolbox.ToolboxDefinition {
	const contents: ToolboxItem[] = []
	// Add blocks with optional separators
	blocks.forEach((blockType) => {
		contents.push({ kind: "block", type: blockType })
	})

	return {
		kind: "flyoutToolbox",
		contents
	}
}
