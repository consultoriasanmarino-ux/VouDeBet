const { supabase } = require('./src/lib/supabase');

async function check() {
    const { data } = await supabase.from('game_configs').select('*').eq('game_slug', 'sugar_vdb').single();
    console.log('Game Config:', data);

    const { count } = await supabase.from('jogos_demo').select('*', { count: 'exact', head: true });
    console.log('Total games:', count);
}

check();
