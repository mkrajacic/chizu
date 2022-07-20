let map;
let data;
let country_code;
let country_name;
let coo;
let type;
let list;

var countryStyle;

let geoJSONs = [];
let countries = [];

var wantCountries = [];
var visitedCountries = [];

function preload() {}

function setup() {
  noCanvas();

  // kreiranje karte
  map = L.map("mapid", {
    maxBounds: [
      [-90, -260],
      [90, 260],
    ],
    maxBoundsViscosity: 1,
    center: [46, 14],
    zoom: 4,
  });
  map.on("click", onMapClick);
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: "2",
    continiousWorld: "false",
  }).addTo(map);

  type = document.querySelector('input[name="type"]:checked').value;

  let div_countries = createDiv();
  div_countries.id("countries");

  let h3_visited = createElement("h3", "Countries I visited:");
  let ol_visited = createElement("ol");
  ol_visited.id("type1");

  let h3_want = createElement("h3", "Countries I'd like to visit:");
  let ol_want = createElement("ol");
  ol_want.id("type2");

  h3_visited.parent(div_countries);
  ol_visited.parent(div_countries);
  h3_want.parent(div_countries);
  ol_want.parent(div_countries);

  h3_visited.position(850, 0);
  ol_visited.position(850, 50);
  h3_want.position(1150, 0);
  ol_want.position(1150, 50);

  var saveJSONBtn = createButton("Save countries");
  saveJSONBtn.id("json-btn");
  saveJSONBtn.position(675, 615);
  saveJSONBtn.mousePressed(saveToJSON);
}

function onMapClick(e) {
  // dohvacanje longitude/latitude pritisnute pozicije na karti
  coo = e.latlng;

  // poziv apiju koji vraca naziv i oznaku drzave ovisno o long i lat
  let url = `http://api.geonames.org/countryCodeJSON?lat=${coo.lat}&lng=${coo.lng}&username=emkei`;
  httpGet(url, "jsonp", false, function (response) {
    // dohvacanje naziva i oznake drzave
    country_code = response.countryCode;
    country_name = response.countryName;
  });

  // boja obojenja obruba ovisno o odabranoj opciji
  if (type == 1) {
    countryStyle = {
      color: "#76f5c4",
      weight: 5,
      opacity: 0.85,
    };
  } else {
    countryStyle = {
      color: "#c976f5",
      weight: 5,
      opacity: 0.85,
    };
  }

  setTimeout(() => {
    if (country_code) {
      if (!countries.includes(country_code)) {
        // ucitavanje datoteke koja sadrzi podatke o koordinatama granica drzava
        data = loadJSON(`./countries/${country_code}.geo.json`);

        setTimeout(() => {
          // obojenje odabrane drzave te spremanje u polje
          var geoJSON = L.geoJSON(data, { style: countryStyle });
          geoJSON.addTo(map);
          geoJSONs.push(geoJSON);
        }, "300");

        countries.push(country_code);

        // dodavanje naziva drzava u listu, svaka stavka ima i gumb za brisanje sa liste
        list = document.getElementById(`type${type}`);
        var newCountry = document.createElement("li");
        newCountry.appendChild(document.createTextNode(country_name));
        newCountry.id = `li-${country_code}`;
        newCountry.style = "position:relative; padding-bottom:6px";
        var newCountry = list.appendChild(newCountry);

        var xButton = document.createElement("button");
        xButton.innerHTML = "✖";
        xButton.type = "button";
        xButton.name = `x-${country_code}`;
        xButton.style = "position:relative; left:8px";

        newCountry.appendChild(xButton);

        xButton.onclick = function (event) {
          var clicked = event.target;
          var name = clicked.name.substring(2);
          var dLi = document.getElementById(`li-${name}`);
          var liParent = dLi.parentElement;
          liParent.removeChild(dLi);
          var indexToDelete = countries.indexOf(name);
          countries = countries.filter((item) => item !== name);

          var clearGJ = geoJSONs[indexToDelete];
          map.removeLayer(clearGJ);
          geoJSONs.splice(indexToDelete, 1);
        };
      }
    }
  }, "175");
}

function onTypeChange() {
  type = document.querySelector('input[name="type"]:checked').value;
}

function saveToJSON() {
  // spremanje podataka iz generirane liste u json oblik
  var ol1 = document.getElementById("type1");
  var items1 = ol1.getElementsByTagName("li");

  for (var i = 0; i < items1.length; ++i) {
    var visitedJSON;
    visitedJSON = {};
    visitedJSON.country = items1[i].innerHTML.substring(
      0,
      items1[i].innerHTML.indexOf("<")
    );
    visitedCountries.push(visitedJSON);
  }

  var ol2 = document.getElementById("type2");
  var items2 = ol2.getElementsByTagName("li");

  for (var j = 0; j < items2.length; ++j) {
    var wantJSON;
    wantJSON = {};
    wantJSON.country = items2[j].innerHTML.substring(
      0,
      items2[j].innerHTML.indexOf("<")
    );
    wantCountries.push(wantJSON);
  }

  var toJSON = [
    { visitedCountries: visitedCountries, wantedCountries: wantCountries },
  ];
  saveJSON(toJSON, "countries.json");
  visitedCountries = [];
  wantCountries = [];
}
