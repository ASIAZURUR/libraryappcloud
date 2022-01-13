const express = require('express');
const updatebookRouter = express.Router();
const upload=require('../multer');
const cloudinary=require('../cloudinary')
const dotenv=require('dotenv');
  dotenv.config();


const Bookdata = require('../model/Bookdata');
function router(nav){
    updatebookRouter.get('/',function(req,res){
        res.render('updatebook',{
            nav,
            title:'Library'
        });
    });

    updatebookRouter.get('/:id',function(req,res){
        const id = req.params.id;
        
        Bookdata.findById(id,function(err,doc){
            if(!err){
                res.render('updateBook',{
                    nav,
                    title:'Library',
                    book: doc 
                });
            }
            else{
                console.log(err);
            }
        });
    });

    
    updatebookRouter.post('/:id',upload.single('image'), async function(req,res){
     try {
          let book= await Bookdata.findById(req.params.id);
          await cloudinary.uploader.destroy(book.cloudinary_id);
          const result=await cloudinary.uploader.upload(req.file.path);
          const data={  title: req.body.title || book.title,
            author:req.body.author|| book.author,
            genre:req.body.genre || book.genre,
            image:result.secure_url || book.image,
           cloudinary_id:result.public_id ||book.cloudinary_id

          };
          book= await Bookdata.findByIdAndUpdate(req.params.id,data,{new:true});
          res.redirect('/books');
     } catch (error) {
         console.log(error)
     }
    })
    return updatebookRouter;
}

module.exports = router;