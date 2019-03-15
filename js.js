<!--  -->
<!--  -->

function pageload(){
	thesunandthemoon();
	p();}

<!-- Paintings            -->
<!-- Info to Variables    -->
function akid(){
	title="A Kid ";
	specs="30 x 24 in, oil on canvas, 2018";
	loc="a_kid";}
function anothersummerdone(){
	title="Another Summer Done ";
	specs="36 x 24 in, oil on canvas, 2018";
	loc="another_summer_done";}
function enroutetobreakfast(){
	title="En Route to Breakfast ";
	specs="48 x 36 in, oil on canvas, 2018";
	loc="en_route_to_breakfast";}
function fromthebalcony(){
	title="From the Balcony ";
	specs="36 x 24 in, oil on canvas, 2019";
	loc="from_the_balcony";}
function lunarzenith(){
	title="Lunar Zenith ";
	specs="24 x 18 in, oil on canvas, 2019";
	loc="lunar_zenith";}
function turnaleaf(){
	title="Turn a Leaf ";
	specs="36 x 24 in, oil on canvas, 2018";
	loc="turn_a_leaf";}
function waterfall(){
	title="Waterfall ";
	specs="36 x 24 in, oil on canvas, 2018";
	loc="waterfall";}
function intravenous(){
	title="Intravenous ";
	specs="18 x 24 in, oil on canvas, 2013";
	loc="intravenous";}
function eatyou(){
	title="Eat You";
	specs="48 x 30 in, oil on canvas, 2015";
	loc="eat_you";}
function plantinacup(){
	title="Plant in a Cup";
	specs="30 x 24 in, oil on canvas, 2013";
	loc="plant_in_a_cup";}
function sweetsweetnectar(){
	title="Sweet, Sweet Nectar";
	specs="18 x 24 in, oil on canvas, 2014";
	loc="sweet_sweet_nectar";}
function aspring(){
	title="A Spring";
	specs="24 x 18 in, oil on canvas, 2014";
	loc="a_spring";}
function bedtimestory(){
	title="Bedtime Story";
	specs="30 x 24 in, oil on canvas, 2014";
	loc="bedtime_story";}
function mudflap(){
	title="Mudflap";
	specs="40 x 30 in, oil on canvas, 2014";
	loc="mudflap";}
function takenbynotus(){
	title="Taken by Notus";
	specs="36 x 24 in, oil on canvas, 2014";
	loc="taken_by_notus";}
function taxes(){
	title="Taxes";
	specs="24 x 18 in, oil on canvas, 2013";
	loc="taxes";}
function cityonisland(){
	title="City on Island";
	specs="40 x 30 in, oil on canvas, 2014";
	loc="city_on_island";}
function elephantsatriver(){
	title="Elephants at River";
	specs="40 x 30 in, oil on canvas, 2014";
	loc="elephants_at_river";}
function lasthikeofsummer(){
	title="Last Hike of Summer";
	specs="40 x 30 in, oil on canvas, 2014";
	loc="last_hike_of_summer";}
function havesomemore(){
	title="Have Some More";
	specs="30 x 24 in, oil on canvas, 2014";
	loc="have_some_more";}
function cleansheets(){
	title="Clean Sheets";
	specs="24 x 18 in, oil on canvas, 2015";
	loc="clean_sheets";}
function crystalballs(){
	title="Crystal Balls";
	specs="30 x 24 in, oil on canvas, 2014";
	loc="crystal_balls";}
function thesunandthemoon(){
	title="The Sun and the Moon";
	specs="48 x 30 in, oil on canvas, 2015";
	loc="the_sun_and_the_moon";}
function aplacetorest(){
	title="A Place to Rest";
	specs="48 x 36 in, oil on canvas, 2016";
	loc="a_place_to_rest";}
function oceanmeetearth(){
	title="Ocean Meet Earth";
	specs="24 x 18 in, oil on canvas, 2016";
	loc="ocean_meet_earth";}
function iceontheburn(){
	title="Ice on the Burn";
	specs="36 x 48 in, oil on canvas, 2016";
	loc="ice_on_the_burn";}
function afeast(){
	title="A Feast";
	specs="36 x 24 in, oil on canvas, 2016";
	loc="a_feast";}	
function deepinthenight(){
	title="Deep in the Night";
	specs="30 x 24 in, oil on canvas, 2016";
	loc="deep_in_the_night";}	
function edgesofhistory(){
	title="Edges of History";
	specs="30 x 24 in, oil on canvas, 2016";
	loc="edges_of_history";}
function gatheringclouds(){
	title="Gathering Clouds";
	specs="36 x 24 in, oil on canvas, 2016";
	loc="gathering_clouds";}	
function onsynth(){
	title="On Synth";
	specs="30 x 24 in, oil on canvas, 2016";
	loc="on_synth";}
function somethingemerges(){
	title="Something Emerges";
	specs="30 x 24 in, oil on canvas, 2016";
	loc="something_emerges";}	
function itabides(){
	title="It Abides";
	specs="60 x 36 in, oil on canvas, 2013";
	loc="it_abides";}
function happybirthday(){
	title="Happy Birthday";
	specs="24 x 18 in, oil on canvas, 2013";
	loc="happy_birthday";}			
	
<!--    Painting Random Order         -->
ord = [enroutetobreakfast,anothersummerdone,fromthebalcony,lunarzenith,turnaleaf,waterfall,thesunandthemoon,afeast,deepinthenight,edgesofhistory,gatheringclouds,onsynth,somethingemerges,itabides,happybirthday,eatyou,intravenous,plantinacup,sweetsweetnectar,aspring,bedtimestory,mudflap,takenbynotus,taxes,cityonisland,elephantsatriver,lasthikeofsummer,havesomemore,cleansheets,crystalballs,aplacetorest,oceanmeetearth,iceontheburn];
var n = ord.length;
var stp = [n]
  // Take values from ord (images in order) and place them in a random order into a new order in ror (random order)
var ror = [akid];
 for ( var i = 0; i < n-1; i++ ) {
    ror.push(ord.splice(Math.floor(Math.random()*ord.length),1)[0]);
  }
  ror.push(ord[0]);
  ord=ror;
pos = 0 
dimr = 0
// Preload images (one pos  ahead)-->
prld = 1

<!-- Paintings                    -->
<!--  Navigation                  -->

function p(){
	ror[pos]();
	//if (pos==0){document.getElementById("navi").style.visibility='hidden'}
	//if (pos==stp){document.getElementById("nx").style.visibility='hidden'}	
document.getElementById("PV").innerHTML="<img max-height:100% src='paintings/" + loc + ".jpg' height=100% class='frame' />";
document.getElementById("about").innerHTML="<strong>" + title + "</strong>" + "<br>" + "<br><specs>" +  specs + "</specs>";
	if (prld<=stp){ror[prld]();document.getElementById("preload").innerHTML="<img max-height:100% src='paintings/" + loc + ".jpg' height=100% />"}
	}
function nx(){
		pos ++; prld ++;
		//if (pos==1){document.getElementById("pr").style.visibility='visible'}
		if (pos>stp){pos--;prld--};
		p();
		}
function pr(){
		pos--; prld --;
		//if (pos<=stp){document.getElementById("nx").style.visibility='visible'}
		if (pos<0){pos++; prld++};
		p();
		}
function infoclick(){
	document.getElementById("frame").style.visibility='visible';
	document.getElementById("frame").innerHTML='<p align="right"><a href="#" onclick="x();"> CLOSE  &nbsp; (X) &nbsp; </a></p><iframe style="height:100%;width:100%"top:20%; src="info.html" frameBorder="0" ></iframe>';
	document.getElementById("frame").style.opacity='1';
	document.getElementById("navi").style.visibility='hidden';
	document.getElementById("PV").style.visibility='hidden';
	//document.getElementById("nx").style.visibility='hidden';
	document.getElementById("about").style.visibility='hidden';
}
function x(){
	document.getElementById("frame").style.visibility='hidden';
	document.getElementById("frame").innerHTML=' ';
	document.getElementById("about").style.visibility='visible';
	document.getElementById("navi").style.visibility='visible';
	document.getElementById("PV").style.visibility='visible';
	//if (pos==0){document.getElementById("pr").style.visibility='hidden'}
	//document.getElementById("nx").style.visibility='visible';
	//if (pos==stp){document.getElementById("nx").style.visibility='hidden'};
}
