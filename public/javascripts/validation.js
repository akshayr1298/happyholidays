
jQuery.validator.addMethod("lettersonly", function(value, element) {
  return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please"); 

// function Validate() {
//     var password = document.getElementById("txtPassword").value;
//     var confirmPassword = document.getElementById("txtConfirmPassword").value;
//     if (password != confirmPassword) {
//         alert("Passwords do not match.");
//         return false;
//     }
//     alert("Password match")
//     return true;
// }

$( function() {
    $( "#datepicker" ).datepicker();
  } );
  $( function() {
    $( "#datepicker1" ).datepicker();
  } );




$(document).ready(function(){

    $("#usersign").validation({
        rules:{
            name:{
                required:true,
                minlength:4,
                maxlength:15,
                lettersonly:true
            },
            number:{
              required:true,
              minlength:10,
              maxlength:10,
              

            },
            email:{
                required:true,
                email:true
            },
            password:{
                required:true,
                minlength:3
            },
            cfpassword:{
              required:true,
              equalsTo: '#password'
            }

        }
    })
})

$(document).ready(function(){
    $("#vendorsign").validation({
        rules:{
            vname:{
                required:true,
                minlength:4,
                maxlength:15
            },
            vemail:{
                required:true,
                email:true
            },
            vpassword:{
                required:true,
                minlength:3
            }
        }
    })
})


// vendor dashboard

var ctx = document.getElementById("myChart");

var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
        lineTension: 0,
        backgroundColor: "transparent",
        borderColor: "#007bff",
        borderWidth: 4,
        pointBackgroundColor: "#007bff",
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
  },
});


// admin datatables
$(document).ready(function () {
    $('#example').DataTable();
});

function changeImage(element) {

  var main_prodcut_image = document.getElementById('main_product_image');
  main_prodcut_image.src = element.src;
  

}



