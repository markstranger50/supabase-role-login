import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your Supabase details
const supabase = createClient('https://jcfebaoadebnmbucdpbc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZmViYW9hZGVibm1idWNkcGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTc4NDUsImV4cCI6MjA2MzQzMzg0NX0.YGi-q6Z8_G3sOS5aQH6rVcMwAbkC-j4Sxgk0Ym6OP1M');

document.getElementById('login-btn')?.addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github'
  });
  if (error) console.error('Login error:', error);
});

// Optional: Auto-redirect if already logged in
const redirectByRole = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const user = session.user;
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Role fetch error:', error);
    return;
  }

  switch (data.role) {
    case 'admin':
      window.location.href = 'admindashboard.html';
      break;
    case 'seller':
      window.location.href = 'sellerdashboard.html';
      break;
    default:
      window.location.href = 'dashboard.html';
      break;
  }
};

redirectByRole();
