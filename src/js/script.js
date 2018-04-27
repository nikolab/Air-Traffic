$( document ).ready(function() {

//vars
var latlon,
 lat,
 lon,
 query,
 url = 'https://raw.githubusercontent.com/nikolab/Air-Traffic/master/AircraftList.json',
 listOfFlights = document.getElementById('list-flights'),
 btn = document.getElementById('btn'),
 msg = document.getElementById("msg");


btn.addEventListener('click', function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(getPosition, showError);

    }

//get user location
    function getPosition(p) {
         lat = p.coords.latitude;
         lon = p.coords.longitude;
         return latlon = "?lat="+ lat + "&lng=" + lon;
    }


    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                msg.innerHTML = "<p>You must allow geolocation in order to application works.</p>";
                break;
            case error.POSITION_UNAVAILABLE:
                msg.innerHTML = "<p>Location information is unavailable.</p>";
                break;
            case error.TIMEOUT:
                msg.innerHTML = "<p>The request to get user location timed out, please try again.</p>";
                break;
            case error.UNKNOWN_ERROR:
                msg.innerHTML = "<p>An unknown error occurred.</p>";
                break;
        }
    }

//fetch JSON data
    //var query = getPosition(latlon);
    //url += query;
    var xml = new XMLHttpRequest();
    xml.open('GET', url);
    xml.onload = function(){

         if(xml.status >= 200 && xml.status < 400) {

            var flightData = JSON.parse(xml.responseText);
            renderHtml(flightData.acList);
        } else {
            console.log("We connected to the server, but it returned an error.");
        }

    };

    xml.onerror = function () {
       console.log("Connection error");
    };

    xml.send();

    function renderHtml(data) {
        var listItem = '';
        var details = '';
        var counter = 1;

        for(var i = 0; i < data.length; i++) {
            var id = data[i].Id;
            var flightNumb = data[i].Icao;
            var flightAlt = data[i].Alt;
            var model = data[i].Mdl;
            var manafactured = data[i].Man;
            var departure = data[i].From;
            var arrival = data[i].To;

            data.sort(function (a, b) {
                return b.Alt - a.Alt;
            });

            listItem += "<li><a href=\"javascript:;\" data-count=count-" + counter + "><span><i class=\"fas fa-plane\"></i></span><span>Flight number: " + flightNumb + "</span><span>Altitude: " + flightAlt + "</span></a></li>";

            details = "<div id=count-" + counter + " class='flight-details'><span class='cls-btn'></span><ul><li>From: " + departure + " - To: " + arrival + "</li><li>Manufacturer: " + manafactured + "</li><li>Model: " + model + "</li></ul></div>";

            counter++;
        }

        listOfFlights.insertAdjacentHTML('beforeend', listItem);
        //listOfFlights.insertAdjacentHTML('beforeend', details);

    }


});

//show - hide details
    $('a').on( "click", function(e) {
        e.preventDefault();
        var id = $(this).attr('data-count');
        $(".flight-details").each(function(){
            $(this).hide();
            if($(this).attr('id') == id) {
                $(this).show();
            }
        });
    });
})

