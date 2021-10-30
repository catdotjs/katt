//Made with love <3 Catdotjs 2021
const {Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Guild, GuildMember } = require('discord.js');
const {randomInt} = require('crypto');
const axios = require("axios");
const spellchecker = require("spellchecker");
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


const { TemperatureConvert, AngleConvert, TimeConvert, MassConvert, VolumeConvert, LengthConvert } = require('./Scripts/ConvertionLibrary.js');
const auth = require("./JSON/auth.json");
const meowMessages = require("./JSON/messages.json");
const topics = require("./JSON/topics.json");

const prefix = "katt ";
const petBattleHowToPlayImg = "Images/how-to-play.png";

client.on("ready",()=>{
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate",(msg)=>{
    var currentGuildId = msg.channel.guildId;
    if(msg.content.toLowerCase().startsWith(prefix)){
        var authorTag = msg.author; //"<@![Author_id]>" | use this to tag
        var msgArgs = msg.content.toLowerCase().replace(prefix,"").split(" "); //prefix removed
        var channel = msg.channel;
        channel.sendTyping();
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
               let define = msgArgs[1]+" "+(msgArgs[2]==undefined?"":msgArgs[2]);
                if(define){
                    axios.get(`https://dictionaryapi.com/api/v3/references/collegiate/json/${define}?key=${auth.dictKey}`).then(response => {
                        var resp = response.data; //HTTP get data
                        try{
                            var phonetic = resp[0].hwi.prs[0].mw;
                        }catch(err){
                            var phonetic = "Phonetic unavailable";
                        }

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
                            channel.send(`${authorTag}, using my big huge brain I checked my dictionary but sadly I couldn't find the word's definition D:`);
                        });
                }else{
                    channel.send(`${authorTag}, I need a word to define <:chihiro_think:859405609303932958>`);
                }
            break;
            
            case "convert":
            case "conv":
                /*
                * everything is convertable!
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
                    channel.send("thats not a type buddy >w<\n->you can convert with **temperature(temp), angle(ang), time, mass, volume(vol)** and **length(len)**\nexample:``katt conv mass 10kg``");
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
               channel.send(`v1.2
-> pp command - <3
-> Drop down menu for spellcheck
-> dad command  - makes dad jokes
-> katt amen - shows a dumbass meme I made
-> stab command - stabs someone as pp bot 
-> topics command - gives a random topic 
-> Meow command - Shows last time a user was active on current server`);
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
                let correctSpellings = spellchecker.getCorrectionsForMisspelling(word);
                correctSpellingsJson = [];
                for(i=0;i<correctSpellings.length;i++){
                    correctSpellingsJson[i]={label:correctSpellings[i],value:correctSpellings[i]};
                }
                let dropDownSpellings = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('SpellCheck').setPlaceholder('Select the correct spelling').addOptions(correctSpellingsJson),);
                channel.send({content:"Is the word you were trying to spell one of the following?",components:[dropDownSpellings]});
               }else{
                channel.send("Word has been spelled correctly");
               }

            break;

            case "meow":
                /*  
                *   Meow command - Lets you see when the user tagged or userid was active last time
                *   example: "katt meow @kae#0004"
                *   return: "Kae was last active at 03:24(UTC+02:00)am in 2021-08-19.\nThey've said '[message here]' as their latest message"
                */
                
                try{
                let userId = msgArgs[1].startsWith('<@!')?msgArgs[1].slice(3, -1):msgArgs[1];
                let userMeowData = meowMessages[currentGuildId].Users[userId];
                let userTimestamp = parseInt(userMeowData[0]/1000);
                let userMessageContent = userMeowData[1];
                let userName = client.users.cache.get(userId).username;
                channel.send(`**${userName}** was last active at <t:${userTimestamp}>\nThey've said `+"``"+`${userMessageContent}`+"``");
                }catch{
                channel.send(`We sadly cannot find any data about **${msgArgs[1]}**, please make sure to mention the user or put their userID(User might not be in our database yet!)\n->example:"katt meow @user"`);
                }
            break;

            case "vote":
               channel.send({content:`${client.user} does not have voting(I don't plan to add), instead please vote or try these bots by talented people.\nMarriage Bot(<https://top.gg/bot/468281173072805889>) and Flower Bot(<https://top.gg/bot/731736201400418314>) made by Voxel Fox(Kae)\nPP bot(<https://top.gg/bot/735147633076863027>) made by slippery schlöpp\nStalker bot(<https://top.gg/bot/723813550136754216/>) made by Hero\nGhigeon bot(<https://top.gg/bot/753013667460546560>) made by Medusa`});
            break;

            case "amen":
               let amens = ["https://i.imgur.com/0UrWK1M.png","https://i.imgur.com/g58cF1G.png","https://i.imgur.com/G13wPru.png"];
               channel.send(amens[randomInt(0,amens.length)]);
            break;
            
            case "dad":
            case "joke":
            axios.get('https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/type/general').then(response => {
                channel.send(response.data[0].setup);
                setTimeout(()=>channel.sendTyping(),100);
                setTimeout(()=>channel.send(response.data[0].punchline),3000);
            });
            break;

            case "pp":
                channel.send("I'm in love with pp bot. Pp bot is so hot and attractive and also my older sibling");
            break;
            
            case "stab":
                /*
                * REMAKE THIS LATER
                *       stab command
                * msgArgs ---------->[0]--->[1]
                * example : "katt stab @user"   
                */
                if(msgArgs[1]){
                    if(msgArgs[1].slice(3, -1)==authorId){
                        channel.send("You've stabbed yourself ._.");
                    }else{
                        if(msgArgs[1].startsWith("<@!")){
                            channel.send(`<@!735147633076863027> has stabbed ${msgArgs[1]} Ouch `);
                        }else{
                            channel.send("Please mention the user you want <@!735147633076863027> to staby staby.");
                        }
                    }
                }else{
                    channel.send("<@!735147633076863027> stabbed nothing... Mention someone for <@!735147633076863027> to stab!");
                }
                
            break;
            
            case "topic":
                channel.send(topics.Contents[randomInt(0,topics.Contents.length)]);
            break;

            case "leave":
                if(authorId=="607952795794145281"){
                    channel.send(`Goodbye ${msg.guild.name} :wave: It was nice serving you <3`);
                    msg.guild.leave();
                }else{
                    channel.send(`you're not catdotjs or the owner of the server!`);
                }
            break;

            case "math":
            case "calc":
                msgArgs.shift();
                let calculation = msgArgs.join("").replace(/[:-}]/g,'');
                try{
                    channel.send("**result:** "+eval(calculation));
                }catch{
                    channel.send("error! something went horribly wrong OmO");
                }
            break;

            case "info":
            case "help":
               channel.send(`Made with love by <@!607952795794145281>!(Thank you mx. Kae[https://voxelfox.co.uk/] for hosting ${client.user}v1.0 <3)\nV__**1.2**__ - Prefix:**"${prefix}"**\nCommands\n->**hello/hi** - says hi to bot\n->**dict/def/define** - defines a word\n->**convert/conv** - Converts units\n->**petb/petbattle** - a battle against the bot!\n->**sc/spellcheck** - Spell check words!\n->**amen** - Shows dumbass memes I made\n->**dad/joke** - Makes dad jokes\n->**meow** - See last message sent by user and when it was sent\n->**topic** - Gives a random topic to talk about\n->**stab** - Ask <@!735147633076863027> to stab people\n->**pp** - <3\n->**math/calc** - does big boi math`);
            break;
        }
    }
    var authorId = msg.author.id; 
    if(meowMessages[currentGuildId]==undefined){meowMessages[currentGuildId]={Users:{}};}
    meowMessages[currentGuildId].Users[authorId]=[msg.createdTimestamp,msg.content];
    try{fs.writeFileSync("JSON/messages.json",JSON.stringify(meowMessages));}catch{console.log("failed :(");}
});

client.on("interactionCreate",async (interaction)=>{
    if(1=="a"){
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
    if(interaction.isSelectMenu){
        switch(interaction.customId){
            case "SpellCheck":
            interaction.update({ content: '``'+interaction.values[0]+'`` is selected as correct spelling', components: [] });
            break;
        }
    }
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function createColour(r,g,b){ //for easy peasy decimal to hex convertion
    return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

client.login(auth.token);
