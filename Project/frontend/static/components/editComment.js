// export default{
//     template: `<div> Edit Detials: {{old}}{{Description}}</div>`,
//     data (){
//         return {
//             old:'OLD',
//         }
//     },
//     props:['Description'],

// }
export default{
    template: `<div> Edit Detials:  {{Description}} {{old}} {{oldC}}</div>`,
    data (){
        return {
            old:'OLD',
        }
    },
    props:['Description', 'oldC'],

}
