import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient('https://YOUR_PROJECT.supabase.co', 'YOUR_ANON_KEY')

document.getElementById('login-btn').addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
  if (error) {
    console.error('Login error:', error.message)
    alert('Login failed: ' + error.message)
  }
})

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const user = session.user

    // Check if profile exists
    const { data: existing, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      // No profile found, create one with default role 'user'
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id })  // role will default to 'user'

      if (insertError) {
        console.error('Failed to create profile:', insertError.message)
        alert('Error setting up user profile.')
        return
      }
    }

    // Now fetch the role
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('Failed to fetch profile:', fetchError.message)
      alert('Error fetching user role.')
      return
    }

    // Redirect based on role
    switch (profile.role) {
      case 'admin':
        window.location.href = 'admindashboard.html'
        break
      case 'seller':
        window.location.href = 'sellerdashboard.html'
        break
      default:
        window.location.href = 'userdashboard.html'
    }
  }
})
