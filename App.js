// [console]
// - scottie

var config = require("./config"); // config file config.js

console.log(config);

var realBotDiscordToken = config.realBotDiscordToken;
var infourl = config.infourl; // url for info and helps stuff, ie: welcome 

//wallet and tip bot
var RPCip = config.RPCip;
var RPCport= config.RPCport
var RPCpass = config.RPCpass;
var RPCuser = config.RPCuser;
var lastestVersion = "v1.2";
//github chan 411029890608005121
var helpfile = "";

//https://discordapp.com/oauth2/authorize?client_id=&scope=bot&permissions=515136
const JSON = require('circular-json');
var coind = require('coind-client');
const msgEmbedToRich = require("discordjs-embed-converter");
var _ = require('lodash');
var anti_spam = require("discord-anti-spam"); //anitspam
var Twitter = require('twitter');
const getBearerToken = require('get-twitter-bearer-token');
var fs = require('fs');
var request = require('request');
const Discord = require('discord.js');//https://discordjs.readthedocs.io/en/latest/docs_client.html
const client2 = new Discord.Client(); //our bot
var externalip = require("externalip");


var client = new coind.Client({
  host: RPCip,
  port: RPCport,
  user: RPCuser,
  pass: RPCpass
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

client2.on('ready', () => {
  console.log('robotbot - Connected to Discord Server....');
});  

//test RPC altcoin
client.cmd('getbalance', function(error, output) { 
  if (!error){
     console.log("RPC is setup correctly, your good to go...");
    return
  }else{
    console.log("Please correct RPC connection details in config.js");
    console.log(error);
    return;
  }
});

client2.on('message', function(message) {

      try{
               
          if (message.content.split(" ")[0] === '!tip') {
            //!tip <userid> amount

            if(message.content.split(" ")[1] == "help"){
              message.reply("📚 Help: \n 💁 Sends some coin to a user based on there user ID, tip them... cmon spread that 💖..\n ```!tip @user <amount>\nie: !tip 211492100485808130 100\n how to get USR ID: Shift + Click Name```");
              return;
            }
            if(message.content.split(" ")[1] == undefined || message.content.split(" ")[2] == undefined){
              message.reply("🛑Error: \n ```Check your your syntax, something is wrong...\n ```!tip <user ID> <amount>\nie: !tip @console 100\n how to get USR ID: Shift + Click Name```");
              return;
              //message.reply("Info to come...");
            }
            var payAmount = parseInt(message.content.split(" ")[2]);
            if(!Number.isInteger(payAmount)){
              payAmount = parseInt(message.content.split(" ")[3]);
              if(!Number.isInteger(payAmount)){
                message.reply("🛑Error: \n ```Check your your syntax, \n ```!tip <user ID> <amount>\nie: !tip @console 100\n how to get USER ID: Shift + Click Name```");
                return;
              }
            }
            
            if(!Number.isInteger(payAmount)){
              message.reply("🛑Error: \n ```Check your your syntax, \n ```!tip <user ID> <amount>\nie: !tip @console 100\n how to get USER ID: Shift + Click Name```");
              return;
            }

            var payto = message.content.split(" ")[1];
                var amount = payAmount;
                if(amount == ""){
                  amount = message.content.split(" ")[3];
                }

                console.log("Amount String: " );
                amount = parseFloat(amount)
                payto = payto.replace("<","");
                payto = payto.replace(">","");
                payto = payto.replace("@","");

                console.log("[PAYTO]]: " + payto);
                console.log("[AMOUNT]]: " + amount);

            if(payto !=  undefined){
              if(amount != undefined){
                var id = message.author.id;
                console.log(id);
                var toId = payto;
                //var name = toname;
                //var toId = client2.users.get("name", to).id;
                //console.log(toId);
                //console.log(message.author.username);                
                //console.log(message.author.avatarURL);
                //console.log(message.author.getNickname(message.channel.server));

                client.cmd('getbalance', id, function(error, balance) { 
                  if (!error){
                    if(amount == 0){
                      message.reply("[🛑Error] You cant send 0, dont be silly ...]");
                      return;
                    }
                    if(balance >= amount){
                      //get address from ID
                      //send to adderss / move
                      client.cmd('getaddressesbyaccount', toId, function(error, name) { 
                        console.log("HERE: ")
                        console.log(name)
                        if(name ==[]){
                          message.reply("[Error]" + "You adempted to send to a user with no wallet, please get that user to type !wallet help" );
                          return;
                        }
                        if(!error){
                          //message.reply("[sent to address]" +  name[0]);

                          client.cmd('move', id, toId, amount, function(error, tx) { 
                            console.log(tx);
                            if(!error){

                              const embed = new Discord.RichEmbed()
                              .setTitle(message.author.username + " is SENDING a TIP")
                              .setAuthor(message.author.username, message.author.avatarURL)
                              /*
                               * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
                               */
                              .setColor(0x00AE86)
                              .setDescription(message.author + " has sent you a tip, of " + amount + " <@"+toId+"> "  +". He must think something you have done was really cool, dont spent it all in one place !!")
                              .setFooter("Congratulations wow !!", "http://www.untappedpotentialltd.co.uk/wp-content/uploads/2015/11/Tip.jpg")
                              .setImage("https://www.123rf.com/stock-photo/congratulations.html")
                              .setThumbnail("https://www.movinglabor.com/images/blog/tip-jar.png")
                              /*
                               * Takes a Date object, defaults to current date.
                               */
                              .setTimestamp()
                              //.setURL("https://www.123rf.com/stock-photo/congratulations.html")
                              //.addField("Let your tip build up ",
                              /*
                               * Inline fields may not display as inline if the thumbnail and/or image is too big.
                               */
                              //.addField("Inline Field", "They can also be inline.", true)
                              /*
                               * Blank field, useful to create some space.
                               */
                              //.addBlankField(true) // field 2
                              //.addField("Inline Field 3", "You can have a maximum of 25 fields.", true);
                            
                              message.reply({embed});

                            }else{
                              console.log(error);
                            }
                          });                         

                        }else{
                          message.reply("[Error]" + "You adempted to send to a user with no wallet, please get that user to type !wallet help" );                          
                        }
                      });

                      //message.reply("[💰Sending] You have enough coin... ]");
                      //message.reply("<@"+toId+"> " + message.author.username + " just sent you a 🎇TIP🎇 !!");
                    }else{
                      message.reply("[🛑Error] You dont have enough coin ...]");                      
                    }
                    return;
                  }else{
                    message.reply("🛑Error: \n ```Check your balance, you broke....");
                    return;
                  }
                });
            } 

            }

          }
  
          if (message.content.split(" ")[0] === '!wallet') {
            if(message.content.split(" ")[1] == undefined){
              message.reply("🛑Error: \n ```Check your balance or check your syntax, something is wrong...```");
              return;
              //message.reply("Info to come...");
            }

            if(message.content.split(" ")[1] == "help"){
              var helptxt = "[HELP]\n " +
              "📚 Syntax: !wallet <COMMAND> \n " +
              "📚 IE: !wallet deposit \n" +
              "📚 Commands: \n" +
              "```deposit (or address), balance, send, withdraw```";
              message.reply(helptxt);
              return;
            }   

            if(message.content.split(" ")[1] == "deposit" || message.content.split(" ")[1] == "address"){
              var id = message.author.id;
              var username = message.author.username;
              
              client.cmd('getaddressesbyaccount', id, function(error, address) { 
                if (!error){
                  console.log(address);
                  if(address[0] == null){
                    message.reply("You are new here, please remember this is not 100% tested only store small amounts here you can risk...\n Generating new Deposit Adress...");
                    client.cmd('getnewaddress', id, function(error, address) {  
                      if (!error){
                         message.reply("💰👛 Address has been created, try !wallet address, or !wallet deposit");
                        return
                      }else{
                        console.log(error);
                        return;
                      }
                    });
                  }else{
                    console.log(error);
                  }
                  message.reply("💰👛 Deposit Address: \n```" + address + "```");
                  return
                }else{
                  console.log(error);
                  return;
                }
              })
            }   
            
            if(message.content.split(" ")[1] == "balance"){
                var id = message.author.id;
                client.cmd('getbalance', id, function(error, balance) { 
                  console.log(balance);
                  if (!error){                    
                    message.reply("💰👛 Balance: " + "\n```" + balance + "```");
                    return;
                  }else{
                    console.log(error);
                    return;
                  }
                });
              
            } 

            if(message.content.split(" ")[1] == "send" || message.content.split(" ")[1] == "withdraw"){
              var amount = parseFloat(message.content.split(" ")[3])
              var to = message.content.split(" ")[2]
              var from = message.author.id;
              //console.log(message.content.split(" "))
              if(amount == undefined || to == undefined){
                message.reply("🛑Bad syntax try: \n ```!wallet send ATP9fJjefZjt5zadw6Zsu4znDsqH7nRX3K 10```");
                return;
              }
              console.log(amount);
              console.log(to);
              client.cmd('sendfrom', from, to, amount, function(error, tx) { 
                if (!error){
                  if(tx[0] == undefined){
                    message.reply("🛑Error: \n ```Check your balance or check your syntax, something is wrong with amount...```");
                  }
                  console.log(tx);
                  message.reply("TX: ```"  + tx + "```");
                  message.reply("https://chainz.cryptoid.info/rns/search.dws?q=" + tx);

                }else{
                  message.reply("🛑Error: \n ```Check your balance or check your syntax, something is wrong...```");
                  console.log(error);
                }
              });
            }  
          }

      }catch(e){
        console.log("ERROR! " + e);
      }
  });


client2.login(realBotDiscordToken, function(error, token){
  if(!error){
      console.log(token);
  }else{
      console.log(error);
  }
});
