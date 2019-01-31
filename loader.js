// import $j from "./core/js/jquery";
//'../../studio/js/modify/actors.events.js

// module.exports.getFile = function(filename, o) {
//   const module = await import(filename)
//   module.default();
//   module.
//   import(filename).then(function(module){
//     console.log("MODULE", module)
//     $j("body").trigger("actorsLoaded");
//     if(o){
//       if(o.after) {
//         return o.after();
//       };
//     };
//   });
// };

module.exports = function(fileName, o) {
  this.fileName = fileName;
  this.o = o;


  this.getFile = function() {
    console.log("getting File", this.o)
    require(`${this.fileName}`)
      .then(function(module){
        console.log("MODULE", module)

        $j("body").trigger("actorsLoaded");

        if(this.o){
          if(this.o.after) {
            return this.o.after();
          };
        };

        return o;
      });
  }
};


// module.exports.default = function() {
//   console.log("DEFAULT EXPORT")
// }
// module.exports.getFile = function(filename) {
//   console.log("Getting Filename "+filename);
// };


// // utils.mjs
// export function addTextToBody(text) {
//   const div = document.createElement('div');
//   div.textContent = text;
//   document.body.appendChild(div);
// }
