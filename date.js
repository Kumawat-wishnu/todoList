//console.log(module);
//module.exports.getDate=getDate;
module.exports.getDate=function(){
let today= new Date();
let options={
       weekday:"long",
       day:"numeric",
       month:"long"
};
let day=today.toLocaleDateString("en-US",options);
return day;
}
//module.exports.getDay=getDay;
module.exports.getDay=function(){
    let today= new Date();
    let options={
           weekday:"long",
    };
    let day=today.toLocaleDateString("en-US",options);
    return day;
    }
    console.log(module.exports);