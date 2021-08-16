//Made with love <3 Catdotjs 2021
const {Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const {randomInt} = require('crypto');
const axios = require("axios");
const spellchecker = require("spellchecker");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


const { TemperatureConvert, AngleConvert, TimeConvert, MassConvert, VolumeConvert, LengthConvert } = require('./Scripts/ConvertionLibrary.js');
const auth = require("./JSON/auth.json");

const prefix = "katt ";
const petBattleHowToPlayImg = "Images/how-to-play.png";

client.on("ready",()=>{
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate",(msg)=>{
    if(msg.content.toLowerCase().startsWith(prefix)){
        var authorTag = msg.author; //"<@![Author_id]>" | use this to tag
        var authorId = authorTag.id; //author's id
        var msgArgs = msg.content.toLowerCase().replace(prefix,"").split(" "); //prefix removed
        var channel = msg.channel;
        switch(msgArgs[0].toLowerCase()){ //this is second part "katt [command]""
            case "hi":
            case "hello":
                channel.send(`Hi, ${authorTag}!!!`);
                
            break;

            case "dict":
            case "def":
            case "define":
                /*
                * Define command. Calls an dictionary api and returns result
                * msgArgs ---------->[0]-->[1]-->[2]...
                * example : "Katt def uh oh" -> "uh-oh"
                */
               let define = msgArgs[1]+(msgArgs[2]==undefined?"":msgArgs[2]);
                if(define){
                    axios.get(`https://dictionaryapi.com/api/v3/references/collegiate/json/${define}?key=${auth.dictKey}`).then(response => {
                        var resp = response.data; //HTTP get data
                        var phonetic = resp[0].hwi.prs[0].mw;

                        if(resp[0].meta.offensive == false){
                            var dictEmbed = new MessageEmbed()
                            .setTitle(`${define.capitalize()} [${phonetic}]`)
                            .setColor(createColour(randomInt(0,255),randomInt(0,255),randomInt(0,255)))
                            .setFooter('Dictionary used - merriam-webster.com')
                            .setTimestamp();

                            for(e=0;e<resp.length;e++){
                                if(resp[e].meta.id.includes(`${define.toLowerCase()}:`) || e==0){
                                    meanings = resp[e].shortdef;
                                    for(i=0;i<meanings.length;i++){
                                        dictEmbed.addField(`${resp[e].fl.capitalize()}`, meanings[i].capitalize(), false);
                                    }
                                }
                            }
                            channel.send({embeds: [dictEmbed]});
                        }else{
                            channel.send("This word has been flagged as offensive. Please do not lookup offensive words :(");
                        }
                        }).catch((err)=>{
                            channel.send(`${authorTag}, thats not a word you silly goose!`);
                        });
                }else{
                    channel.send(`${authorTag}, I need a word to define <:chihiro_think:859405609303932958>`);
                }
            break;
            
            case "convert":
            case "conv":
                /*
                * For now only Temp conversion is possible
                * msgArgs ---------->[0]--->[1]--->[2]
                * example : "katt conv temp 20c"
                */
               conversion = msgArgs[2]+(msgArgs[3]!=undefined?msgArgs[3]:"");
               switch(msgArgs[1]){
                   case "temp":
                   case "temperature":
                    channel.send(TemperatureConvert(conversion));
                   break;

                   case "ang":
                   case "angle":
                    channel.send(AngleConvert(conversion));
                    break;

                   case "time":
                    channel.send(TimeConvert(conversion));
                    break;

                   case "mass":
                    channel.send(MassConvert(conversion));
                    break;

                   case "vol":
                   case "volume":
                    channel.send(VolumeConvert(conversion));
                    break;
                   case "len":
                   case "length":
                    channel.send(LengthConvert(conversion));
                    break;
                   default:
                    channel.send("thats not a type buddy >w<\n->you can convert with **temperature, angle, time, mass, volume** and **length**");
               }
            break;

            case "petbattle":
            case "petb":
               var actions = new MessageActionRow().addComponents(
               new MessageButton()
               .setCustomId('petB_Proceed')
               .setLabel('Proceed')
               .setStyle('SUCCESS')
               ,
               new MessageButton()
               .setCustomId('petB_Cancel')
               .setLabel('Cancel')
               .setStyle('DANGER')
               ,
               new MessageButton()
               .setCustomId('petB_HowToPlay')
               .setLabel('How to play')
               .setStyle("PRIMARY")
               );

               channel.send("pet battle is currently being worked on. Sorry :(");
               /*
               channel.send({content:`Do you want to pet battle with ${client.user}? ${authorTag}(60 second to respond)`,components:[actions]})
               .then(message => {
                setTimeout(() =>{
                message.edit({content:"Pet battle timed out :(",components:[]})
                },60000)
               });
               */
            break;
            
            case "update":
            case "latest":
               channel.send(`v1.1
               -> every command works with multiple spacing
               -> Dictionary api has been changed to merriam-webster's api
               -> Latest/Update - Shows last update
               -> sc/spellcheck command - guesses closest spelling`);
            break;

            case "sc":
            case "spellcheck":
               /*
               *  spellchecks
               *  msgArgs -->[0]-->[1]-->[2]...
               *  example : "katt sc hello" 
               */
              //check grammar here
               word = msgArgs[1]+(msgArgs[2]||"")
               if(spellchecker.isMisspelled(word)){
                channel.send("Is the word you were trying to spell one of the following?\n"+spellchecker.getCorrectionsForMisspelling(word));
               }else{
                channel.send("Word has been spelled correctly");
               }

            break;

            case "vote":
               channel.send({content:`${client.user} does not have voting(I don't plan to add), instead please vote or try these bots by talented people.\nMarriage Bot(<https://top.gg/bot/468281173072805889>) and Flower Bot(<https://top.gg/bot/731736201400418314>) from Voxel Fox\nPP bot(<https://top.gg/bot/735147633076863027>) from slippery schlöpp\nStalker bot(<https://top.gg/bot/723813550136754216/>) from Hero`});
            break;

            case "info":
            case "help":
               channel.send(`Made with love by <@!607952795794145281>!(Thank you mx. Kae[https://voxelfox.co.uk/] for hosting ${client.user}v1.0 <3)\nV__**1.1**__ - Prefix:**"${prefix}"**\nCommands\n->**hello/hi** - Says hi to bot\n->**dict/def/define** - Defines a word\n->**convert/conv** - Converts units\n->**petb/petbattle** - A battle against the bot!\n->**sc/spellcheck** - Guesses the word you tried to spell\n->**latest/update** - Gives info about latest update\n->**vote** - Vote for ${client.user}`);
            break;
        }
    }
});
/*
client.on("interactionCreate",async (interaction)=>{
    if(interaction.isButton){
        let userData = interaction.user; //has id,bot status,name,discriminator
        let guild = interaction.guild;
        let channel = interaction.channel;
        //await interaction.reply("boop");
        //await interaction.update("abc");
        switch(interaction.customId){
            case "petB_Proceed":
                interaction.update(`Lets battle <@!${userData.id}>!`);
            break;

            case "petB_Cancel":
                interaction.update({content:`Pet Battle has been cancelled D:`,components:[]});
            break;

            case "petB_HowToPlay":
                var actions = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId('petB_Proceed')
                    .setLabel('Proceed')
                    .setStyle('SUCCESS')
                    ,
                    new MessageButton()
                    .setCustomId('petB_Cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
                    );
                interaction.update({content:`Do you want to pet battle with ${client.user}? <@!${userData.id}>`,components:[actions]});
                channel.sendTyping();
                //interaction.followUp(`here is how to play <@!${userData.id}>\nhttps://media.discordapp.net/attachments/737848885875310633/874850499772444722/how-to-play.png?width=1190&height=670`);
                interaction.followUp({content:`Here is how to play <@!${userData.id}>`,files:[petBattleHowToPlayImg]});
            break;

        }
    }
});
*/
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function createColour(r,g,b){ //for easy peasy decimal to hex convertion
    return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

client.login(auth.token);
