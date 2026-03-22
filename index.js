require('dotenv').config()
const express = require('express')
const {parseRemindTime} = require('./parser')
const {supabase} = require('./supabase')

require('./cron');

const app = express()
app.use(express.json())


app.get('/webhook', (req,res)=>{
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if(mode === 'subscribe' && token===process.env.VERIFY_TOKEN){
        res.send(challenge)
    } else  {
       res.status(403).send('Forbidden');
    }
})


app.post('/webhook', async (req, res) => {
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));
  
  const { object, entry } = req.body;

  if (object === 'page') {
    for (const e of entry) {
      for (const change of e.changes) {
        if (change.field === 'mention') {
          const { comment_id, post_id, sender_id } = change.value;
          const text = change.value.text;
          const username = change.value.from?.username || sender_id;
          
          const remindAt = parseRemindTime(text);
          if (!remindAt) return res.sendStatus(200);
          
          const { error } = await supabase
            .from('reminders')
            .insert({ username, comment_id, post_id, remind_at: remindAt });
          
          if (error) console.error('Insert failed:', error);
        }
      }
    }
  }
  
  res.sendStatus(200);
});



app.listen(process.env.PORT, ()=>{
    console.log(`server is listening on ${process.env.PORT}`)
})