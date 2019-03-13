<!-- Paintings            -->
<!-- Info to Variables    -->

function intravenous(){
	title="Intravenous ";
	specs="18 x 24 in, oil on canvas, 2013.";
	loc="intravenous";}
function eatyou(){
	title="Eat You";
	specs="48 x 30 in, oil on canvas, 2015.";
	loc="eat_you";}
function plantinacup(){
	title="Plant in a Cup";
	specs="30 x 24 in, oil on canvas, 2013.";
	loc="plant_in_a_cup";}
function sweetsweetnectar(){
	title="Sweet, Sweet Nectar";
	specs="18 x 24 in, oil on canvas, 2014.";
	loc="sweet_sweet_nectar";}
function aspring(){
	title="A Spring";
	specs="24 x 18 in, oil on canvas, 2014.";
	loc="a_spring";}
function bedtimestory(){
	title="Bedtime Story";
	specs="30 x 24 in, oil on canvas, 2014.";
	loc="bedtime_story";}
function mudflap(){
	title="Mudflap";
	specs="40 x 30 in, oil on canvas, 2014.";
	loc="mudflap";}
function takenbynotus(){
	title="Taken by Notus";
	specs="36 x 24 in, oil on canvas, 2014.";
	loc="taken_by_notus";}
function taxes(){
	title="Taxes";
	specs="24 x 18 in, oil on canvas, 2013.";
	loc="taxes";}
function cityonisland(){
	title="City on Island";
	specs="40 x 30 in, oil on canvas, 2014.";
	loc="city_on_island";}
function elephantsatriver(){
	title="Elephants at River";
	specs="40 x 30 in, oil on canvas, 2014.";
	loc="elephants_at_river";}
function lasthikeofsummer(){
	title="Last Hike of Summer";
	specs="40 x 30 in, oil on canvas, 2014.";
	loc="last_hike_of_summer";}
function havesomemore(){
	title="Have Some More";
	specs="30 x 24 in, oil on canvas, 2014.";
	loc="have_some_more";}
function cleansheets(){
	title="Clean Sheets";
	specs="24 x 18 in, oil on canvas, 2015.";
	loc="clean_sheets";}
function crystalballs(){
	title="Crystal Balls";
	specs="30 x 24 in, oil on canvas, 2014.";
	loc="crystal_balls";}
function thesunandthemoon(){
	title="The Sun and the Moon";
	specs="48 x 30 in, oil on canvas, 2015.";
	loc="the_sun_and_the_moon";}
function aplacetorest(){
	title="A Place to Rest";
	specs="48 x 36 in, oil on canvas, 2016.";
	loc="a_place_to_rest";}
function oceanmeetearth(){
	title="Ocean Meet Earth";
	specs="24 x 18 in, oil on canvas, 2016.";
	loc="ocean_meet_earth";}
function iceontheburn(){
	title="Ice on the Burn";
	specs="36 x 48 in, oil on canvas, 2016.";
	loc="ice_on_the_burn";}
function afeast(){
	title="A Feast";
	specs="36 x 24 in, oil on canvas, 2016.";
	loc="a_feast";}	
function deepinthenight(){
	title="Deep in the Night";
	specs="30 x 24 in, oil on canvas, 2016.";
	loc="deep_in_the_night";}	
function edgesofhistory(){
	title="Edges of History";
	specs="30 x 24 in, oil on canvas, 2016.";
	loc="edges_of_history";}
function gatheringclouds(){
	title="Gathering Clouds";
	specs="36 x 24 in, oil on canvas, 2016.";
	loc="gathering_clouds";}	
function onsynth(){
	title="On Synth";
	specs="30 x 24 in, oil on canvas, 2016.";
	loc="on_synth";}
function somethingemerges(){
	title="Something Emerges";
	specs="30 x 24 in, oil on canvas, 2016.";
	loc="something_emerges";}	
function itabides(){
	title="It Abides";
	specs="60 x 36 in, oil on canvas, 2013.";
	loc="it_abides";}
function happybirthday(){
	title="Happy Birthday";
	specs="24 x 18 in, oil on canvas, 2013.";
	loc="happy_birthday";}			
	
<!--    Painting Random Order         -->
ord = [afeast,deepinthenight,edgesofhistory,gatheringclouds,onsynth,somethingemerges,itabides,happybirthday,eatyou,intravenous,plantinacup,sweetsweetnectar,aspring,bedtimestory,mudflap,takenbynotus,taxes,cityonisland,elephantsatriver,lasthikeofsummer,havesomemore,cleansheets,crystalballs,aplacetorest,oceanmeetearth,iceontheburn];
var n = ord.length;
var stp = [n]
  // Take values from ord (images in order) and place them in a random order into a new order in ror (random order)
var ror = [thesunandthemoon];
 for ( var i = 0; i < n-1; i++ ) {
    ror.push(ord.splice(Math.floor(Math.random()*ord.length),1)[0]);
  }
  ror.push(ord[0]);
  ord=ror;
pos = 0 
dimr = 0
