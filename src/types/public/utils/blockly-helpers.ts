import * as Blockly from "blockly"
import { BlockNames } from "../blockly"
import { AvailableBlock } from "../chat"
import { BLOCK_REGISTRY } from "./blockly-registry"
import { ToolboxItem } from "../sandbox"

export function getBlocksFromRegistry(blockTypes: BlockNames[]): AvailableBlock[] {
	return blockTypes.map(blockType => {
		const blockDef = BLOCK_REGISTRY[blockType]
		return { type: blockType, ...blockDef }
	})
}

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

interface BlockData {
    toolboxConfig: Blockly.utils.toolbox.ToolboxDefinition
    availableBlocks: AvailableBlock[]
}

export function createChallengeToolbox(blockTypes: BlockNames[]): BlockData {
	return {
		toolboxConfig: createFlyoutToolbox(blockTypes),
		availableBlocks: getBlocksFromRegistry(blockTypes)
	}
}

