const express=require("express");
const upload=require('../multer');
const cloudinary=require('../cloudinary');
const adminAuthorRouter=express.Router();
const Authordata=require('../model/Authordata')
function find(nav)
{adminAuthorRouter.get('/',function(req,res){
    res.render('addAuthor',{
        nav,
        title:'Library'
    })
})
adminAuthorRouter.post('/add',upload.single('image'), async function(req,res){
 try {
    const result=await cloudinary.uploader.upload(req.file.path);
    var author=new Authordata({
        name: req.body.name,
        books:req.body.books,
        details:req.body.details,
        image:result.secure_url ,
        cloudinary_id:result.public_id})
        // console.log(req.file.filename)
 
  await author.save();//saving to database
 res.redirect('/authors');


} catch (error) {
     console.log(error);
 } 
  


})
return adminAuthorRouter
}
module.exports=find;