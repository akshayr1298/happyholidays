
// $("#booking").submit((e)=>{
//   e.preventDefault()
  
// }),




function verifyPayment(payment,order){
  $.ajax({
    url:'/verify-payment',
    data:{
      payment,
      order
    },
    method:'post',
    success:(response)=>{
      if(response.status){
        location.href = '/order-success'
      }else{
        alert('payment fail')
      }
    }
  })
}

function confirmoder(Mode){
  console.log('mode',Mode);
  for(let i = 0,{length} = Mode;i<length;i++){
    if(Mode[i].checked){
      var paymentMode = Mode[i].value
      break;

    }
  }
 
  console.log('payment',paymentMode);
  $.ajax({
  
    url:'/confirmBook',
    method:'post',
    data:{paymentMode},
    success:(response)=>{
      if(response.check){
        console.log('ajaxres',response);
        razorpayPayment(response)
      
      }else{
        location.href = '/bookingStatus'
      }
    }
  })
}



function razorpayPayment(order){
  console.log('raz',order); 
  var options = {
    "key": "rzp_test_UL2JgpeRyabsBF", // Enter the Key ID generated from the Dashboard
    "amount": order.response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "happyHolidays",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
      
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);

        verifyPayment(response,order)

    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.open();  
}

/* disable */

$('#name').prop("disabled",true);
$('#number').prop("disabled",true);
$('#emailId').prop("disabled",true);

/* enable */

$('#editProfile').click(()=>{
  $('#name').prop("disabled",false);
  $('#number').prop("disabled",false);
  $('#emailId').prop("disabled",false);

})



function updateuser(userId){

  name = $('#name').val(),
  email = $('#emailId').val(),
  number = $('#number').val()

  $.ajax({
    url:'/updateprofile',
    method:'post', 
    data:{
      name,
      email,
      number,
      userId
     
    },
    success:(response)=>{
      if(response.data){
        alert('Profile updated')
        location.reload()
      }
  
    }
  })
}

function cancelbooking(bookingId){
  if(confirm("Are you sure want to cancel booking")){
    $.ajax({
      url:'/cancelbooking',
      method:'get',
      data:{bookingId},
      success:(response)=>{
        if(response.status){
          location.reload()
        }
      }
    })
    

  }
}


