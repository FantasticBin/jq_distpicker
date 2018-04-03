
// (function toProv(arr) {
//   var newArr = [];
//   console.log(arr.length);
//   for (var item of arr) {
//     var newProv = {};
//     var province = item.p.split("|");
//     newProv = {
//       id: province[1],
//       name: province[0],
//       city: []
//     };
//     for (var itemC of item.c) {
//       var city = itemC.n.split("|");
//       newProv.city.push({
//         id:city[1],
//         name:city[0]
//       })
//     }
//     newArr.push(newProv);
//   }

//   console.log(JSON.stringify(newArr));
// })(city_json);
// (function(arr) {
//   var newArr = [];
//   for (var item of arr) {
//     for (var itemC of item.c) {
//       var pid = itemC.n.split("|")[1];
//       // var newProv = {
//       //   pid:itemC.n.split("|")[1],
//       // };
//       if (itemC.a) {
//         for (var iterator of itemC.a) {
//           var area = iterator.s.split("|");
//             // console.log(newProv);
//             newArr.push({
//               id: area[1],
//               name: area[0],
//               pid:pid
//             });
//         }
//       }
//     }
//   }
//   // console.log(newArr);
//   console.log(JSON.stringify(newArr));
// })(city_json);
