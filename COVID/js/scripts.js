var selections = {};
var filters = {};
var fieldLabel = {'country':'Country','state':'State','city':'City'};
$(document).ready(function() {
  $.get(
    "http://52.14.161.75/countries",
    function(data) {
      // var data = JSON.parse(data)
       // alert('page content: ' + data.length);
       $(data).each( function( index, el ) {
            $("#countriesDropdown").append("<a onclick='dropdownClick(event, \"country\")'>" + el + "</a>")
        });

    }
  );
  $.get(
    "http://52.14.161.75/states",
    function(data) {
      // var data = JSON.parse(data)
       // alert('page content: ' + data.length);
       $(data).each( function( index, el ) {
            $("#statesDropdown").append("<a  onclick='dropdownClick(event, \"state\")'>" + el + "</a>")
        });

    }
  );
  $.get(
    "http://52.14.161.75/cities",
    function(data) {
      // var data = JSON.parse(data)
       // alert('page content: ' + data.length);
       $(data).each( function( index, el ) {
            $("#citiesDropdown").append("<a onclick='dropdownClick(event, \"city\")'>" + el + "</a>")
        });

    }
  );
});

function filterBox(field, value){
  return "<div filter='" + field + "' class='filterBox'><div class='filterValues'><a class='filterBoxField'>" + fieldLabel[field] + "</a><a class='filterBoxValue'>" + value + "</a></div><div class='filterRemove' onclick='removeFilter(event)'></div></div>"
}

function removeFilter(e){
  var target = e.target;
  delete selections[$(e.target).parent().attr("filter")];
  $(filters[$(e.target).parent().attr("filter")]).css("background-color", "white");
  updateSelectionsBar();
  updateQuery();
}

function dropdownClick(e, filter){
  var target = e.target;
  selections[filter] = $(e.target).text();
  filters[filter] = $(e.target).parent().parent().children(".dropbtn").children(".filterhighlight");
  $(filters[filter]).css("background-color", "#009845");
  $(e.target).parent().hide();
  updateSelectionsBar();
  updateQuery();
}

function updateQuery(){
  var query = "http://52.14.161.75";
  var first = true;

  for(var key in selections) {
    var value = selections[key];
    if (first == true){
      query += "?";
      first = false;
    }
    else{
        query += "&";
    }
    query += key + "=" + value
  }
  loadBarChart(query);
}

function updateSelectionsBar(){
  $("#selections").empty();
  for(var key in selections) {
    var value = selections[key];
    $("#selections").append(filterBox(key, value));
  }
}

function countryFunction() {
  if($("#countriesDropdown").css("display") == "none"){
    $("#countriesDropdown").css("display", "flex");
  }else{
    $("#countriesDropdown").css("display", "none");
  }
}

function stateFunction() {
  if($("#statesDropdown").css("display") == "none"){
    $("#statesDropdown").css("display", "flex");
  }else{
    $("#statesDropdown").css("display", "none");
  }
}

function cityFunction() {
  if($("#citiesDropdown").css("display") == "none"){
    $("#citiesDropdown").css("display", "flex");
  }else{
    $("#citiesDropdown").css("display", "none");
  }
}

function filterFunction(field) {
  var input, filter, ul, li, a, i;
  if (field == "country"){
    input = document.getElementById("countriesInput");
  }else if (field == "state") {
    input = document.getElementById("statesInput");
  }else if (field == "city") {
    input = document.getElementById("citiesInput");
  }
  filter = input.value.toUpperCase();
  if (field == "country"){
    div = document.getElementById("countriesDropdown");
  }else if (field == "state") {
    div = document.getElementById("statesDropdown");
  }else if (field == "city") {
    div = document.getElementById("citiesDropdown");
  }
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function loadBarChart(url){
  $("#barchart .chart-container").empty();
  $("#barchart .chart-container").append("<canvas id='myChart'></canvas>");
  $.get(
    url,
    function(jsonfile) {

      var labels = jsonfile.map(function(e) {
         return e.Date;
      });
      var data = jsonfile.map(function(e) {
         return e.Cases;
      });;
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [{
                  label: '# of Votes',
                  data: data,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
      });

    }
  );
}

loadBarChart("http://52.14.161.75/");
