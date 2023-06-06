/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book.find({}, (err, data) => {
        if (!data) {
          res.json([]);
        } else {
          const formatData = data.map((book) => {
            return {
              _id: book._id,
              title: book.title,
              comments: book.comments,
              commentcount: book.comments.length
            }
          });
          res.json(formatData);
        }
      });
    })

    .post((req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        res.send('missing required field title');
        return;
      }

      const newBook = new Book({ title, comments: [] });

      newBook.save((err, data) => {
        if (err || !data) {
          res.send('there was an error saving');
        } else {
          res.json({ _id: data._id, title: data.title });
        }
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'

      Book.remove({}, (err, data) => {
        if (err || !data) {
          res.send('could not remove');
        } else {
          res.send('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid, (err, data) => {
        if (!data) {
          res.send('no book exists');
        } else {
          res.json({
            _id: data._id,
            title: data.title,
            comments: data.comments,
            commentcount: data.comments.length
          });
        }
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment) {
        res.send('missing required field comment');
        return;
      }

      if (!data) {
        res.send('no book exists');
      } else {
        data.comments.push(comment);

        data.save((err, bookdata) => {
          res.json({
            _id: bookdata._id,
            title: bookdata.title,
            comments: bookdata.comments,
            commentcount: bookdata.comments.length
          });
        });
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findByIdAndRemove(bookid, (err, data) => {
        if (err || !data) {
          res.send('no book exists');
        } else {
          res.send('delete successful');
        }
      });
    });

};
