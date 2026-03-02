const { supabase } = require('./src/lib/supabase');

async function findUser() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Recent Users:', data);
}

findUser();
