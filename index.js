// Import required modules
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
import { ARGUMENT_TYPE, SlashCommandArgument, SlashCommandNamedArgument } from '../../../slash-commands/SlashCommandArgument.js';
import { SlashCommandEnumValue } from '../../../slash-commands/SlashCommandEnumValue.js';
import { characters } from '../../../../script.js'; // Import characters from script.js

// Adding the requested slash commands for `/char-create` and `/char-edit`

// /char-create name
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'char-create',
    callback: (namedArgs, unnamedArgs) => {
        // Placeholder functionality for creating a character
        return `Character "${unnamedArgs.toString()}" created!`;
    },
    unnamedArgumentList: [
        SlashCommandArgument.fromProps({
            description: 'The name of the character to create',
            typeList: [ARGUMENT_TYPE.STRING],
            isRequired: true,
        }),
    ],
    returns: 'Returns the uniqueName',
    helpString: `
        <div>
            Creates a new character with the specified name.
        </div>
        <div>
            <strong>Example:</strong>
            <pre><code class="language-stscript">/char-create John</code></pre>
        </div>
    `,
}));

// /char-edit name="" field="" content
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'char-edit',
    callback: (namedArgs, unnamedArgs) => {
        const [content] = unnamedArgs;
        // Placeholder functionality for editing a character
        return `Character "${namedArgs.name}" field "${namedArgs.field}" updated to "${content}".`;
    },
    namedArgumentList: [
        SlashCommandNamedArgument.fromProps({
            name: 'name',
            description: 'The name of the character to edit. Autocomplete is available.',
            typeList: [ARGUMENT_TYPE.STRING],
            isRequired: true,
            enumProvider: () => {
                // Generate the dropdown values from the characters list
                return characters.map(it => new SlashCommandEnumValue(it.name, it.avatar));
            },
        }),
        SlashCommandNamedArgument.fromProps({
            name: 'field',
            description: 'The field of the character to edit. Select one of the following:',
            typeList: [ARGUMENT_TYPE.STRING],
            isRequired: true,
            enumProvider: () => {
                return [
                    new SlashCommandEnumValue('Main Prompt', 'Any content here will replace the default Main Prompt used for the character. Insert {{original}} to include the default prompt from system settings.'),
                    new SlashCommandEnumValue('Post-History Instructions', 'Any content here will replace the default Post-history instructions used for the character. Insert {{original}} to include the default prompt from system settings.'),
                    new SlashCommandEnumValue('Created By', 'Creator of the character'),
                    new SlashCommandEnumValue('Character Version', 'Version of the character'),
                    new SlashCommandEnumValue('Creator\'s Notes', 'Notes from the creator'),
                    new SlashCommandEnumValue('Tags to Embed', 'Tags associated with the character'),
                    new SlashCommandEnumValue('Personality Summary', 'Brief personality summary of the character'),
                    new SlashCommandEnumValue('Scenario', 'Scenario the character is part of'),
                    new SlashCommandEnumValue('Character\'s Note', 'Text to be inserted in-chat @ designated depth and role'),
                    new SlashCommandEnumValue('Depth', 'Depth of Character\'s Note'),
                    new SlashCommandEnumValue('Role', 'Designated role of the Character\'s Note'),
                    new SlashCommandEnumValue('Talkativeness', 'How often the character speaks in group chats!'),
                    new SlashCommandEnumValue('Examples of dialogue', 'Examples of dialogues for the character'),
                    new SlashCommandEnumValue('Description', 'Description of the character'),
                    new SlashCommandEnumValue('First message', 'The first message of the character'),
                    new SlashCommandEnumValue('Alt. Greetings', 'Alternative greetings'),
                ];
            },
        }),
    ],
    unnamedArgumentList: [
        SlashCommandArgument.fromProps({
            description: 'The new content for the specified field',
            typeList: [ARGUMENT_TYPE.STRING],
            isRequired: true,
        }),
    ],
    helpString: `
        <div>
            Edits the specified field of a character with new content.
            Autocomplete is available for the <code>name</code> and <code>field</code> arguments.
        </div>
        <div>
            <strong>Example:</strong>
            <pre><code class="language-stscript">/char-edit name=John field=age 30</code></pre>
        </div>
        <div>
            <strong>Field descriptions and examples:</strong>
            <ul>
                <li><strong>Role:</strong> Select from "System", "User", "Assistant" (e.g., <code>System</code>)</li>
                <li><strong>Talkativeness:</strong> Enter a value between <code>-10</code> and <code>10</code> (e.g., <code>5</code>)</li>
            </ul>
        </div>
    `,
}));
