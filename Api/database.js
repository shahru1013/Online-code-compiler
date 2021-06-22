const Api = require("express");
const api = Api();
const FormData = require('form-data');
const axios = require('axios');
api.get('/test',(req,resp)=>{

    let code = req.query.code;
    let lang = req.query.lang;
    let input = req.query.input;

    //data
    let bodyFormData = new FormData();
    bodyFormData.append('lang', lang);
    bodyFormData.append('code', code);
    bodyFormData.append('input', input);
    bodyFormData.append('save', 'false');
    
    axios({
        method: "post",
        url: "https://ide.geeksforgeeks.org/main.php/",
        data: bodyFormData,
        headers: bodyFormData.getHeaders()
      })
        .then(function (response) {
          //handle success
          let sid = response.data.sid;
          let res = response.data.status;
          if(res.toString()==="SUCCESS"){
            setTimeout(()=>{
              //console.log(sid);
              getOutput(sid,resp);
            },3000);
          }
          else{
            res.send({err:'Something wrong'});
          }
        })
        .catch(function (response) {
         // console.log(response);
          res.send({err:'Network error'});
        });
});


// get output
let getOutput=(sid,res)=>{
  var bodyFormData = new FormData();
  bodyFormData.append('sid', sid);
  bodyFormData.append('requestType', 'fetchResults');
  axios({
    method: "post",
    url: "https://ide.geeksforgeeks.org/submissionResult.php",
    data: bodyFormData,
    headers:bodyFormData.getHeaders()
  })
    .then(function (response) {
      let stat = response.data.status;
      console.log(stat);
      if(stat=="IN-QUEUE"){
        setTimeout(()=>{
          //console.log(sid);
          getOutput(sid,res);
        },3000);
      }
      else{
        
        res.send({data:response.data}); 
      } 
    })
    .catch(function (response) {
      //handle error
      res.send({err:'Network error'});
    });
}

module.exports = api;