const express=require("express")
const cors=require("cors")
require("dotenv").config()
const port=9000
const mongoo=require("mongoose")
mongoo.connect(process.env.URI).then(()=>console.log("Connected to mongo db🥳")).catch((e)=>console.log("err at connection with mongo db😔"))
app.use(cors())
const app=express()
app.use(express.json())
const schema=new mongoo.Schema({
    Name:String,
    Preference:String,
})
const model=mongoo.model("pre",schema)
app.post("/upload",async(req,res)=>{
    const{Name,Preference}=req.body
    try{
        await model.create({Name:Name,Preference:Preference})
        const total=await model.aggregate([{$group:{_id:null,count:{$sum:1}}}])
        const response=await model.aggregate([{$group:{_id:"$Preference",names:{$push:"$Name"},count:{$sum:1}}}])
        console.log(response)
        res.status(200).json({response,total})
    }catch(e){
        console.log(e)
    }
})
app.get("/",(req,res)=>{
    res.send("<h1>Helloworld</h1>")
})
app.listen(port , ()=>{
    console.log(`server is running on ${port}....`)
})