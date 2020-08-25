const width = 960;
const height = 600;
// https://diplomatie.belgium.be/nl/Diensten/Op_reis_in_het_buitenland/reisadviezen/frankrijk
// https://fr.wikipedia.org/wiki/Liste_des_d%C3%A9partements_fran%C3%A7ais
// geel
// De volgende regio's zijn een oranje zone : regio Île de France (Essonne, Hauts-de-Seine, Seine-et-Marne, Seine-Saint-Denis, Val-de-Marne, Val-d’Oise, Yvelines); departement Haut-Rhin ; departementen Gironde en Pyrénées-Atlantiques ; departementen Finistère en Ille-et-Vilaine ; departement Eure-et-Loir, Indre-et-Loire en Loiret ; departementen Aube en Marne ; departement Haute-Saône ; departementen Gard en Hérault ; departement Creuse ; departementen Meurthe-et-Moselle en Moselle ; departementen Haute-Garonne, Hautes-Pyrénées en Tarn ; departement Nord ; departementen Loire-Atlantique, Maine-et-Loire, Mayenne en Sarthe ; departement Oise ; departementen Alpes-de-Haute-Provence, Alpes-Maritimes, Hautes-Alpes, Var, Vaucluse ; departementen Ain, Haute-Savoie, Isère, Loire en Rhône ; La Réunion; Guadeloupe; Martinique; Mayotte; Saint Martin.
// rood
// departement Bouches-du-Rhône

const orangeZones = [
  "38",
  "05",
  "60",
  "49",
  "59",
  "81",
  "65",
  "23",
  "70",
  "51",
  "10",
  "37",
  "28",
  "29",
  "64",
  "33",
  "68",
  "75",
  "77",
  "78",
  "91",
  "92",
  "93",
  "94",
  "95",
  "59",
  "45",
  "54",
  "57",
  "72",
  "53",
  "44",
  "35",
  "30",
  "31",
  "34",
  "01",
  "69",
  "42",
  "74",
  "04",
  "06",
  "83",
  "84",
  "13",
];
const redZones = ["13"];
const orange = "#FF6347";
const green = "#32CD32";
const red = "#FF0000";

var projection = d3.geo
  .albers()
  .rotate([0, 0])
  .center([2.47, 47.4])
  .scale(3200)
  .translate([width / 2, height / 2])
  .precision(0.1);

var path = d3.geo.path().projection(projection);

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("departements.json", function (error, france) {
  if (error) throw error;
  console.log("france: ", france);
  var departements = france;
  console.log("departments: ", departements);
  departements.features.forEach((departement) => {
    svg
      .append("path")
      .datum(departement)
      .attr("d", path)
      .attr("class", function (d) {
        return getColorClass(d);
      });
  });

  svg
    .append("path")
    .datum(
      topojson.mesh(france, departements, function (a, b) {
        return a !== b;
      })
    )
    .attr("class", "departement-boundary")
    .attr("d", path);

  svg
    .selectAll("text")
    .data(departements.features)
    .enter()
    .append("text")
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    })
    .attr("dy", ".35em")
    .text(function (d) {
      return d.properties.nom;
    });
});

function getColor(d) {
  //console.log(d.id);
  if (redZones.includes(d.properties.code)) {
    return red;
  } else if (orangeZones.includes(d.id)) {
    return orange;
  } else {
    return green;
  }
}

function getColorClass(d) {
  //console.log(d.properties.code);
  if (redZones.includes(d.properties.code)) {
    return "departement-red";
  } else if (orangeZones.includes(d.properties.code)) {
    return "departement-orange";
  } else {
    return "departement-green";
  }
}
