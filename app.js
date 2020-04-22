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

//// CREATE TABLE STATIC METHOD
VisitantesSchema.statics.createTable = async function() {

  const table = await this.find();

  let tr = '';

  table.forEach((item) => {
    tr += ('<tr><td>'+item['_id']+'</td>'+
    '<td>'+item.name+'</td>' +
    '<td>'+item.count+'</td></tr>' );
  });

  return ('<table><thead><tr>'+
          '<td class="text-center">Id</td>'+
          '<td class="text-center">Name</td>'+
          '<td class="text-center">Visits</td>'+
          '</tr></thead><tbody>'+tr+'</tbody></table>');
};

//// MODEL
const Visitor = mongoose.model('Visitors', VisitantesSchema);



//// GET

app.get('/', async (req, res) => {


  var name = req.query.name;

  //// CHECK IF VISITOR EXISTS

  var oldVisitor = await Visitor.find({ name, });

//// IF VISITOR DOESN'T EXIST, CREATE NEW ONE AND SAVE

if (!name) {
      name = 'Anónimo';

      const person = new Visitor ({
        name,
        count: 1
      });

      await person.save();


//// IF ANONYMOUS CREATE NEW


} else if (!oldVisitor.length) {

  const person = new Visitor ({
  name,
  count: 1
});

await person.save();

// INCREASE COUNT IF IT EXISTS

  } else {
    await Visitor.updateOne({ name, }, { $inc: {count: 1} });
  };

  const table = await Visitor.createTable();
  res.send(table);

});


app.listen('3000', () => console.log('visitantes Recursivo Puerto 3000'));
