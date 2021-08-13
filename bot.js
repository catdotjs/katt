//Made with love <3 Catdotjs 2021
const {Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const {randomInt} = require('crypto');
const axios = require("axios");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const { TemperatureConvert, AngleConvert, TimeConvert, MassConvert, VolumeConvert, LengthConvert } = require('./Scripts/ConvertionLibrary.js');
const auth = require("./JSON/auth.json");

const prefix = "katt ";
const petBattleHowToPlayImg = "Images/how-to-play.png";

let match = {};

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
                * msgArgs ---------->[0]-->[1]-->[2]
                * example : "Katt def Hello tr" (msgArgs[2] is optional)
                */
                if(msgArgs[1]){
                    axios.get("https://api.dictionaryapi.dev/api/v2/entries/"+(msgArgs[2] || "en")+"/"+msgArgs[1]).then(response => {
                            var resp = response.data[0]; //HTTP get data
                            var meanings = resp.meanings; //Array of meanings
                            var dictEmbed = new MessageEmbed()
                            .setColor(createColour(randomInt(0,256),randomInt(0,256),randomInt(0,256)))
	                        .setTitle(resp.word.capitalize()+" ("+resp.phonetic+")")
	                        .setFooter('Dictionary used - dictionaryapi.dev')
                            .setTimestamp();

                            for(i=0;i<meanings.length;i++){
                                dictEmbed.addField(meanings[i].partOfSpeech.capitalize(), meanings[i].definitions[0].definition, false);
                            }
                            channel.send({embeds: [dictEmbed]});
                        }).catch((err)=>{
                            channel.send(`${authorTag} thats not a word you silly goose!(orrr language you want is not supported >.>)`);
                        });
                }else{
                    channel.send(`${authorTag} missing a word pal!`);
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
            
            case "info":
            case "help":
               channel.send(`Made with love by <@!607952795794145281>!\nVersion __**1.0**__\nPrefix **"${prefix}"**\nCommands\n->**hello/hi** - says hi to bot\n->**dict/def/define** - defines a word\n->**convert/conv** - Converts units\n->**petb/petbattle** - a battle against the bot!`);
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
