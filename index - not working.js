// Import required modules
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
import { ARGUMENT_TYPE, SlashCommandArgument, SlashCommandNamedArgument } from '../../../slash-commands/SlashCommandArgument.js';
import { SlashCommandEnumValue } from '../../../slash-commands/SlashCommandEnumValue.js';
import { getContext } from '../../../st-context.js';
import { characters } from '../../../../script.js'; // Import characters from script.js

// Adding the requested slash commands for `/char-create` and `/char-edit`

// /char-create name
SlashCommandParser.addCommandObject(SlashCommand.fromProps({
    name: 'char-create',
    callback: async (namedArgs, unnamedArgs) => {
        const baseName = unnamedArgs.toString().trim(); // Input character name
        if (!baseName) return 'Error: Character name cannot be empty!';

        const context = getContext(); // Fetch context
        const characters = context.characters; // Access characters array

        // Find a unique name
        let uniqueName = baseName;
        let counter = 1;
        while (characters.some(character => character.name === uniqueName)) {
            uniqueName = `${baseName}${counter}`;
            counter++;
        }

        // Prepare formData for the POST request
        const formData = new FormData();
        formData.append('name', String(uniqueName)); // Ensure name is a string
        formData.append('description', ''); // Add any default properties as strings
        formData.append('creator_notes', '');
        formData.append('alternate_greetings', JSON.stringify([])); // Always stringified
        formData.append('extensions', JSON.stringify({})); // Always stringified
        formData.append('fav', 'false'); // Explicitly a string
        formData.append('avatar', ''); // Explicitly an empty string for avatar

        try {
            // Send POST request to create the character
            const headers = context.getRequestHeaders();
            delete headers['Content-Type']; // Let the browser set this for FormData

            const url = '/api/characters/create';
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error response from server: ${errorText}`);
                throw new Error('Failed to create character');
            }

            await context.reloadCurrentChat(); // Reload the chat to reflect the new character

            return uniqueName; // Return the unique name used
        } catch (error) {
            console.error('Error creating character:', error);
            return `Error: ${error.message}`;
        }
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
            If a character with the same name exists, a number is appended to make the name unique.
        </div>
        <div>
            <strong>Example:</strong>
            <pre><code class="language-stscript">/char-create John</code></pre>
            Returns "John" or "John1" if "John" already exists.
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
            <pre><code class="language-stscript">/char-edit name=John field=Description A character description</code></pre>
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
