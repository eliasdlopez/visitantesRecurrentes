const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', function(error) {
  console.error('ERROR', error);
});

const VisitantesSchema = mongoose.Schema({
  name: String,
  count: Number
});

const Visitor = mongoose.model('Visitors', VisitantesSchema);

app.get('/', async (req, res) => {
  var name = req.query.name;

  //// CHECK IF VISITOR EXISTS

  var oldVisitor = await Visitor.find({ name: name });

  //// IF VISITOR DOESN'T EXIST, CREATE NEW ONE AND SAVE

    if (!oldVisitor.length) {

        const person = new Visitor ({
        name: name,
        count: 1
      });

      person.save((error) => {
        if (error) {
          return res.send(`error`);
        }
      });

//// IF ANONYMOUS CREATE NEW

  } else if (!name) {
        name = 'Anónimo';

        const person = new Visitor ({
          name: name,
          count: 1
        });

        person.save((error) => {
          if (error) {
            return res.send(`error`);
          }
        });

// INCREASE COUNT IF IT EXISTS

  } else {
    console.log('funcionó');
    Visitor.updateOne({ name: name }, { $inc: {count: 1} }, console.log);

  };


  //// CREATE TABLE

  Visitor.find(function(err, table) {

      if (err) return console.error(err);

      let tr = '';

      table.forEach((item) => {
        tr += ('<tr><td>'+item['_id']+'</td>'+
                   '<td>'+item.name+'</td>' +
                   '<td>'+item.count+'</td></tr>' );
      });
      let result = ('<table><thead><tr>'+
                      '<td class="text-center">'+"Id"+'</td>'+
                      '<td class="text-center">'+"Name"+'</td>'+
                      '<td class="text-center">'+"Visits"+'</td>'+
                 '</tr></thead><tbody>'+tr+'</tbody></table>');

      return res.send(result);
  });





});

// Visitor.find({}, (error, data) => {
//           let tr = '';
//           data.forEach((article) => {
//             tr += ('<tr><td>'+article['_id']+'</td>'+
//                        '<td>'+article.name+'</td>' +
//                        '<td>'+article.count+'</td></tr>' );
//           });
//           let header = ('<table><thead><tr>'+
//                           '<th class="text-center">'+"Id"+'</th>'+
//                           '<th class="text-center">'+"Name"+'</th>'+
//                           '<th class="text-center">'+"Visits"+'</th>'+
//                      '</tr></thead>'+tr+'</table>');
//           return  res.send(header);

    // //// RETURN TABLE
    // var fullDB = Visitor.find(function(error, visitor) {
    //   if (error) return console.error(error);
    //     console.log(fullDB);
    //   });
    //
    //     return res.send(fullDB);




app.listen('3000', () => console.log('visitantes Recursivo Puerto 3000'));
