const mongoose=require('mongoose');
const ProductSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please enter a product  name"]
        },
        description:{
            type:String,
            required:true,
         },
         price:{
            type:Number,
            required:true,
            default:0
         },
      

    },
    {
        timestamps:false,
        versionKey: false
    }
);

const Product=mongoose.model("Product",ProductSchema);

module.exports=Product;