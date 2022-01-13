const express=require("express");

const adminRouter=express.Router();

const upload=require('../multer');

const cloudinary=require('../cloudinary');


const Bookdata=require('../model/Bookdata')
function router(nav)
{adminRouter.get('/',function(req,res){
    res.render('addBook',{
        nav,
        title:'Library'
    })
})
adminRouter.post('/add',upload.single('image'), async function(req,res){
  try {
    const result=await cloudinary.uploader.upload(req.file.path);
    
    var book=new Bookdata({
        title: req.body.title,
        author:req.body.author,
        genre:req.body.genre,
        image:result.secure_url,
       cloudinary_id:result.public_id})
  //  var book = Bookdata(item);
 await book.save();//saving to database
 res.redirect('/books');
  } catch (error) {
    console.log(error)
  } 

})



return adminRouter
}
module.exports=router;