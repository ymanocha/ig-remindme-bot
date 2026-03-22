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

app.post('/webhook',async (req,res)=>{
    const value = req.body.entry[0].changes[0].value;
    const username = value.from.username;
    const comment_id = value.id;
    const post_id = value.media.id;
    const text = value.text;
     
    const remindAt = parseRemindTime(text);

    if(!remindAt){
        return res.sendStatus(200)
     } else {
       const {error} = await supabase
          .from('reminders')
          .insert({
              username,
              comment_id,
              post_id,
              remind_at: remindAt
          })

        if (error) console.error('Insert  failed:', error);
        
        res.sendStatus(200)
     }
})



app.listen(process.env.PORT, ()=>{
    console.log(`server is listening on ${process.env.PORT}`)
})