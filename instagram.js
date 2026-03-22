const axios = require('axios');


async function replyToComment(commentId, username){
   try {const res = await axios.post(`https://graph.facebook.com/v19.0/${commentId}/replies`,{
      message:`@${username} ⏰ This is your reminder!`,
      access_token: process.env.INSTAGRAM_TOKEN
      });
   } catch(error) {
      console.error('Failed to reply to comment:',error.message)
   }
}

module.exports = {replyToComment};