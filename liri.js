require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require("request");

var fs = require("fs");

var inquirer = require("inquirer");

var moment = require("moment");

//get the input arguments
var input = process.argv.splice(2);
var searchTerm = "";

//if there were arguments...
if (input.length > 0) {
    //concatenate the search term arguments
    for (var i = 1; i < input.length; i++) {
        searchTerm += input[i];
    }
    liri(input[0]);

}
//if there weren't any arguments 
else {
    //future Inquirer menu here...
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["Search for a concert by artist", "Search for a song on Spotify", "Look up a movie's info", "Do what it says"],
        name: "choice"
    },
    {
        type: "input",
        message: "what are you searching for?",
        name: "search",
        when: function(answer){
            return answer.choice != "Do what it says";
        }
    }]).then(function(response){
        searchTerm = response.search;
        switch(response.choice){
            case "Search for a concert by artist":
                liri("concert-this");
            break;
            case "Search for a song on Spotify":
                liri("spotify-this-song");
            break;
            case "Look up a movie's info":
                liri("movie-this");
            break;
            case "Do what it says":
                liri("do-what-it-says");
            break;
        }
        console.log(response.choice);
    })
}

function liri(command){
    //identify the command argument
    switch (command) {
        case "concert-this":
            if(searchTerm){
                concert(searchTerm);
            }
            else{
                concert("Lady Gaga");
            }
            break;
        case "spotify-this-song":
            if(searchTerm){
                music(searchTerm);
            }
            else{
                music("The Sign");
            }
            break;
        case "movie-this":
            if(searchTerm){
                movie(searchTerm);
            }
            else{
                movie("Mr. Nobody");
            }
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function(error, data) {
                if(error) console.log(error);
                input = data.split(",");
                searchTerm = input[1];
                liri(input[0]);
            })
            break;
        default:
            console.log("Invalid Option");
            break;
    }
}

//function for searcing an artist on bands in town, and displaying the results
function concert(artist) {
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, info) {

        // If the request was successful...
        if (!error && response.statusCode === 200) {

            var parsed = JSON.parse(info);
            //console.log(JSON.parse(info));
            for (var i = 0; i < parsed.length; i++) {
                console.log("**********");
                console.log("Venue Name: " + parsed[i].venue.name);
                console.log("Location: " + parsed[i].venue.city + ", " + parsed[i].venue.region);
                var formattedTime = moment(parsed[i].datetime, "YYYY-MM-DD HH:mm:ss").format("MM-DD-YYYY");
                console.log("Date: " + formattedTime);
            }
        }
    });
}

//function for searching spotify for a song and displaying the information about it
function music(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) return console.log('Error occurred: ' + err);
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log("**********");
            for (var j = 0; j < songs[i].artists.length; j++) {
                console.log("Artist " + (j + 1) + ": " + songs[i].artists[j].name);
            }
            console.log("Song Name: " + songs[i].name);
            console.log("Preview: " + songs[i].preview_url);
            console.log("Album: " + songs[i].album.name);
        }
    });
}

//function for searching OMDB and displaying the movies information
function movie(movie) {

    request("http://www.omdbapi.com/?t=" + movie + "&plot=short&apikey=trilogy", function (error, response, info) {
        if (!error && response.statusCode === 200) {
            info = JSON.parse(info);
            console.log("Movie Name: " + info.Title);
            console.log("Release Year: " + info.Year);
            console.log("IMDB Rating: " + info.imdbRating);
            console.log("Country: " + info.Country);
            console.log("Language: " + info.Language);
            console.log("Plot: " + info.Plot);
            console.log("Actors: " + info.Actors);

        }
    });
}