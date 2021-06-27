//Discord
const Discord = require('discord.js')
require('dotenv').config();
const discordBot = new Discord.Client();
const covid19 = require('owid-covid')
const PREFIX = 'o!'


// ISO2 to ISO3 conversion
const getCountryISO3 = require("country-iso-2-to-3");
// getCountryISO3("iso2 country code")


//Covid19 Cases Function
function covidstats(fromWhere) {
    if (fromWhere.length === 2) {
        getCountryISO3(fromWhere)
        fromWhere = getCountryISO3(fromWhere)
        covid19.getLatestStats(fromWhere).then((data) => {
            //console.log(data)
            const countryData= JSON.stringify(data['location'])
            const casesData = JSON.stringify(data['total_cases'])
            const newCasesData = JSON.stringify(data['new_cases'])
        })
    }
    else{
        covid19.getLatestStats(fromWhere).then((data) => {
            //console.log(data)
            const countryData= JSON.stringify(data['location'])
            const casesData = JSON.stringify(data['total_cases'])
            const newCasesData = JSON.stringify(data['new_cases'])
    })
}


discordBot.on('ready', () => {
    console.log('OneStop is ready to serve!')
})

discordBot.on('message', (msg) => {
    if (!msg.content.startsWith(PREFIX)) return
    let args = msg.content.substring(PREFIX.length).split(' ');
    switch (args[0]) {
        case 'info':
            msg.reply('Hey there! I am OneStop!')
            break;
        case 'covid':
            if (args[1] === '') {
                
                msg.channel.send('Invalid response');
                
            }
            else {
                covidstats(fromWhere)
                  const embed = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
                    .setTitle("Country ",countryData)
                    .addField("Total Cases ",casesData)
                    .addField("New Cases ",newCasesData)
                    msg.channel.send(embed)
                }
        }
    })
}


//Telegram
const { Telegraf } = require('telegraf')
const oneStopBotToken = process.env.TELEGRAM_BOT_TOKEN

const telegramBot = new Telegraf(oneStopBotToken)

telegramBot.start((ctx) => {
    console.log(ctx.from)
    ctx.reply('Hey there! I am OneStop!')
})

telegramBot.on('sticker', (ctx) => {
    ctx.reply('👌🏻')
})

telegramBot.command('devinfo', async (ctx) => {
    if (ctx.from.id != 1622650771 && ctx.from.id != 1604074166) return ctx.reply('Sorry, you are not a developer of this bot.')
    try {
        await ctx.reply(`id: ${telegramBot.botInfo.id}`)
        await ctx.reply(`first_name: ${telegramBot.botInfo.first_name}`)
        await ctx.reply(`can_read_all_group_messages: ${telegramBot.botInfo.can_read_all_group_messages}`)
        await ctx.reply(`can_join_groups: ${telegramBot.botInfo.can_join_groups}`)
        await ctx.reply(`supports_inline_queries: ${telegramBot.botInfo.supports_inline_queries}`)
        await ctx.reply(`username: ${telegramBot.botInfo.username}`)
        await ctx.reply(`is_bot: ${telegramBot.botInfo.is_bot}`)
    } catch (err) {
        console.log(err)
    }
})

telegramBot.command('covid', (ctx) => {
    covid19.getStats('SGP')
        .then(stats => {
            
        })
})

telegramBot.launch()

discordBot.login(process.env.TOKEN)