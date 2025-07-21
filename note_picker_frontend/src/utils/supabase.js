import { createClient } from '@supabase/supabase-js';

// Util to get site URL, correct for local/dev/prod
export const getURL = () => {
  let url =
    process.env.REACT_APP_SITE_URL ||
    window.location.origin ||
    'http://localhost:3000/';

  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  if (!url.endsWith('/')) {
    url = `${url}/`;
  }
  return url;
};

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
