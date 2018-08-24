require("dotenv").config();

var keys = require("./keys.js");

input = process.argv.splice(2);

if(input){
    switch(input[0]){
        case "concert-this":

        break;
        case "spotify-this-song":

        break;
        case "movie-this":

        break;
        case "do-what-it-says":

        break;
        default:
        console.log("Invalid Option");
        break;
    }

}
else{
    //future Inquirer menu here...
}