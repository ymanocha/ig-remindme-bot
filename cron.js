const cron = require('node-cron');
const {supabase} = require('./supabase');
const {replyToComment} = require('./instagram');

cron.schedule('* * * * *', async() => {
     const { data , error } = await supabase
                .from('reminders')
                .select('*')
                .lte('remind_at', new Date().toISOString())
                .eq('is_sent', false);
     
     if (error){
        console.error(error);
        return ;
     }

     if (!data || data.length === 0) return;
      

    for(const { id,comment_id,username} of data ){
        await replyToComment(comment_id,username)
        
        const { error: updateError } = await supabase
                  .from('reminders')
                  .update({ is_sent: true })
                  .eq('id', id);

           if (updateError) console.error('Update failed:', updateError);
    }

    }
   

)