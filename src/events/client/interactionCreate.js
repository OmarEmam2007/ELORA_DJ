module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const safeReply = async (payload) => {
            try {
                if (interaction.deferred || interaction.replied) return await interaction.followUp(payload);
                return await interaction.reply(payload);
            } catch (_) { }
        };

        try {
            if (interaction.isButton()) {
                if (interaction.customId && interaction.customId.startsWith('music_')) {
                    if (!client.music || typeof client.music.handleButton !== 'function') {
                        return safeReply({ content: '❌ Music system not initialized.', ephemeral: true });
                    }
                    return client.music.handleButton(interaction);
                }
            }

            if (!interaction.isChatInputCommand()) return;
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            await command.execute(interaction, client);
        } catch (error) {
            console.error('❌ [ELORA DJ] interactionCreate error:', error);
            await safeReply({ content: 'Error executing command!', ephemeral: true });
        }
    }
};
