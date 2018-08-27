require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require("request");

var fs = require("fs");

//get the input arguments
var input = process.argv.splice(2);
var searchTerm = "";

//if there were arguments...
if (input) {
    //concatenate the search term arguments
    for (var i = 1; i < input.length; i++) {
        searchTerm += input[i];
    }
    liri(input[0]);

}
//if there weren't any arguments 
else {
    //future Inquirer menu here...
}

function liri(command){
    //identify the command argument
    switch (command) {
        case "concert-this":
            concert(searchTerm);
            break;
        case "spotify-this-song":
            music(searchTerm);
            break;
        case "movie-this":
            movie(searchTerm);
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
                console.log("Date: " + parsed[i].datetime);
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