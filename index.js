import { SlashCommandParser, SlashCommand, SlashCommandNamedArgument, SlashCommandArgument, getContext } from "../../extensions.js";

// Access SillyTavern context to manipulate characters
const context = getContext();

// Helper function to find or create a character by name
function getOrCreateCharacter(name) {
    let character = context.characters.find(char => char.name.toLowerCase() === name.toLowerCase());
    if (!character) {
        character = {
            name: name,
            mainPrompt: "",
            postHistoryInstructions: "",
            createdBy: "",
            version: "1.0",
            creatorNotes: "",
            tagsToEmbed: [],
            personalitySummary: "",
            scenario: "",
            characterNote: "",
            depth: 0,
            role: "Assistant", // Default role
            talkativeness: 0,  // Default talkativeness
            examplesOfDialogue: "",
            description: "",
            firstMessage: "",
            altGreetings: []
        };
        context.characters.push(character);
    }
    return character;
}

// Slash command to create a character
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "char-create",
    callback: (namedArgs, unnamedArgs) => {
        const characterName = unnamedArgs.toString().trim();
        if (!characterName) return "Error: Character name is required.";

        getOrCreateCharacter(characterName);
        return `Character "${characterName}" has been created!`;
    },
    unnamedArgumentList: [
        SlashCommandArgument.fromProps({
            description: "The name of the character to create",
            typeList: ARGUMENT_TYPE.STRING,
            isRequired: true,
        })
    ],
    helpString: `<div>Creates a new character with the given name.</div><div><strong>Example:</strong> /char-create Alice</div>`
}));

// Slash command to edit a character's field
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: "char-edit",
    callback: (namedArgs, unnamedArgs) => {
        const characterName = namedArgs.name;
        const fieldName = namedArgs.field;
        const content = unnamedArgs.toString().trim();

        if (!characterName || !fieldName || !content)
            return "Error: Name, field, and content are required.";

        const character = context.characters.find(char => char.name.toLowerCase() === characterName.toLowerCase());
        if (!character) return `Error: Character "${characterName}" not found.`;

        if (!(fieldName in character))
            return `Error: Invalid field "${fieldName}". Available fields: ${Object.keys(character).join(", ")}`;

        character[fieldName] = content;
        return `Character "${characterName}" updated: ${fieldName} = "${content}"`;
    },
    namedArgumentList: [
        SlashCommandNamedArgument.fromProps({
            name: "name",
            description: "The name of the character to edit",
            typeList: ARGUMENT_TYPE.STRING,
            isRequired: true,
        }),
        SlashCommandNamedArgument.fromProps({
            name: "field",
            description: "The field to edit",
            typeList: ARGUMENT_TYPE.STRING,
            isRequired: true,
        })
    ],
    unnamedArgumentList: [
        SlashCommandArgument.fromProps({
            description: "The content to write into the field",
            typeList: ARGUMENT_TYPE.STRING,
            isRequired: true,
        })
    ],
    helpString: `<div>Edits a specific field of a character.</div><div><strong>Example:</strong> /char-edit name="Alice" field="mainPrompt" "New main prompt"</div>`
}));
