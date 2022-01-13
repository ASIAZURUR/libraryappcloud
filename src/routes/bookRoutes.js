const express=require('express');
const booksRouter=express.Router();
const Bookdata=require('../model/Bookdata');
const{ensureAuthorized}=require('../config/auth-admin');
const cloudinary=require('../cloudinary');
const dotenv=require('dotenv');
  dotenv.config();
function router(nav)
{
  
    booksRouter.get('/', async function(req,res){
       await Bookdata.find()
        .then(function(books){
            res.render("books",
            {
                nav,
                title:'Library',
                books
            });
        });

        })
      
    booksRouter.get('/:id',function(req,res){
        const id=req.params.id;
        Bookdata.findOne({_id:id})
        
        .then(function(book){
            res.render('book',{
                nav,
                title:'Library',
                book
            })
        })  
        })
        booksRouter.get('/:id/delete',ensureAuthorized, async function(req,res){
           try {
               let book=await Bookdata.findById(req.params.id);
               await cloudinary.uploader.destroy(book.cloudinary_id);
               await book.remove();
               res.redirect('/books')
           } catch (error) {
               console.log(error);
           }
    
        });
        booksRouter.get('/delete/:id',ensureAuthorized, async function(req,res){
          
            try {
                let book=await Bookdata.findById(req.params.id);
                await cloudinary.uploader.destroy(book.cloudinary_id);
                await book.remove();
                res.redirect('/books')
            } catch (error) {
                console.log(error);
            }
        });
      
    return booksRouter;
}

module.exports=router;